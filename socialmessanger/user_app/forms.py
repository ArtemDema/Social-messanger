from django import forms
from .models import User
from django.contrib.auth import authenticate
from django.contrib.auth.forms import AuthenticationForm


class RegForm(forms.ModelForm):
    password = forms.CharField(
        required=True, 
        label="Пароль",
        widget= forms.PasswordInput(attrs={
            'placeholder': 'Введіть пароль'
        }))
    
    confirm_password = forms.CharField(
        required=True, 
        label="Підтвердіть пароль",
        widget= forms.PasswordInput(attrs={
            'placeholder': 'Повторіть пароль'
        }))

    class Meta:
        model = User
        fields = ['email']
        widgets = {
            "email": forms.EmailInput(attrs={
                'placeholder': 'Введіть пошту'
            })
        }

    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(email = email).exists():
            raise forms.ValidationError(message = 'Користувач з такою поштою вже існує')
        return email
    
    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')

        if password and confirm_password and password != confirm_password:
            raise forms.ValidationError(message = 'Паролі не співпадають')

        return cleaned_data
    
    def save(self, commit = True):
        user = super().save(commit = False)
        user.username = ""
        user.set_password(self.cleaned_data['password'])
        user.save()
        
        return user


class AuthForm(AuthenticationForm):
    password = forms.CharField(
        required=True, 
        label="Пароль",
        widget= forms.PasswordInput(attrs={
            "placeholder": "Введіть пароль"
        }))
    
    username = forms.EmailField(
        required=True, 
        label="Електрона пошта",
        widget= forms.EmailInput(attrs={
            "placeholder": "Введіть пошту"
        }))
    
    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')

        user = authenticate(self.request, username = username, password = password)
        if not user:
            print("ecnm")
            raise forms.ValidationError(message = 'Користувача не існує')
        else:
            self.confirm_login_allowed(user = user)

        return self.cleaned_data

    
class ConfirmForm(forms.Form):
    confirm1 = forms.CharField(required=True, label="")
    confirm2 = forms.CharField(required=True, label="")
    confirm3 = forms.CharField(required=True, label="")
    confirm4 = forms.CharField(required=True, label="")
    confirm5 = forms.CharField(required=True, label="")
    confirm6 = forms.CharField(required=True, label="")