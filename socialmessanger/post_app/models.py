from django.db import models

# Create your models here.
from django.db import models
from user_app.models import User

# Create your models here.

class PostTag(models.Model):
    name = models.CharField(max_length= 50, unique= True)

class Post(models.Model):
    title = models.CharField(max_length=100)
    topic = models.CharField(max_length=100)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete= models.CASCADE, related_name= 'posts')
    created_at = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField(PostTag, related_name= 'post')

class PostLink(models.Model):
    url = models.URLField(max_length=200)
    post = models.ForeignKey(Post, on_delete= models.CASCADE, related_name= 'links')
