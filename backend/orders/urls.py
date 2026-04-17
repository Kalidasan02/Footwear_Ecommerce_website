from django.urls import path
from .views import CheckoutView, UpdateOrderStatusView, DownloadReceiptView, OrderListView
from .views import CheckoutView, UpdateOrderStatusView, DownloadReceiptView, OrderListView, AdminDashboardView
from .views import CheckoutView, UpdateOrderStatusView, DownloadReceiptView, OrderListView, AdminDashboardView, AdminOrderListView

urlpatterns = [
    path('checkout/', CheckoutView.as_view()),
    path('', OrderListView.as_view()),   # ✅ FIX HERE
    path('update-status/<int:order_id>/', UpdateOrderStatusView.as_view()),
    path('receipt/<int:order_id>/', DownloadReceiptView.as_view()),
    path('admin-dashboard/', AdminDashboardView.as_view()),
    path('admin-orders/', AdminOrderListView.as_view()),
    
]