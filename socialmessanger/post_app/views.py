from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def render_post(request):
    return render(
        request=request,
        template_name='post_app/post.html',
        context = {"which_site": "post"}
    )