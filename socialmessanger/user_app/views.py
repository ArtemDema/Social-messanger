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
        context["form_comfirm"] = ConfirmForm()
        return context
    
    # def post(self, request, *args, **kwargs):
    #     if "register" in request.POST:
    #         form = RegForm()
    #         if form.is_valid():
    #             pass
            
    #     elif "login" in request.POST:
    #         form = AuthForm(data=request.POST)
    #         if form.is_valid():
    #             email = form.cleaned_data'email']
    #             password = form.cleaned_data['password']

    #     elif "confirm" in request.POST:
    #         form = ConfirmForm()
    #         if form.is_valid():
    #             pass

