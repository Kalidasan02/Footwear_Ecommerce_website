from django.urls import path
from .views import (
    AddToCartView,
    CartView,
    UpdateCartItemView,
    RemoveCartItemView
)

urlpatterns = [
    path('', CartView.as_view(), name='view-cart'),
    path('add/', AddToCartView.as_view(), name='add-to-cart'),
    path('update/', UpdateCartItemView.as_view(), name='update-cart'),
    path('remove/<int:item_id>/', RemoveCartItemView.as_view(), name='remove-cart'),
]