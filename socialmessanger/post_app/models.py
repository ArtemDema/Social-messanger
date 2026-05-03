from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    topic = models.CharField(max_length=255, null=True, blank=True)
    content = models.TextField(null=True)
    tags = models.ManyToManyField('PostTag', blank=True)
    

class PostTag(models.Model):
    name = models.CharField(max_length=50, unique=True)


class PostLink(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    url = models.URLField(max_length=500)
    

class PostImage(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    original = models.ImageField(upload_to="post_images/originals/")
    compressed = models.ImageField(upload_to="post_images/compressed/")