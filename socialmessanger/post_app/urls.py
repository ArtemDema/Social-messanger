from django.urls import path
from .views import *

urlpatterns = [
    path('', HomeView.as_view(), name= 'post_page'),
    path('tag', TagView.as_view(), name= 'tag_page')
]