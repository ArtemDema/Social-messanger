from django.urls import path
from .views import *

urlpatterns = [
    path('', FriendsView.as_view(), name= 'friends_page')
]