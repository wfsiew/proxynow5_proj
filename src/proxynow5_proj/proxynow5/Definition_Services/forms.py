from models import *
from django import forms
from django.shortcuts import *
from proxynow5_proj.proxynow5.forms import BaseSaveForm, BaseSearchForm,\
    BaseFilterForm
from proxynow5_proj.proxynow5.exceptions import UIException
from django.utils.translation import ugettext as _
from django.forms.forms import Form
from django.db import transaction

SEARCH_CHOICES = (
                  (0, _(u'All')),
                  (1, _(u'TCP')),
                  (2, _(u'UDP')),
                  (3, _(u'ICMP')),
                  (4, _(u'IP')),
                  (5, _(u'Service group'))
)

ADD_FORM_TITLE = _(u'Create new service definition')
EDIT_FORM_TITLE = _(u'Edit service definition')

class DefServicesForm(BaseSaveForm):
    name = forms.CharField(max_length=1024, label=_(u'Name:'),
                           widget=forms.TextInput(attrs={'class': 'text'}))
    type = forms.ChoiceField(choices=DEFSERVICES_TYPES, label=_(u'Type:'),
                             widget=forms.Select(attrs={'class': 'select'}))
    comment = forms.CharField(max_length=10240, label=_(u'Comment:'),
                              widget=forms.TextInput(attrs={'class': 'text'}), required=False)
    
    def clean_type(self):
        _type = self.cleaned_data['type']
        type = int(_type)
        if type < 1 or type > 5:
            raise forms.ValidationError(_(u'Invalid type'))
        
        return _type
    
    def validate_name(self, name):
        try:
            o = DefServices.objects.get(name__iexact=name)
            raise UIException(_(u'The name %s already exist.' % name))
        
        except DefServices.DoesNotExist:
            pass
    
    @transaction.commit_on_success
    def insert(self, request):
        name = self.cleaned_data['name']
        _type = self.cleaned_data['type']
        comment = self.cleaned_data['comment']
        type = int(_type)
        self.validate_name(name)
        
        if type == 1:
            form = DefServicesTCPForm(request.POST)
            if form.is_valid():
                defservices = DefServices.objects.create(name=name, type=type, comment=comment)
                form.insert(defservices, request)
                return None, defservices
                
            else:
                return form, None
            
        elif type == 2:
            form = DefServicesUDPForm(request.POST)
            if form.is_valid():
                defservices = DefServices.objects.create(name=name, type=type, comment=comment)
                form.insert(defservices, request)
                return None, defservices
                
            else:
                return form, None
            
        elif type == 3:
            form = DefServicesICMPForm(request.POST)
            if form.is_valid():
                defservices = DefServices.objects.create(name=name, type=type, comment=comment)
                form.insert(defservices, request)
                return None, defservices
                
            else:
                return form, None
            
        elif type == 4:
            form = DefServicesIPForm(request.POST)
            if form.is_valid():
                defservices = DefServices.objects.create(name=name, type=type, comment=comment)
                form.insert(defservices, request)
                return None, defservices
                
            else:
                return form, None
            
        elif type == 5:
            form = DefServicesGroupForm()
            defservices = DefServices.objects.create(name=name, type=type, comment=comment)
            form.insert(defservices, request)
            return None, defservices
            
    @transaction.commit_on_success
    def update(self, request):
        name = self.cleaned_data['name']
        _type = self.cleaned_data['type']
        comment = self.cleaned_data['comment']
        _id = request.POST['id']
        type = int(_type)
        id = int(_id)
        try:
            defservices = DefServices.objects.get(id=id)
            
        except DefServices.DoesNotExist:
            raise UIException(_(u'The service definition does not exist.'))
        
        if name.lower() != defservices.name.lower():
            self.validate_name(name)
        
        if type == 1:
            form = DefServicesTCPForm(request.POST)
            if form.is_valid():
                defservices.name = name
                defservices.comment = comment
                defservices.save()
                form.update(defservices, request)
                return None, defservices

            else:
                return form, None
            
        elif type == 2:
            form = DefServicesUDPForm(request.POST)
            if form.is_valid():
                defservices.name = name
                defservices.comment = comment
                defservices.save()
                form.update(defservices, request)
                return None, defservices
                
            else:
                return form, None
            
        elif type == 3:
            form = DefServicesICMPForm(request.POST)
            if form.is_valid():
                defservices.name = name
                defservices.comment = comment
                defservices.save()
                form.update(defservices, request)
                return None, defservices
                
            else:
                return form, None
            
        elif type == 4:
            form = DefServicesIPForm(request.POST)
            if form.is_valid():
                defservices.name = name
                defservices.comment = comment
                defservices.save()
                form.update(defservices, request)
                return None, defservices
                
            else:
                return form, None
            
        elif type == 5:
            form = DefServicesGroupForm()
            defservices.name = name
            defservices.comment = comment
            defservices.save()
            form.update(defservices, request)
            return None, defservices
        
    def set_choices(self, type):
        self.fields['type'].choices = (DEFSERVICES_TYPES[type - 1],)
    
