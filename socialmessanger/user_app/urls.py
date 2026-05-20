from django.urls import path
from .views import *

urlpatterns = [
    path('', render_user, name= 'user_page'),
    path('settings/', SettingsView.as_view(), name= 'settings_page'),

    path('auth/', AuthView.as_view(), name= 'auth_page'),
    path('register/', RegisterView.as_view(), name= 'register_page'),
    path('login/',LoginView.as_view(), name= 'login_page'),
    path('confirm/',ConfirmView.as_view(), name= 'confirm_page'),
    path('logout/',LogoutView.as_view(), name= 'logout_page'),
]
