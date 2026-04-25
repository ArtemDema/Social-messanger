from django.shortcuts import render
from django.views.generic import TemplateView, View
from .forms import *
from django.contrib.auth import login
from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth.forms import AuthenticationForm

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
    
class RegisterView(View):
    def post(self, request, *args, **kwargs):
        form = RegForm(request.POST)
        
        if form.is_valid():
            form.save()
            return JsonResponse(data={
                "answer": True
            })
        
        return JsonResponse(data={
                "answer": False
            })
        


class LoginView(View):
    def post(self, request, *args, **kwargs):
        form = AuthenticationForm(request, request.POST)

        if form.is_valid():
            user = form.get_user()
            login(request = request, user = user)
            return JsonResponse(data={
                "answer": True
            })
        
        return JsonResponse(data={
                "answer": False
            })