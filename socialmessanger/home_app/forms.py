from django import forms


class SetUsernameForm(forms.Form):
    name = forms.CharField(
    min_length= 2,
    max_length= 25,
    required=True, 
    label="Псевдонім автора",
    widget= forms.PasswordInput(attrs={
        'placeholder': 'Введіть Псевдонім автора'
    }))

    user_name = forms.CharField(
        min_length= 4,
        max_length= 20,
        required=True, 
        label="Ім'я користувача",
        widget= forms.PasswordInput(attrs={
            'placeholder': "@"
    }))

