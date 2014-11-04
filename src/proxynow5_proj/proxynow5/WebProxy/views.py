from django.http import *
from django.shortcuts import *
from django.template import *
from forms import *
from models import *
from search import *
from proxynow5_proj.proxynow5.utils import *
from proxynow5_proj.proxynow5.sortablelist import *
from proxynow5_proj.proxynow5.Definition_Network.forms import *
from proxynow5_proj.proxynow5.exceptions import UIException
from django.contrib.auth.decorators import login_required
from django.template.context import RequestContext
from django.utils.translation import ugettext as _
from django.template.loader import get_template
from django.db import transaction

#===============================================================================
# WP views
#===============================================================================
@login_required
@admin_access_required
def wp_save(request):
    if request.method == 'POST':
        form = WPForm(request.POST)
        if form.is_valid():
            try:
                if request.is_ajax():
                    form.save(request)
                    return json_result({'success': 1,
                                        'msg': _(u'The webproxy setting was successfully updated.')})
                    
                else:
                    return HttpResponseRedirect('/wp/save/')
                
            except UIException, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
        
    elif 'id' in request.GET:
        id = request.GET['id']
        try:
            o = WP.objects.get(id=id)
            form = WPForm({'av': o.av,
                           'avscansize': o.avscansize,
                           'mode': o.mode,
                           'authentication': o.authentication,
                           'safesearchon': o.safesearchon})
            variables = RequestContext(request, {'form': form,
                                                 'id': id,
                                                 'hide_cancel': True})
            return render_to_response('wp/wp_save_form.html', variables)
        
        except WP.DoesNotExist:
            pass
        
    total = WP.objects.count()
    id = ''
    if total > 0:
        o = WP.objects.all()[0]
        id = o.id
        form = WPForm({'av': o.av,
                       'avscansize': o.avscansize,
                       'mode': o.mode,
                       'authentication': o.authentication,
                       'safesearchon': o.safesearchon})
        
    else:
        form = WPForm()
        
    variables = RequestContext(request, {'form': form,
                                         'id': id,
                                         'hide_cancel': True})
    return render_to_response('wp/wp_save_form.html', variables)

