from django.urls import path
from .views import *

urlpatterns = [
    path('', render_home, name= 'home_page')
]