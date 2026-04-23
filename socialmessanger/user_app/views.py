from django.shortcuts import render
from django.views.generic import TemplateView
from .forms import *

# Create your views here.
def render_user(request):
    return render(
        request=request,
        template_name='user_app/user.html'
    )

def render_settings(request):
    return render(
        request=request,
        template_name='user_app/settings.html'
    )

class AuthView(TemplateView):
    template_name = 'user_app/entrance.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["form_register"] = RegForm()
        context["form_login"] = AuthForm()
        context["form_confirm"] = ConfirmForm()
        return context