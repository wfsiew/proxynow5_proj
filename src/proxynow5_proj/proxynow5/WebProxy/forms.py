from models import *
from django import forms
from django.shortcuts import *
from proxynow5_proj.proxynow5.utils import *
from proxynow5_proj.proxynow5.sortablelist import *
from proxynow5_proj.proxynow5.forms import BaseSaveForm, BaseSearchForm
from proxynow5_proj.proxynow5.exceptions import UIException
from django.utils.translation import ugettext as _
from django.db import transaction
from django.db.models import Q

WPPROFILE_SEARCH_CHOICES = (
                            (0, _(u'All')),
                            (1, _(u'Standard')),
                            (2, _(u'Transparent'))
)

ADD_WPPROFILE_FORM_TITLE = _(u'Create new profile')
EDIT_WPPROFILE_FORM_TITLE = _(u'Edit profile')
ADD_WPPROFILEEXCEPT_FORM_TITLE = _(u'Create new exception')
EDIT_WPPROFILEEXCEPT_FORM_TITLE = _(u'Edit exception')

def get_locations():
    loc = [('top', _(u'Top')), ('bottom', _(u'Bottom'))]
    ls = WPProfile.objects.order_by('location')
    i = 1
    for v in ls:
        loc.append((i, v.location))
        i += 1
                   
    return loc

class WPForm(BaseSaveForm):
    av = forms.IntegerField(label=_(u'Enable antivirus'),
                            widget=forms.CheckboxInput())
    avscansize = forms.IntegerField(initial=2048,
                                    label=_(u'Maximum file size to be scanned:'),
                                    widget=forms.TextInput(attrs={'size': 10}))
    mode = forms.ChoiceField(choices=WP_MODES, label=_(u'Mode:'),
                             widget=forms.Select(attrs={'class': 'select'}))
    authentication = forms.ChoiceField(choices=AUTHENTICATION_TYPES, initial=2, label=_(u'Authentication method:'),
                                       widget=forms.Select(attrs={'class': 'select'}))
    safesearchon = forms.ChoiceField(choices=WP_SAFESEARCH, initial=2, label=_('Safe search'),
                                    widget=forms.Select(attrs={'class': 'select'}))
    
    def clean(self):
        _mode = self.cleaned_data['mode']
        _authentication = self.cleaned_data['authentication']
        if _mode == '2' and _authentication == '1':
            raise forms.ValidationError(_(u'Invalid authentication selection for transparent mode.'))
        
        return self.cleaned_data
    
    def insert(self, request):
        _av = self.cleaned_data['av']
        _avscansize = self.cleaned_data['avscansize']
        _mode = self.cleaned_data['mode']
        _authentication = self.cleaned_data['authentication']
        _safesearchon = self.cleaned_data['safesearchon']
        av = int(_av)
        avscansize = int(_avscansize)
        mode = int(_mode)
        authentication = int(_authentication)
        safesearchon = int(_safesearchon)
        
        try:
            WP.objects.all().delete()
            
        except:
            pass
        
        o = WP.objects.create(av=av, avscansize=avscansize, mode=mode, authentication=authentication, safesearchon=safesearchon)
        return o
    
    def update(self, request):
        _av = self.cleaned_data['av']
        _avscansize = self.cleaned_data['avscansize']
        _mode = self.cleaned_data['mode']
        _authentication = self.cleaned_data['authentication']
        _safesearchon = self.cleaned_data['safesearchon']
        _id = request.POST['id']
        av = int(_av)
        avscansize = int(_avscansize)
        mode = int(_mode)
        authentication = int(_authentication)
        safesearchon = int(_safesearchon)
        id = int(_id)
        
        try:
            o = WP.objects.get(id=id)
            
        except WP.DoesNotExist:
            raise UIException(_(u'The webproxy setting does not exist'))
        
        o.av = av
        o.avscansize = avscansize
        o.mode = mode
        o.authentication = authentication
        o.safesearchon = safesearchon
        o.save()
        return o

