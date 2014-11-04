from models import *
from django import forms
from django.shortcuts import *
from proxynow5_proj.proxynow5.utils import *
from proxynow5_proj.proxynow5.sortablelist import *
from proxynow5_proj.proxynow5.forms import BaseSaveForm, BaseSearchForm
from proxynow5_proj.proxynow5.exceptions import UIException
from django.utils.translation import ugettext as _
from django.db.models import Q
from django.db import transaction

ADD_NAT_PF_FORM_TITLE = _(u'Create new port forwarding')
EDIT_NAT_PF_FORM_TITLE = _(u'Edit port forwarding')
ADD_NAT_MASQ_FORM_TITLE = _(u'Create new masquerading rule')
EDIT_NAT_MASQ_FORM_TITLE = _(u'Edit masquerading rule')
ADD_NAT_FORM_TITLE = _(u'Create new NAT rule')
EDIT_NAT_FORM_TITLE = _(u'Edit NAT rule')
ADD_NAT_ADVANCED_FORM_TITLE = _(u'')
EDIT_NAT_ADVANCED_FORM_TITLE = _(u'')

def get_nat_masq_locations():
    loc = [('top', _(u'Top')), ('bottom', _(u'Bottom'))]
    ls = NAT_MASQ.objects.order_by('location')
    i = 1
    for v in ls:
        loc.append((i, v.location))
        i += 1
                   
    return loc

class NAT_PFForm(BaseSaveForm):
    interface = forms.ModelChoiceField(queryset=NetInt.objects.all(),
                                       label=_(u'Interface:'),
                                       widget=forms.Select(attrs={'class': 'select'}))
    originalPort = forms.ModelChoiceField(queryset=DefServices.objects.all(),
                                          label=_(u'Port:'))
    host = forms.ModelChoiceField(queryset=DefNet.objects.all(),
                                  label=_(u'Host:'))
    newService = forms.ModelChoiceField(queryset=DefServices.objects.all(),
                                        label=_(u'Port:'))
    comment = forms.CharField(max_length=10240, label=_(u'Comment:'),
                              widget=forms.TextInput(attrs={'class': 'text'}), required=False)
    
    @transaction.commit_on_success
    def insert(self, request):
        interface = self.cleaned_data['interface']
        originalPort = self.cleaned_data['originalPort']
        host = self.cleaned_data['host']
        newService = self.cleaned_data['newService']
        comment = self.cleaned_data['comment']
        
        natpf = NAT_PF.objects.create(interface=interface, originalPort=originalPort,
                                      host=host, newService=newService, comment=comment)
    
    @transaction.commit_on_success
    def update(self, request):
        interface = self.cleaned_data['interface']
        originalPort = self.cleaned_data['originalPort']
        host = self.cleaned_data['host']
        newService = self.cleaned_data['newService']
        comment = self.cleaned_data['comment']
        _id = request.POST['id']
        id = int(_id)
        try:
            natpf = NAT_PF.objects.get(id=id)
            
        except NAT_PF.DoesNotExist:
            raise UIException(_(u'The NAT port forwarding does not exist.'))
        
        natpf.interface = interface
        natpf.originalPort = originalPort
        natpf.host = host
        natpf.newService = newService
        natpf.comment = comment
        natpf.save()
    
class NAT_MASQForm(BaseSaveForm):
    network = forms.ModelChoiceField(queryset=DefNet.objects.all(),
                                     label=_(u'Network:'))
    interface = forms.ModelChoiceField(queryset=NetInt.objects.all(),
                                       label=_(u'Interface:'),
                                       widget=forms.Select(attrs={'class': 'select'}))
    comment = forms.CharField(max_length=10240, label=_(u'Comment:'),
                              widget=forms.TextInput(attrs={'class': 'text'}), required=False)
    
    def __init__(self, *args, **kwargs):
        super(NAT_MASQForm, self).__init__(*args, **kwargs)
        self.fields['location'] = forms.ChoiceField(choices=get_nat_masq_locations(), label=_(u'Location'),
                                                    widget=forms.Select(attrs={'class': 'select'}))
        
    @transaction.commit_on_success
    def insert(self, request):
        network = self.cleaned_data['network']
        interface = self.cleaned_data['interface']
        comment = self.cleaned_data['comment']
        _location = self.cleaned_data['location']
        location = get_location_insert(NAT_MASQ, _location)
        ls = NAT_MASQ.objects.order_by('location')
        tls = tuple(ls)
        natmasq = NAT_MASQ.objects.create(network=network, interface=interface, location=location, comment=comment)
        
        if _location != 'bottom':
            update_locations_after_insert(location, tls)
            
        return None, natmasq
    
    @transaction.commit_on_success
    def update(self, request):
        network = self.cleaned_data['network']
        interface = self.cleaned_data['interface']
        _location = self.cleaned_data['location']
        comment = self.cleaned_data['comment']
        _id = request.POST['id']
        id = int(_id)
        try:
            natmasq = NAT_MASQ.objects.get(id=id)
            
        except NAT_MASQ.DoesNotExist:
            raise UIException(_(u'The NAT masquerading rule does not exist.'))
        
        location = get_location_update(NAT_MASQ, _location)
        ls = NAT_MASQ.objects.order_by('location')
        tls = tuple(ls)
        old_loc = natmasq.location
        
        natmasq.network = network
        natmasq.interface = interface
        natmasq.location = location
        natmasq.comment = comment
        natmasq.save()
        update_locations_after_update(old_loc, location, tls)
    
