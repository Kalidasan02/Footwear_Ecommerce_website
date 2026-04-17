from django.core.mail import send_mail
from django.conf import settings


def send_order_email(order):

    subject = f"Order Confirmation - Order #{order.id}"

    message = f"""
Hello {order.user.username},

Your order has been placed successfully.

Order ID: {order.id}
Status: {order.status}
Total Amount: ₹{order.total_price}

Items:
"""

    for item in order.items.all():
        message += f"\n- {item.product.name} | Size: {item.size} | Qty: {item.quantity} | Price: ₹{item.price}"

    message += "\n\nYour order will be processed and shipped to you within 2-3 business days."
    message += "\n\nThank you for shopping with FOOTWEAR FOUNDRY!"


    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [order.user.email],
        fail_silently=False,
    )