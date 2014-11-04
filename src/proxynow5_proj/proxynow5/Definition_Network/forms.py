from models import *
from django import forms
from django.shortcuts import *
from django.db import transaction
from django.utils.translation import ugettext as _
from proxynow5_proj.proxynow5.Wizard.process_session import STORE_HOST, \
    store_session, is_existed_in_session, get_items_session_byid, \
    update_items_session
from proxynow5_proj.proxynow5.exceptions import UIException
from proxynow5_proj.proxynow5.forms import BaseSaveForm, BaseSearchForm, \
    BaseFilterForm
from proxynow5_proj.proxynow5.utils import get_obj_id, validate_netmask

SEARCH_CHOICES = (
                  (0, _(u'All')),
                  (1, _(u'Host')),
                  (2, _(u'DNS host')),
                  (3, _(u'Network')),
                  (4, _(u'Network group'))
)

ADD_FORM_TITLE = _(u'Create new network definition')
EDIT_FORM_TITLE = _(u'Edit network definition')

class DefNetForm(BaseSaveForm):
    name = forms.CharField(max_length=1024, label=_(u'Name:'),
                           widget=forms.TextInput(attrs={'class': 'text'}))
    type = forms.ChoiceField(choices=DEFNET_TYPES, label=_(u'Type:'),
                            widget=forms.Select(attrs={'class': 'select'}))
    comment = forms.CharField(max_length=10240, label=_(u'Comment:'),
                              widget=forms.TextInput(attrs={'class': 'text'}), required=False)
    
    def clean_type(self):
        _type = self.cleaned_data['type']
        type = int(_type)
        if type < 1 or type > 4:
            raise forms.ValidationError(_(u'Invalid type'))
        
        return _type
    
    def validate_name(self, name):
        try:
            o = DefNet.objects.get(name__iexact=name)
            raise UIException(_(u'The name %s already exist.' % name))
        
        except DefNet.DoesNotExist:
            pass
    
    @transaction.commit_on_success
    def insert(self, request):
        name = self.cleaned_data['name']
        _type = self.cleaned_data['type']
        comment = self.cleaned_data['comment']
        type = int(_type)
        self.validate_name(name)
        
        if type == 1:
            form = DefNetHostForm(request.POST)
            if form.is_valid():
                defnet = DefNet.objects.create(name=name, type=type, comment=comment)
                form.insert(defnet, request)
                return None, defnet
                
            else:
                return form, None
            
        elif type == 2:
            form = DefNetDNSHostForm(request.POST)
            if form.is_valid():
                defnet = DefNet.objects.create(name=name, type=type, comment=comment)
                form.insert(defnet, request)
                return None, defnet
                
            else:
                return form, None
            
        elif type == 3:
            form = DefNetNetworkForm(request.POST)
            if form.is_valid():
                defnet = DefNet.objects.create(name=name, type=type, comment=comment)
                form.insert(defnet, request)
                return None, defnet
                
            else:
                return form, None
            
        elif type == 4:
            form = DefNetGroupForm()
            defnet = DefNet.objects.create(name=name, type=type, comment=comment)
            form.insert(defnet, request)
            return None, defnet
    
    @transaction.commit_on_success
    def update(self, request):
        name = self.cleaned_data['name']
        _type = self.cleaned_data['type']
        comment = self.cleaned_data['comment']
        _id = request.POST['id']
        type = int(_type)
        id = int(_id)
        try:
            defnet = DefNet.objects.get(id=id)
            
        except DefNet.DoesNotExist:
            raise UIException(_(u'The network definition does not exist.'))
        
        if name.lower() != defnet.name.lower():
            self.validate_name(name)
        
        if type == 1:
            form = DefNetHostForm(request.POST)
            if form.is_valid():
                defnet.name = name
                defnet.comment = comment
                defnet.save()
                form.update(defnet, request)
                return None, defnet

            else:
                return form, None
            
        elif type == 2:
            form = DefNetDNSHostForm(request.POST)
            if form.is_valid():
                defnet.name = name
                defnet.comment = comment
                defnet.save()
                form.update(defnet, request)
                return None, defnet
                
            else:
                return form, None
            
        elif type == 3:
            form = DefNetNetworkForm(request.POST)
            if form.is_valid():
                defnet.name = name
                defnet.comment = comment
                defnet.save()
                form.update(defnet, request)
                return None, defnet
                
            else:
                return form, None
            
        elif type == 4:
            form = DefNetGroupForm()
            defnet.name = name
            defnet.comment = comment
            defnet.save()
            form.update(defnet, request)
            return None, defnet
        
    def insert_temp(self, request):
        name = self.cleaned_data['name']
        _type = self.cleaned_data['type']
        comment = self.cleaned_data['comment']
        type = int(_type)
        is_existed_in_session(request, STORE_HOST, name)
        
        if type == 1:
            form = DefNetHostForm(request.POST)
            if form.is_valid():
                defnet = DefNet(name=name, type=type, comment=comment)
                defnet.id = get_obj_id(defnet)
                x1 = form.insert_temp(defnet, request)
                
                ls = [defnet, x1]  
                store_session(request, STORE_HOST, name,str(defnet.id) , ls)
                return None, defnet
            
            else:
                return form, None
            
        elif type == 2:
            form = DefNetDNSHostForm(request.POST)
            if form.is_valid():
                defnet = DefNet(name=name, type=type, comment=comment)
                defnet.id = get_obj_id(defnet)
                x2 = form.insert_temp(defnet, request)
                
                ls = [defnet, x2]
                store_session(request, STORE_HOST, name,str(defnet.id), ls)
                return None, defnet
                
            else:
                return form, None
            
        elif type == 3:
            form = DefNetNetworkForm(request.POST)
            if form.is_valid():
                defnet = DefNet(name=name, type=type, comment=comment)
                defnet.id = get_obj_id(defnet)
                x3 = form.insert_temp(defnet, request)
                
                ls = [defnet, x3]
                store_session(request, STORE_HOST, name,str(defnet.id) ,ls)
                return None, defnet
                
            else:
                return form, None
            
        elif type == 4:
            form = DefNetGroupForm()
            defnet = DefNet(name=name, type=type, comment=comment)
            defnet.id = get_obj_id(defnet)
            x4 = form.insert_temp(defnet, request)
            
            ls = [defnet, x4]
            store_session(request, STORE_HOST, name,str(defnet.id), ls)
            return None, defnet
        
    def update_temp(self,request):
       
        name = self.cleaned_data['name']
        _type = self.cleaned_data['type']
        comment = self.cleaned_data['comment']
        type = int(_type)
        _id = request.POST['id']
        ls_def = []
        type = int(_type)
        id = int(_id)
        
        defnetobj = get_items_session_byid(request, STORE_HOST, str(id))
       
        if defnetobj is None:
            raise UIException(_(u'The Host does not exist'))
        
        defnetmainobj = defnetobj[0]
        
        if name.lower() != defnetmainobj.name.lower() :
            is_existed_in_session(request, STORE_HOST, name)
                    
        if type == 1:
            form = DefNetHostForm(request.POST)
            if form.is_valid():
                defnetmainobj.name = name
                defnetmainobj.comment = comment
                defnetmainobj.type = 1
                
                x1 = form.insert_temp(defnetmainobj, request)
              
                ls_def = [defnetmainobj, x1]
                update_items_session(request, STORE_HOST, name, id, ls_def) 
                return None,defnetmainobj 
            else:
               
                return form,None
                
        if type == 2:
            form = DefNetDNSHostForm(request.POST)
            if form.is_valid():
                defnetmainobj.name = name
                defnetmainobj.comment = comment
                defnetmainobj.type = 2
                x1 = form.insert_temp(defnetmainobj, request)
                
                ls_def = [defnetmainobj, x1]
                update_items_session(request, STORE_HOST, name, id, ls_def)
                return None,defnetmainobj 
            else:
                return form,None
                
        if type == 3:
            form = DefNetNetworkForm(request.POST)
            if form.is_valid():
                defnetmainobj.name = name
                defnetmainobj.comment = comment
                defnetmainobj.type = 3
                x1 = form.insert_temp(defnetmainobj, request)
                
                ls_def = [defnetmainobj,x1]
                update_items_session(request, STORE_HOST, name, id, ls_def)
                
                return None,defnetmainobj 
            else:
                return form,None
                 
    
    def set_choices(self, type):
        self.fields['type'].choices = (DEFNET_TYPES[type - 1],)
        
    def set_netdnsrelay_choices(self):
        self.fields['type'].choices = (DEFNET_TYPES[0], DEFNET_TYPES[1],)
        
    def set_netroutegateway_choices(self):
        self.fields['type'].choices = (DEFNET_TYPES[0], DEFNET_TYPES[1],)
    
