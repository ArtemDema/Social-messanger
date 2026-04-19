from django.urls import path
from .views import *

urlpatterns = [
    path('', render_user, name= 'user_page'),
    path('settings/', render_settings, name= 'settings_page'),

    path('register/', AuthView.as_view(), name= 'register_page'),
    path('login/', AuthView.as_view(), name= 'login_page'),
    path('confirm/', AuthView.as_view(), name= 'confirm_page'),
    
]