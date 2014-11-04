from models import *
from django import forms
from django.shortcuts import *
from proxynow5_proj.proxynow5.Wizard.process_session import *
from proxynow5_proj.proxynow5.forms import BaseSaveForm, BaseSearchForm,\
    BaseFilterForm
from proxynow5_proj.proxynow5.exceptions import UIException
from proxynow5_proj.proxynow5.utils import get_obj_id
from django.utils.translation import ugettext as _
from django.db import transaction

WPCAT_SEARCH_CHOICES = (
                        (0, _(u'All')),
                        (1, _(u'Prebuild')),
                        (2, _(u'Custom'))
)

ADD_WPCAT_FORM_TITLE = _(u'Create new category')
EDIT_WPCAT_FORM_TITLE = _(u'Edit category')
ADD_WPWHITELIST_FORM_TITLE = _(u'Create new whitelist')
EDIT_WPWHITELIST_FORM_TITLE = _(u'Edit whitelist')
ADD_WPBLACKLIST_FORM_TITLE = _(u'Create new blacklist')
EDIT_WPBLACKLIST_FORM_TITLE = _(u'Edit blacklist')
ADD_WPEXT_FORM_TITLE = _(u'Create new extension')
EDIT_WPEXT_FORM_TITLE = _(u'Edit extension')
ADD_WPCONTENT_FORM_TITLE = _(u'Create new content')
EDIT_WPCONTENT_FORM_TITLE = _(u'Edit content')
ADD_WPMIME_FORM_TITLE = _(u'Create new MIME')
EDIT_WPMIME_FORM_TITLE = _(u'Edit MIME')

