from django.urls import path
from .views import CreatePaymentOrder, VerifyPayment

urlpatterns = [
    path("create-order/", CreatePaymentOrder.as_view()),
    path("verify-payment/", VerifyPayment.as_view()),
]