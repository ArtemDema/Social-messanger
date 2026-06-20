from post_app.forms import PostForm, PostTagForm
from .forms import *
from django.views.generic import ListView
from .forms import SetUsernameForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from post_app.models import Post
from django.core.paginator import Paginator
from django.template.loader import render_to_string
from friends_app.utils.friends import get_friends_by_section


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
        context["count_friends"] = len(get_friends_by_section(current_user = self.request.user, section = "friends"))
        context["count_posts"] = len(Post.objects.filter(author = self.request.user))
        context["first_three_friends"] = get_friends_by_section(current_user = self.request.user, section = "friends")[:3]
        context["first_three_requests"] = get_friends_by_section(current_user = self.request.user, section = "requests")[:3]
        return context
    
    def get_queryset(self):
        return Post.objects.filter(author=self.request.user)
    
    def get(self, request, *args, **kwargs):
        if request.headers.get("X-Requested-With") == "XMLHttpRequest":
            page_number = request.GET.get("page")
            posts = self.get_queryset()
            paginator = Paginator(posts, self.paginate_by)
            post_list = paginator.get_page(page_number)
            if int(page_number) > paginator.num_pages:
                return JsonResponse({
                    "answer": False
                })
            return JsonResponse({
                    "answer": True,
                    "html": render_to_string(template_name = "home_app/particles/post_list.html", 
                                             context = {
                                                 "posts": post_list,
                                                 "user": request.user
                                                })
                })
        return super().get(request, *args ,**kwargs)

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