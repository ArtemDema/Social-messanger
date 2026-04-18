from django.urls import path
from .views import *

urlpatterns = [
    path('', render_home, name= 'home_page'),
    path('entrance/', render_entrance, name= 'reg_auth_page')
]