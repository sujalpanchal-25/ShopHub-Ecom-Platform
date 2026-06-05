from rest_framework.response import Response
from rest_framework.decorators  import api_view,permission_classes
from .models import Product,Category,Cart,CartItem,OrderItem,Order,Wishlist,WishlistItem
from .serializers import ProductSerializers,CategorySerializers,CartSerializers,RegisterSerializers,UserSerializers,WishlistSerializer,OrderSerializer,OrderItemSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.contrib.auth.models import User
from rest_framework import status
from django.db.models import Q

# Create your views here.

@api_view(['GET'])
def product_list(request):
    category_id =request.GET.get('category')
    product = Product.objects.all().order_by('?')
    
    if category_id:
        product = product.filter(category_id=category_id)
        
    serializer = ProductSerializers(product,many=True)
    
    return Response(serializer.data)

@api_view(['GET'])
def product_detail(request,pk):
    try:
        detail = Product.objects.get(pk=pk)
        ser = ProductSerializers(detail,context = {'request':request})
        return Response(ser.data)
    except Product.DoesNotExist:
        return Response({'error':'Product Not Found'},status=404)

@api_view(['GET'])
def Category_list(request):
    category = Category.objects.all()
    serializers = CategorySerializers(category,many=True)
    return Response(serializers.data)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart , created = Cart.objects.get_or_create(user = request.user)
    serializers = CartSerializers(cart)
    return Response(serializers.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cart_add(request):
    product_id = request.data.get('product_id')
    product = Product.objects.get(id = product_id)
    cart , created = Cart.objects.get_or_create(user = request.user)
    item , created = CartItem.objects.get_or_create(cart=cart,product=product)
    
    if item.quantity + (0 if created else 1) > product.stocks:
        return Response({'error': f'Only {product.stocks} Items left in Stock'})
    
    if not created:
        item.quantity += 1
        item.save()
    return Response({'message' : 'Product added to cart','cart':CartSerializers(cart).data})    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_cart_quantity(request):
    item_id = request.data.get('item_id')
    quantity = request.data.get('quantity')

    if not item_id or quantity is None:
        return Response({'message':'Item ID and quantity are required'},status=400)
    
    try:
        item = CartItem.objects.get(id=item_id)
        
        if quantity > item.product.stocks:
            return Response({'error': f'Only {item.product.stock} items available.'}, status=status.HTTP_400_BAD_REQUEST)
        if int(quantity)<1:
            item.delete()
            return Response({'message':'Item removed from cart'})
        
        item.quantity = quantity
        item.save()
        serializer = CartSerializers(item.cart)
        return Response(serializer.data)
    except CartItem.DoesNotExist:
        return Response({'error':'Cart item not Found'},status=404)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cart_remove(request):
    item_id = request.data.get('item_id')
    CartItem.objects.filter(id=item_id).delete()
    return Response({'message':'Item removed from cart'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):  
    try:
        data = request.data
        name = data.get('name')
        address = data.get('address')
        phone = data.get('phone')
        payment_method = data.get('payment_method','COD')
        
        if not phone.isdigit() or len(phone) < 10:
            return Response({'error':'Invalid phone number'},status=400)
        
        cart , created = Cart.objects.get_or_create(user =request.user) 
        if not cart or not cart.items.exists():
            return Response({'error':'Cart is empty'},status=400)
        
        for item in cart.items.all():
            if item.quantity > item.product.stocks:
                return Response({'error': f'Not enough stock for {item.product.name}. Please reduce quantity.'}, status=status.HTTP_400_BAD_REQUEST)
        
        total = sum(float(item.product.price) * item.quantity for item in cart.items.all())
        
        #create order
        order = Order.objects.create(
            user= request.user,
            total_amount = total,
        )
        
        #create order item
        for item in cart.items.all():
            OrderItem.objects.create(
                order = order,
                product = item.product,
                quantity = item.quantity,
                price = item.product.price,    
            )
            
            item.product.stocks-=item.quantity
            item.product.save()
            
        #clear the cart
        cart.items.all().delete()
        
        return Response({
            "message":"Order Placed Successfully",
            "order_id":order.id,
        })
        
    except Exception as e:
        return Response({"error":str(e)},status=500)
        
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializers = RegisterSerializers(data = request.data)
    if serializers.is_valid():
        user = serializers.save()
        return Response({'message':'User Created Successfully', 'user':UserSerializers(user).data},status=status.HTTP_201_CREATED)
    return Response(serializers.errors,status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def search_product(request):
    search = request.GET.get('search')

    product = Product.objects.all()

    if search:
        product = product.filter(
            Q(name__icontains=search) |
            Q(description__icontains=search) |
            Q(category__name__icontains=search)
        )

    serializer = ProductSerializers(product, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wishlist(request):
    wish , created = Wishlist.objects.get_or_create(user=request.user)
    ser = WishlistSerializer(wish)
    return Response(ser.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def wishlist_add(request):

    product_id = request.data.get('product_id')

    product = Product.objects.get(id=product_id)

    wishlist, created = Wishlist.objects.get_or_create(user=request.user)

    WishlistItem.objects.get_or_create(wishlist=wishlist,product=product)

    return Response({"message": "Added to wishlist"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def wishlist_remove(request):

    product_id = request.data.get('product_id')

    wishlist = Wishlist.objects.get(
        user=request.user
    )

    WishlistItem.objects.filter(
        wishlist=wishlist,
        product_id=product_id
    ).delete()

    return Response({
        "message": "Removed from wishlist"
    })
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_list(request):
    orders = Order.objects.filter(user=request.user).order_by('-id')
    ser =  OrderSerializer(orders,many=True)
    return Response(ser.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_details(request,pk):
    try:
        order = Order.objects.get(id=pk,user=request.user)
        ser = OrderSerializer(order)
        return Response(ser.data)
    
    except order.DoesNotExist:
        return Response({'error':"orders Not Found"},status=status.HTTP_404_NOT_FOUND)
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def order_cancel(request, pk):

    try:
        order = Order.objects.get(id=pk,user=request.user)
        if order.status in ['Shipped','Delivered']:
            return Response({'error':'Order Cannot be Cancelled'},status=status.HTTP_400_BAD_REQUEST)
        
        if order.status == 'Cancelled':
            return Response({'error':'Order is already cancelled'},status=status.HTTP_400_BAD_REQUEST)
        
        for i in order.items.all():
            product = i.product
            product.stocks += i.quantity
            product.save()
            
        order.status = 'Cancelled'
        order.save()
    
        return Response({"message": "Order Cancelled Successfully"})

    except Order.DoesNotExist:
        return Response({"error": "Order Not Found"},status=status.HTTP_404_NOT_FOUND)