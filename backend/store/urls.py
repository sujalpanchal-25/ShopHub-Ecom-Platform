from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

urlpatterns = [
    path("register/",views.register),
    path("token/",TokenObtainPairView.as_view(),name='token_obtain_pair'),
    path("token/refresh",TokenRefreshView.as_view(),name='token_refresh'),
    
    path("product/",views.product_list),
    path('product/<int:pk>/',views.product_detail),
    
    path('Cart/',views.get_cart),
    path('Cart/add/',views.cart_add),
    path('Cart/update/', views.update_cart_quantity),
    path('Cart/remove/',views.cart_remove),
    
    path('search/',views.search_product),
    path('categories/',views.Category_list),
    path('orders/create/',views.create_order),
    
    path('wishlist/', views.get_wishlist),  
    path('wishlist/add/', views.wishlist_add),
    path('wishlist/remove/', views.wishlist_remove),
    
    path("orders/",views.order_list),
    path("orders/<int:pk>",views.order_details),
    path('orders/delete/<int:pk>/',views.order_cancel),
]