#===============================================================================
# Profile views
#===============================================================================
@login_required
@admin_access_required
def wpprofile_save(request):
    scope = ''
    level = ''
    form_title = ADD_WPPROFILE_FORM_TITLE
    
    if 'scope' in request.GET:
        scope = '-' + request.GET['scope']
        
    if request.method == 'GET' and 'level' in request.GET:
        level = '_' + request.GET['level']
        
    if request.method == 'POST':
        form = WPProfileForm(request.POST)
        if form.is_valid():
            try:
                if request.is_ajax():
                    formexcept, o = form.save(request)
                    if formexcept != None:
                        return json_form_error(formexcept)
                    
                    else:
                        return HttpResponse(u'success')
                    
                else:
                    return HttpResponseRedirect('/wpprofile/save/')
                
            except UIException, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
    
    elif 'id' in request.GET:
        form_title = EDIT_WPPROFILE_FORM_TITLE
        _id = request.GET['id']
        id = int(_id)
        clone = ''
        if 'clone' in request.GET:
            clone = request.GET['clone']
            form_title = ADD_WPPROFILE_FORM_TITLE
            
        try:
            o = WPProfile.objects.get(id=id)
            name = o.name
            location = o.location
            enable = o.enable
            timequota = o.timequota
            sizequota = o.sizequota
            catdef = o.catdef
            safesearchon = o.safesearchon
            scheduleon = 0
            schedules = o.wpprofileschd_set.filter(profileid=o)
             
            if schedules.count() > 0:
                scheduleon = 0
                
            else:
                scheduleon = 1
                
            dic = {'name': name,
                   'location': location,
                   'enable': enable,
                   'timequota': timequota,
                   'sizequota': sizequota,
                   'catdef': catdef,
                   'safesearchon': safesearchon,
                   'scheduleon': scheduleon}
            form = WPProfileForm(dic)
            userinternals = o.wpprofileuserinternal_set.filter(profileid=o)
            userexternals = o.wpprofileuserexternal_set.filter(profileid=o)
            allowextensions = o.wpprofileallowext_set.filter(profileid=o)
            blockextensions = o.wpprofileblockext_set.filter(profileid=o)
            allowmimes = o.wpprofileallowmime_set.filter(profileid=o)
            blockmimes = o.wpprofileblockmime_set.filter(profileid=o)
            cats = o.wpselectedcat_set.filter(profileid=o)
            whitelist = o.wpprofilewhitelist_set.filter(profileid=o)
            blacklist = o.wpprofileblacklist_set.filter(profileid=o)
            contentfilters = o.wpprofilecontentfilter_set.filter(profileid=o)
            nets = o.wpnet_set.filter(profileid=o)
            x = o.wpprofileexcept_set.get(profileid=o)
            skipauth = x.skipauth
            skipcache = x.skipcache
            skipav = x.skipav
            skipext = x.skipext
            skipmime = x.skipmime
            skipurl = x.skipurl
            skipcontentfilter = x.skipcontentfilter
            dictexcept = {'skipauth': skipauth,
                          'skipcache': skipcache,
                          'skipav': skipav,
                          'skipext': skipext,
                          'skipmime': skipmime,
                          'skipurl': skipurl,
                          'skipcontentfilter': skipcontentfilter}
            formexcept = WPProfileExceptForm(dictexcept)
            exceptnets = x.wpprofileexceptnet_set.filter(exceptid=x)
            excepturls = x.wpprofileexcepturl_set.filter(exceptid=x)
            exceptuserinternals = x.wpprofileexceptuserinternal_set.filter(exceptid=x)
            exceptuserexternals = x.wpprofileexceptuserexternal_set.filter(exceptid=x)
            variables = RequestContext(request, {'form': form,
                                                 'formexcept': formexcept,
                                                 'schedules': schedules,
                                                 'userinternals': userinternals,
                                                 'userexternals': userexternals,
                                                 'allowextensions': allowextensions,
                                                 'blockextensions': blockextensions,
                                                 'allowmimes': allowmimes,
                                                 'blockmimes': blockmimes,
                                                 'cats': cats,
                                                 'whitelist': whitelist,
                                                 'blacklist': blacklist,
                                                 'contentfilters': contentfilters,
                                                 'nets': nets,
                                                 'exceptnets': exceptnets,
                                                 'excepturls': excepturls,
                                                 'exceptuserinternals': exceptuserinternals,
                                                 'exceptuserexternals': exceptuserexternals,
                                                 'level': level,
                                                 'scope': scope,
                                                 'form_title': form_title,
                                                 'dialog1_title': _(u'Add schedule definition'),
                                                 'dialog1_edit_title': _(u'Edit schedule definition'),
                                                 'dialog2_title': _(u'Add user definition'),
                                                 'dialog2_edit_title': _(u'Edit user definition'),
                                                 'dialog3_title': _(u'Add extension'),
                                                 'dialog3_edit_title': _(u'Edit extension'),
                                                 'dialog4_title': _(u'Add extension'),
                                                 'dialog4_edit_title': _(u'Edit extension'),
                                                 'dialog5_title': _(u'Add MIME'),
                                                 'dialog5_edit_title': _(u'Edit MIME'),
                                                 'dialog6_title': _(u'Add MIME'),
                                                 'dialog6_edit_title': _(u'Edit MIME'),
                                                 'dialog7_title': _(u'Add category'),
                                                 'dialog7_edit_title': _(u'Edit category'),
                                                 'dialog8_title': _(u'Add whitelist'),
                                                 'dialog8_edit_title': _(u'Edit whitelist'),
                                                 'dialog9_title': _(u'Add blacklist'),
                                                 'dialog9_edit_title': _(u'Edit blacklist'),
                                                 'dialog10_title': _(u'Add content'),
                                                 'dialog10_edit_title': _(u'Edit content'),
                                                 'dialog11_title': _(u'Add network definition'),
                                                 'dialog11_edit_title': _(u'Edit network definition'),
                                                 'dialog12_title': _(u'Add network definition'),
                                                 'dialog12_edit_title': _(u'Edit network definition'),
                                                 'dialog13_title': _(u'Add user definition'),
                                                 'dialog13_edit_title': _(u'Edit user definition'),
                                                 'dialog14_editurl_title': _(u'Edit URL'),
                                                 'dialog14_import_title': _(u'Import'),
                                                 'dialog14_export_title': _(u'Export')})
            return render_to_response('wpprofile/wpprofile_save_form.html', variables)
        
        except WPProfile.DoesNotExist:
            pass
        
    else:
        form = WPProfileForm()
        formexcept = WPProfileExceptForm()
    
    variables = RequestContext(request, {'form': form,
                                         'formexcept': formexcept,
                                         'level': level,
                                         'scope': scope,
                                         'form_title': form_title,
                                         'dialog1_title': _(u'Add schedule definition'),
                                         'dialog1_edit_title': _(u'Edit schedule definition'),
                                         'dialog2_title': _(u'Add user definition'),
                                         'dialog2_edit_title': _(u'Edit user definition'),
                                         'dialog3_title': _(u'Add extension'),
                                         'dialog3_edit_title': _(u'Edit extension'),
                                         'dialog4_title': _(u'Add extension'),
                                         'dialog4_edit_title': _(u'Edit extension'),
                                         'dialog5_title': _(u'Add MIME'),
                                         'dialog5_edit_title': _(u'Edit MIME'),
                                         'dialog6_title': _(u'Add MIME'),
                                         'dialog6_edit_title': _(u'Edit MIME'),
                                         'dialog7_title': _(u'Add category'),
                                         'dialog7_edit_title': _(u'Edit category'),
                                         'dialog8_title': _(u'Add whitelist'),
                                         'dialog8_edit_title': _(u'Edit whitelist'),
                                         'dialog9_title': _(u'Add blacklist'),
                                         'dialog9_edit_title': _(u'Edit blacklist'),
                                         'dialog10_title': _(u'Add content'),
                                         'dialog10_edit_title': _(u'Edit content'),
                                         'dialog11_title': _(u'Add network definition'),
                                         'dialog11_edit_title': _(u'Edit network definition'),
                                         'dialog12_title': _(u'Add network definition'),
                                         'dialog12_edit_title': _(u'Edit network definition'),
                                         'dialog13_title': _(u'Add user definition'),
                                         'dialog13_edit_title': _(u'Edit user definition'),
                                         'dialog14_editurl_title': _(u'Edit URL'),
                                         'dialog14_import_title': _(u'Import'),
                                         'dialog14_export_title': _(u'Export')})
    return render_to_response('wpprofile/wpprofile_save_form.html', variables)

