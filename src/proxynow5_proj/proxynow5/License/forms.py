from models import *
from proxynow5_proj.proxynow5.License.license import *
from django import forms
from proxynow5_proj.proxynow5.exceptions import UIException
from django.utils.translation import ugettext as _

class LicenseForm(forms.Form):
    licensekey = forms.CharField(max_length=50, label=_(u'License key:'),
                                 widget=forms.TextInput(attrs={'class': 'lictext'}))
    
    def save(self, info):
        licensekey = self.cleaned_data['licensekey']
        identitytoken = info['IdentityToken']
        _pn_expirydate = info['PN_EXPIRY_DATE']
        _pn_webproxy_expirydate = info['PN_WEBPROXY_EXPIRY_DATE']
        _pn_numofusers = info['PN_No_of_Users']
        _pn_reserved1_expirydate = info['PN_RESERVED1_EXPIRY_DATE']
        _pn_reserved2_expirydate = info['PN_RESERVED2_EXPIRY_DATE']
        _pn_reserved3_expirydate = info['PN_RESERVED3_EXPIRY_DATE']
        _pn_reserved4_expirydate = info['PN_RESERVED4_EXPIRY_DATE']
        _pn_reserved5_expirydate = info['PN_RESERVED5_EXPIRY_DATE']
        
        pn_expirydate = get_datetime_from_dbstr(_pn_expirydate)
        pn_webproxy_expirydate = get_datetime_from_dbstr(_pn_webproxy_expirydate)
        pn_numofusers = int(_pn_numofusers)
        pn_reserved1_expirydate = get_datetime_from_dbstr(_pn_reserved1_expirydate)
        pn_reserved2_expirydate = get_datetime_from_dbstr(_pn_reserved2_expirydate)
        pn_reserved3_expirydate = get_datetime_from_dbstr(_pn_reserved3_expirydate)
        pn_reserved4_expirydate = get_datetime_from_dbstr(_pn_reserved4_expirydate)
        pn_reserved5_expirydate = get_datetime_from_dbstr(_pn_reserved5_expirydate)
        
        try:
            License.objects.all().delete()
            
        except:
            pass
        
        o = License.objects.create(activationkey=licensekey,
                                   identitytoken=identitytoken,
                                   pn_expirydate = pn_expirydate,
                                   pn_webproxy_expirydate=pn_webproxy_expirydate,
                                   pn_numofusers=pn_numofusers,
                                   pn_reserved1_expirydate=pn_reserved1_expirydate,
                                   pn_reserved2_expirydate=pn_reserved2_expirydate,
                                   pn_reserved3_expirydate=pn_reserved3_expirydate,
                                   pn_reserved4_expirydate=pn_reserved4_expirydate,
                                   pn_reserved5_expirydate=pn_reserved5_expirydate)
        return o