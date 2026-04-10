from django.urls import path
from .views import *

urlpatterns = [
    path('', render_post, name= 'post_page')
]