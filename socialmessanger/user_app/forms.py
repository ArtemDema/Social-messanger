from django import forms

class RegForm(forms.Form):
    email = forms.EmailField(required=True, label="Електронна пошта")
    password = forms.CharField(required=True, label="Пароль")
    confirm_password = forms.CharField(required=True, label="Підтвердіть пароль")

class AuthForm(forms.Form):
    email = forms.EmailField(required=True, label="Електронна пошта")
    password = forms.CharField(required=True, label="Пароль")

class ConfirmForm(forms.Form):
    confirm1 = forms.CharField(required=True, label="")
    confirm2 = forms.CharField(required=True, label="")
    confirm3 = forms.CharField(required=True, label="")
    confirm4 = forms.CharField(required=True, label="")
    confirm5 = forms.CharField(required=True, label="")
    confirm6 = forms.CharField(required=True, label="")