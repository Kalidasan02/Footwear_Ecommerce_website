from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from products.models import ProductSize

from .models import Order, OrderItem
from .serializers import OrderSerializer

from cart.models import Cart
from rest_framework.permissions import IsAdminUser
from rest_framework import status

from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4

from cart.models import Cart, CartItem
from products.models import ProductSize
from .models import Order, OrderItem
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .utils import send_order_email



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from cart.models import Cart
from products.models import ProductSize
from .models import Order, OrderItem
from .utils import send_order_email   # if you created this

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import OrderSerializer

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Order

class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            cart = Cart.objects.get(user=request.user)
            items = cart.items.all()

            if not items.exists():
                return Response({"error": "Cart is empty"}, status=400)

            total = 0

            for item in items:
                product_size = ProductSize.objects.get(
                    product=item.product,
                    size=item.size
                )

                if product_size.stock < item.quantity:
                    return Response({
                        "error": f"Not enough stock for {item.product.name} size {item.size}"
                    }, status=400)

                total += item.product.price * item.quantity

            order = Order.objects.create(
                user=request.user,
                total_price=total,
                status="pending"
            )

            for item in items:
                product_size = ProductSize.objects.get(
                    product=item.product,
                    size=item.size
                )

                product_size.stock -= item.quantity
                product_size.save()

                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    size=item.size,
                    quantity=item.quantity,
                    price=item.product.price
                )

            # Clear cart after successful order creation
            items.delete()

            # Optional email sending (don't break checkout if mail fails)
            try:
                if order.user.email:
                    send_order_email(order)
            except Exception as e:
                print("Email sending failed:", e)

            return Response({
                "message": "Order created successfully",
                "order_id": order.id
            }, status=201)

        except Cart.DoesNotExist:
            return Response({"error": "Cart not found"}, status=404)

        except ProductSize.DoesNotExist:
            return Response({"error": "Selected size not found"}, status=404)

        except Exception as e:
            return Response({
                "error": "Something went wrong during checkout",
                "details": str(e)
            }, status=500)



class UpdateOrderStatusView(APIView):

    permission_classes = [IsAdminUser]

    def put(self, request, order_id):
        return self.update_status(request, order_id)

    def patch(self, request, order_id):
        return self.update_status(request, order_id)

    def update_status(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        new_status = request.data.get("status")

        valid_status = ["pending", "dispatched", "completed", "returned"]

        if new_status not in valid_status:
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = new_status
        order.save()

        return Response({
            "message": "Order status updated",
            "order_id": order.id,
            "status": order.status
        })



class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-created_at")       







class DownloadReceiptView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):

        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="receipt_order_{order.id}.pdf"'

        doc = SimpleDocTemplate(
            response,
            pagesize=A4,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=40
        )

        styles = getSampleStyleSheet()
        elements = []

        # Custom styles
        title_style = ParagraphStyle(
            'TitleStyle',
            parent=styles['Title'],
            alignment=TA_CENTER,
            fontSize=22,
            spaceAfter=10
        )

        subtitle_style = ParagraphStyle(
            'SubtitleStyle',
            parent=styles['Heading2'],
            alignment=TA_LEFT,
            fontSize=16,
            spaceAfter=15
        )

        normal_style = ParagraphStyle(
            'NormalStyle',
            parent=styles['Normal'],
            fontSize=11,
            leading=16
        )

        # 🔹 Header
        elements.append(Paragraph("<b>FOOTWEAR FOUNDRY</b>", title_style))
        elements.append(Paragraph("<b>Official Purchase Receipt</b>", subtitle_style))
        elements.append(Spacer(1, 12))

        # 🔹 Order Details
        elements.append(Paragraph(f"<b>Order ID:</b> {order.id}", normal_style))
        elements.append(Paragraph(f"<b>Order Date:</b> {order.created_at.strftime('%Y-%m-%d %H:%M')}", normal_style))
        elements.append(Paragraph(f"<b>Status:</b> {order.status.title()}", normal_style))
        elements.append(Paragraph(f"<b>Customer:</b> {order.user.username}", normal_style))
        elements.append(Spacer(1, 20))

        # 🔹 Table Data
        data = [["Product", "Size", "Qty", "Unit Price", "Total"]]

        for item in order.items.all():
            total = item.quantity * item.price
            data.append([
                Paragraph(item.product.name, normal_style),
                str(item.size),
                str(item.quantity),
                f"Rs. {item.price}",
                f"Rs. {total}"
            ])

        # 🔹 Better aligned table
        table = Table(data, colWidths=[220, 55, 55, 85, 85])

        table.setStyle(TableStyle([
            # Header
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2c3e50")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 10),

            # Grid
            ("GRID", (0, 0), (-1, -1), 1, colors.black),

            # Alignment
            ("ALIGN", (1, 1), (-1, -1), "CENTER"),
            ("ALIGN", (0, 0), (0, -1), "LEFT"),

            # Padding
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),

            # Alternate row background
            ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
        ]))

        elements.append(table)
        elements.append(Spacer(1, 25))

        # 🔹 Total Section
        elements.append(Paragraph(f"<b>Total Amount: Rs. {order.total_price}</b>", styles["Heading3"]))
        elements.append(Spacer(1, 30))

        # 🔹 Footer
        elements.append(Paragraph("Thank you for shopping with us!", normal_style))
        elements.append(Paragraph("This is a system-generated receipt and serves as proof of purchase.", normal_style))

        doc.build(elements)

        return response



from django.contrib.auth import get_user_model
from products.models import Product, ProductSize
from .models import Order
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response

User = get_user_model()


class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_products = Product.objects.count()
        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status="pending").count()
        completed_orders = Order.objects.filter(status="completed").count()
        total_revenue = sum(order.total_price for order in Order.objects.filter(status="completed"))
        total_users = User.objects.count()

        # 🔹 Low stock detection
        low_stock_items = ProductSize.objects.filter(stock__lte=5).select_related("product")

        low_stock_products = [
            {
                "product_name": item.product.name,
                "size": item.size,
                "stock": item.stock
            }
            for item in low_stock_items
        ]

        return Response({
            "total_products": total_products,
            "total_orders": total_orders,
            "pending_orders": pending_orders,
            "completed_orders": completed_orders,
            "total_revenue": total_revenue,
            "total_users": total_users,
            "low_stock_count": low_stock_items.count(),
            "low_stock_products": low_stock_products,
        })


from rest_framework.permissions import IsAdminUser


class AdminOrderListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        orders = Order.objects.all().order_by("-created_at")

        data = []
        for order in orders:
            items = []
            for item in order.items.all():
                items.append({
                    "product_name": item.product.name,
                    "size": item.size,
                    "quantity": item.quantity,
                    "price": str(item.price)
                })

            data.append({
                "id": order.id,
                "user": order.user.username,
                "status": order.status,
                "total_price": str(order.total_price),
                "created_at": order.created_at,
                "items": items
            })

        return Response(data)