class DefServicesTCPForm(forms.Form):
    dstport = forms.CharField(label=_(u'Destination port:'),
                              widget=forms.TextInput(attrs={'class': 'text'}))
    srcport = forms.CharField(initial=DEFAULT_DEFSERVICESTCP_SRCPORT, label=_(u'Source port:'),
                              widget=forms.TextInput(attrs={'class': 'text'}))
    
    def insert(self, defservices, request):
        dstport = self.cleaned_data['dstport']
        srcport = self.cleaned_data['srcport']
        o = DefServicesTCP.objects.create(id=defservices,
                                          dstport=dstport,
                                          srcport=srcport)
        
    def update(self, defservices, request):
        dstport = self.cleaned_data['dstport']
        srcport = self.cleaned_data['srcport']
        o = get_object_or_404(DefServicesTCP, id=defservices)
        o.dstport = dstport
        o.srcport = srcport
        o.save()
    
class DefServicesUDPForm(forms.Form):
    dstport = forms.CharField(label=_(u'Destination port:'),
                              widget=forms.TextInput(attrs={'class': 'text'}))
    srcport = forms.CharField(initial=DEFAULT_DEFSERVICESUDP_SRCPORT, label=_(u'Source port:'),
                              widget=forms.TextInput(attrs={'class': 'text'}))
    
    def insert(self, defservices, request):
        dstport = self.cleaned_data['dstport']
        srcport = self.cleaned_data['srcport']
        o = DefServicesUDP.objects.create(id=defservices,
                                          dstport=dstport,
                                          srcport=srcport)
        
    def update(self, defservices, request):
        dstport = self.cleaned_data['dstport']
        srcport = self.cleaned_data['srcport']
        o = get_object_or_404(DefServicesUDP, id=defservices)
        o.dstport = dstport
        o.srcport = srcport
        o.save()
    
class DefServicesICMPForm(forms.Form):
    icmptype = forms.IntegerField(min_value=0, max_value=255, label=_(u'ICMP type:'),
                              widget=forms.TextInput(attrs={'class': 'text_icmp'}))
    code = forms.IntegerField(min_value=0, max_value=255, label=_(u'ICMP code:'),
                              widget=forms.TextInput(attrs={'class': 'text_icmp'}))
    
    def insert(self, defservices, request):
        _icmptype = self.cleaned_data['icmptype']
        _code = self.cleaned_data['code']
        icmptype = int(_icmptype)
        code = int(_code)
        o = DefServicesICMP.objects.create(id=defservices, type=icmptype, code=code)
        
    def update(self, defservices, request):
        _icmptype = self.cleaned_data['icmptype']
        _code = self.cleaned_data['code']
        icmptype = int(_icmptype)
        code = int(_code)
        o = get_object_or_404(DefServicesICMP, id=defservices)
        o.type = icmptype
        o.code = code
        o.save()
    
class DefServicesIPForm(forms.Form):
    protocol = forms.IntegerField(min_value=0, max_value=255, label=_(u'IP protocol no.:'),
                                  widget=forms.TextInput(attrs={'class': 'text'}))
    
    def insert(self, defservices, request):
        _protocol = self.cleaned_data['protocol']
        protocol = int(_protocol)
        o = DefServicesIP.objects.create(id=defservices, protocol=protocol)
        
    def update(self, defservices, request):
        _protocol = self.cleaned_data['protocol']
        protocol = int(_protocol)
        o = get_object_or_404(DefServicesIP, id=defservices)
        o.protocol = protocol
        o.save()
    
class DefServicesGroupForm(forms.Form):
    
    @transaction.commit_on_success
    def insert(self, defservices, request):
        members = request.POST['members']
#        if members == '' or members == None:
#            raise forms.ValidationError(_(u'Group members are required.'))
            
        members_id = members.split(',')
        for id in members_id:
            try:
                m = get_object_or_404(DefServices, id=id)
                o = DefServicesGroup.objects.create(gid=defservices, member=m)
                
            except:
                pass
            
    @transaction.commit_on_success
    def update(self, defservices, request):
        members = request.POST['members']
#        if members == '' or members == None:
#            raise forms.ValidationError(_(u'Group members are required.'))
        
        members_id = members.split(',')
        DefServicesGroup.objects.filter(gid=defservices).delete()
        for id in members_id:
            try:
                m = get_object_or_404(DefServices, id=id)
                o = DefServicesGroup.objects.create(gid=defservices, member=m)
                
            except:
                pass
    
class SearchForm(BaseSearchForm):
    selection = forms.ChoiceField(choices=SEARCH_CHOICES,
                                  widget=forms.Select(attrs={'class': 'search_option'}))
    
class FilterForm(BaseFilterForm):
    filters = forms.ChoiceField(choices=SEARCH_CHOICES,
                                    widget=forms.Select(attrs={'class': 'filter_option'}))
    
def get_defservices_form(type, clone, dic):
    form = DefServicesForm(dic)
    if clone == '1':
        return form
    
    else:
        if type >= 1 <= 5:
            form.set_choices(type)
        
        return form