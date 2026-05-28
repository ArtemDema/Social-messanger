from django.urls import path
from .views import ProfileView

urlpatterns = [
    path('<int:id>/', ProfileView.as_view(), name="profile_page")
]