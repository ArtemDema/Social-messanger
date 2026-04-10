from django.urls import path
from .views import *

urlpatterns = [
    path('', render_friends, name= 'friends_page')
]