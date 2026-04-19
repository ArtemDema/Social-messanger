from django import forms

class RegForm(forms.Form):
    email = forms.EmailField(required=True, label="Електронна пошта")
    password = forms.CharField(required=True, label="Пароль")
    confirm_password = forms.CharField(required=True, label="Підтвердіть пароль")

class AuthForm(forms.Form):
    email = forms.EmailField(required=True, label="Електронна пошта")
    password = forms.CharField(required=True, label="Пароль")

class ConfirmForm(forms.Form):
    confirm = forms.CharField(required=True, label="Код підтвердження")