from models import *
from django import forms
from django.shortcuts import *
from proxynow5_proj.proxynow5.utils import *
from proxynow5_proj.proxynow5.forms import BaseSaveForm
from proxynow5_proj.proxynow5.exceptions import UIException
from django.utils.translation import ugettext as _
from datetime import datetime

class AdminForm(BaseSaveForm):
    datetime = forms.DateTimeField(label=_(u'Appliance date time:'),
                                   widget=forms.DateTimeInput(attrs={'class': 'text',
                                                                     'title': 'YYYY-MM-DD hh:mm:ss'}))
    timezone = forms.CharField(max_length=100, label=_(u'Appliance timezone:'),
                               widget=forms.TextInput(attrs={'class': 'text'}))
    
    def insert(self, request):
        datetime = self.cleaned_data['datetime']
        timezone = self.cleaned_data['timezone']
        
        try:
            Admin.objects.all().delete()
            
        except:
            pass
        
        o = Admin.objects.create(datetime=datetime,
                                 timezone=timezone)
        return o
    
    def update(self, request):
        datetime = self.cleaned_data['datetime']
        timezone = self.cleaned_data['timezone']
        _id = request.POST['id']
        id = int(_id)
        
        try:
            o = Admin.objects.get(id=id)
            
        except Admin.DoesNotExist:
            raise UIException(_(u'The Admin setting does not exist'))
        
        o.datetime = datetime
        o.timezone = timezone
        o.save()
        return o
    
class ADInfoForm(BaseSaveForm):
    adserver = forms.CharField(max_length=100, label=_(u'Active Directory server address:'),
                               widget=forms.TextInput(attrs={'class': 'text'}))
    addomain = forms.CharField(max_length=100, label=_(u'Active Directory domain:'),
                               widget=forms.TextInput(attrs={'class': 'text'}))
    adusername = forms.CharField(max_length=100, label=_(u'Active Directory Administrator username:'),
                                 widget=forms.TextInput(attrs={'class': 'text'}))
    adpassword = forms.CharField(max_length=50, label=_(u'Active Directory Administrator password:'),
                                 widget=forms.PasswordInput(attrs={'class': 'text'}))
    
    def insert(self, request):
        adserver = self.cleaned_data['adserver']
        addomain = self.cleaned_data['addomain']
        adusername = self.cleaned_data['adusername']
        raw_adpassword = self.cleaned_data['adpassword']
        adpassword = encrypt_password_(raw_adpassword)
        
        try:
            ADInfo.objects.all().delete()
            
        except:
            pass
        
        o = ADInfo.objects.create(adserver=adserver,
                                  addomain=addomain,
                                  adusername=adusername,
                                  adpassword=adpassword)
        return o
    
    def update(self, request):
        adserver = self.cleaned_data['adserver']
        addomain = self.cleaned_data['addomain']
        adusername = self.cleaned_data['adusername']
        raw_adpassword = self.cleaned_data['adpassword']
        _id = request.POST['id']
        id = int(_id)
        
        try:
            o = ADInfo.objects.get(id=id)
            
        except ADInfo.DoesNotExist:
            raise UIException(_(u'The Active Directory setting does not exist'))
        
        o.adserver = adserver
        o.addomain = addomain
        o.adusername = adusername
        if raw_adpassword != '**********':
            o.adpassword = encrypt_password_(raw_adpassword)
            
        o.save()
        return o