class WPProfileForm(BaseSaveForm):
    name = forms.CharField(max_length=1024, label=_(u'Name:'),
                           widget=forms.TextInput(attrs={'class': 'text'}))
    timequota = forms.IntegerField(initial=0, label=_(u'Daily time quota:'),
                                   widget=forms.TextInput(attrs={'size': 10}))
    sizequota = forms.IntegerField(initial=0, label=_(u'Daily size quota:'),
                                   widget=forms.TextInput(attrs={'size': 10}))
    catdef = forms.ChoiceField(choices=CATDEF_TYPES, initial=2, label=_(u'Action:'),
                               widget=forms.Select(attrs={'class': 'select'}))
    scheduleon = forms.IntegerField(initial=1, label=_(u'On all the time'),
                                    widget=forms.CheckboxInput())
    safesearchon = forms.ChoiceField(choices=WP_SAFESEARCH, label=_(u'Safe search'),
                                     widget=forms.Select(attrs={'class': 'select'}))
    
    def __init__(self, *args, **kwargs):
        super(WPProfileForm, self).__init__(*args, **kwargs)
        self.fields['location'] = forms.ChoiceField(choices=get_locations(), label=_(u'Location'),
                                                    widget=forms.Select(attrs={'class': 'select'}))
        
    def validate_name(self, name):
        try:
            o = WPProfile.objects.get(name__iexact=name)
            raise UIException(_(u'The name %s already exist.' % name))
        
        except WPProfile.DoesNotExist:
            pass
        
    def validate_data(self, request):
        ls1 = request.POST['userinternals']
        ls2 = request.POST['userexternals']
        ls3 = request.POST['nets']
        a1 = is_empty_list(ls1)
        a2 = is_empty_list(ls2)
        a3 = is_empty_list(ls3)
        
        if (a1 == True and a2 == True) and a3 == True:
            raise UIException(_(u'Please specify at least 1 user or host.'))
        
    @transaction.commit_on_success
    def insert(self, request):
        name = self.cleaned_data['name']
        _location = self.cleaned_data['location']
        _timequota = self.cleaned_data['timequota']
        _sizequota = self.cleaned_data['sizequota']
        _catdef = self.cleaned_data['catdef']
        _safesearchon = self.cleaned_data['safesearchon']
        enable = 0
        timequota = int(_timequota)
        sizequota = int(_sizequota)
        catdef = int(_catdef)
        safesearchon = int(_safesearchon)
        self.validate_name(name)
        self.validate_data(request)
        
        form = WPProfileExceptForm(request.POST)
        if not form.is_valid():
            return form, None
        
        location = get_location_insert(WPProfile, _location)
        ls = WPProfile.objects.order_by('location')
        tls = tuple(ls)
        wpprofile = WPProfile.objects.create(name=name, location=location, enable=enable,
                                             timequota=timequota, sizequota=sizequota,
                                             catdef=catdef, safesearchon=safesearchon)
        
        wpprofileexcept = form.insert(wpprofile, request)
        self.insert_wpprofileschd(wpprofile, request)
        self.insert_wpprofileuserinternal(wpprofile, request)
        self.insert_wpprofileuserexternal(wpprofile, request)
        self.insert_wpprofileallowext(wpprofile, request)
        self.insert_wpprofileblockext(wpprofile, request)
        self.insert_wpprofileallowmime(wpprofile, request)
        self.insert_wpprofileblockmime(wpprofile, request)
        self.insert_wpprofilecat(wpprofile, request)
        self.insert_wpprofilewhitelist(wpprofile, request)
        self.insert_wpprofileblacklist(wpprofile, request)
        self.insert_wpprofilecontentfilter(wpprofile, request)
        self.insert_wpnet(wpprofile, request)
        
        if _location != 'bottom':
            update_locations_after_insert(location, tls)
            
        return None, wpprofile
            
    def insert_wpprofileschd(self, wpprofile, request):
        ls = request.POST['schedules']
        ls_id = ls.split(',')
        for id in ls_id:
            try:
                m = get_object_or_404(DefSchd, id=id)
                o = WPProfileSchd.objects.create(profileid=wpprofile, schedule=m)
                
            except:
                pass
    
    def insert_wpprofileuserinternal(self, wpprofile, request):
        ls = request.POST['userinternals']
        ls_id = ls.split(',')
        for id in ls_id:
            try:
                m = get_object_or_404(DefUser, id=id)
                o = WPProfileUserInternal.objects.create(profileid=wpprofile, userinternal=m)
                
            except:
                pass
    
    def insert_wpprofileuserexternal(self, wpprofile, request):
        ls = request.POST['userexternals']
        ls_id = ls.split(',')
        for id in ls_id:
            try:
                m = get_object_or_404(ADUser, id=id)
                o = WPProfileUserExternal.objects.create(profileid=wpprofile, userexternal=m)
                
            except:
                pass
            
    def insert_wpprofileallowext(self, wpprofile, request):
        ls = request.POST['allowexts']
        ls_id = ls.split(',')
        for id in ls_id:
            try:
                m = get_object_or_404(WPExt, id=id)
                o = WPProfileAllowExt.objects.create(profileid=wpprofile, allowext=m)
                
            except:
                pass
    
    def insert_wpprofileblockext(self, wpprofile, request):
        ls = request.POST['blockexts']
        ls_id = ls.split(',')
        for id in ls_id:
            try:
                m = get_object_or_404(WPExt, id=id)
                o = WPProfileBlockExt.objects.create(profileid=wpprofile, blockext=m)
                
            except:
                pass
    
    def insert_wpprofileallowmime(self, wpprofile, request):
        ls = request.POST['allowmimes']
        ls_id = ls.split(',')
        for id in ls_id:
            try:
                m = get_object_or_404(WPMIME, id=id)
                o = WPProfileAllowMIME.objects.create(profileid=wpprofile, allowmime=m)
                
            except:
                pass
    
    def insert_wpprofileblockmime(self, wpprofile, request):
        ls = request.POST['blockmimes']
        ls_id = ls.split(',')
        for id in ls_id:
            try:
                m = get_object_or_404(WPMIME, id=id)
                o = WPProfileBlockMIME.objects.create(profileid=wpprofile, blockmime=m)
                
            except:
                pass
    
    def insert_wpprofilecat(self, wpprofile, request):
        ls = request.POST['cats']
        ls_id = ls.split(',')
        for id in ls_id:
            try:
                m = get_object_or_404(WPCat, id=id)
                o = WPSelectedCat.objects.create(profileid=wpprofile, catid=m)
                
            except:
                pass
    
    def insert_wpprofilewhitelist(self, wpprofile, request):
        ls = request.POST['whitelist']
        ls_id = ls.split(',')
        for id in ls_id:
            try:
                m = get_object_or_404(WPWhiteList, id=id)
                o = WPProfileWhiteList.objects.create(profileid=wpprofile, whitelist=m)
                
            except:
                pass
    
    def insert_wpprofileblacklist(self, wpprofile, request):
        ls = request.POST['blacklist']
        ls_id = ls.split(',')
        for id in ls_id:
            try:
                m = get_object_or_404(WPBlackList, id=id)
                o = WPProfileBlackList.objects.create(profileid=wpprofile, blacklist=m)
                
            except:
                pass
    
    def insert_wpprofilecontentfilter(self, wpprofile, request):
        ls = request.POST['contentfilters']
        ls_id = ls.split(',')
        for id in ls_id:
            try:
                m = get_object_or_404(WPContent, id=id)
                o = WPProfileContentFilter.objects.create(profileid=wpprofile, contentfilter=m)
                
            except:
                pass
            
    def insert_wpnet(self, wpprofile, request):
        ls = request.POST['nets']
        ls_id = ls.split(',')
        for id in ls_id:
            try:
                m = get_object_or_404(DefNet, id=id)
                o = WPNet.objects.create(profileid=wpprofile, netid=m)
                
            except:
                pass
            
    @transaction.commit_on_success
    def update(self, request):
        name = self.cleaned_data['name']
        _location = self.cleaned_data['location']
        _timequota = self.cleaned_data['timequota']
        _sizequota = self.cleaned_data['sizequota']
        _catdef = self.cleaned_data['catdef']
        _safesearchon = self.cleaned_data['safesearchon']
        _id = request.POST['id']
        timequota = int(_timequota)
        sizequota = int(_sizequota)
        catdef = int(_catdef)
        safesearchon = int(_safesearchon)
        id = int(_id)
        try:
            wpprofile = WPProfile.objects.get(id=id)
            
        except WPProfile.DoesNotExist:
            raise UIException(_(u'The webproxy profile does not exist.'))
        
        if name.lower() != wpprofile.name.lower():
            self.validate_name(name)
            
        self.validate_data(request)
        
        form = WPProfileExceptForm(request.POST)
        if not form.is_valid():
            return form, None
        
        location = get_location_update(WPProfile, _location)
        ls = WPProfile.objects.order_by('location')
        tls = tuple(ls)
        old_loc = wpprofile.location
        
        wpprofile.name = name
        wpprofile.location = location
        wpprofile.timequota = timequota
        wpprofile.sizequota = sizequota
        wpprofile.catdef = catdef
        wpprofile.safesearchon = safesearchon
        wpprofile.save()
        form.update(wpprofile, request)
        self.update_wpprofileschd(wpprofile, request)
        self.update_wpprofileuserinternal(wpprofile, request)
        self.update_wpprofileuserexternal(wpprofile, request)
        self.update_wpprofileallowext(wpprofile, request)
        self.update_wpprofileblockext(wpprofile, request)
        self.update_wpprofileallowmime(wpprofile, request)
        self.update_wpprofileblockmime(wpprofile, request)
        self.update_wpprofilecat(wpprofile, request)
        self.update_wpprofilewhitelist(wpprofile, request)
        self.update_wpprofileblacklist(wpprofile, request)
        self.update_wpprofilecontentfilter(wpprofile, request)
        self.update_wpnet(wpprofile, request)
        update_locations_after_update(old_loc, location, tls)
        return None, wpprofile
        
    def update_wpprofileschd(self, wpprofile, request):
        ls = request.POST['schedules']
        ls_id = ls.split(',')
        WPProfileSchd.objects.filter(profileid=wpprofile).delete()
        for id in ls_id:
            try:
                m = get_object_or_404(DefSchd, id=id)
                o = WPProfileSchd.objects.create(profileid=wpprofile, schedule=m)
                
            except:
                pass
    
    def update_wpprofileuserinternal(self, wpprofile, request):
        ls = request.POST['userinternals']
        ls_id = ls.split(',')
        WPProfileUserInternal.objects.filter(profileid=wpprofile).delete()
        for id in ls_id:
            try:
                m = get_object_or_404(DefUser, id=id)
                o = WPProfileUserInternal.objects.create(profileid=wpprofile, userinternal=m)
                
            except:
                pass
    
    def update_wpprofileuserexternal(self, wpprofile, request):
        ls = request.POST['userexternals']
        ls_id = ls.split(',')
        WPProfileUserExternal.objects.filter(profileid=wpprofile).delete()
        for id in ls_id:
            try:
                m = get_object_or_404(ADUser, id=id)
                o = WPProfileUserExternal.objects.create(profileid=wpprofile, userexternal=m)
                
            except:
                pass
    
    def update_wpprofileallowext(self, wpprofile, request):
        ls = request.POST['allowexts']
        ls_id = ls.split(',')
        WPProfileAllowExt.objects.filter(profileid=wpprofile).delete()
        for id in ls_id:
            try:
                m = get_object_or_404(WPExt, id=id)
                o = WPProfileAllowExt.objects.create(profileid=wpprofile, allowext=m)
                
            except:
                pass
    
    def update_wpprofileblockext(self, wpprofile, request):
        ls = request.POST['blockexts']
        ls_id = ls.split(',')
        WPProfileBlockExt.objects.filter(profileid=wpprofile).delete()
        for id in ls_id:
            try:
                m = get_object_or_404(WPExt, id=id)
                o = WPProfileBlockExt.objects.create(profileid=wpprofile, blockext=m)
                
            except:
                pass
    
    def update_wpprofileallowmime(self, wpprofile, request):
        ls = request.POST['allowmimes']
        ls_id = ls.split(',')
        WPProfileAllowMIME.objects.filter(profileid=wpprofile).delete()
        for id in ls_id:
            try:
                m = get_object_or_404(WPMIME, id=id)
                o = WPProfileAllowMIME.objects.create(profileid=wpprofile, allowmime=m)
                
            except:
                pass
    
    def update_wpprofileblockmime(self, wpprofile, request):
        ls = request.POST['blockmimes']
        ls_id = ls.split(',')
        WPProfileBlockMIME.objects.filter(profileid=wpprofile).delete()
        for id in ls_id:
            try:
                m = get_object_or_404(WPMIME, id=id)
                o = WPProfileBlockMIME.objects.create(profileid=wpprofile, blockmime=m)
                
            except:
                pass
    
    def update_wpprofilecat(self, wpprofile, request):
        ls = request.POST['cats']
        ls_id = ls.split(',')
        WPSelectedCat.objects.filter(profileid=wpprofile).delete()
        for id in ls_id:
            try:
                m = get_object_or_404(WPCat, id=id)
                o = WPSelectedCat.objects.create(profileid=wpprofile, catid=m)
                
            except:
                pass
    
    def update_wpprofilewhitelist(self, wpprofile, request):
        ls = request.POST['whitelist']
        ls_id = ls.split(',')
        WPProfileWhiteList.objects.filter(profileid=wpprofile).delete()
        for id in ls_id:
            try:
                m = get_object_or_404(WPWhiteList, id=id)
                o = WPProfileWhiteList.objects.create(profileid=wpprofile, whitelist=m)
                
            except:
                pass
    
    def update_wpprofileblacklist(self, wpprofile, request):
        ls = request.POST['blacklist']
        ls_id = ls.split(',')
        WPProfileBlackList.objects.filter(profileid=wpprofile).delete()
        for id in ls_id:
            try:
                m = get_object_or_404(WPBlackList, id=id)
                o = WPProfileBlackList.objects.create(profileid=wpprofile, blacklist=m)
                
            except:
                pass
    
    def update_wpprofilecontentfilter(self, wpprofile, request):
        ls = request.POST['contentfilters']
        ls_id = ls.split(',')
        WPProfileContentFilter.objects.filter(profileid=wpprofile).delete()
        for id in ls_id:
            try:
                m = get_object_or_404(WPContent, id=id)
                o = WPProfileContentFilter.objects.create(profileid=wpprofile, contentfilter=m)
                
            except:
                pass
            
    def update_wpnet(self, wpprofile, request):
        ls = request.POST['nets']
        ls_id = ls.split(',')
        WPNet.objects.filter(profileid=wpprofile).delete()
        for id in ls_id:
            try:
                m = get_object_or_404(DefNet, id=id)
                o = WPNet.objects.create(profileid=wpprofile, netid=m)
                
            except:
                pass
        
