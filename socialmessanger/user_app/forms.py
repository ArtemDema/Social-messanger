from django import forms
from .models import User
from django.contrib.auth import authenticate
from django.contrib.auth.forms import AuthenticationForm



class RegForm(forms.ModelForm):
    password = forms.CharField(
        min_length= 6,
        max_length= 30,
        required=True, 
        label="Пароль",
        widget= forms.PasswordInput(attrs={
            'placeholder': 'Введіть пароль'
        }))
    
    confirm_password = forms.CharField(
        min_length= 6,
        max_length= 30,
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
        
        if email:
            if User.objects.filter(email = email).exists():
                raise forms.ValidationError(message = 'Користувач з такою поштою вже існує')
        else:
            raise forms.ValidationError(message = 'Поля пусті!')
        
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

        if username and password:
            self.user_cache = authenticate(self.request, username = username, password = password)
            if not self.user_cache:
                raise forms.ValidationError(message = 'Користувача не існує, або введені невірні дані')
            else:
                self.confirm_login_allowed(user = self.user_cache)

        return self.cleaned_data

    
class ConfirmForm(forms.Form):
    confirm1 = forms.CharField(required=True, label="", max_length= 1)
    confirm2 = forms.CharField(required=True, label="", max_length= 1)
    confirm3 = forms.CharField(required=True, label="", max_length= 1)
    confirm4 = forms.CharField(required=True, label="", max_length= 1)
    confirm5 = forms.CharField(required=True, label="", max_length= 1)
    confirm6 = forms.CharField(required=True, label="", max_length= 1)

    def clean(self):
        confirm1 = self.cleaned_data.get('confirm1')
        confirm2 = self.cleaned_data.get('confirm2')
        confirm3 = self.cleaned_data.get('confirm3')
        confirm4 = self.cleaned_data.get('confirm4')
        confirm5 = self.cleaned_data.get('confirm5')
        confirm6 = self.cleaned_data.get('confirm6')
        list_of_numbers = ["0","1","2","3","4","5","6","7","8","9"]

        if confirm1 not in list_of_numbers:
            raise forms.ValidationError(message = 'Ви ввели не число!')
        
        if confirm2 not in list_of_numbers:
            raise forms.ValidationError(message = 'Ви ввели не число!')
        
        if confirm3 not in list_of_numbers:
            raise forms.ValidationError(message = 'Ви ввели не число!')
        
        if confirm4 not in list_of_numbers:
            raise forms.ValidationError(message = 'Ви ввели не число!')
        
        if confirm5 not in list_of_numbers:
            raise forms.ValidationError(message = 'Ви ввели не число!')
        
        if confirm6 not in list_of_numbers:
            raise forms.ValidationError(message = 'Ви ввели не число!')