class DefNetHostForm(forms.Form):
    host = forms.IPAddressField(label=_(u'Host:'),
                                widget=forms.TextInput(attrs={'class': 'text'}))

    def insert(self, defnet, request):
        host = self.cleaned_data['host']
        o = DefNetHost.objects.create(id=defnet, host=host)

    def update(self, defnet, request):
        host = self.cleaned_data['host']
        o = get_object_or_404(DefNetHost, id=defnet)
        o.host = host
        o.save()
        
    def insert_temp(self, defnet, request):
        host = self.cleaned_data['host']
        o = DefNetHost(id=defnet, host=host)
        return o

class DefNetDNSHostForm(forms.Form):
    hostname = forms.CharField(max_length=1023, label=_(u'Hostname:'),
                               widget=forms.TextInput(attrs={'class': 'text'}))
    
    def insert(self, defnet, request):
        hostname = self.cleaned_data['hostname']
        o = DefNetDNSHost.objects.create(id=defnet, hostname=hostname)
        
    def update(self, defnet, request):
        hostname = self.cleaned_data['hostname']
        o = get_object_or_404(DefNetDNSHost, id=defnet)
        o.hostname = hostname
        o.save()
        
    def insert_temp(self, defnet, request):
        hostname = self.cleaned_data['hostname']
        o = DefNetDNSHost(id=defnet, hostname=hostname)
        return o
    
