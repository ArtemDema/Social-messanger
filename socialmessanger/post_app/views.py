from django.views.generic import ListView, View, FormView
from django.contrib.auth.mixins import LoginRequiredMixin
from .forms import PostForm
from django.http import JsonResponse
from .models import Post
from django.core.paginator import Paginator
from django.template.loader import render_to_string
from .forms import PostTagForm
from home_app.forms import SetUsernameForm


class HomeView(LoginRequiredMixin, ListView):
    template_name = "post_app/post.html"
    model = Post
    context_object_name = "posts"
    paginate_by = 5

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["form_post"] = PostForm()
        context["form_tag"] = PostTagForm()
        context["home_form"] = SetUsernameForm()
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
                    "html": render_to_string(template_name = "post_app/particles/post_list.html", 
                                             context = {
                                                 "posts": post_list,
                                                 "user": request.user
                                                })
                })
        return super().get(request, *args ,**kwargs)

    def post(self, request, *args, **kwargs):
        form = PostForm(request.POST, 
                        request.FILES,     
                        links=request.POST.getlist("links"),
                        images=request.FILES.getlist("images"))
    
        if form.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)
    
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
    
class TagView(View):
    def post(self, request, *args, **kwargs):
        form = PostTagForm(request.POST)

        if form.is_valid():
            form.save()
            return JsonResponse(data={
                "answer": True
            })
        
        return JsonResponse(data={
            "answer": False,
            "errors": form.errors.get_json_data()
        })
        
        