class WPProfileExceptForm(BaseSaveForm):
    skipauth = forms.IntegerField(label=_(u'Skip authentication'),
                                  widget=forms.CheckboxInput())
    skipcache = forms.IntegerField(label=_(u'Skip cache'),
                                   widget=forms.CheckboxInput())
    skipav = forms.IntegerField(label=_(u'Skip AV'),
                                widget=forms.CheckboxInput())
    skipext = forms.IntegerField(label=_(u'Skip extension filter'),
                                 widget=forms.CheckboxInput())
    skipmime = forms.IntegerField(label=_(u'Skip mime filter'),
                                  widget=forms.CheckboxInput())
    skipurl = forms.IntegerField(label=_(u'Skip URL filter'),
                                 widget=forms.CheckboxInput())
    skipcontentfilter = forms.IntegerField(label=_(u'Skip content filter'),
                                           widget=forms.CheckboxInput())
    
    def insert(self, wpprofile, request):
        _skipauth = self.cleaned_data['skipauth']
        _skipcache = self.cleaned_data['skipcache']
        _skipav = self.cleaned_data['skipav']
        _skipext = self.cleaned_data['skipext']
        _skipmime = self.cleaned_data['skipmime']
        _skipurl = self.cleaned_data['skipurl']
        _skipcontentfilter = self.cleaned_data['skipcontentfilter']
        skipauth = int(_skipauth)
        skipcache = int(_skipcache)
        skipav = int(_skipav)
        skipext = int(_skipext)
        skipmime = int(_skipmime)
        skipurl = int(_skipurl)
        skipcontentfilter = int(_skipcontentfilter)
        
        wpprofileexcept = WPProfileExcept.objects.create(profileid=wpprofile, skipauth=skipauth, skipcache=skipcache,
                                                         skipav=skipav, skipext=skipext, skipmime=skipmime,
                                                         skipurl=skipurl, skipcontentfilter=skipcontentfilter)
        self.insert_wpprofileexceptnet(wpprofileexcept, request)
        self.insert_wpprofileexcepturl(wpprofileexcept, request)
        self.insert_wpprofileexceptuserinternal(wpprofileexcept, request)
        self.insert_wpprofileexceptuserexternal(wpprofileexcept, request)
    
    def insert_wpprofileexceptnet(self, wpprofileexcept, request):
        ls = request.POST['exceptnets']
        ls_id = ls.split(',')
        for id in ls_id:
            try:
                m = get_object_or_404(DefNet, id=id)
                o = WPProfileExceptNet.objects.create(exceptid=wpprofileexcept, netid=m)
                
            except:
                pass
    
    def insert_wpprofileexcepturl(self, wpprofileexcept, request):
        urls = request.POST['excepturls']
        data = urls.split('||')
        for url in data:
            try:
                if url != '':
                    o = WPProfileExceptURL.objects.create(exceptid=wpprofileexcept, url=url)
                
            except:
                pass
    
    def insert_wpprofileexceptuserinternal(self, wpprofileexcept, request):
        ls = request.POST['exceptuserinternals']
        ls_id = ls.split(',')
        for id in ls_id:
            try:
                m = get_object_or_404(DefUser, id=id)
                o = WPProfileExceptUserInternal.objects.create(exceptid=wpprofileexcept, userinternal=m)
                
            except:
                pass
    
    def insert_wpprofileexceptuserexternal(self, wpprofileexcept, request):
        ls = request.POST['exceptuserexternals']
        ls_id = ls.split(',')
        for id in ls_id:
            try:
                m = get_object_or_404(ADUser, id=id)
                o = WPProfileExceptUserExternal.objects.create(exceptid=wpprofileexcept, userexternal=m)
                
            except:
                pass
    
    def update(self, wpprofile, request):
        _skipauth = self.cleaned_data['skipauth']
        _skipcache = self.cleaned_data['skipcache']
        _skipav = self.cleaned_data['skipav']
        _skipext = self.cleaned_data['skipext']
        _skipmime = self.cleaned_data['skipmime']
        _skipurl = self.cleaned_data['skipurl']
        _skipcontentfilter = self.cleaned_data['skipcontentfilter']
        skipauth = int(_skipauth)
        skipcache = int(_skipcache)
        skipav = int(_skipav)
        skipext = int(_skipext)
        skipmime = int(_skipmime)
        skipurl = int(_skipurl)
        skipcontentfilter = int(_skipcontentfilter)
        
        wpprofileexcept = get_object_or_404(WPProfileExcept, profileid=wpprofile)

        wpprofileexcept.skipauth = skipauth
        wpprofileexcept.skipcache = skipcache
        wpprofileexcept.skipav = skipav
        wpprofileexcept.skipext = skipext
        wpprofileexcept.skipmime = skipmime
        wpprofileexcept.skipurl = skipurl
        wpprofileexcept.skipcontentfilter = skipcontentfilter
        wpprofileexcept.save()
        self.update_wpprofileexceptnet(wpprofileexcept, request)
        self.update_wpprofileexcepturl(wpprofileexcept, request)
        self.update_wpprofileexceptuserinternal(wpprofileexcept, request)
        self.update_wpprofileexceptuserexternal(wpprofileexcept, request)
    
    def update_wpprofileexceptnet(self, wpprofileexcept, request):
        ls = request.POST['exceptnets']
        ls_id = ls.split(',')
        WPProfileExceptNet.objects.filter(exceptid=wpprofileexcept).delete()
        for id in ls_id:
            try:
                m = get_object_or_404(DefNet, id=id)
                o = WPProfileExceptNet.objects.create(exceptid=wpprofileexcept, netid=m)
                
            except:
                pass
    
    def update_wpprofileexcepturl(self, wpprofileexcept, request):
        urls = request.POST['excepturls']
        data = urls.split('||')
        WPProfileExceptURL.objects.filter(exceptid=wpprofileexcept).delete()
        for url in data:
            try:
                if url != '':
                    o = WPProfileExceptURL.objects.create(exceptid=wpprofileexcept, url=url)
                
            except:
                pass
    
    def update_wpprofileexceptuserinternal(self, wpprofileexcept, request):
        ls = request.POST['exceptuserinternals']
        ls_id = ls.split(',')
        WPProfileExceptUserInternal.objects.filter(exceptid=wpprofileexcept).delete()
        for id in ls_id:
            try:
                m = get_object_or_404(DefUser, id=id)
                o = WPProfileExceptUserInternal.objects.create(exceptid=wpprofileexcept, userinternal=m)
                
            except:
                pass
    
    def update_wpprofileexceptuserexternal(self, wpprofileexcept, request):
        ls = request.POST['exceptuserexternals']
        ls_id = ls.split(',')
        WPProfileExceptUserExternal.objects.filter(exceptid=wpprofileexcept).delete()
        for id in ls_id:
            try:
                m = get_object_or_404(ADUser, id=id)
                o = WPProfileExceptUserExternal.objects.create(exceptid=wpprofileexcept, userexternal=m)
                
            except:
                pass

