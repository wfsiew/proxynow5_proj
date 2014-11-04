from models import *
from django import forms
from django.shortcuts import *
from django.db import transaction
from django.utils.translation import ugettext as _
from django.db.models import Q
from proxynow5_proj.proxynow5.forms import BaseSaveForm, BaseSearchForm
from proxynow5_proj.proxynow5.Definition_Network.forms import SEARCH_CHOICES
from proxynow5_proj.proxynow5.exceptions import UIException
from proxynow5_proj.proxynow5.utils import validate_netmask

NETINT_SEARCH_CHOICES = (
                         (0, _(u'All')),
                         (1, _(u'Ethernet Standard'))
)

NETROUTE_DESTINATION_SEARCH_CHOICES = (
                                       SEARCH_CHOICES[1],
                                       SEARCH_CHOICES[2],
                                       SEARCH_CHOICES[3],
                                       SEARCH_CHOICES[4]
)

NETROUTE_GATEWAY_SEARCH_CHOICES = (
                                   (5, SEARCH_CHOICES[1][1]),
                                   (6, SEARCH_CHOICES[2][1])
)

NETROUTE_SEARCH_CHOICES = (
                           (0, _(u'All')),
                           ('Destination', NETROUTE_DESTINATION_SEARCH_CHOICES),
                           ('Gateway', NETROUTE_GATEWAY_SEARCH_CHOICES)
)

ADD_NETINT_FORM_TITLE = _(u'Create new interface')
EDIT_NETINT_FORM_TITLE = _(u'Edit interface')
ADD_NETROUTE_FORM_TITLE = _(u'Create new route')
EDIT_NETROUTE_FORM_TITLE = _(u'Edit route')
ADD_NETDHCP_FORM_TITLE = _(u'Create new DHCP server')
EDIT_NETDHCP_FORM_TITLE = _(u'Edit DHCP server')

class NetIntForm(BaseSaveForm):
    name = forms.CharField(max_length=1024, label=_(u'Name:'),
                          widget=forms.TextInput(attrs={'class': 'text'}))
    type = forms.ChoiceField(choices=NETINT_TYPES, label=_(u'Type:'),
                             widget=forms.Select(attrs={'class': 'select'}))
    hardware = forms.ModelChoiceField(queryset=NIC.objects.all(),
                                      label=_(u'Hardware:'),
                                      widget=forms.Select(attrs={'class': 'select'}))
    address = forms.IPAddressField(label=_(u'IP address:'),
                                   widget=forms.TextInput(attrs={'class': 'text'}))
    netmask = forms.IPAddressField(label=_(u'Netmask:'),
                                   widget=forms.TextInput(attrs={'class': 'text'}))
    gateway = forms.IPAddressField(label=_(u'Default GW:'),
                                   widget=forms.TextInput(attrs={'class': 'text'}), required=False)
    mtu = forms.IntegerField(initial=DEFAULT_NETINT_MTU, label=_(u'MTU:'),
                             widget=forms.TextInput(attrs={'class': 'text'}))
    comment = forms.CharField(max_length=10240, label=_(u'Comment:'),
                              widget=forms.TextInput(attrs={'class': 'text'}), required=False)
    
    def validate_name(self, name):
        try:
            o = NetInt.objects.get(name__iexact=name)
            raise UIException(_(u'The name %s already exist.' % name))
        
        except NetInt.DoesNotExist:
            pass
    
    @transaction.commit_on_success
    def insert(self, request):
        name = self.cleaned_data['name']
        _type = self.cleaned_data['type']
        hardware = self.cleaned_data['hardware']
        address = self.cleaned_data['address']
        netmask = self.cleaned_data['netmask']
        gateway = self.cleaned_data['gateway']
        _mtu = self.cleaned_data['mtu']
        comment = self.cleaned_data['comment']
        type = int(_type)
        mtu = int(_mtu)
        self.validate_name(name)
        validate_netmask(netmask)
        
        netint = NetInt.objects.create(name=name, type=type, hardware=hardware, address=address,
                                       netmask=netmask, gateway=gateway, mtu=mtu, comment=comment)
        
    @transaction.commit_on_success
    def update(self, request):
        name = self.cleaned_data['name']
        _type = self.cleaned_data['type']
        hardware = self.cleaned_data['hardware']
        address = self.cleaned_data['address']
        netmask = self.cleaned_data['netmask']
        gateway = self.cleaned_data['gateway']
        _mtu = self.cleaned_data['mtu']
        comment = self.cleaned_data['comment']
        _id = request.POST['id']
        type = int(_type)
        mtu = int(_mtu)
        id = int(_id)
        try:
            netint = NetInt.objects.get(id=id)
            
        except NetInt.DoesNotExist:
            raise UIException(_(u'The interface does not exist.'))
        
        if name.lower() != netint.name.lower():
            self.validate_name(name)
        
        validate_netmask(netmask)
        netint.name = name
        netint.hardware = hardware
        netint.address = address
        netint.netmask = netmask
        netint.gateway = gateway
        netint.mtu = mtu
        netint.comment = comment
        netint.save()
        
class NetIntSearchForm(BaseSearchForm):  
    selection = forms.ChoiceField(choices=NETINT_SEARCH_CHOICES,
                                  widget=forms.Select(attrs={'class': 'search_option'}))
        
