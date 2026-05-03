from django import forms
from user_app.models import User


class SetUsernameForm(forms.Form):
    first_name = forms.CharField(
    min_length= 2,
    max_length= 25,
    required=True, 
    label="Псевдонім автора",
    widget= forms.TextInput(attrs={
        'placeholder': 'Введіть Псевдонім автора'
    }))

    username = forms.CharField(
        min_length= 4,
        max_length= 20,
        required=True, 
        label="Ім'я користувача",
        widget= forms.TextInput(attrs={
            'placeholder': "@"
    }))

    def clean(self):
        cleaned_data = super().clean()

        first_name = cleaned_data.get('first_name')
        username = cleaned_data.get('username')

        if first_name and username:
            if User.objects.filter(first_name = first_name).exists():
                raise forms.ValidationError(message = 'Користувач з таким псевдонімом вже існує')
            
            if User.objects.filter(username = username).exists():
                raise forms.ValidationError(message = "Користувач з таким им'ям вже існує")
            
            if username[0] == "@":
                raise forms.ValidationError(message = "Собачка не має бути на початку імені")
        else:
            raise forms.ValidationError(message = 'Поля пусті')

        return cleaned_data