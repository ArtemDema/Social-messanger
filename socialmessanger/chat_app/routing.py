from django.urls import path 
from .consumers import *

websockets_urlpatterns = [
    path("/<int:chat_id>", ChatConsumer.as_asgi(), name="chat_ws")
]