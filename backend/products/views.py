from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer




class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer

from django.db.models import Q

class ProductListView(generics.ListAPIView):

    serializer_class = ProductSerializer

    def get_queryset(self):

        queryset = Product.objects.filter(is_active=True)\
            .select_related("brand", "category")\
            .prefetch_related("sizes", "images")

        brand = self.request.query_params.get('brand')
        category = self.request.query_params.get('category')
        size = self.request.query_params.get('size')
        price_min = self.request.query_params.get('price_min')
        price_max = self.request.query_params.get('price_max')
        search = self.request.query_params.get('search')

        if brand:
            queryset = queryset.filter(brand__name__iexact=brand)

        if category:
            queryset = queryset.filter(category__name__iexact=category)

        if size:
            queryset = queryset.filter(sizes__size=size)

        if price_min:
            queryset = queryset.filter(price__gte=price_min)

        if price_max:
            queryset = queryset.filter(price__lte=price_max)

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(brand__name__icontains=search) |
                Q(category__name__icontains=search)
            )

        return queryset.distinct()