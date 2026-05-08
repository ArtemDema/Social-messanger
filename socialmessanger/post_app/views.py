from django.views.generic import TemplateView, FormView
from django.contrib.auth.mixins import LoginRequiredMixin
from .forms import PostForm
from django.http import JsonResponse


class HomeView(LoginRequiredMixin, FormView):
    template_name = "post_app/post.html"
    form_class = PostForm
    
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()

        if self.request.method == "POST":
            kwargs["links"] = self.request.POST.getlist("links")
            kwargs["images"] = self.request.POST.getlist("images")
        
        return kwargs
    
    def form_valid(self, form):
        if self.request.user.is_authenticated:
            post = form.save(author = self.request.user)
            return JsonResponse(data={
                "answer": True
            })
        
        return JsonResponse(data={
            "answer": False
        })
        
    def form_invalid(self, form):
        return JsonResponse({
            "answer": False,
            "errors": form.errors.get_json_data()
        })
    
    # def post(self, request, *args, **kwargs):
    #     form = PostForm(request.POST)

    #     if form.is_valid():
    #         form.save(request.user)

    #         return JsonResponse(data={
    #             "answer": True
    #         })
        
    #     return JsonResponse({
    #         "answer": False,
    #         "errors": form.errors.get_json_data()
    #     })
        