class NAT_DNAT_SNATForm(BaseSaveForm):
    originalSource = forms.ModelChoiceField(queryset=DefNet.objects.all(),
                                            label=_(u'Original source:'))
    originalPort = forms.ModelChoiceField(queryset=DefServices.objects.all(),
                                          label=_(u'Original port:'))
    originalDestination = forms.ModelChoiceField(queryset=DefNet.objects.all(),
                                                 label=_(u'Original destination:'))
    mode = forms.ChoiceField(choices=NAT_DNAT_SNAT_MODES, label=_(u'NAT mode:'),
                             widget=forms.Select(attrs={'class': 'select'}))
    newDestinationHost = forms.IntegerField(label=_(u'New destination:'), required=False)
    newDestinationPort = forms.IntegerField(label=_(u'New destination port:'), required=False)
    newSourceAddress = forms.IntegerField(label=_(u'New source:'), required=False)
    newSourcePort = forms.IntegerField(label=_(u'New source port:'), required=False)
    autoCreatePFRule = forms.IntegerField(initial=1, label=_(u'Automatically open on packet filter'),
                                          widget=forms.CheckboxInput())
    comment = forms.CharField(max_length=10240, label=_(u'Comment:'),
                              widget=forms.TextInput(attrs={'class': 'text'}), required=False)
    
    def clean(self):
        _mode = self.cleaned_data['mode']
        mode = int(_mode)
        if mode == 1 or mode == 3:
            newDestinationHost = self.cleaned_data['newDestinationHost']
            newDestinationPort = self.cleaned_data['newDestinationPort']
            if newDestinationHost == None or newDestinationHost == '' or \
                newDestinationPort == None or newDestinationPort == '':
                raise forms.ValidationError(_(u'Please enter new destination and new destination port.'))

        elif mode == 2 or mode == 3:
            newSourceAddress = self.cleaned_data['newSourceAddress']
            newSourcePort = self.cleaned_data['newSourcePort']
            if newSourceAddress == None or newSourceAddress == '' or \
                newSourcePort == None or newSourcePort == '':
                raise forms.ValidationError(_(u'Please enter new source and new source port.'))

        if mode == 1 or mode == 3:
            newDestinationHost_id = int(newDestinationHost)
            newDestinationPort_id = int(newDestinationPort)
            try:
                a = DefNet.objects.get(id=newDestinationHost_id)
                
            except DefNet.DoesNotExist:
                raise forms.ValidationError(_(u'Invalid destination.'))
            
            try:
                b = DefServices.objects.get(id=newDestinationPort_id)
                
            except DefServices.DoesNotExist:
                raise forms.ValidationError(_(u'Invalid destination port.'))
                
        elif mode == 2 or mode == 3:
            newSourceAddress_id = int(newSourceAddress)
            newSourcePort_id = int(newSourcePort)
            try:
                c = DefNet.objects.get(id=newSourceAddress_id)
                
            except DefNet.DoesNotExist:
                raise forms.ValidationError(_(u'Invalid source.'))
            
            try:
                d = DefServices.objects.get(id=newSourcePort_id)
                
            except DefServices.DoesNotExist:
                raise forms.ValidationError(_(u'Invalid source port.'))
                
        return self.cleaned_data
    
    @transaction.commit_on_success
    def insert(self, request):
        originalSource = self.cleaned_data['originalSource']
        originalPort = self.cleaned_data['originalPort']
        originalDestination = self.cleaned_data['originalDestination']
        _mode = self.cleaned_data['mode']
        _autoCreatePFRule = self.cleaned_data['autoCreatePFRule']
        comment = self.cleaned_data['comment']
        mode = int(_mode)
        autoCreatePFRule = int(_autoCreatePFRule)
        
        natdnatsnat = NAT_DNAT_SNAT(originalSource=originalSource, originalPort=originalPort,
                                    originalDestination=originalDestination, mode=mode,
                                    autoCreatePFRule=autoCreatePFRule, comment=comment)
        if mode == 1 or mode == 3:
            _newDestinationHost = self.cleaned_data['newDestinationHost']
            _newDestinationPort = self.cleaned_data['newDestinationPort']
            newDestinationHost_id = int(_newDestinationHost)
            newDestinationPort_id = int(_newDestinationPort)
            
            try:
                newDestinationHost = DefNet.objects.get(id=newDestinationHost_id)
                
            except DefNet.DoesNotExist:
                raise UIException(_(u'Invalid destination.'))
            
            try:
                newDestinationPort = DefServices.objects.get(id=newDestinationPort_id)
                
            except DefServices.DoesNotExist:
                raise UIException(_(u'Invalid destination port.'))
            
            natdnatsnat.newDestinationHost = newDestinationHost
            natdnatsnat.newDestinationPort = newDestinationPort
            
        elif mode == 2 or mode == 3:
            _newSourceAddress = self.cleaned_data['newSourceAddress']
            _newSourcePort = self.cleaned_data['newSourcePort']
            newSourceAddress_id = int(_newSourceAddress)
            newSourcePort_id = int(_newSourcePort)
            
            try:
                newSourceAddress = DefNet.objects.get(id=newSourceAddress_id)
                
            except DefNet.DoesNotExist:
                raise forms.ValidationError(_(u'Invalid source.'))
            
            try:
                newSourcePort = DefServices.objects.get(id=newSourcePort_id)
                
            except DefServices.DoesNotExist:
                raise forms.ValidationError(_(u'Invalid source.'))
            
            natdnatsnat.newSourceAddress = newSourceAddress
            natdnatsnat.newSourcePort = newSourcePort
            
        natdnatsnat.save()
    
    @transaction.commit_on_success
    def update(self, request):
        originalSource = self.cleaned_data['originalSource']
        originalPort = self.cleaned_data['originalPort']
        originalDestination = self.cleaned_data['originalDestination']
        _mode = self.cleaned_data['mode']
        _autoCreatePFRule = self.cleaned_data['autoCreatePFRule']
        comment = self.cleaned_data['comment']
        mode = int(_mode)
        autoCreatePFRule = int(_autoCreatePFRule)
        _id = request.POST['id']
        id = int(_id)
        try:
            natdnatsnat = NAT_DNAT_SNAT.objects.get(id=id)
            
        except NAT_DNAT_SNAT.DoesNotExist:
            raise UIException(_(u'The NAT rule does not exist.'))
        
        natdnatsnat.originalSource = originalSource
        natdnatsnat.originalPort = originalPort
        natdnatsnat.originalDestination = originalDestination
        natdnatsnat.mode = mode
        natdnatsnat.autoCreatePFRule = autoCreatePFRule
        natdnatsnat.comment = comment
        if mode == 1 or mode == 3:
            _newDestinationHost = self.cleaned_data['newDestinationHost']
            _newDestinationPort = self.cleaned_data['newDestinationPort']
            newDestinationHost_id = int(_newDestinationHost)
            newDestinationPort_id = int(_newDestinationPort)
            
            try:
                newDestinationHost = DefNet.objects.get(id=newDestinationHost_id)
                
            except DefNet.DoesNotExist:
                raise UIException(_(u'Invalid destination.'))
            
            try:
                newDestinationPort = DefServices.objects.get(id=newDestinationPort_id)
                
            except DefServices.DoesNotExist:
                raise UIException(_(u'Invalid destination port.'))
            
            natdnatsnat.newDestinationHost = newDestinationHost
            natdnatsnat.newDestinationPort = newDestinationPort
            
        elif mode == 2 or mode == 3:
            _newSourceAddress = self.cleaned_data['newSourceAddress']
            _newSourcePort = self.cleaned_data['newSourcePort']
            newSourceAddress_id = int(_newSourceAddress)
            newSourcePort_id = int(_newSourcePort)
            
            try:
                newSourceAddress = DefNet.objects.get(id=newSourceAddress_id)
                
            except DefNet.DoesNotExist:
                raise forms.ValidationError(_(u'Invalid source.'))
            
            try:
                newSourcePort = DefServices.objects.get(id=newSourcePort_id)
                
            except DefServices.DoesNotExist:
                raise forms.ValidationError(_(u'Invalid source.'))
            
            natdnatsnat.newSourceAddress = newSourceAddress
            natdnatsnat.newSourcePort = newSourcePort
        
        natdnatsnat.save()
        
class NATSearchForm(BaseSearchForm):
    pass