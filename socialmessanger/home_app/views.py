from post_app.forms import PostForm
from .forms import *
from django.views.generic import TemplateView
from .forms import SetUsernameForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse


class HomeView(LoginRequiredMixin, TemplateView):
    template_name = 'home_app/home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["home_form"] = SetUsernameForm()
        context["post_form"] = PostForm()
        return context
    
    def post(self, request, *args, **kwargs):
        form = SetUsernameForm(request.POST)

        if form.is_valid():
            first_name = form.cleaned_data.get('first_name')
            username = form.cleaned_data.get('username')

            request.user.first_name = first_name
            username = f'@{username}'
            request.user.username = username
            request.user.save()

            return JsonResponse({
                "answer": True,
                })
            
        return JsonResponse({
            "answer": False,
            "errors": form.errors.get_json_data()
        })