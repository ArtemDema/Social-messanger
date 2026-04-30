from django import forms
from .models import PostTag, Post, PostLink

class PostForm(forms.ModelForm):
    tags = forms.ModelMultipleChoiceField(
        label = 'Оберіть теги',
        queryset = PostTag.object.all(),
        required = False,
        widget = forms.CheckboxSelectMultiple
    )

    class Meta:
        model = Post
        fields = ['title', 'topic', 'content']
        widget = {
            "title": forms.TextInput(attrs= {
                "placeholder": "Назва"
            }),
            "topic": forms.TextInput(attrs= {
                "placeholder": "Тема"
            }),
            "content": forms.TextInput(attrs= {
                "placeholder": "Текст"
            })
        }

        labels = {
            "title": "Назва публікації",
            "topic": "Тема публікації",
            "content": "Зміст публікації" 
        }