class NetLBForm(BaseSaveForm):
    id = forms.ModelChoiceField(queryset=NetInt.objects.all(),
                                label=_(u'Interface'),
                                widget=forms.Select(attrs={'class': 'select'}))
    
    def insert(self, request):
        _id = self.cleaned_data['id']
        id = int(_id)
        
        netlb = NetLB.objects.create(id=id)
        
    def update(self, request):
        _id = self.cleaned_data['id']
        _oldid = request.POST['_id']
        id = int(_id)
        oldid = int(_oldid)
        try:
            _netlb = NetLB.objects.get(id=oldid)
            
        except NetLB.DoesNotExist:
            raise UIException(_(u'The link load balancing does not exist.'))
        
        _netlb.delete()
        
        netlb = NetLB.objects.create(id=id)
        netlb.save()
        
class NetDHCPForm(BaseSaveForm):
    netid = forms.ModelChoiceField(queryset=NetInt.objects.all(),
                                   label=_(u'Interface:'),
                                   widget=forms.Select(attrs={'class': 'select'}))
    start = forms.IPAddressField(label=_(u'Range start:'),
                                 widget=forms.TextInput(attrs={'class': 'text'}))
    end = forms.IPAddressField(label=_(u'Range end:'),
                               widget=forms.TextInput(attrs={'class': 'text'}))
    dnsserver1 = forms.IPAddressField(label=_(u'DNS Server 1:'),
                                      widget=forms.TextInput(attrs={'class': 'text'}))
    dnsserver2 = forms.IPAddressField(label=_(u'DNS Server 2:'),
                                      widget=forms.TextInput(attrs={'class': 'text'}))
    gateway = forms.IPAddressField(label=_(u'Default gateway:'),
                                   widget=forms.TextInput(attrs={'class': 'text'}))
    domain = forms.CharField(max_length=100, label=_(u'Domain:'),
                             widget=forms.TextInput(attrs={'class': 'text'}))
    leasetime = forms.IntegerField(label=_(u'Lease Time (sec):'),
                                   widget=forms.TextInput(attrs={'class': 'text'}))
    
    @transaction.commit_on_success
    def insert(self, request):
        netid = self.cleaned_data['netid']
        start = self.cleaned_data['start']
        end = self.cleaned_data['end']
        dnsserver1 = self.cleaned_data['dnsserver1']
        dnsserver2 = self.cleaned_data['dnsserver2']
        gateway = self.cleaned_data['gateway']
        domain = self.cleaned_data['domain']
        _leasetime = self.cleaned_data['leasetime']
        leasetime = int(_leasetime)
        
        netdhcp = NetDHCP.objects.create(netid=netid, start=start, end=end,
                                         dnsserver1=dnsserver1, dnsserver2=dnsserver2,
                                         gateway=gateway, domain=domain, leasetime=leasetime)
        
    @transaction.commit_on_success
    def update(self, request):
        netid = self.cleaned_data['netid']
        start = self.cleaned_data['start']
        end = self.cleaned_data['end']
        dnsserver1 = self.cleaned_data['dnsserver1']
        dnsserver2 = self.cleaned_data['dnsserver2']
        gateway = self.cleaned_data['gateway']
        domain = self.cleaned_data['domain']
        _leasetime = self.cleaned_data['leasetime']
        _oldnetid = request.POST['_netid']
        leasetime = int(_leasetime)
        oldnetid = int(_oldnetid)
        try:
            _netdhcp = NetDHCP.objects.get(netid=oldnetid)
            
        except NetDHCP.DoesNotExist:
            raise UIException(_(u'The DHCP server does not exist.'))
        
        _netdhcp.delete()
        
        netdhcp = NetDHCP.objects.create(netid=netid, start=start, end=end,
                                         dnsserver1=dnsserver1, dnsserver2=dnsserver2,
                                         gateway=gateway, domain=domain, leasetime=leasetime)
        
class NetDHCPSearchForm(BaseSearchForm):
    pass

class NetRouteForm(BaseSaveForm):
    netid = forms.ModelChoiceField(queryset=DefNet.objects.all(),
                                   label=_(u'Destination:'))
    gwid = forms.ModelChoiceField(queryset=DefNet.objects.filter(Q(type=1) | Q(type=2)),
                                  label=_(u'Gateway:'))
    comment = forms.CharField(max_length=10240, label=_(u'Comment:'),
                              widget=forms.TextInput(attrs={'class': 'text'}), required=False)
    
    @transaction.commit_on_success
    def insert(self, request):
        netid = self.cleaned_data['netid']
        gwid = self.cleaned_data['gwid']
        comment = self.cleaned_data['comment']
            
        netroute = NetRoute.objects.create(netid=netid, gwid=gwid, comment=comment)
    
    @transaction.commit_on_success
    def update(self, request):
        netid = self.cleaned_data['netid']
        gwid = self.cleaned_data['gwid']
        comment = self.cleaned_data['comment']
        _id = request.POST['id']
        id = int(_id)
        try:
            netroute = NetRoute.objects.get(id=id)
            
        except NetRoute.DoesNotExist:
            raise UIException(_(u'The route does not exist.'))
        
        netroute.netid = netid
        netroute.gwid = gwid
        netroute.comment = comment
        netroute.save()
        
class NetRouteSearchForm(BaseSearchForm):
    selection = forms.ChoiceField(choices=NETROUTE_SEARCH_CHOICES,
                                  widget=forms.Select(attrs={'class': 'search_option'}))