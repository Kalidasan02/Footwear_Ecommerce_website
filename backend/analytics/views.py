from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

from django.db.models import Sum, F
from django.db.models.functions import TruncDate

from orders.models import OrderItem
from products.models import ProductSize

class DailySalesView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        sales = OrderItem.objects.values(
            date=TruncDate("order__created_at")
        ).annotate(
            total_sales=Sum(F("price") * F("quantity"))
        ).order_by("date")

        return Response(sales)

class SalesByBrandView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        sales = OrderItem.objects.values(
            brand=F("product__brand__name")
        ).annotate(
            total_sales=Sum(F("price") * F("quantity"))
        ).order_by("-total_sales")

        return Response(sales)


class SalesByCategoryView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        sales = OrderItem.objects.values(
            category=F("product__category__name")
        ).annotate(
            total_sales=Sum(F("price") * F("quantity"))
        ).order_by("-total_sales")

        return Response(sales)

class LowStockProductsView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        products = ProductSize.objects.filter(stock__lte=5).values(
            "product__name",
            "size",
            "stock"
        )

        return Response(products)