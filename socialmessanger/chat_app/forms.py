from django import forms

class GroupForm(forms.Form):
    name = forms.CharField(max_length = 20, 
                           widget = forms.TextInput(attrs= {"placeholder": "Введіть назву"}))
    
    images = forms.ImageField(label="",
                              widget = forms.ClearableFileInput())