class WPCatForm(BaseSaveForm):
    name = forms.CharField(max_length=1024, label=_(u'Name:'),
                           widget=forms.TextInput(attrs={'class': 'text'}))
    type = forms.ChoiceField(choices=WPCAT_TYPES, label=_(u'Type:'),
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
            o = WPCat.objects.get(name__iexact=name)
            raise UIException(_(u'The name %s already exist.' % name))
        
        except WPCat.DoesNotExist:
            pass
    
    @transaction.commit_on_success
    def insert(self, request):
        name = self.cleaned_data['name']
        _type = self.cleaned_data['type']
        comment = self.cleaned_data['comment']
        type = int(_type)
        self.validate_name(name)
        
        form = WPCatValueForm()
        wpcat = WPCat.objects.create(name=name, type=type, comment=comment)
        form.insert(wpcat, request)
        return None, wpcat
        
    @transaction.commit_on_success
    def update(self, request):
        name = self.cleaned_data['name']
        _type = self.cleaned_data['type']
        comment = self.cleaned_data['comment']
        _id = request.POST['id']
        type = int(_type)
        id = int(_id)
        try:
            wpcat = WPCat.objects.get(id=id)
            
        except WPCat.DoesNotExist:
            raise UIException(_(u'The category does not exist.'))
        
        if name.lower() != wpcat.name.lower():
            self.validate_name(name)
        
        form = WPCatValueForm()
        wpcat.name = name
        wpcat.comment = comment
        wpcat.save()
        form.update(wpcat, request)
        return None, wpcat
       
    def insert_temp(self, request):
        name = self.cleaned_data['name']
        _type = self.cleaned_data['type']
        comment = self.cleaned_data['comment']
        type = int(_type)
        is_existed_in_session(request, STORE_CATEGORY, name)
        
        form = WPCatValueForm()
        wpcat = WPCat(name=name, type=type, comment=comment)
        wpcat.id = get_obj_id(wpcat)
        wpcatvalues = form.insert_temp(wpcat, request)
        
        lswpcat = [wpcat, wpcatvalues]
        store_session(request, STORE_CATEGORY, name, wpcat.id, lswpcat)
        return None, wpcat
    
    def update_temp(self, request):
        name = self.cleaned_data['name']
        _type = self.cleaned_data['type']
        comment = self.cleaned_data['comment']
        _id = request.POST['id']
        type = int(_type)
        id = int(_id)
        
        lswpcat = get_items_session_byid(request, STORE_CATEGORY, id)
        if lswpcat is None:
            raise UIException(_(u'The category does not exist'))
        
        wpcat = lswpcat[0]
        if name.lower() != wpcat.name.lower():
            is_existed_in_session(request, STORE_CATEGORY, name)
            
        form = WPCatValueForm()
        wpcat.name = name
        wpcat.comment = comment
        wpcatvalues = form.insert_temp(wpcat, request)
        
        lswpcat = [wpcat, wpcatvalues]
        update_items_session(request, STORE_CATEGORY, name, id, lswpcat)
        return None, wpcat
        
    def set_choices(self, type):
        self.fields['type'].choices = (WPCAT_TYPES[type - 1],)
    
class WPCatValueForm(forms.Form):
    
    def insert(self, wpcat, request):
        urls = request.POST['urls']
        data = urls.split('||')
        for url in data:
            try:
                if url != '':
                    o = WPCatValue.objects.create(uid=wpcat, url=url)
                
            except:
                pass
        
    def update(self, wpcat, request):
        urls = request.POST['urls']
        data = urls.split('||')
        WPCatValue.objects.filter(uid=wpcat).delete()
        for url in data:
            try:
                if url != '':
                    o = WPCatValue.objects.create(uid=wpcat, url=url)
                
            except:
                pass
            
    def insert_temp(self, wpcat, request):
        urls = request.POST['urls']
        data = urls.split('||')
        ls = []
        for url in data:
            if url != '':
                o = WPCatValue(uid=wpcat, url=url)
                o.id = get_obj_id(o)
                ls.append(o)
                
        return ls
        
class WPWhiteListForm(BaseSaveForm):
    name = forms.CharField(max_length=1024, label=_(u'Name:'),
                           widget=forms.TextInput(attrs={'class': 'text'}))
    comment = forms.CharField(max_length=10240, label=_(u'Comment:'),
                              widget=forms.TextInput(attrs={'class': 'text'}), required=False)
    
    def validate_name(self, name):
        try:
            o = WPWhiteList.objects.get(name__iexact=name)
            raise UIException(_(u'The name %s already exist.' % name))
        
        except WPWhiteList.DoesNotExist:
            pass
    
    @transaction.commit_on_success
    def insert(self, request):
        name = self.cleaned_data['name']
        comment = self.cleaned_data['comment']
        self.validate_name(name)
        
        form = WPWhiteListValueForm()
        wpwhitelist = WPWhiteList.objects.create(name=name, comment=comment)
        form.insert(wpwhitelist, request)
        return None, wpwhitelist
        
    @transaction.commit_on_success
    def update(self, request):
        name = self.cleaned_data['name']
        comment = self.cleaned_data['comment']
        _id = request.POST['id']
        id = int(_id)
        try:
            wpwhitelist = WPWhiteList.objects.get(id=id)
            
        except WPWhiteList.DoesNotExist:
            raise UIException(_(u'The whitelist does not exist.'))
        
        if name.lower() != wpwhitelist.name.lower():
            self.validate_name(name)
        
        form = WPWhiteListValueForm()
        wpwhitelist.name = name
        wpwhitelist.comment = comment
        wpwhitelist.save()
        form.update(wpwhitelist, request)
        return None, wpwhitelist
    
    def insert_temp(self, request):
        name = self.cleaned_data['name']
        comment = self.cleaned_data['comment']
        is_existed_in_session(request, STORE_WHITE_LIST, name)
        
        form = WPWhiteListValueForm()
        wpwhitelist = WPWhiteList(name=name, comment=comment)
        wpwhitelist.id = get_obj_id(wpwhitelist)
        wpwhitelistvalues = form.insert_temp(wpwhitelist, request)
        
        lswpwhitelist = [wpwhitelist, wpwhitelistvalues]
        store_session(request, STORE_WHITE_LIST, name, wpwhitelist.id, lswpwhitelist)
        return None, wpwhitelist
    
    def update_temp(self, request):
        name = self.cleaned_data['name']
        comment = self.cleaned_data['comment']
        _id = request.POST['id']
        id = int(_id)
        
        lswpwhitelist = get_items_session_byid(request, STORE_WHITE_LIST, id)
        if lswpwhitelist is None:
            raise UIException(_(u'The whitelist does not exist.'))
        
        wpwhitelist = lswpwhitelist[0]
        if name.lower() != wpwhitelist.name.lower():
            is_existed_in_session(request, STORE_WHITE_LIST, name)
            
        form = WPWhiteListValueForm()
        wpwhitelist.name = name
        wpwhitelist.comment = comment
        wpwhitelistvalues = form.insert_temp(wpwhitelist, request)
        
        lswpwhitelist = [wpwhitelist, wpwhitelistvalues]
        update_items_session(request, STORE_WHITE_LIST, name, id, lswpwhitelist)
        return None, wpwhitelist
        
class WPWhiteListValueForm(forms.Form):
    
    def insert(self, wpwhitelist, request):
        urls = request.POST['urls']
        data = urls.split('||')
        for url in data:
            try:
                if url != '':
                    o = WPWhiteListValue.objects.create(uid=wpwhitelist, url=url)
                
            except:
                pass
        
    def update(self, wpwhitelist, request):
        urls = request.POST['urls']
        data = urls.split('||')
        WPWhiteListValue.objects.filter(uid=wpwhitelist).delete()
        for url in data:
            try:
                if url != '':
                    o = WPWhiteListValue.objects.create(uid=wpwhitelist, url=url)
                
            except:
                pass
            
    def insert_temp(self, wpwhitelist, request):
        urls = request.POST['urls']
        data = urls.split('||')
        ls = []
        for url in data:
            if url != '':
                o = WPWhiteListValue(uid=wpwhitelist, url=url)
                o.id = get_obj_id(o)
                ls.append(o)
                
        return ls
        
class WPBlackListForm(BaseSaveForm):
    name = forms.CharField(max_length=1024, label=_(u'Name:'),
                           widget=forms.TextInput(attrs={'class': 'text'}))
    comment = forms.CharField(max_length=10240, label=_(u'Comment:'),
                              widget=forms.TextInput(attrs={'class': 'text'}), required=False)
    
    def validate_name(self, name):
        try:
            o = WPBlackList.objects.get(name__iexact=name)
            raise UIException(_(u'The name %s already exist.' % name))
        
        except WPBlackList.DoesNotExist:
            pass
    
    @transaction.commit_on_success
    def insert(self, request):
        name = self.cleaned_data['name']
        comment = self.cleaned_data['comment']
        self.validate_name(name)
        
        form = WPBlackListValueForm()
        wpblacklist = WPBlackList.objects.create(name=name, comment=comment)
        form.insert(wpblacklist, request)
        return None, wpblacklist
        
    @transaction.commit_on_success
    def update(self, request):
        name = self.cleaned_data['name']
        comment = self.cleaned_data['comment']
        _id = request.POST['id']
        id = int(_id)
        try:
            wpblacklist = WPBlackList.objects.get(id=id)
            
        except WPBlackList.DoesNotExist:
            raise UIException(_(u'The blacklist does not exist.'))
        
        if name.lower() != wpblacklist.name.lower():
            self.validate_name(name)
        
        form = WPBlackListValueForm()
        wpblacklist.name = name
        wpblacklist.comment = comment
        wpblacklist.save()
        form.update(wpblacklist, request)
        return None, wpblacklist
    
    def insert_temp(self, request):
        name = self.cleaned_data['name']
        comment = self.cleaned_data['comment']
        is_existed_in_session(request, STORE_BLACK_LIST, name)
        
        form = WPBlackListValueForm()
        wpblacklist = WPBlackList(name=name, comment=comment)
        wpblacklist.id = get_obj_id(wpblacklist)
        wpblacklistvalues = form.insert_temp(wpblacklist, request)
        
        lswpblacklist = [wpblacklist, wpblacklistvalues]
        store_session(request, STORE_BLACK_LIST, name, wpblacklist.id, lswpblacklist)
        return None, wpblacklist
    
    def update_temp(self, request):
        name = self.cleaned_data['name']
        comment = self.cleaned_data['comment']
        _id = request.POST['id']
        id = int(_id)
        
        lswpblacklist = get_items_session_byid(request, STORE_BLACK_LIST, id)
        if lswpblacklist is None:
            raise UIException(_(u'The blacklist does not exist.'))
        
        wpblacklist = lswpblacklist[0]
        if name.lower() != wpblacklist.name.lower():
            is_existed_in_session(request, STORE_BLACK_LIST, name)
            
        form = WPBlackListValueForm()
        wpblacklist.name = name
        wpblacklist.comment = comment
        wpblacklistvalues = form.insert_temp(wpblacklist, request)
        
        lswpblacklist = [wpblacklist, wpblacklistvalues]
        update_items_session(request, STORE_BLACK_LIST, name, id, lswpblacklist)
        return None, wpblacklist
        
class WPBlackListValueForm(forms.Form):
    
    def insert(self, wpblacklist, request):
        urls = request.POST['urls']
        data = urls.split('||')
        for url in data:
            try:
                if url != '':
                    o = WPBlackListValue.objects.create(uid=wpblacklist, url=url)
                
            except:
                pass
        
    def update(self, wpblacklist, request):
        urls = request.POST['urls']
        data = urls.split('||')
        WPBlackListValue.objects.filter(uid=wpblacklist).delete()
        for url in data:
            try:
                if url != '':
                    o = WPBlackListValue.objects.create(uid=wpblacklist, url=url)
        
            except:
                pass
            
    def insert_temp(self, wpblacklist, request):
        urls = request.POST['urls']
        data = urls.split('||')
        ls = []
        for url in data:
            if url != '':
                o = WPBlackListValue(uid=wpblacklist, url=url)
                o.id = get_obj_id(o)
                ls.append(o)
                
        return ls
            
class WPExtForm(BaseSaveForm):
    name = forms.CharField(max_length=1024, label=_(u'Name:'),
                           widget=forms.TextInput(attrs={'class': 'text'}))
    comment = forms.CharField(max_length=10240, label=_(u'Comment:'),
                              widget=forms.TextInput(attrs={'class': 'text'}), required=False)
    
    def validate_name(self, name):
        try:
            o = WPExt.objects.get(name__iexact=name)
            raise UIException(_(u'The name %s already exist.' % name))
        
        except WPExt.DoesNotExist:
            pass
    
    @transaction.commit_on_success
    def insert(self, request):
        name = self.cleaned_data['name']
        comment = self.cleaned_data['comment']
        self.validate_name(name)
        
        form = WPExtValueForm()
        wpext = WPExt.objects.create(name=name, comment=comment)
        form.insert(wpext, request)
        return None, wpext
    
    @transaction.commit_on_success
    def update(self, request):
        name = self.cleaned_data['name']
        comment = self.cleaned_data['comment']
        _id = request.POST['id']
        id = int(_id)
        try:
            wpext = WPExt.objects.get(id=id)
            
        except WPExt.DoesNotExist:
            raise UIException(_(u'The extension does not exist.'))
        
        if name.lower() != wpext.name.lower():
            self.validate_name(name)
        
        form = WPExtValueForm()
        wpext.name = name
        wpext.comment = comment
        wpext.save()
        form.update(wpext, request)
        return None, wpext
    
    def insert_temp(self, request):
        name = self.cleaned_data['name']
        comment = self.cleaned_data['comment']
        is_existed_in_session(request, STORE_EXTENSION, name)
        
        form = WPExtValueForm()
        wpext = WPExt(name=name, comment=comment)
        wpext.id = get_obj_id(wpext)
        wpextvalues = form.insert_temp(wpext, request)
        
        lswpext = [wpext, wpextvalues]
        store_session(request, STORE_EXTENSION, name, wpext.id, lswpext)
        return None, wpext
    
    def update_temp(self, request):
        name = self.cleaned_data['name']
        comment = self.cleaned_data['comment']
        _id = request.POST['id']
        id = int(_id)
        
        lswpext = get_items_session_byid(request, STORE_EXTENSION, id)
        if lswpext is None:
            raise UIException(_(u'The extension does not exist.'))
        
        wpext = lswpext[0]
        if name.lower() != wpext.name.lower():
            is_existed_in_session(request, STORE_EXTENSION, name)
            
        form = WPExtValueForm()
        wpext.name = name
        wpext.comment = comment
        wpextvalues = form.insert_temp(wpext, request)
        
        lswpext = [wpext, wpextvalues]
        update_items_session(request, STORE_EXTENSION, name, id, lswpext)
        return None, wpext
    
class WPExtValueForm(forms.Form):
    
    def insert(self, wpext, request):
        extensions = request.POST['extensions']
        data = extensions.split('||')
        for extension in data:
            try:
                if extension != '':
                    o = WPExtValue.objects.create(uid=wpext, extension=extension)
                
            except:
                pass
            
    def update(self, wpext, request):
        extensions = request.POST['extensions']
        data = extensions.split('||')
        WPExtValue.objects.filter(uid=wpext).delete()
        for extension in data:
            try:
                if extension != '':
                    o = WPExtValue.objects.create(uid=wpext, extension=extension)
        
            except:
                pass
            
    def insert_temp(self, wpext, request):
        extensions = request.POST['extensions']
        data = extensions.split('||')
        ls = []
        for extension in data:
            if extension != '':
                o = WPExtValue(uid=wpext, extension=extension)
                o.id = get_obj_id(o)
                ls.append(o)
                
        return ls
        
class WPContentForm(BaseSaveForm):
    name = forms.CharField(max_length=1024, label=_(u'Name:'),
                           widget=forms.TextInput(attrs={'class': 'text'}))
    comment = forms.CharField(max_length=10240, label=_(u'Comment:'),
                              widget=forms.TextInput(attrs={'class': 'text'}), required=False)
    
    def validate_name(self, name):
        try:
            o = WPContent.objects.get(name__iexact=name)
            raise UIException(_(u'The name %s already exist.' % name))
        
        except WPContent.DoesNotExist:
            pass
    
    @transaction.commit_on_success
    def insert(self, request):
        name = self.cleaned_data['name']
        comment = self.cleaned_data['comment']
        self.validate_name(name)
        
        form = WPContentValueForm()
        wpcontent = WPContent.objects.create(name=name, comment=comment)
        form.insert(wpcontent, request)
        return None, wpcontent
        
    @transaction.commit_on_success
    def update(self, request):
        name = self.cleaned_data['name']
        comment = self.cleaned_data['comment']
        _id = request.POST['id']
        id = int(_id)
        try:
            wpcontent = WPContent.objects.get(id=id)
            
        except WPContent.DoesNotExist:
            raise UIException(_(u'The content does not exist.'))
        
        if name.lower() != wpcontent.name.lower():
            self.validate_name(name)
        
        form = WPContentValueForm()
        wpcontent.name = name
        wpcontent.comment = comment
        wpcontent.save()
        form.update(wpcontent, request)
        return None, wpcontent
    
    def insert_temp(self, request):
        name = self.cleaned_data['name']
        comment = self.cleaned_data['comment']
        is_existed_in_session(request, STORE_CONTENT, name)
        
        form = WPContentValueForm()
        wpcontent = WPContent(name=name, comment=comment)
        wpcontent.id = get_obj_id(wpcontent)
        wpcontentvalues = form.insert_temp(wpcontent, request)
        
        lswpcontent = [wpcontent, wpcontentvalues]
        store_session(request, STORE_CONTENT, name, wpcontent.id, lswpcontent)
        
        return None, wpcontent
    
    def update_temp(self, request):
        name = self.cleaned_data['name']
        comment = self.cleaned_data['comment']
        _id = request.POST['id']
        id = int(_id)
        
        lswpcontent = get_items_session_byid(request, STORE_CONTENT, id)
        if lswpcontent is None:
            raise UIException(_(u'The content does not exist.'))
        
        wpcontent = lswpcontent[0]
        if name.lower() != wpcontent.name.lower():
            is_existed_in_session(request, STORE_CONTENT, name)
            
        form = WPContentValueForm()
        wpcontent.name = name
        wpcontent.comment = comment
        wpcontentvalues = form.insert_temp(wpcontent, request)
        
        lswpcontent = [wpcontent, wpcontentvalues]
        update_items_session(request, STORE_CONTENT, name, id, lswpcontent)
        return None, wpcontent
        
class WPContentValueForm(forms.Form):
    
    def insert(self, wpcontent, request):
        keywords = request.POST['keywords']
        scores = request.POST['scores']
        _keywords = keywords.split('||')
        _scores = scores.split('||')
        k = len(_keywords)
        for i in range(k):
            try:
                keyword = _keywords[i]
                score = int(_scores[i])
                if keyword != '':
                    o = WPContentValue.objects.create(uid=wpcontent, keyword=keyword, score=score)
                
            except:
                pass
        
    def update(self, wpcontent, request):
        keywords = request.POST['keywords']
        scores = request.POST['scores']
        _keywords = keywords.split('||')
        _scores = scores.split('||')
        k = len(_keywords)
        WPContentValue.objects.filter(uid=wpcontent).delete()
        for i in range(k):
            try:
                keyword = _keywords[i]
                score = int(_scores[i])
                if keyword != '':
                    o = WPContentValue.objects.create(uid=wpcontent, keyword=keyword, score=score)
                
            except:
                pass
            
    def insert_temp(self, wpcontent, request):
        keywords = request.POST['keywords']
        scores = request.POST['scores']
        _keywords = keywords.split('||')
        _scores = scores.split('||')
        print _keywords
        
        k = len(_keywords)
        ls = []
        for i in range(k):
            try:
                keyword = _keywords[i]
                score = int(_scores[i])
                if keyword != '':
                    o = WPContentValue(uid=wpcontent, keyword=keyword, score=score)
                    o.id = get_obj_id(o)
                    ls.append(o)
            except:
                pass
        return ls
        
class WPMIMEForm(BaseSaveForm):
    name = forms.CharField(max_length=1024, label=_(u'Name:'),
                           widget=forms.TextInput(attrs={'class': 'text'}))
    comment = forms.CharField(max_length=10240, label=_(u'Comment:'),
                              widget=forms.TextInput(attrs={'class': 'text'}), required=False)
    
    def validate_name(self, name):
        try:
            o = WPMIME.objects.get(name__iexact=name)
            raise UIException(_(u'The name %s already exist.' % name))
        
        except WPMIME.DoesNotExist:
            pass
    
    @transaction.commit_on_success
    def insert(self, request):
        name = self.cleaned_data['name']
        comment = self.cleaned_data['comment']
        self.validate_name(name)
        
        form = WPMIMEValueForm()
        wpmime = WPMIME.objects.create(name=name, comment=comment)
        form.insert(wpmime, request)
        return None, wpmime
        
    @transaction.commit_on_success
    def update(self, request):
        name = self.cleaned_data['name']
        comment = self.cleaned_data['comment']
        _id = request.POST['id']
        id = int(_id)
        try:
            wpmime = WPMIME.objects.get(id=id)
            
        except WPMIME.DoesNotExist:
            raise UIException(_(u'The mime does not exist.'))
        
        if name.lower() != wpmime.name.lower():
            self.validate_name(name)
        
        form = WPMIMEValueForm()
        wpmime.name = name
        wpmime.comment = comment
        wpmime.save()
        form.update(wpmime, request)
        return None, wpmime
    
    def insert_temp(self, request):
        name = self.cleaned_data['name']
        comment = self.cleaned_data['comment']
        is_existed_in_session(request, STORE_MIME, name)
        
        form = WPMIMEValueForm()
        wpmime = WPMIME(name=name, comment=comment)
        wpmime.id = get_obj_id(wpmime)
        wpmimevalues = form.insert_temp(wpmime, request)
        
        lswpmime = [wpmime, wpmimevalues]
        store_session(request, STORE_MIME, name, wpmime.id, lswpmime)
        return None, wpmime
    
    def update_temp(self, request):
        name = self.cleaned_data['name']
        comment = self.cleaned_data['comment']
        _id = request.POST['id']
        id = int(_id)
        
        lswpmime = get_items_session_byid(request, STORE_MIME, id)
        if lswpmime is None:
            raise UIException(_(u'The mime does not exist.'))
        
        wpmime = lswpmime[0]
        if name.lower() != wpmime.name.lower():
            is_existed_in_session(request, STORE_MIME, name)
            
        form = WPMIMEValueForm()
        wpmime.name = name
        wpmime.comment = comment
        wpmimevalues = form.insert_temp(wpmime, request)
        
        lswpmime = [wpmime, wpmimevalues]
        update_items_session(request, STORE_MIME, name, id, lswpmime)
        return None, wpmime
        
class WPMIMEValueForm(forms.Form):
    
    def insert(self, wpmime, request):
        mimes = request.POST['mimes']
        data = mimes.split('||')
        for mime in data:
            try:
                if mime != '':
                    o = WPMIMEValue.objects.create(uid=wpmime, mime=mime)
                
            except:
                pass
        
    def update(self, wpmime, request):
        mimes = request.POST['mimes']
        data = mimes.split('||')
        WPMIMEValue.objects.filter(uid=wpmime).delete()
        for mime in data:
            try:
                if mime != '':
                    o = WPMIMEValue.objects.create(uid=wpmime, mime=mime)
                
            except:
                pass
            
    def insert_temp(self, wpmime, request):
        mimes = request.POST['mimes']
        data = mimes.split('||')
        ls = []
        for mime in data:
            if mime != '':
                o = WPMIMEValue(uid=wpmime, mime=mime)
                o.id = get_obj_id(o)
                ls.append(o)
                
        return ls
    
class WPCatSearchForm(BaseSearchForm):
    selection = forms.ChoiceField(choices=WPCAT_SEARCH_CHOICES,
                                  widget=forms.Select(attrs={'class': 'search_option'}))
    
class WPWhiteListSearchForm(BaseSearchForm):
    pass
    
class FilterWPCatForm(BaseFilterForm):
    filters = forms.ChoiceField(choices=WPCAT_SEARCH_CHOICES,
                                widget=forms.Select(attrs={'class': 'filter_option'}))

def get_wpcat_form(type, clone, dic):
    form = WPCatForm(dic)
    if clone == '1':
        return form
    
    else:
        if type >= 1 <= 2:
            form.set_choices(type)
            
        return form