class WPAdvanceForm(BaseSaveForm):
    cache = forms.IntegerField(initial=1, label=_('Enable caching'),
                               widget=forms.CheckboxInput())
    parent = forms.IntegerField(label=_(u'Enable parent proxy'),
                                widget=forms.CheckboxInput())
    parentip = forms.IntegerField(label=_(u'Parent proxy:'), required=False)
    parentport = forms.IntegerField(label=_(u'Port:'),
                                    widget=forms.TextInput(attrs={'class': 'text'}), required=False)
    parentusername = forms.CharField(max_length=1024, label=_(u'Username:'),
                                     widget=forms.TextInput(attrs={'class': 'text'}), required=False)
    parentpassword = forms.CharField(max_length=50, label=_(u'Password:'),
                                     widget=forms.PasswordInput(attrs={'class': 'text'}), required=False)
    
    def clean(self):
        _parent = self.cleaned_data['parent']
        parent = int(_parent)
        if parent == 1:
            parentip = self.cleaned_data['parentip']
            parentport = self.cleaned_data['parentport']
            parentusername = self.cleaned_data['parentusername']
            raw_parentpassword = self.cleaned_data['parentpassword']
            if parentip == None or parentip == '' or \
                parentport == None or parentport == '':
                raise forms.ValidationError(_(u'Please enter parent proxy and port.'))
            
            parentip_id = int(parentip)
            try:
                o = DefNet.objects.filter(Q(type=1) | Q(type=2)).get(id=parentip_id)
                
            except DefNet.DoesNotExist:
                raise forms.ValidationError(_(u'Invalid parent proxy.'))
            
        return self.cleaned_data
    
    def insert(self, request):
        _cache = self.cleaned_data['cache']
        _parent = self.cleaned_data['parent']
        cache = int(_cache)
        parent = int(_parent)
        
        try:
            WPAdvance.objects.all().delete()
            
        except:
            pass
        
        o = WPAdvance(cache=cache,
                      parent=parent)
        if parent == 1:
            _parentip = self.cleaned_data['parentip']
            _parentport = self.cleaned_data['parentport']
            parentusername = self.cleaned_data['parentusername']
            raw_parentpassword = self.cleaned_data['parentpassword']
            parentip_id = int(_parentip)
            parentpassword = encrypt_password(raw_parentpassword)
            
            try:
                parentip = DefNet.objects.filter(Q(type=1) | Q(type=2)).get(id=parentip_id)
                
            except DefNet.DoesNotExist:
                raise UIException(_(u'Invalid parent proxy.'))
            
            parentport = int(_parentport)
            o.parentip = parentip
            o.parentport = parentport
            o.parentusername = parentusername
            o.parentpassword = parentpassword
            
        o.save()
        return o
    
    def update(self, request):
        _cache = self.cleaned_data['cache']
        _parent = self.cleaned_data['parent']
        cache = int(_cache)
        parent = int(_parent)
        _id = request.POST['id']
        id = int(_id)
        
        try:
            o = WPAdvance.objects.get(id=id)
            
        except WPAdvance.DoesNotExist:
            raise UIException(_(u'The Advance setting does not exist'))
        
        o.cache = cache
        o.parent = parent
        if parent == 1:
            _parentip = self.cleaned_data['parentip']
            _parentport = self.cleaned_data['parentport']
            parentusername = self.cleaned_data['parentusername']
            raw_parentpassword = self.cleaned_data['parentpassword']
            parentip_id = int(_parentip)
            
            try:
                parentip = DefNet.objects.filter(Q(type=1) | Q(type=2)).get(id=parentip_id)
                
            except DefNet.DoesNotExist:
                raise UIException(_(u'Invalid parent proxy.'))
            
            parentport = int(_parentport)
            o.parentip = parentip
            o.parentport = parentport
            o.parentusername = parentusername
            if raw_parentpassword != '**********':
                o.parentpassword = encrypt_password(raw_parentpassword)
            
        o.save()
        return o
    
class WPProfileSearchForm(BaseSearchForm):
    selection = forms.ChoiceField(choices=WPPROFILE_SEARCH_CHOICES,
                                  widget=forms.Select(attrs={'class': 'search_option'}))
    
class WPProfileExceptSearchForm(BaseSearchForm):
    pass