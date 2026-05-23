from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import *
from friends_app.utils.friends import *

# Create your views here.
class ChatView(LoginRequiredMixin, TemplateView):
    template_name = "chat_app/chat.html"
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        chats = Chat.objects.filter(is_group = False, users = self.request.user)
        data = []
        
        for chat in chats:
            other_user = chat.users.exclude(id = self.request.user.id).first()
            data.append({
                "chat_id": chat.id,
                "other_user":  other_user
            })

        context["individual_chats"] = data


        chats = Chat.objects.filter(is_group = True, users = self.request.user)
        data = []
        
        for chat in chats:
            other_user = chat.users.exclude(id = self.request.user.id).first()
            data.append({
                "chat_id": chat.id,
                "chat_name": chat.name
            })

        context["group_chats"] = data


        context["friends"] = {"users": get_friends_by_section(current_user = self.request.user, section = "friends")}

        return context