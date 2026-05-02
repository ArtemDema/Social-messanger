from django import forms
from .models import PostTag, Post, PostLink

class PostForm(forms.ModelForm):
    tags = forms.ModelMultipleChoiceField(
        label = 'Оберіть теги',
        queryset = PostTag.objects.all(),
        required = False,
        widget = forms.CheckboxSelectMultiple
    )

    class Meta:
        model = Post
        fields = ['title', 'topic', 'content']
        widgets = {
            "title": forms.TextInput(attrs= {
                "placeholder": "Напишіть назву публікації"
            }),
            "topic": forms.TextInput(attrs= {
                "placeholder": "Напишіть тему публікації"
            }),
            "content": forms.TextInput(attrs= {
                "placeholder": "Введіть текст цієї публікації"
            })
        }
        labels = {
            "title": "Назва публікації",
            "topic": "Тема публікації",
            "content": "Зміст публікації" 
        }