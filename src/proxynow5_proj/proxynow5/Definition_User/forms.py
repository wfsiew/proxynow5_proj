from models import *
from django import forms
from django.shortcuts import *
from proxynow5_proj.proxynow5.utils import *
from proxynow5_proj.proxynow5.forms import BaseSaveForm, BaseSearchForm,\
    BaseFilterForm
from proxynow5_proj.proxynow5.exceptions import UIException
from proxynow5_proj.proxynow5.backends import AuthBackend
from django.utils.translation import ugettext as _
from django.db import transaction

SEARCH_CHOICES = (
                  (0, _(u'All')),
                  (1, _(u'User')),
                  (2, _(u'User group'))
)

ADD_FORM_TITLE = _(u'Create new user')
EDIT_FORM_TITLE = _(u'Edit user')

class DefUserForm(BaseSaveForm):
    name = forms.CharField(max_length=1024, label=_(u'Name:'),
                           widget=forms.TextInput(attrs={'class': 'text'}))
    type = forms.ChoiceField(choices=DEFUSER_TYPES, label=_(u'Type:'),
                            widget=forms.Select(attrs={'class': 'select'}))
    accesstype = forms.ChoiceField(choices=DEFUSER_ACCESS_TYPES, label=_(u'Access Type:'),
                                   widget=forms.Select(attrs={'class': 'select'}))
    comment = forms.CharField(max_length=10240, label=_(u'Comment:'),
                              widget=forms.TextInput(attrs={'class': 'text'}), required=False)
    
    def clean_type(self):
        _type = self.cleaned_data['type']
        type = int(_type)
        if type < 1 or type > 2:
            raise forms.ValidationError(_(u'Invalid type'))
        
        return _type
    
    def validate_name(self, name):
        try:
            o = DefUser.objects.get(name__iexact=name)
            raise UIException(_(u'The name %s already exist.' % name))
        
        except DefUser.DoesNotExist:
            pass
    
    @transaction.commit_on_success
    def insert(self, request):
        name = self.cleaned_data['name']
        _type = self.cleaned_data['type']
        _accesstype = self.cleaned_data['accesstype']
        comment = self.cleaned_data['comment']
        type = int(_type)
        accesstype = int(_accesstype)
        self.validate_name(name)
        
        if type == 1:
            form = DefUserNameForm(request.POST)
            if form.is_valid():
                confirm_password = request.POST.get('confirm_password', '')
                if confirm_password == '':
                    raise UIException(_(u'Confirm passwrd is required.'))
                
                password = form.cleaned_data['password']
                if password != confirm_password:
                    raise UIException(_(u'Password does not match.'))
                
                defuser = DefUser.objects.create(name=name, type=type, accesstype=accesstype, comment=comment)
                AuthBackend.insert_user(username=name)
                form.insert(defuser, request)
                return None, defuser
                
            else:
                return form, None
            
        elif type == 2:
            form = DefUserGroupForm()
            defuser = DefUser.objects.create(name=name, type=type, accesstype=accesstype, comment=comment)
            AuthBackend.insert_user(username=name)
            form.insert(defuser, request)
            return None, defuser
            
    @transaction.commit_on_success
    def update(self, request):
        name = self.cleaned_data['name']
        _type = self.cleaned_data['type']
        _accesstype = self.cleaned_data['accesstype']
        comment = self.cleaned_data['comment']
        _id = request.POST['id']
        type = int(_type)
        accesstype = int(_accesstype)
        id = int(_id)
        try:
            defuser = DefUser.objects.get(id=id)
            
        except DefUser.DoesNotExist:
            raise UIException(_(u'The user does not exist'))
        
        if name.lower() != defuser.name.lower():
            self.validate_name(name)
        
        if type == 1:
            form = DefUserNameForm(request.POST)
            if form.is_valid():
                AuthBackend.update_user(old_username=defuser.name, new_username=name)
                defuser.name = name
                defuser.accesstype = accesstype
                defuser.comment = comment
                defuser.save()
                form.update(defuser, request)
                return None, defuser
                
            else:
                return form, None
            
        elif type == 2:
            form = DefUserGroupForm()
            AuthBackend.update_user(old_username=defuser.name, new_username=name)
            defuser.name = name
            defuser.accesstype = accesstype
            defuser.comment = comment
            defuser.save()
            form.update(defuser, request)
            return None, defuser
        
    def set_choices(self, type):
        self.fields['type'].choices = (DEFUSER_TYPES[type - 1],)
    
