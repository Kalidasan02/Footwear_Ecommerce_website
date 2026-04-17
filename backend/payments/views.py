import razorpay
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Payment
from orders.models import Order
from orders.utils import send_order_email



client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))




class CreatePaymentOrder(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        order_id = request.data.get("order_id")

        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

        amount = int(order.total_price * 100)   # Convert rupees to paise

        order_data = {
            "amount": amount,
            "currency": "INR",
            "payment_capture": 1
        }

        razorpay_order = client.order.create(data=order_data)

        return Response({
            "razorpay_order_id": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "currency": razorpay_order["currency"],
            "key": settings.RAZORPAY_KEY_ID
        })


from cart.models import Cart, CartItem
from orders.utils import send_order_email


class VerifyPayment(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        razorpay_order_id = request.data.get("razorpay_order_id")
        razorpay_payment_id = request.data.get("razorpay_payment_id")
        razorpay_signature = request.data.get("razorpay_signature")
        order_id = request.data.get("order_id")

        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id]):
            return Response({
                "error": "Missing required payment fields"
            }, status=400)

        params_dict = {
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature
        }

        try:
            # Verify Razorpay signature
            client.utility.verify_payment_signature(params_dict)

            # Get the order only for logged-in user
            try:
                order = Order.objects.get(id=order_id, user=request.user)
            except Order.DoesNotExist:
                return Response({"error": "Order not found"}, status=404)

            # Prevent duplicate payment records
            if Payment.objects.filter(order=order, status="success").exists():
                return Response({"message": "Payment already verified"})

            # Save payment
            Payment.objects.create(
                order=order,
                razorpay_order_id=razorpay_order_id,
                razorpay_payment_id=razorpay_payment_id,
                razorpay_signature=razorpay_signature,
                amount=order.total_price,
                status="success"
            )

            # Mark order completed
            order.status = "completed"
            order.save()

            # Clear cart after successful payment
            try:
                cart = Cart.objects.get(user=request.user)
                CartItem.objects.filter(cart=cart).delete()
            except Cart.DoesNotExist:
                pass

            # Send email safely
            if order.user.email:
                try:
                    send_order_email(order)
                except Exception as e:
                    print("Email sending failed:", e)

            return Response({"message": "Payment verified successfully"})

        except Exception as e:
            return Response({
                "error": "Payment verification failed",
                "details": str(e)
            }, status=400)