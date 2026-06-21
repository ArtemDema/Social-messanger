from django.urls import path
from .views import *

urlpatterns = [
    path('auth/', AuthView.as_view(), name= 'auth_page'),
    path('register/', RegisterView.as_view(), name= 'register_page'),
    path('login/',LoginView.as_view(), name= 'login_page'),
    path('confirm/',ConfirmView.as_view(), name= 'confirm_page'),
    path('logout/',LogoutView.as_view(), name= 'logout_page'),
]