class DefUserNameForm(forms.Form):
    displayname = forms.CharField(max_length=100, label=_(u'Display name:'),
                                  widget=forms.TextInput(attrs={'class': 'text'}), required=False)
    password = forms.CharField(max_length=50, label=_(u'Password:'),
                               widget=forms.PasswordInput(attrs={'class': 'text'}))
    
    def insert(self, defuser, request):
        displayname = self.cleaned_data['displayname']
        raw_password = self.cleaned_data['password']
        password = encrypt_password(raw_password)
        o = DefUserName.objects.create(id=defuser, displayname=displayname, password=password)
        
    def update(self, defuser, request):
        displayname = self.cleaned_data['displayname']
        raw_password = self.cleaned_data['password']
        o = get_object_or_404(DefUserName, id=defuser)
        o.displayname = displayname
        if raw_password != '**********':
            o.password = encrypt_password(raw_password)
            
        o.save()

class DefUserGroupForm(forms.Form):
    
    @transaction.commit_on_success
    def insert(self, defuser, request):
        members = request.POST['members']
#        if members == '' or members == None:
#            raise forms.ValidationError(_(u'Group members are required.'))
            
        members_id = members.split(',')
        for id in members_id:
            try:
                m = get_object_or_404(DefUser, id=id)
                o = DefUserGroup.objects.create(gid=defuser, member=m)
                
            except:
                pass
            
    @transaction.commit_on_success
    def update(self, defuser, request):
        members = request.POST['members']
#        if members == '' or members == None:
#            raise forms.ValidationError(_(u'Group members are required.'))
        
        members_id = members.split(',')
        DefUserGroup.objects.filter(gid=defuser).delete()
        for id in members_id:
            try:
                m = get_object_or_404(DefUser, id=id)
                o = DefUserGroup.objects.create(gid=defuser, member=m)
                
            except:
                pass
            
class DefUserNameForm_(forms.Form):
    name = forms.CharField(required=False, max_length=1024, label=_(u'Name:'),
                           widget=forms.TextInput(attrs={'class': 'text_user', 'readonly': True, 'disabled': 'disabled'}))
    password = forms.CharField(max_length=50, label=_(u'Password:'),
                               widget=forms.PasswordInput(attrs={'class': 'text_user'}))
    
    def update(self, request):
        try:
            id = request.session['user_id']
            defuser = DefUser.objects.get(id=id)
            
        except DefUser.DoesNotExist:
            raise UIException(_(u'The user does not exist'))
        
        raw_password = self.cleaned_data['password']
        o = get_object_or_404(DefUserName, id=defuser)
        if raw_password != '**********':
            o.password = encrypt_password(raw_password)
            o.save()

class SearchForm(BaseSearchForm):
    selection = forms.ChoiceField(choices=SEARCH_CHOICES,
                                  widget=forms.Select(attrs={'class': 'search_option'}))
    
class FilterForm(BaseFilterForm):
    filters = forms.ChoiceField(choices=SEARCH_CHOICES,
                                widget=forms.Select(attrs={'class': 'filter_option'}))
    
def get_defuser_form(type, clone, dic):
    form = DefUserForm(dic)
    if clone == '1':
        return form
    
    else:
        if type >= 1 <= 2:
            form.set_choices(type)
        
        return form