@login_required
@admin_access_required
@transaction.commit_on_success
def wpprofile_delete(request):
    if request.method == 'POST':
        if 'id' in request.POST:
            _id = request.POST['id']
            id = int(_id)
            pgsize = int(request.POST['pgsize'])
            pgnum = int(request.POST['pgnum'])
            search_by = request.POST.get('find', '')
            keyword = request.POST.get('text', '')
            try:
                o = WPProfile.objects.get(id=id)
                
            except WPProfile.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            loc = o.location
            ls = WPProfile.objects.order_by('location')
            tls = tuple(ls)
            o.delete()
            update_locations_after_delete(loc, tls)
            if (search_by == '0' or search_by == '') and keyword == '':
                total = WPProfile.objects.count()
                
            else:
                q = get_wpprofile_query(search_by, keyword)
                total = WPProfile.objects.filter(q).count()
                
            if total < pgsize or pgsize < 1:
                pgsize = total
        
            s = get_item_msg(total, pgsize, pgnum)
            if request.is_ajax():
                return HttpResponse(u'success|%s' % s)
            
            else:
                return HttpResponseRedirect('/wpprofile/')
            
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
@transaction.commit_on_success
def wpprofile_save_enable(request):
    if request.method == 'POST':
        if 'id' in request.POST:
            _id = request.POST['id']
            _enable = request.POST['enable']
            id = int(_id)
            enable = int(_enable)
            try:
                o = WPProfile.objects.get(id=id)
                
            except WPProfile.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            o.enable = enable
            o.save()
            return HttpResponse(u'success')
            
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
@transaction.commit_on_success
def wpprofile_save_location(request):
    if request.method == 'POST':
        if 'id' in request.POST:
            _id = request.POST['id']
            _swapid = request.POST['swapid']
            id = int(_id)
            swapid = int(_swapid)
            
            try:
                o = WPProfile.objects.get(id=id)
                x = WPProfile.objects.get(id=swapid)
                
            except WPProfile.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            old_loc = o.location
            new_loc = x.location
            ls = WPProfile.objects.order_by('location')
            tls = tuple(ls)
            
            o.location = new_loc
            o.save()
            update_locations_after_update(old_loc, new_loc, tls)
            return HttpResponse(u'success')
        
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
def wpprofile_list(request):
    template = 'wpprofile/wpprofile_list.html'
    return process_wpprofile(request, template)

