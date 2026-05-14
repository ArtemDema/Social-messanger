from .utils.friends import *
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView

class FriendsView(LoginRequiredMixin, TemplateView):
    template_name = 'friends_app/friends.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context["sections"] = {
            "request": {"title": "Запити", "users": get_friends_by_section(current_user = self.request.user, section = "requests")},
            "recommendations": {"title": "Рекомендації", "users": get_friends_by_section(current_user = self.request.user, section = "recommendations")},
            "friends": {"title": "Друзі", "users": get_friends_by_section(current_user = self.request.user, section = "friends")}
        }

        return context