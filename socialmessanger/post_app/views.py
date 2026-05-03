from django.views.generic import TemplateView, FormView
from django.contrib.auth.mixins import LoginRequiredMixin
from .forms import PostForm
from django.urls import reverse_lazy
from django.http import JsonResponse


class HomeView(LoginRequiredMixin, TemplateView):
    template_name = "post_app/post.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["post_form"] = PostForm()
        return context

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()

        if self.request.method == "POST":
            kwargs["links"] = self.request.POST.getlist("links")
            kwargs["images"] = self.request.POST.getlist("images")
        
        return kwargs
    
    def post(self, request, *args, **kwargs):
        form = PostForm(request.POST)

        if form.is_valid():
            form.save(request.user)

            return JsonResponse(data={
                "answer": True
            })
        
        return JsonResponse({
            "answer": False,
            "errors": form.errors.get_json_data()
        })
        