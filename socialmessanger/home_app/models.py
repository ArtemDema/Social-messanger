from django.db import models
from django import forms

# Create your models here.

class Registration(models.Model):
    email = models.EmailField()
    password = models.CharField(max_length = 25)
    confirm_password = models.CharField(max_length = 25)