from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView
from .forms import PostForm

class HomeView(LoginRequiredMixin, TemplateView):
    template_name = 'post_app/post.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["post_form"] = PostForm()
        return context