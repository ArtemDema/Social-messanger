from django.views.generic import ListView
from django.http import JsonResponse
from post_app.models import Post
from user_app.models import User
from django.core.paginator import Paginator
from django.template.loader import render_to_string


class ProfileView(ListView):
    template_name = "profile_app/profile.html"
    model = Post
    context_object_name = "posts"
    paginate_by = 5

    def get_friendship_status(self, current_user, profile_user):
        if current_user.received_friendship.filter(from_user = profile_user, status = "pending").exists():
            return "request"
        
        return 'recommendation'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["profile_user"] = User.objects.get(id=self.kwargs["id"])
        context["friendship"] = self.get_friendship_status(current_user = self.request.user, profile_user = User.objects.get(id=self.kwargs["id"]))

        return context
    
    def get_queryset(self):
        return Post.objects.filter(author = User.objects.get(id=self.kwargs["id"]))
    
    def get(self, request, id,  *args, **kwargs):
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
                    "html": render_to_string(template_name = "profile_app/particles/post_list.html", 
                                             context = {
                                                 "posts": post_list,
                                                 "profile_user": User.objects.get(id=id)
                                                })
                })
        return super().get(request, *args ,**kwargs)