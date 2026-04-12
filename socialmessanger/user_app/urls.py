from django.urls import path
from .views import *

urlpatterns = [
    path('', render_user, name= 'user_page'),
    path('settings/', render_settings, name= 'settings_page'),
]