from django.shortcuts import render
from .forms import *


# Create your views here.
def render_home(request):
    return render(
        request=request,
        template_name='home_app/home.html'
    )

def render_entrance(request):
    form_reg = RegForm()
    form_auth = AuthForm()

    return render(
        request=request,
        template_name='home_app/entrance.html',
        context = {"form_reg": form_reg,
                   "form_auth": form_auth}
    )