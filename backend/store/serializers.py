from rest_framework import serializers
from .models import Category, Product, CartItem, Cart,WishlistItem,Wishlist,Order,OrderItem
from django.contrib.auth.models import User

class CategorySerializers(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        
class ProductSerializers(serializers.ModelSerializer):
    category = CategorySerializers(read_only = True)

    class Meta:
        model = Product
        fields = '__all__'
        
class CartItemSerializers(serializers.ModelSerializer):
    Product_name = serializers.CharField(source='product.name',read_only=True)
    product_price = serializers.DecimalField(source='product.price',max_digits=10,decimal_places=2,read_only=True)
    product_image = serializers.ImageField(source='product.image',read_only=True)
    product_stock = serializers.IntegerField(source ='product.stocks',read_only=True)
    class Meta:
        model = CartItem
        fields = '__all__'

class CartSerializers(serializers.ModelSerializer):
    items = CartItemSerializers(many=True,read_only=True)
    total = serializers.ReadOnlyField()
    
    class Meta:
        model = Cart
        fields = '__all__'
        
class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','password']
        
class RegisterSerializers(serializers.ModelSerializer):
        password = serializers.CharField(write_only=True)
        password2 = serializers.CharField(write_only=True)
        
        class Meta:
            model = User
            fields = ['username','email','password','password2']
            
        def validate(self,data):
            if data['password'] != data['password2']:
                raise serializers.ValidationError("Password Do not Match..")
            return data
        
        def create(self, validated_data):
            username = validated_data['username']
            email = validated_data.get('email','')
            password = validated_data['password']
            user = User.objects.create_user(username=username,email=email,password=password)
            return user
        
class WishlistItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source='product.name',
        read_only=True
    )

    product_price = serializers.DecimalField(
        source='product.price',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    product_image = serializers.ImageField(
        source='product.image',
        read_only=True
    )

    class Meta:
        model = WishlistItem
        fields = '__all__'


class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Wishlist
        fields = '__all__'
        
class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source='product.name',
        read_only=True
    )
    
    product_image = serializers.ImageField(
        source='product.image',
        read_only=True
    )
    
    class Meta:
        model = OrderItem
        fields = '__all__'
        
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True,read_only=True)
    
    class Meta:
        model= Order
        fields='__all__'
        