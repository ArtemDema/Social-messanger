from django.shortcuts import render

# Create your views here.
def render_user(request):
    return render(
        request=request,
        template_name='user_app/user.html'
    )

def render_settings(request):
    return render(
        request=request,
        template_name='user_app/settings.html'
    )
