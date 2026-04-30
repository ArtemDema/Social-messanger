from django.shortcuts import render
from .forms import *
from django.views.generic import TemplateView
from .forms import SetUsernameForm
from django.contrib.auth.mixins import LoginRequiredMixin


class HomeView(LoginRequiredMixin, TemplateView):
    template_name = 'home_app/home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["home_form"] = SetUsernameForm()
        return context