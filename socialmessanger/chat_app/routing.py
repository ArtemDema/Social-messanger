from django.urls import path 
from .consumers import ChatConsumer

websockets_urlpatterns = [
    path("chat/<int:chat_id>", ChatConsumer.as_asgi(), name="chat_ws")
]