@login_required
@admin_access_required
def wpprofile_page(request):
    dic = {
           'title': _(u'Access Control Profile'),
           'searchform': WPProfileSearchForm(),
           'template': 'wpprofile/wpprofile_page.html',
           'add_label': _(u'New webproxy profile ...'),
           'dialog_title': _(u'Edit webproxy profile')
           }
    return get_page_list(request, WPProfile, dic)

#===============================================================================
# Advance views
#===============================================================================
@login_required
@admin_access_required
def wpadvance_save(request):
    if request.method == 'POST':
        form = WPAdvanceForm(request.POST)
        if form.is_valid():
            try:
                if request.is_ajax():
                    form.save(request)
                    return json_result({'success': 1,
                                        'msg': _(u'The advanced setting was successfully updated.')})
                    
                else:
                    return HttpResponseRedirect('/wpadvance/')
                
            except UIException, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
        
    elif 'id' in request.GET:
        _id = request.GET['id']
        id = int(_id)
        try:
            o = WPAdvance.objects.get(id=id)
            form = WPAdvanceForm({'cache': o.cache,
                                  'parent': o.parent,
                                  'parentip': o.parentip,
                                  'parentport': o.parentport,
                                  'parentusername': o.parentusername,
                                  'parentpassword': o.parentpassword})
            variables = RequestContext(request, {'form': form,
                                                 'id': id,
                                                 'o': o,
                                                 'hide_cancel': True,
                                                 'dialog_title': _(u'Advanced'),
                                                 'dialog1_title': _(u'Add network definition'),
                                                 'dialog1_edit_title': _(u'Edit network definition'),
                                                 'dialog2_title': _(u'Add network definition'),
                                                 'dialog2_edit_title': _(u'Edit network definition'),
                                                 'dialog3_edit_title': _(u'Edit port'),
                                                 'dialog4_import_title': _(u'Import'),
                                                 'dialog5_export_title': _(u'Export')})
            return render_to_response('/wpadvance/wpadvance_page.html', variables)
        
        except WPAdvance.DoesNotExist:
            pass
        
    total = WPAdvance.objects.count()
    skiplist = WPAdvanceSkip.objects.all()
    id = ''
    o = None
    if total > 0:
        o = WPAdvance.objects.all()[0]
        id = o.id
        form = WPAdvanceForm({'cache': o.cache,
                              'parent': o.parent,
                              'parentip': o.parentip,
                              'parentport': o.parentport,
                              'parentusername': o.parentusername,
                              'parentpassword': o.parentpassword})
        
    else:
        form = WPAdvanceForm()
        
    variables = RequestContext(request, {'form': form,
                                         'id': id,
                                         'o': o,
                                         'hide_cancel': True,
                                         'dialog_title': _(u'Advanced'),
                                         'dialog1_title': _(u'Add network definition'),
                                         'dialog1_edit_title': _(u'Edit network definition'),
                                         'dialog2_title': _(u'Add network definition'),
                                         'dialog2_edit_title': _(u'Edit network definition'),
                                         'dialog3_edit_title': _(u'Edit port'),
                                         'dialog4_import_title': _(u'Import'),
                                         'dialog5_export_title': _(u'Export')})
    return render_to_response('wpadvance/wpadvance_page.html', variables)

#===============================================================================
# Advance Skip views
#===============================================================================
@login_required
@admin_access_required
def wpadvanceskip_page(request):
    skiplist = WPAdvanceSkip.objects.all()
    variables = RequestContext(request, {'skiplist': skiplist})
    return render_to_response('wpadvance/wpadvanceskip_save_form.html', variables)

@login_required
@admin_access_required
@transaction.commit_on_success
def wpadvanceskip_save(request):
    if request.method == 'POST':
        data = request.POST['data']
        
        ids = data.split(',')
        fail_list = []
        for id in ids:
            try:
                m = get_object_or_404(DefNet, id=id)
                o = WPAdvanceSkip.objects.create(netid=m)
                
            except:
                fail_list.append(id)
                
        if fail_list == []:
            return HttpResponse(u'success')
        
        else:
            return json_result({'error': 1,
                                'fail_list': fail_list})
            
    return HttpResponse(u'invalid request')

