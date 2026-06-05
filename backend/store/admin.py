from django.contrib import admin
from .models import  Category, Product, UserProfile, Order,  OrderItem, Cart, CartItem, Wishlist, WishlistItem

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)} 

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at',)
    list_editable = ('price',) 
    list_per_page = 20

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('customer_name', 'phone', 'short_address')
    search_fields = ('user__username', 'user__email', 'phone')

    def customer_name(self, obj):
        return obj.user.get_full_name() or obj.user.username
    customer_name.short_description = 'Customer'
    customer_name.admin_order_field = 'user__username'

    def short_address(self, obj):
        return obj.address[:50] + '...' if len(obj.address) > 50 else obj.address
    short_address.short_description = 'Address'

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0 
    readonly_fields = ('price',) 

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'product_list', 'status', 'total_amount', 'created_at')
    list_filter = ('status', 'created_at')  
    search_fields = ('user__username', 'items__product__name', 'id')
    readonly_fields = ('created_at', 'total_amount')
    list_editable = ('status',) 
    inlines = [OrderItemInline] 
    
    fieldsets = (
        ('Order Information', {
            'fields': ('user', 'status', 'total_amount', 'created_at')
        }),
    )

    def customer_name(self, obj):
        if obj.user:
            return obj.user.get_full_name() or obj.user.username
        return "Guest"
    customer_name.short_description = 'Customer Name'

    def product_list(self, obj):
        products = [item.product.name for item in obj.items.all()]
        product_string = ", ".join(products)
        return product_string[:50] + "..." if len(product_string) > 50 else product_string
    product_list.short_description = 'Products Ordered'

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'product_list', 'created_at', 'total_items')
    search_fields = ('user__username', 'items__product__name')
    readonly_fields = ('created_at',)
    inlines = [CartItemInline]

    def customer_name(self, obj):
        if obj.user:
            return obj.user.get_full_name() or obj.user.username
        return "Guest"
    customer_name.short_description = 'Customer Name'

    def product_list(self, obj):
        products = [item.product.name for item in obj.items.all()]
        product_string = ", ".join(products)
        return product_string[:50] + "..." if len(product_string) > 50 else product_string
    product_list.short_description = 'Products in Cart'

    def total_items(self, obj):
        return obj.items.count()
    total_items.short_description = 'Total Items'


class WishlistItemInline(admin.TabularInline):
    model = WishlistItem
    extra = 0

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('customer_name', 'product_list', 'total_saved_items')
    search_fields = ('user__username', 'items__product__name')
    inlines = [WishlistItemInline]

    def customer_name(self, obj):
        if obj.user:
            return obj.user.get_full_name() or obj.user.username
        return "Unknown"
    customer_name.short_description = 'Customer Name'

    def product_list(self, obj):
        products = [item.product.name for item in obj.items.all()]
        product_string = ", ".join(products)
        return product_string[:50] + "..." if len(product_string) > 50 else product_string
    product_list.short_description = 'Saved Products'

    def total_saved_items(self, obj):
        return obj.items.count()
    total_saved_items.short_description = 'Total Items'