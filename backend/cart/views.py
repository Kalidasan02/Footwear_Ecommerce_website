from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Cart, CartItem
from .serializers import CartItemSerializer
from products.models import Product

class AddToCartView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        product_id = request.data.get("product_id")
        size = request.data.get("size")
        quantity = request.data.get("quantity", 1)

        product = Product.objects.get(id=product_id)

        cart, created = Cart.objects.get_or_create(user=request.user)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            size=size
        )

        if not created:
            item.quantity += int(quantity)
        else:
            item.quantity = quantity

        item.save()

        return Response({"message": "Item added to cart"})
    
class CartView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        cart, created = Cart.objects.get_or_create(user=request.user)

        items = cart.items.all()

        serializer = CartItemSerializer(items, many=True)

        return Response(serializer.data)

class UpdateCartItemView(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request):

        item_id = request.data.get("item_id")
        quantity = request.data.get("quantity")

        item = CartItem.objects.get(id=item_id, cart__user=request.user)

        item.quantity = quantity
        item.save()

        return Response({"message": "Cart updated"})
    
class RemoveCartItemView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):

        item = CartItem.objects.get(id=item_id, cart__user=request.user)

        item.delete()

        return Response({"message": "Item removed from cart"})

class CartView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        cart, created = Cart.objects.get_or_create(user=request.user)

        items = cart.items.all()

        serializer = CartItemSerializer(items, many=True)

        total = 0

        for item in items:
            total += item.product.price * item.quantity

        return Response({
            "items": serializer.data,
            "total_price": total
        })