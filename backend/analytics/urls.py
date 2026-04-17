from django.urls import path
from .views import (
    DailySalesView,
    SalesByBrandView,
    SalesByCategoryView,
    LowStockProductsView
)

urlpatterns = [
    path("sales/daily/", DailySalesView.as_view()),
    path("sales/brand/", SalesByBrandView.as_view()),
    path("sales/category/", SalesByCategoryView.as_view()),
    path("products/low-stock/", LowStockProductsView.as_view()),
]