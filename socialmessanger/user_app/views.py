from django.shortcuts import render
from django.views.generic import TemplateView, View
from .forms import *
from django.contrib.auth import login, logout
from django.http import JsonResponse
import random
from django.core.mail import send_mail
from .models import User
from django.views import View
from django.http import HttpRequest
from django.shortcuts import redirect
from home_app.forms import SetUsernameForm

# Create your views here.
def render_user(request):
    return render(
        request=request,
        template_name='user_app/user.html'
    )

class SettingsView(TemplateView):
    template_name = 'user_app/settings.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["home_form"] = SetUsernameForm()
        return context

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
            code = random.randint(100000, 999999)
            
            request.session['verification_code'] = code
            request.session['reg_data'] = form.cleaned_data

            send_mail(
                'Кoд підтвердження',
                f'Ваш код: {code}',
                "examplemailworldit@gmail.com",
                [form.cleaned_data["email"]],
                fail_silently = False
            )
            return JsonResponse(data={
                "answer": True
            })
        
        return JsonResponse({
            "answer": False,
            "errors": form.errors.get_json_data()
        })

        


class LoginView(View):
    def post(self, request, *args, **kwargs):
        form = AuthForm(request, request.POST)

        if form.is_valid():
            user = form.get_user()
            login(request = request, user = user)
            return JsonResponse(data={
                "answer": True
            })
        
        return JsonResponse({
            "answer": False,
            "errors": form.errors.get_json_data()
        })
    
class ConfirmView(View):
    def post(self, request, *args, **kwargs):
        form = ConfirmForm(request.POST)

        if form.is_valid():
            confirm1 = form.cleaned_data.get('confirm1')
            confirm2 = form.cleaned_data.get('confirm2')
            confirm3 = form.cleaned_data.get('confirm3')
            confirm4 = form.cleaned_data.get('confirm4')
            confirm5 = form.cleaned_data.get('confirm5')
            confirm6 = form.cleaned_data.get('confirm6')

            verification_code = request.session.get("verification_code")
            user_code = f"{confirm1}{confirm2}{confirm3}{confirm4}{confirm5}{confirm6}"

            if str(verification_code) == user_code:
                reg_data = request.session.get("reg_data")

                user = User.objects.create(
                    username = "",
                    email = reg_data['email']
                )
                user.set_password(reg_data['password'])
                user.save()

                del request.session['verification_code']
                del request.session['reg_data']
                
                
                return JsonResponse({
                    "answer": True,
                })
            
        return JsonResponse({
            "answer": False,
            "errors": form.errors.get_json_data()
        })

class LogoutView(View):
    def get(self, request: HttpRequest):
        logout(request)
        return redirect("auth_page")

