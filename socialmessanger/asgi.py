"""
ASGI config for site_messanger project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
django_app = get_asgi_application()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'socialmessanger.settings')


from channels.routing import ProtocolTypeRouter, URLRouter
from chat_app.routing import websockets_urlpatterns
from channels.auth import AuthMiddlewareStack
from user_app.routing import user_websockets_urlpatterns




application = ProtocolTypeRouter({
    'http': django_app,
    'websocket': AuthMiddlewareStack(URLRouter(websockets_urlpatterns + user_websockets_urlpatterns))
})