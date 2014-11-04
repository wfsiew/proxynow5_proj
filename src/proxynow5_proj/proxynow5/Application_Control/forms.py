from models import *
from django import forms
from django.shortcuts import *
from proxynow5_proj.proxynow5.sortablelist import *
from proxynow5_proj.proxynow5.forms import BaseSaveForm, BaseSearchForm,\
    BaseFilterForm
from proxynow5_proj.proxynow5.exceptions import UIException
from django.utils.translation import ugettext as _
from django.db import transaction

SEARCH_CHOICES = (
                  (0, _(u'All')),
                  (1, _(u'Allow')),
                  (2, _(u'Block'))
)

APPCTRLAPPLIST_SEARCH_CHOICES = (
                                 (0, _(u'All')),
                                 (1, _(u'Name')),
                                 (2, _(u'Category'))
)

ADD_FORM_TITLE = _(u'Create new application control rule')
EDIT_FORM_TITLE = _(u'Edit application control rule')

def get_locations():
    loc = [('top', _(u'Top')), ('bottom', _(u'Bottom'))]
    ls = AppCtrlRule.objects.order_by('location')
    i = 1
    for v in ls:
        loc.append((i, v.location))
        i += 1
                   
    return loc
    
class AppCtrlRuleForm(BaseSaveForm):
    name = forms.CharField(max_length=1024, label=_(u'Name:'),
                           widget=forms.TextInput(attrs={'class': 'text'}))
    action = forms.ChoiceField(choices=ACTIONS, label=_(u'Action:'),
                               widget=forms.Select(attrs={'class': 'select'}))
    comment = forms.CharField(max_length=10240, label=_(u'Comment:'),
                              widget=forms.TextInput(attrs={'class': 'text'}), required=False)
    
    def __init__(self, *args, **kwargs):
        super(AppCtrlRuleForm, self).__init__(*args, **kwargs)
        self.fields['location'] = forms.ChoiceField(choices=get_locations(), label=_(u'Location:'),
                                                    widget=forms.Select(attrs={'class': 'select'}))
        
    def validate_name(self, name):
        try:
            o = AppCtrlRule.objects.get(name__iexact=name)
            raise UIException(_(u'The name %s already exist.' % name))
        
        except AppCtrlRule.DoesNotExist:
            pass
    
    @transaction.commit_on_success
    def insert(self, request):
        name = self.cleaned_data['name']
        _location = self.cleaned_data['location']
        _action = self.cleaned_data['action']
        comment = self.cleaned_data['comment']
        enable = 0
        action = int(_action)
        self.validate_name(name)
        
        location = get_location_insert(AppCtrlRule, _location)
        ls = AppCtrlRule.objects.order_by('location')
        tls = tuple(ls)
        appctrlrule = AppCtrlRule.objects.create(name=name, location=location, enable=enable,
                                                 action=action, comment=comment)
        self.insert_appctrlskiplist(appctrlrule, request)
        self.insert_appctrlfor(appctrlrule, request)
        
        if _location != 'bottom':
            update_locations_after_insert(location, tls)
            
    def insert_appctrlskiplist(self, appctrlrule, request):
        ls = request.POST['skiplist']
        ls_id = ls.split(',')
        for id in ls_id:
            try:
                m = get_object_or_404(DefNet, id=id)
                o = AppCtrlSkipList.objects.create(aid=appctrlrule, net=m)
                
            except:
                pass
            
    def insert_appctrlfor(self, appctrlrule, request):
        ls = request.POST['applyto']
        ls_id = ls.split(',')
        for id in ls_id:
            try:
                m = get_object_or_404(DefNet, id=id)
                o = AppCtrlFor.objects.create(aid=appctrlrule, net=m)
                
            except:
                pass
            
    @transaction.commit_on_success
    def update(self, request):
        name = self.cleaned_data['name']
        _location = self.cleaned_data['location']
        _action = self.cleaned_data['action']
        comment = self.cleaned_data['comment']
        _id = request.POST['id']
        action = int(_action)
        id = int(_id)
        try:
            appctrlrule = AppCtrlRule.objects.get(id=id)
            
        except AppCtrlRule.DoesNotExist:
            raise UIException(_(u'The application control rule does not exist.'))
        
        if name.lower() != appctrlrule.name.lower():
            self.validate_name(name)
        
        location = get_location_update(AppCtrlRule, _location)
        ls = AppCtrlRule.objects.order_by('location')
        tls = tuple(ls)
        old_loc = appctrlrule.location
        
        appctrlrule.name = name
        appctrlrule.location = location
        appctrlrule.action = action
        appctrlrule.comment = comment
        appctrlrule.save()
        self.update_appctrlskiplist(appctrlrule, request)
        self.update_appctrlfor(appctrlrule, request)
        update_locations_after_update(old_loc, location, tls)
        
    def update_appctrlskiplist(self, appctrlrule, request):
        ls = request.POST['skiplist']
        ls_id = ls.split(',')
        AppCtrlSkipList.objects.filter(aid=appctrlrule).delete()
        for id in ls_id:
            try:
                m = get_object_or_404(DefNet, id=id)
                o = AppCtrlSkipList.objects.create(aid=appctrlrule, net=m)
                
            except:
                pass
            
    def update_appctrlfor(self, appctrlrule, request):
        ls = request.POST['applyto']
        ls_id = ls.split(',')
        AppCtrlFor.objects.filter(aid=appctrlrule).delete()
        for id in ls_id:
            try:
                m = get_object_or_404(DefNet, id=id)
                o = AppCtrlFor.objects.create(aid=appctrlrule, net=m)
                
            except:
                pass

class SearchForm(BaseSearchForm):
    selection = forms.ChoiceField(choices=SEARCH_CHOICES,
                                  widget=forms.Select(attrs={'class': 'search_option'}))
    
class FilterAppCtrlAppListForm(BaseFilterForm):
    filters = forms.ChoiceField(choices=APPCTRLAPPLIST_SEARCH_CHOICES,
                                widget=forms.Select(attrs={'class': 'filter_option'}))