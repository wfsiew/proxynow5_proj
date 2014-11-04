from django import forms

SECURE_OPTIONS = (
                  ('normal', (u'Normal')),
                  ('TLS', (u'TLS')),
                  ('SSL', (u'SSL')),
)

class ListEmailForm(forms.Form):
    email = forms.EmailField(required=True)
        
class  HostEmailForm(forms.Form):
    fromemail = forms.EmailField(widget=forms.TextInput(attrs={'class': 'text'}), required=True)
    
    smtphost = forms.CharField(max_length=10240,widget=forms.TextInput(attrs={'class': 'text'}), required=True)
    
    smtpport = forms.IntegerField(widget=forms.TextInput(attrs={'class': 'text'}), required=True)
    
    smtpuser = forms.CharField(max_length=10240,widget=forms.TextInput(attrs={'class': 'text'}),required=False)
    
    smtppass =  forms.CharField(max_length=10240,widget=forms.PasswordInput(attrs={'class': 'text'}),required=False)
    
    smtprepass = forms.CharField(max_length=10240, widget=forms.PasswordInput(attrs={'class': 'text'}),required=False)
    
    smtpsecure = forms.ChoiceField(choices=SECURE_OPTIONS,
                                  widget=forms.Select()) 
    