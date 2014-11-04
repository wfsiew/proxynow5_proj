from django import forms
from django.utils.translation import ugettext as _
from proxynow5_proj.proxynow5.NIC.models import NIC
from proxynow5_proj.proxynow5.Administration.forms import *

CONFIGURATION_ADMINISTRATOR_FORM_TITLE = _(u'Configuration wizard - Administrator account')
CONFIGURATION_NETWORK_INTERFACES_FORM_TITLE = _('Configuration wizard - Network interfaces definition')
CONFIGURATION_DNS = _('Configuration wizard - DNS')
CONFIGURATION_USER_AUTHENTICATION = _(u'Configuration wizard - User authentication')
CONFIGURATION_TRUSTED_NETWORK = _(u'Configuration wizard - Trusted Network Range')
CONFIGURATION_INTERNET_USAGE_POLICY = _(u'Configuration wizard - Internet Usage Policy')
CONFIGURATION_FINISHED = _(u'Configuration wizard - Completed!')

# Note that 
# the word on the left , can not be changed.
IMPORT_SETTINGS = (
                  ('Notused', _(u'Not used')),
                  ('1', _(u'1')),
                  ('2', _(u'2')),
                  ('3', _(u'3')),
                  ('4', _(u'4')),
                  ('5', _(u'5')),
                  ('6', _(u'6')),
)

class ADMINISTRATORACCOUNTfORM(forms.Form):
    adpassword = forms.CharField(max_length=100,required=True,widget=forms.PasswordInput(attrs={'class': 'text'}))
    readpassword = forms.CharField(max_length=100,required=True,widget=forms.PasswordInput(attrs={'class': 'text'}))
    emailnotifier = forms.EmailField(max_length=100,required=True,widget=forms.TextInput(attrs={'class': 'text'}))
    
    def clean_readpassword(self):
        varadpassword = self.cleaned_data['adpassword']
        varreadpassword = self.cleaned_data['readpassword']
        
        if varadpassword != varreadpassword:
            raise forms.ValidationError(_(u"Passwords do not match.")) 
        
        return self.cleaned_data['readpassword']
    

class EXTERNALINTERFACEFORM(forms.Form):
    ipaddresslocal = forms.IPAddressField(widget=forms.TextInput(attrs={'class': 'text'}))
    netmaskaddresslocal = forms.IPAddressField(widget=forms.TextInput(attrs={'class': 'text'}))
    defaultgateway = forms.IPAddressField(widget=forms.TextInput(attrs={'class': 'text'}))
    hardware = forms.ModelChoiceField(queryset=NIC.objects.all() ,widget=forms.Select(attrs={'class': 'select'})) 
    
    def clean_netmaskaddresslocal(self):
        varnetmaskaddresslocal = self.cleaned_data['netmaskaddresslocal']
        validate_netmask(varnetmaskaddresslocal)
        
    
class LOCALINTERFACEFORM(forms.Form):
    ipaddresslocal_external = forms.IPAddressField(widget=forms.TextInput(attrs={'class': 'text'}))
    netmaskaddresslocal_external = forms.IPAddressField(widget=forms.TextInput(attrs={'class': 'text'}))
    defaultgateway_external = forms.IPAddressField(widget=forms.TextInput(attrs={'class': 'text'}))
    hardware_external = forms.ModelChoiceField(queryset=NIC.objects.all() ,widget=forms.Select(attrs={'class': 'select'}))
    
    ipaddresslocal_internal = forms.IPAddressField(widget=forms.TextInput(attrs={'class': 'text'}))
    netmaskaddresslocal_internal = forms.IPAddressField(widget=forms.TextInput(attrs={'class': 'text'}))
    hardware_internal = forms.ModelChoiceField(queryset=NIC.objects.all() ,widget=forms.Select(attrs={'class': 'select'})) 
    
    def clean_hardware_internal(self):
        varhardware_external = self.cleaned_data['hardware_external']
        varhardware_internal = self.cleaned_data['hardware_internal']
        
        if (varhardware_internal != "") and (varhardware_external == varhardware_internal):
            raise forms.ValidationError(_(u"Internal and external hardwares must be different."))
        
        return self.cleaned_data['hardware_internal']
    
    def clean_netmasklocal_external(self):
        varnetmaskaddresslocal_external = self.cleaned_data['netmaskaddresslocal_external']
        validate_netmask(varnetmaskaddresslocal_external)
    
    def clean_netmaskaddresslocal_internal(self):
        varnetmaskaddresslocal_internal = self.cleaned_data['netmaskaddresslocal_internal']
        validate_netmask(varnetmaskaddresslocal_internal)
        
     
class USERAUTHENTICATEFORM(ADInfoForm):
    confirmadpassword = forms.CharField(max_length=100, label=_(u'Active Directory Administrator password:'),
                                 widget=forms.PasswordInput(attrs={'class': 'text'}))
    
    def clean_confirmadpassword(self):
        varconfirmadpassword = self.cleaned_data['confirmadpassword']
        varadpassword = self.cleaned_data["adpassword"]
        
        if varadpassword != "" and  varadpassword != varconfirmadpassword:
            raise forms.ValidationError(_(u"Passwords do not match."))
        
        return self.cleaned_data['confirmadpassword']
             
        
class SETTINGSIMPORTFORM(forms.Form):
    selection = forms.ChoiceField(choices = IMPORT_SETTINGS,
                                  widget = forms.Select(attrs={'style': 'width:150px'}))  

      
class IpRange(forms.Form):
    ipaddress_range = forms.IPAddressField(widget=forms.TextInput(attrs={'class': 'text'}))
      
    
    