class DefNetNetworkForm(forms.Form):
    ipaddress = forms.IPAddressField(label=_(u'Address:'),
                                     widget=forms.TextInput(attrs={'class': 'text'}))
    netmask = forms.IPAddressField(initial='255.255.255.0', label=_(u'Netmask:'),
                                   widget=forms.TextInput(attrs={'class': 'text'}))
    
    def insert(self, defnet, request):
        ipaddress = self.cleaned_data['ipaddress']
        netmask = self.cleaned_data['netmask']
        validate_netmask(netmask)
        o = DefNetNetwork.objects.create(id=defnet,
                                         ipaddress=ipaddress,
                                         netmask=netmask)
        
    def update(self, defnet, request):
        ipaddress = self.cleaned_data['ipaddress']
        netmask = self.cleaned_data['netmask']
        validate_netmask(netmask)
        o = get_object_or_404(DefNetNetwork, id=defnet)
        o.ipaddress = ipaddress
        o.netmask = netmask
        o.save()
        
    def insert_temp(self, defnet, request):
        ipaddress = self.cleaned_data['ipaddress']
        netmask = self.cleaned_data['netmask']
        validate_netmask(netmask)
        o = DefNetNetwork(id=defnet,
                          ipaddress=ipaddress,
                          netmask=netmask)
        return o
    
class DefNetGroupForm(forms.Form):
    
    @transaction.commit_on_success
    def insert(self, defnet, request):
        members = request.POST['members']
#        if members == '' or members == None:
#            raise Exception(_(u'Group members are required.'))
            
        members_id = members.split(',')
        for id in members_id:
            try:
                m = get_object_or_404(DefNet, id=id)
                o = DefNetGroup.objects.create(gid=defnet, member=m)
                
            except:
                pass
            
    @transaction.commit_on_success
    def update(self, defnet, request):
        members = request.POST['members']
#        if members == '' or members == None:
#            raise Exception(_(u'Group members are required.'))
        
        members_id = members.split(',')
        DefNetGroup.objects.filter(gid=defnet).delete()
        for id in members_id:
            try:
                m = get_object_or_404(DefNet, id=id)
                o = DefNetGroup.objects.create(gid=defnet, member=m)
                
            except:
                pass
            
    def insert_temp(self, defnet, request):
        members = request.POST['members']
        members_id = members.split(',')
        lst_obj = [] 
        
        for id in members_id:
            m = get_items_session_byid(request,STORE_HOST,id)
            
            if m != None:
                o = DefNetGroup(gid = defnet ,member=m)
                lst_obj.append(o)
        
        return lst_obj

class SearchForm(BaseSearchForm):  
    selection = forms.ChoiceField(choices=SEARCH_CHOICES,
                                  widget=forms.Select(attrs={'class': 'search_option'}))
    
class FilterForm(BaseFilterForm):
    filters = forms.ChoiceField(choices=SEARCH_CHOICES,
                                widget=forms.Select(attrs={'class': 'filter_option'}))
    
class FilterDNSRelayForm(BaseFilterForm):
    filters = forms.ChoiceField(choices=(
                                         SEARCH_CHOICES[1],
                                         SEARCH_CHOICES[2],
                                         ),
                                widget=forms.Select(attrs={'class': 'filter_option'}))
    
class FilterRouteGatewayForm(BaseFilterForm):
    filters = forms.ChoiceField(choices=(
                                         SEARCH_CHOICES[1],
                                         SEARCH_CHOICES[2],
                                         ),
                                widget=forms.Select(attrs={'class': 'filter_option'}))
    
def get_defnet_form(type, clone, dic):
    form = DefNetForm(dic)
    if clone == '1':
        return form
    
    else:
        if type >= 1 <= 4:
            form.set_choices(type)
        
        return form