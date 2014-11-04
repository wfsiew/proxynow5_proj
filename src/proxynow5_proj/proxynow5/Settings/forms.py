from django import forms

class ImportForm(forms.Form):
    filename = forms.FileField()