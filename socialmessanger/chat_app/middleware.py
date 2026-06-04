from django.core.cache import cache

class UserOnlineMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            cache.set(f"online_{request.user.id}", True, 20)
        
        response = self.get_response(request)
        return response