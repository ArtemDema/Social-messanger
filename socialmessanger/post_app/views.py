from django.shortcuts import render

# Create your views here.
def render_post(request):
    return render(
        request=request,
        template_name='post_app/post.html',
        context = {"which_site": "post"}
    )