@login_required
@admin_access_required
@transaction.commit_on_success
def wpadvanceskip_delete(request):
    if request.method == 'POST':
        if 'id' in request.POST:
            _id = request.POST['id']
            id = int(_id)
            try:
                o = WPAdvanceSkip.objects.get(netid=id)
                
            except WPAdvanceSkip.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            o.delete()
            return HttpResponse(u'success')
        
    return HttpResponse(u'invalid id')

#===============================================================================
# Advance Allow views
#===============================================================================
@login_required
@admin_access_required
def wpadvanceallow_page(request):
    ports = WPAdvanceAllow.objects.all()
    variables = RequestContext(request, {'ports': ports})
    return render_to_response('wpadvance/wpadvanceallow_save_form.html', variables)

@login_required
@admin_access_required
@transaction.commit_on_success
def wpadvanceallow_save(request):
    if request.method == 'POST':
        data = request.POST['data']
        
        ports = data.split(',')
        fail_list = []
        for port in ports:
            try:
                p = int(port)
                o = WPAdvanceAllow.objects.create(portid=p)
                
            except:
                fail_list.append(port)
                
        if fail_list == []:
            return HttpResponse(u'success')
        
        else:
            return json_result({'error': 1,
                                'fail_list': fail_list})
            
    return HttpResponse(u'invalid request')

@login_required
@admin_access_required
@transaction.commit_on_success
def wpadvanceallow_delete(request):
    if request.method == 'POST':
        if 'portid' in request.POST:
            _portid = request.POST['portid']
            portid = int(_portid)
            try:
                o = WPAdvanceAllow.objects.get(portid=portid)
                
            except WPAdvanceAllow.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            o.delete()
            return HttpResponse(u'success')
        
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
@transaction.commit_on_success
def wpadvanceallow_saveport(request):
    scope = ''
    level = ''
    if 'scope' in request.GET:
        scope = '-' + request.GET['scope']
        
    if request.method == 'GET' and 'level' in request.GET:
        level = '_' + request.GET['level']
        
    if request.method == 'POST':
        if 'portid' in request.POST:
            _portid = request.POST['portid']
            _newportid = request.POST['newportid']
            portid = int(_portid)
            newportid = int(_newportid)
            try:
                o = WPAdvanceAllow.objects.get(portid=portid)
                
            except WPAdvanceAllow.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            o.delete()
            p = WPAdvanceAllow.objects.create(portid=newportid)
            
            return json_result({'success': 1,
                                'port': newportid})
            
        return HttpResponse(u'invalid id')
        
    variables = RequestContext(request, {'scope': scope,
                                         'level': level})
    return render_to_response('wpadvance/wpadvanceallow_port_save_form.html', variables)

#===============================================================================
# Trusted Network views
#===============================================================================
@login_required
@admin_access_required
def nettrusted_page(request):
    net = NetTrusted.objects.all()
    variables = RequestContext(request, {'net': net,
                                         'dialog_title': _(u'Trusted Network'),
                                         'dialog1_title': _(u'Add network definition'),
                                         'dialog1_edit_title': _(u'Edit network definition')})
    return render_to_response('nettrusted/nettrusted_page.html', variables)
    
@login_required
@admin_access_required
@transaction.commit_on_success
def nettrusted_net_save(request):
    if request.method == 'POST':
        data = request.POST['data']
        
        ids = data.split(',')
        fail_list = []
        for id in ids:
            try:
                m = get_object_or_404(DefNet, id=id)
                o = NetTrusted.objects.create(netid=m)
                
            except:
                fail_list.append(id)
            
        if fail_list == []:
            return HttpResponse(u'success')
        
        else:
            return json_result({'error': 1,
                                'fail_list': fail_list})
    
    return HttpResponse(u'invalid request')

@login_required
@admin_access_required
@transaction.commit_on_success
def nettrusted_net_delete(request):
    if request.method == 'POST':
        if 'netid' in request.POST:
            _netid = request.POST['netid']
            netid = int(_netid)
            try:
                o = NetTrusted.objects.get(netid=netid)
                
            except NetTrusted.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            o.delete()
            return HttpResponse(u'success')
        
    return HttpResponse(u'invalid id')