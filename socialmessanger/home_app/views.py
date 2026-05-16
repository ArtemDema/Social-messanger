from post_app.forms import PostForm, PostTagForm
from .forms import *
from django.views.generic import ListView
from .forms import SetUsernameForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from post_app.models import Post


class HomeView(LoginRequiredMixin, ListView):
    template_name = 'home_app/home.html'
    model = Post
    context_object_name = "posts"
    paginate_by = 5

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["home_form"] = SetUsernameForm()
        context["post_form"] = PostForm()
        context["tag_form"] = PostTagForm()
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