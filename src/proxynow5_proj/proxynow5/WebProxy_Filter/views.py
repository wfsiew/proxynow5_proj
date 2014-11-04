from django.http import *
from django.shortcuts import *
from forms import *
from models import *
from search import *
from proxynow5_proj.proxynow5.utils import *
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, InvalidPage
from django.template.context import RequestContext
from django.utils.translation import ugettext as _
from proxynow5_proj.proxynow5.forms import NavigateForm
from proxynow5_proj.proxynow5.exceptions import UIException
from proxynow5_proj.proxynow5.Wizard.process_session import get_items_session_byid, STORE_CATEGORY
from django.template.loader import get_template
from django.db import transaction

@login_required
@admin_access_required
def wpfilter_page(request):
    variables = RequestContext(request)
    return render_to_response('wpfilter_page.html', variables)

#===============================================================================
# Category
#===============================================================================
def wpcat_save_temp(request):
    return wpcat_save(request)

@custom_login_required
def wpcat_save(request):
    scope = ''
    level = ''
    form_title = ADD_WPCAT_FORM_TITLE
    
    if 'scope' in request.GET:
        scope = '-' + request.GET['scope']
        
    if request.method == 'GET' and 'level' in request.GET:
        level = '_' + request.GET['level']
        
    if request.method == 'POST':
        form = WPCatForm(request.POST)
        if form.is_valid():
            try:
                if request.is_ajax():
                    inner_form, o = form.save(request)
                    if inner_form != None:
                        return json_form_error(inner_form)
                    
                    elif 'level' in request.POST and o != None:
                        return json_result({'success': 1,
                                            'id': o.id,
                                            'name': o.__unicode__()})
                        
                    else:
                        return HttpResponse(u'success')
                    
                else:
                    return HttpResponseRedirect('/wpcat/save/')
                
            except UIException, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
        
    elif 'id' in request.GET:
        form_title = EDIT_WPCAT_FORM_TITLE
        _id = request.GET['id']
        id = int(_id)
        clone = ''
        wiz = request.GET.get('wiz' ,'')
            
        if 'clone' in request.GET:
            clone = request.GET['clone']
            form_title = ADD_WPCAT_FORM_TITLE
            
        name = ''
        type = 1
        comment = ''
        wpcatvalue = None
        try:
            if wiz == '':
                o = WPCat.objects.get(id=id)
                
            else:
                lswpcat = get_items_session_byid(request, STORE_CATEGORY, id)
                
                if not lswpcat is None:
                    o = lswpcat[0]
                    wpcatvalue = lswpcat[1]
                    
                else:
                    o = WPCat()
                
            name = o.name
            type = o.type
            comment = o.comment
            dic = {'name': name,
                   'type': type,
                   'comment': comment}
            form = get_wpcat_form(type, clone, dic)
            if wpcatvalue is None:
                urls = o.wpcatvalue_set.filter(uid=o)
                
            else:
                urls = wpcatvalue
                
            variables = RequestContext(request, {'form': form,
                                                 'urls': urls,
                                                 'level': level,
                                                 'scope': scope,
                                                 'form_title': form_title,
                                                 'dialog_editurl_title': _(u'Edit URL'),
                                                 'dialog_import_title': _(u'Import'),
                                                 'dialog_export_title': _(u'Export')})
            return render_to_response('wpcat/wpcat_save_form.html', variables)
        
        except WPCat.DoesNotExist:
            pass
        
    else:
        form = WPCatForm()
        
    variables = RequestContext(request, {'form': form,
                                         'level': level,
                                         'scope': scope,
                                         'form_title': form_title,
                                         'dialog_editurl_title': _(u'Edit URL'),
                                         'dialog_import_title': _(u'Import'),
                                         'dialog_export_title': _(u'Export')})
    return render_to_response('wpcat/wpcat_save_form.html', variables)

@login_required
@admin_access_required
@transaction.commit_on_success
def wpcat_delete(request):
    if request.method == 'POST':
        if 'id' in request.POST:
            _id = request.POST['id']
            id = int(_id)
            pgsize = int(request.POST['pgsize'])
            pgnum = int(request.POST['pgnum'])
            search_by = request.POST.get('find', '')
            keyword = request.POST.get('text', '')
            confirm = request.POST.get('confirm', '')
            try:
                o = WPCat.objects.get(id=id)
                
            except WPCat.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            if confirm == '':
                n1 = o.wpprofilecats.count()
                show_msg = n1 > 0
                if show_msg and request.is_ajax():
                    t = get_template('wpcat/wpcat_confirm_delete.html')
                    msg = t.render(RequestContext(request, {'o': o,
                                                            'show_msg': show_msg}))
                    return json_result({'hasgroups': 1,
                                        'msg': msg})
            
            o.delete()
            if (search_by == '0' or search_by == '') and keyword == '':
                total = WPCat.objects.count()
                
            else:
                q = get_wpcat_query(search_by, keyword)
                total = WPCat.objects.filter(q).count()
            
            if total < pgsize or pgsize < 1:
                pgsize = total
        
            s = get_item_msg(total, pgsize, pgnum)
            if request.is_ajax():
                return json_result({'success': 1,
                                    'itemscount': s})
            
            else:
                return HttpResponseRedirect('/wpcat/')
            
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
def wpcat_list(request):
    template = 'wpcat/wpcat_list.html'
    return process_wpcat(request, template)

@login_required
@admin_access_required
def wpcat_page(request):
    dic = {
           'title': _(u'Category'),
           'searchform': WPCatSearchForm(),
           'hide_search_selection': True,
           'template': 'wpcat/wpcat_page.html',
           'add_label': _(u'New category ...'),
           'dialog_title': _(u'Edit category')
           }
    return get_page_list(request, WPCat, dic)

@login_required
@admin_access_required
def wpcat_saveurl(request):
    scope = ''
    level = ''
    if 'scope' in request.GET:
        scope = '-' + request.GET['scope']
        
    if request.method == 'GET' and 'level' in request.GET:
        level = '_' + request.GET['level']
        
    variables = RequestContext(request, {'scope': scope,
                                         'level': level})
    
    return render_to_response('wpcat/wpcat_url_save_form.html', variables)

@login_required
@admin_access_required
def wpcat_import(request):
    scope = ''
    level = ''
    if 'scope' in request.GET:
        scope = '-' + request.GET['scope']
        
    if request.method == 'GET' and 'level' in request.GET:
        level = '_' + request.GET['level']
        
    variables = RequestContext(request, {'scope': scope,
                                         'level': level})
        
    return render_to_response('wpcat/wpcat_import_form.html', variables)

@login_required
@admin_access_required
def wpcat_export(request):
    scope = ''
    level = ''
    if 'scope' in request.GET:
        scope = '-' + request.GET['scope']
        
    if request.method == 'GET' and 'level' in request.GET:
        level = '_' + request.GET['level']
        
    variables = RequestContext(request, {'scope': scope,
                                         'level': level})
    
    return render_to_response('wpcat/wpcat_export_form.html', variables)

#===============================================================================
# Views for list selection
#===============================================================================
@login_required
@admin_access_required
def wpcat_list_panel(request):
    objlist = WPCat.objects.all()
    form = FilterWPCatForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('wpcat/wpcat_list_panel.html', variables)

@login_required
@admin_access_required
def wpcat_list_select(request):
    objlist = process_wpcat_filter(request)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('wpcat/wpcat_list_select.html', variables)

def wpcat_list_panel_temp(request):
    objlist = get_allitems_session(request,STORE_CATEGORY)
    form = FilterWPCatForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('wpcat/wpcat_list_panel.html', variables)

def wpcat_list_select_temp(request):
    objlist = get_allitems_session(request, STORE_CATEGORY)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('wpcat/wpcat_list_select.html', variables)

#===============================================================================
# Whitelist
#===============================================================================
def wpwhitelist_save_temp(request):
    return wpwhitelist_save(request)

@custom_login_required
def wpwhitelist_save(request):
    scope = ''
    level = ''
    form_title = ADD_WPWHITELIST_FORM_TITLE
    
    if 'scope' in request.GET:
        scope = '-' + request.GET['scope']
        
    if request.method == 'GET' and 'level' in request.GET:
        level = '_' + request.GET['level']
        
    if request.method == 'POST':
        form = WPWhiteListForm(request.POST)
        if form.is_valid():
            try:
                if request.is_ajax():
                    inner_form, o = form.save(request)
                    if inner_form != None:
                        return json_form_error(inner_form)
                    
                    elif 'level' in request.POST and o != None:
                        return json_result({'success': 1,
                                            'id': o.id,
                                            'name': o.name})
                        
                    else:
                        return HttpResponse(u'success')
                    
                else:
                    return HttpResponseRedirect('/wpwhitelist/save/')
                
            except UIException, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
        
    elif 'id' in request.GET:
        form_title = EDIT_WPWHITELIST_FORM_TITLE
        _id = request.GET['id']
        id = int(_id)
        clone = ''
        wiz = request.GET.get('wiz', '')
            
        if 'clone' in request.GET:
            clone = request.GET['clone']
            form_title = ADD_WPWHITELIST_FORM_TITLE
            
        name = ''
        comment = ''
        wpwhitelistvalue = None
        try:
            if wiz == '':
                o = WPWhiteList.objects.get(id=id)
                
            else:
                lswpwhitelist = get_items_session_byid(request, STORE_WHITE_LIST, id)
                
                if not lswpwhitelist is None:
                    o = lswpwhitelist[0]
                    wpwhitelistvalue = lswpwhitelist[1]
                    
                else:
                    o = WPWhiteList()
                    
            name = o.name
            comment = o.comment
            form = WPWhiteListForm({'name': name,
                                    'comment': comment})
            if wpwhitelistvalue is None:
                urls = o.wpwhitelistvalue_set.filter(uid=o)
                
            else:
                urls = wpwhitelistvalue
                
            variables = RequestContext(request, {'form': form,
                                                 'urls': urls,
                                                 'level': level,
                                                 'scope': scope,
                                                 'form_title': form_title,
                                                 'dialog_editurl_title': _(u'Edit URL'),
                                                 'dialog_import_title': _(u'Import'),
                                                 'dialog_export_title': _(u'Export')})
            return render_to_response('wpwhitelist/wpwhitelist_save_form.html', variables)
        
        except WPWhiteList.DoesNotExist:
            pass
        
    else:
        form = WPWhiteListForm()
        
    variables = RequestContext(request, {'form': form,
                                         'level': level,
                                         'scope': scope,
                                         'form_title': form_title,
                                         'dialog_editurl_title': _(u'Edit URL'),
                                         'dialog_import_title': _(u'Import'),
                                         'dialog_export_title': _(u'Export')})
    return render_to_response('wpwhitelist/wpwhitelist_save_form.html', variables)

@login_required
@admin_access_required
@transaction.commit_on_success
def wpwhitelist_delete(request):
    if request.method == 'POST':
        if 'id' in request.POST:
            _id = request.POST['id']
            id = int(_id)
            pgsize = int(request.POST['pgsize'])
            pgnum = int(request.POST['pgnum'])
            keyword = request.POST.get('text', '')
            confirm = request.POST.get('confirm', '')
            try:
                o = WPWhiteList.objects.get(id=id)
                
            except WPWhiteList.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            if confirm == '':
                n1 = o.wpprofilewhitelists.count()
                show_msg = n1 > 0
                if show_msg and request.is_ajax():
                    t = get_template('wpwhitelist/wpwhitelist_confirm_delete.html')
                    msg = t.render(RequestContext(request, {'o': o,
                                                            'show_msg': show_msg}))
                    return json_result({'hasgroups': 1,
                                        'msg': msg})
            
            o.delete()
            if keyword == '':
                total = WPWhiteList.objects.count()
                
            else:
                q = get_wpwhitelist_query(keyword)
                total = WPWhiteList.objects.filter(q).count()
            
            if total < pgsize or pgsize < 1:
                pgsize = total
        
            s = get_item_msg(total, pgsize, pgnum)
            if request.is_ajax():
                return json_result({'success': 1,
                                    'itemscount': s})
            
            else:
                return HttpResponseRedirect('/wpwhitelist/')
            
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
def wpwhitelist_list(request):
    template = 'wpwhitelist/wpwhitelist_list.html'
    return process_wpwhitelist(request, template)

@login_required
@admin_access_required
def wpwhitelist_page(request):
    dic = {
           'title': _(u'Whitelist'),
           'searchform': WPWhiteListSearchForm(),
           'hide_search_selection': True,
           'template': 'wpwhitelist/wpwhitelist_page.html',
           'add_label': _(u'New whitelist ...'),
           'dialog_title': _(u'Edit whitelist')
           }
    return get_page_list(request, WPWhiteList, dic)

#===============================================================================
# Views for list selection
#===============================================================================
@login_required
@admin_access_required
def wpwhitelist_list_panel(request):
    objlist = WPWhiteList.objects.all()
    form = BaseFilterForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('wpwhitelist/wpwhitelist_list_panel.html', variables)

@login_required
@admin_access_required
def wpwhitelist_list_select(request):
    objlist = process_wpwhitelist_filter(request)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('wpwhitelist/wpwhitelist_list_select.html', variables)

def wpwhitelist_list_panel_temp(request):
    objlist = get_allitems_session(request,STORE_WHITE_LIST)
    form = BaseFilterForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('wpwhitelist/wpwhitelist_list_panel.html', variables)

def wpwhitelist_list_select_temp(request):
    objlist = get_allitems_session(request,STORE_WHITE_LIST)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('wpwhitelist/wpwhitelist_list_select.html', variables)

#===============================================================================
# Blacklist
#===============================================================================
def wpblacklist_save_temp(request):
    return wpblacklist_save(request)

@custom_login_required
def wpblacklist_save(request):
    scope = ''
    level = ''
    form_title = ADD_WPBLACKLIST_FORM_TITLE
    
    if 'scope' in request.GET:
        scope = '-' + request.GET['scope']
        
    if request.method == 'GET' and 'level' in request.GET:
        level = '_' + request.GET['level']
        
    if request.method == 'POST':
        form = WPBlackListForm(request.POST)
        if form.is_valid():
            try:
                if request.is_ajax():
                    inner_form, o = form.save(request)
                    if inner_form != None:
                        return json_form_error(inner_form)
                    
                    elif 'level' in request.POST and o != None:
                        return json_result({'success': 1,
                                            'id': o.id,
                                            'name': o.name})
                        
                    else:
                        return HttpResponse(u'success')
                    
                else:
                    return HttpResponseRedirect('/wpblacklist/save/')
                
            except UIException, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
        
    elif 'id' in request.GET:
        form_title = EDIT_WPBLACKLIST_FORM_TITLE
        _id = request.GET['id']
        id = int(_id)
        clone = ''
        wiz = request.GET.get('wiz', '')
            
        if 'clone' in request.GET:
            clone = request.GET['clone']
            form_title = ADD_WPBLACKLIST_FORM_TITLE
            
        name = ''
        comment = ''
        wpblacklistvalue = None
        try:
            if wiz == '':
                o = WPBlackList.objects.get(id=id)
                
            else:
                lswpblacklist = get_items_session_byid(request, STORE_BLACK_LIST, id)
                
                if not lswpblacklist is None:
                    o = lswpblacklist[0]
                    wpblacklistvalue = lswpblacklist[1]
                    
                else:
                    o = WPBlackList()
                    
            name = o.name
            comment = o.comment
            form = WPBlackListForm({'name': name,
                                    'comment': comment})
            if wpblacklistvalue is None:
                urls = o.wpblacklistvalue_set.filter(uid=o)
                
            else:
                urls = wpblacklistvalue
                
            variables = RequestContext(request, {'form': form,
                                                 'urls': urls,
                                                 'level': level,
                                                 'scope': scope,
                                                 'form_title': form_title,
                                                 'dialog_editurl_title': _(u'Edit URL'),
                                                 'dialog_import_title': _(u'Import'),
                                                 'dialog_export_title': _(u'Export')})
            return render_to_response('wpblacklist/wpblacklist_save_form.html', variables)
        
        except WPBlackList.DoesNotExist:
            pass
        
    else:
        form = WPBlackListForm()
        
    variables = RequestContext(request, {'form': form,
                                         'level': level,
                                         'scope': scope,
                                         'form_title': form_title,
                                         'dialog_editurl_title': _(u'Edit URL'),
                                         'dialog_import_title': _(u'Import'),
                                         'dialog_export_title': _(u'Export')})
    return render_to_response('wpblacklist/wpblacklist_save_form.html', variables)

@login_required
@admin_access_required
@transaction.commit_on_success
def wpblacklist_delete(request):
    if request.method == 'POST':
        if 'id' in request.POST:
            _id = request.POST['id']
            id = int(_id)
            pgsize = int(request.POST['pgsize'])
            pgnum = int(request.POST['pgnum'])
            keyword = request.POST.get('text', '')
            confirm = request.POST.get('confirm', '')
            try:
                o = WPBlackList.objects.get(id=id)
                
            except WPBlackList.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            if confirm == '':
                n1 = o.wpprofileblacklists.count()
                show_msg = n1 > 0
                if show_msg and request.is_ajax():
                    t = get_template('wpblacklist/wpblacklist_confirm_delete.html')
                    msg = t.render(RequestContext(request, {'o': o,
                                                            'show_msg': show_msg}))
                    return json_result({'hasgroups': 1,
                                        'msg': msg})
            
            o.delete()
            if keyword == '':
                total = WPBlackList.objects.count()
                
            else:
                q = get_wpblacklist_query(keyword)
                total = WPBlackList.objects.filter(q).count()
            
            if total < pgsize or pgsize < 1:
                pgsize = total
        
            s = get_item_msg(total, pgsize, pgnum)
            if request.is_ajax():
                return json_result({'success': 1,
                                    'itemscount': s})
            
            else:
                return HttpResponseRedirect('/wpblacklist/')
            
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
def wpblacklist_list(request):
    template = 'wpblacklist/wpblacklist_list.html'
    return process_wpblacklist(request, template)

@login_required
@admin_access_required
def wpblacklist_page(request):
    dic = {
           'title': _(u'Blacklist'),
           'searchform': WPWhiteListSearchForm(),
           'hide_search_selection': True,
           'template': 'wpblacklist/wpblacklist_page.html',
           'add_label': _(u'New blacklist ...'),
           'dialog_title': _(u'Edit blacklist')
           }
    return get_page_list(request, WPBlackList, dic)

#===============================================================================
# Views for list selection
#===============================================================================
@login_required
@admin_access_required
def wpblacklist_list_panel(request):
    objlist = WPBlackList.objects.all()
    form = BaseFilterForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('wpblacklist/wpblacklist_list_panel.html', variables)

@login_required
@admin_access_required
def wpblacklist_list_select(request):
    objlist = process_wpblacklist_filter(request)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('wpblacklist/wpblacklist_list_select.html', variables)

def wpblacklist_list_panel_temp(request):
    objlist = get_allitems_session(request,STORE_BLACK_LIST)
    form = BaseFilterForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('wpblacklist/wpblacklist_list_panel.html', variables)

def wpblacklist_list_select_temp(request):
    objlist = get_allitems_session(request,STORE_BLACK_LIST)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('wpblacklist/wpblacklist_list_select.html', variables)
    
#===============================================================================
# Extension
#===============================================================================
def wpext_save_temp(request):
    return wpext_save(request)

@custom_login_required
def wpext_save(request):
    scope = ''
    level = ''
    form_title = ADD_WPEXT_FORM_TITLE
    
    if 'scope' in request.GET:
        scope = '-' + request.GET['scope']
        
    if request.method == 'GET' and 'level' in request.GET:
        level = '_' + request.GET['level']
    
    if request.method == 'POST':
        form = WPExtForm(request.POST)
        if form.is_valid():
            try:
                if request.is_ajax():
                    inner_form, o = form.save(request)
                    if inner_form != None:
                        return json_form_error(inner_form)
                    
                    elif 'level' in request.POST and o != None:
                        return json_result({'success': 1,
                                            'id': o.id,
                                            'name': o.name})
                        
                    else:
                        return HttpResponse(u'success')
                    
                else:
                    return HttpResponseRedirect('/wpext/save/')
                
            except UIException, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
        
    elif 'id' in request.GET:
        form_title = EDIT_WPEXT_FORM_TITLE
        _id = request.GET['id']
        id = int(_id)
        clone = ''
        wiz = request.GET.get('wiz', '')
            
        if 'clone' in request.GET:
            clone = request.GET['clone']
            form_title = ADD_WPEXT_FORM_TITLE
            
        name = ''
        comment = ''
        wpextvalue = None
        try:
            if wiz == '':
                o = WPExt.objects.get(id=id)
                
            else:
                lswpext = get_items_session_byid(request, STORE_EXTENSION, id)
                
                if not lswpext is None:
                    o = lswpext[0]
                    wpextvalue = lswpext[1]
                    
                else:
                    o = WPExt()
                    
            name = o.name
            comment = o.comment
            form = WPExtForm({'name': name,
                                    'comment': comment})
            if wpextvalue is None:
                extensions = o.wpextvalue_set.filter(uid=o)
                
            else:
                extensions = wpextvalue
                
            variables = RequestContext(request, {'form': form,
                                                 'extensions': extensions,
                                                 'level': level,
                                                 'scope': scope,
                                                 'form_title': form_title,
                                                 'dialog_editext_title': _(u'Edit extension'),
                                                 'dialog_import_title': _(u'Import'),
                                                 'dialog_export_title': _(u'Export')})
            return render_to_response('wpext/wpext_save_form.html', variables)
        
        except WPExt.DoesNotExist:
            pass
        
    else:
        form = WPExtForm()
        
    variables = RequestContext(request, {'form': form,
                                         'level': level,
                                         'scope': scope,
                                         'form_title': form_title,
                                         'dialog_editext_title': _(u'Edit extension'),
                                         'dialog_import_title': _(u'Import'),
                                         'dialog_export_title': _(u'Export')})
    return render_to_response('wpext/wpext_save_form.html', variables)

@login_required
@admin_access_required
@transaction.commit_on_success
def wpext_delete(request):
    if request.method == 'POST':
        if 'id' in request.POST:
            _id = request.POST['id']
            id = int(_id)
            pgsize = int(request.POST['pgsize'])
            pgnum = int(request.POST['pgnum'])
            keyword = request.POST.get('text', '')
            confirm = request.POST.get('confirm', '')
            try:
                o = WPExt.objects.get(id=id)
                
            except WPExt.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            if confirm == '':
                n1 = o.wpprofileallowexts.count()
                n2 = o.wpprofileblockexts.count()
                show_msg = n1 > 0 or n2 > 0
                if show_msg and request.is_ajax():
                    t = get_template('wpext/wpext_confirm_delete.html')
                    msg = t.render(RequestContext(request, {'o': o,
                                                            'show_msg': show_msg}))
                    return json_result({'hasgroups': 1,
                                        'msg': msg})
            
            o.delete()
            if keyword == '':
                total = WPExt.objects.count()
                
            else:
                q = get_wpext_query(keyword)
                total = WPExt.objects.filter(q).count()
            
            if total < pgsize or pgsize < 1:
                pgsize = total
        
            s = get_item_msg(total, pgsize, pgnum)
            if request.is_ajax():
                return json_result({'success': 1,
                                    'itemscount': s})
            
            else:
                return HttpResponseRedirect('/wpext/')
            
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
def wpext_list(request):
    template = 'wpext/wpext_list.html'
    return process_wpext(request, template)

@login_required
@admin_access_required
def wpext_page(request):
    dic = {
           'title': _(u'Extension'),
           'searchform': WPWhiteListSearchForm(),
           'hide_search_selection': True,
           'template': 'wpext/wpext_page.html',
           'add_label': _(u'New extension ...'),
           'dialog_title': _(u'Edit extension')
           }
    return get_page_list(request, WPExt, dic)

@custom_login_required
def wpext_saveext(request):
    scope = ''
    level = ''
    if 'scope' in request.GET:
        scope = '-' + request.GET['scope']
        
    if request.method == 'GET' and 'level' in request.GET:
        level = '_' + request.GET['level']
        
    variables = RequestContext(request, {'scope': scope,
                                         'level': level})
    
    return render_to_response('wpext/wpext_ext_save_form.html', variables)

#===============================================================================
# Views for list selection
#===============================================================================
@login_required
@admin_access_required
def wpext_list_panel(request):
    objlist = WPExt.objects.all()
    form = BaseFilterForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('wpext/wpext_list_panel.html', variables)

@login_required
@admin_access_required
def wpext_list_select(request):
    objlist = process_wpext_filter(request)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('wpext/wpext_list_select.html', variables)

def wpext_list_panel_temp(request):
    objlist = get_allitems_session(request,STORE_EXTENSION)
    form = BaseFilterForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('wpext/wpext_list_panel.html', variables)

def wpext_list_select_temp(request):
    objlist = get_allitems_session(request,STORE_EXTENSION)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('wpext/wpext_list_select.html', variables)

#===============================================================================
# Content
#===============================================================================
def wpcontent_save_temp(request):
    return wpcontent_save(request)

@custom_login_required
def wpcontent_save(request):
    scope = ''
    level = ''
    form_title = ADD_WPCONTENT_FORM_TITLE
    
    if 'scope' in request.GET:
        scope = '-' + request.GET['scope']
        
    if request.method == 'GET' and 'level' in request.GET:
        level = '_' + request.GET['level']
    
    if request.method == 'POST':
        form = WPContentForm(request.POST)
        if form.is_valid():
            try:
                if request.is_ajax():
                    inner_form, o = form.save(request)
                    if inner_form != None:
                        return json_form_error(inner_form)
                    
                    elif 'level' in request.POST and o != None:
                        return json_result({'success': 1,
                                            'id': o.id,
                                            'name': o.name})
                        
                    else:
                        return HttpResponse(u'success')
                    
                else:
                    return HttpResponseRedirect('/wpcontent/save/')
                
            except UIException, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
        
    elif 'id' in request.GET:
        form_title = EDIT_WPCONTENT_FORM_TITLE
        _id = request.GET['id']
        id = int(_id)
        clone = ''
        wiz = request.GET.get('wiz', '')
            
        if 'clone' in request.GET:
            clone = request.GET['clone']
            form_title = ADD_WPCONTENT_FORM_TITLE
            
        name = ''
        comment = ''
        wpcontentvalue = None
        try:
            if wiz == '':
                o = WPContent.objects.get(id=id)
                
            else:
                lswpcontent = get_items_session_byid(request, STORE_CONTENT, id)
                
                if not lswpcontent is None:
                    o = lswpcontent[0]
                    wpcontentvalue = lswpcontent[1]
                
                else:
                    o= WPContent()
                
            name = o.name
            comment = o.comment
            form = WPContentForm({'name': name,
                                  'comment': comment})
            if wpcontentvalue is None:
                contents = o.wpcontentvalue_set.filter(uid=o)
                
            else:
                contents = wpcontentvalue
                
            variables = RequestContext(request, {'form': form,
                                                 'contents': contents,
                                                 'level': level,
                                                 'scope': scope,
                                                 'form_title': form_title,
                                                 'dialog_editcontent_title': _(u'Edit content'),
                                                 'dialog_import_title': _(u'Import'),
                                                 'dialog_export_title': _(u'Export')})
            return render_to_response('wpcontent/wpcontent_save_form.html', variables)
        
        except WPContent.DoesNotExist:
            pass
        
    else:
        form = WPContentForm()
        form1 = WPContentValueForm()
        
    variables = RequestContext(request, {'form': form,
                                         'form1': form1,
                                         'level': level,
                                         'scope': scope,
                                         'form_title': form_title,
                                         'dialog_editcontent_title': _(u'Edit content'),
                                         'dialog_import_title': _(u'Import'),
                                         'dialog_export_title': _(u'Export')})
    return render_to_response('wpcontent/wpcontent_save_form.html', variables)

@login_required
@admin_access_required
@transaction.commit_on_success
def wpcontent_delete(request):
    if request.method == 'POST':
        if 'id' in request.POST:
            _id = request.POST['id']
            id = int(_id)
            pgsize = int(request.POST['pgsize'])
            pgnum = int(request.POST['pgnum'])
            keyword = request.POST.get('text', '')
            confirm = request.POST.get('confirm', '')
            try:
                o = WPContent.objects.get(id=id)
                
            except WPContent.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            if confirm == '':
                n1 = o.wpprofilecontentfilters.count()
                show_msg = n1 > 0
                if show_msg and request.is_ajax():
                    t = get_template('wpcontent/wpcontent_confirm_delete.html')
                    msg = t.render(RequestContext(request, {'o': o,
                                                            'show_msg': show_msg}))
                    return json_result({'hasgroups': 1,
                                        'msg': msg})
            
            o.delete()
            if keyword == '':
                total = WPContent.objects.count()
                
            else:
                q = get_wpcontent_query(keyword)
                total = WPContent.objects.filter(q).count()
            
            if total < pgsize or pgsize < 1:
                pgsize = total
        
            s = get_item_msg(total, pgsize, pgnum)
            if request.is_ajax():
                return json_result({'success': 1,
                                    'itemscount': s})
            
            else:
                return HttpResponseRedirect('/wpcontent/')
            
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
def wpcontent_list(request):
    template = 'wpcontent/wpcontent_list.html'
    return process_wpcontent(request, template)

@login_required
@admin_access_required
def wpcontent_page(request):
    dic = {
           'title': _(u'Content'),
           'searchform': WPWhiteListSearchForm(),
           'hide_search_selection': True,
           'template': 'wpcontent/wpcontent_page.html',
           'add_label': _(u'New content ...'),
           'dialog_title': _(u'Edit content')
           }
    return get_page_list(request, WPContent, dic)

@login_required
@admin_access_required
def wpcontent_savecontent(request):
    scope = ''
    level = ''
    if 'scope' in request.GET:
        scope = '-' + request.GET['scope']
        
    if request.method == 'GET' and 'level' in request.GET:
        level = '_' + request.GET['level']
        
    variables = RequestContext(request, {'scope': scope,
                                         'level': level})
    
    return render_to_response('wpcontent/wpcontent_content_save_form.html', variables)

@login_required
@admin_access_required
def wpcontent_export(request):
    scope = ''
    level = ''
    if 'scope' in request.GET:
        scope = '-' + request.GET['scope']
        
    if request.method == 'GET' and 'level' in request.GET:
        level = '_' + request.GET['level']
        
    variables = RequestContext(request, {'scope': scope,
                                         'level': level})
    
    return render_to_response('wpcontent/wpcontent_export_form.html', variables)

#===============================================================================
# Views for list selection
#===============================================================================
@login_required
@admin_access_required
def wpcontent_list_panel(request):
    objlist = WPContent.objects.all()
    form = BaseFilterForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('wpcontent/wpcontent_list_panel.html', variables)

@login_required
@admin_access_required
def wpcontent_list_select(request):
    objlist = process_wpcontent_filter(request)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('wpcontent/wpcontent_list_select.html', variables)

def wpcontent_list_panel_temp(request):
    objlist = get_allitems_session(request,STORE_CONTENT)
    print objlist 
    form = BaseFilterForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('wpcontent/wpcontent_list_panel.html', variables)

def wpcontent_list_select_temp(request):
    objlist = get_allitems_session(request,STORE_CONTENT)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('wpcontent/wpcontent_list_select.html', variables)

#===============================================================================
# MIME
#===============================================================================
def wpmime_save_temp(request):
    return wpmime_save(request)

@custom_login_required
def wpmime_save(request):
    scope = ''
    level = ''
    form_title = ADD_WPMIME_FORM_TITLE
    
    if 'scope' in request.GET:
        scope = '-' + request.GET['scope']
        
    if request.method == 'GET' and 'level' in request.GET:
        level = '_' + request.GET['level']
    
    if request.method == 'POST':
        form = WPMIMEForm(request.POST)
        if form.is_valid():
            try:
                if request.is_ajax():
                    inner_form, o = form.save(request)
                    if inner_form != None:
                        return json_form_error(inner_form)
                    
                    elif 'level' in request.POST and o != None:
                        return json_result({'success': 1,
                                            'id': o.id,
                                            'name': o.name})
                        
                    else:
                        return HttpResponse(u'success')
                    
                else:
                    return HttpResponseRedirect('/wpmime/save/')
                
            except UIException, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
        
    elif 'id' in request.GET:
        form_title = EDIT_WPMIME_FORM_TITLE
        _id = request.GET['id']
        id = int(_id)
        clone = ''
        wiz = request.GET.get('wiz', '')
            
        if 'clone' in request.GET:
            clone = request.GET['clone']
            form_title = ADD_WPMIME_FORM_TITLE
            
        name = ''
        comment = ''
        wpmimevalue = None
        try:
            if wiz == '':
                o = WPMIME.objects.get(id=id)
                
            else:
                lswpmime = get_items_session_byid(request, STORE_MIME, id)
                
                if not lswpmime is None:
                    o = lswpmime[0]
                    wpmimevalue = lswpmime[1]
                    
                else:
                    o = WPMIME()
                    
            name = o.name
            comment = o.comment
            form = WPMIMEForm({'name': name,
                                'comment': comment})
            if wpmimevalue is None:
                mimes = o.wpmimevalue_set.filter(uid=o)
                
            else:
                mimes = wpmimevalue
                
            variables = RequestContext(request, {'form': form,
                                                 'mimes': mimes,
                                                 'level': level,
                                                 'scope': scope,
                                                 'form_title': form_title,
                                                 'dialog_editmime_title': _(u'Edit mime'),
                                                 'dialog_import_title': _(u'Import'),
                                                 'dialog_export_title': _(u'Export')})
            return render_to_response('wpmime/wpmime_save_form.html', variables)
        
        except WPMIME.DoesNotExist:
            pass
        
    else:
        form = WPMIMEForm()
        
    variables = RequestContext(request, {'form': form,
                                         'level': level,
                                         'scope': scope,
                                         'form_title': form_title,
                                         'dialog_editmime_title': _(u'Edit mime'),
                                         'dialog_import_title': _(u'Import'),
                                         'dialog_export_title': _(u'Export')})
    return render_to_response('wpmime/wpmime_save_form.html', variables)

@login_required
@admin_access_required
@transaction.commit_on_success
def wpmime_delete(request):
    if request.method == 'POST':
        if 'id' in request.POST:
            _id = request.POST['id']
            id = int(_id)
            pgsize = int(request.POST['pgsize'])
            pgnum = int(request.POST['pgnum'])
            keyword = request.POST.get('text', '')
            confirm = request.POST.get('confirm', '')
            try:
                o = WPMIME.objects.get(id=id)
                
            except WPMIME.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            if confirm == '':
                n1 = o.wpprofileallowmimes.count()
                n2 = o.wpprofileblockmimes.count()
                show_msg = n1 > 0 or n2 > 0
                if show_msg and request.is_ajax():
                    t = get_template('wpmime/wpmime_confirm_delete.html')
                    msg = t.render(RequestContext(request, {'o': o,
                                                            'show_msg': show_msg}))
                    return json_result({'hasgroups': 1,
                                        'msg': msg})
            
            o.delete()
            if keyword == '':
                total = WPMIME.objects.count()
                
            else:
                q = get_wpmime_query(keyword)
                total = WPMIME.objects.filter(q).count()
            
            if total < pgsize or pgsize < 1:
                pgsize = total
        
            s = get_item_msg(total, pgsize, pgnum)
            if request.is_ajax():
                return json_result({'success': 1,
                                    'itemscount': s})
            
            else:
                return HttpResponseRedirect('/wpcontent/')
            
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
def wpmime_list(request):
    template = 'wpmime/wpmime_list.html'
    return process_wpmime(request, template)

@login_required
@admin_access_required
def wpmime_page(request):
    dic = {
           'title': _(u'Content'),
           'searchform': WPWhiteListSearchForm(),
           'hide_search_selection': True,
           'template': 'wpmime/wpmime_page.html',
           'add_label': _(u'New MIME ...'),
           'dialog_title': _(u'Edit MIME')
           }
    return get_page_list(request, WPMIME, dic)

@login_required
@admin_access_required
def wpmime_savemime(request):
    scope = ''
    level = ''
    if 'scope' in request.GET:
        scope = '-' + request.GET['scope']
        
    if request.method == 'GET' and 'level' in request.GET:
        level = '_' + request.GET['level']
        
    variables = RequestContext(request, {'scope': scope,
                                         'level': level})
    
    return render_to_response('wpmime/wpmime_mime_save_form.html', variables)

#===============================================================================
# Views for list selection
#===============================================================================
@login_required
@admin_access_required
def wpmime_list_panel(request):
    objlist = WPMIME.objects.all()
    form = BaseFilterForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('wpmime/wpmime_list_panel.html', variables)

@login_required
@admin_access_required
def wpmime_list_select(request):
    objlist = process_wpmime_filter(request)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('wpmime/wpmime_list_select.html', variables)

def wpmime_list_panel_temp(request):
    objlist = get_allitems_session(request,STORE_MIME)
    form = BaseFilterForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('wpmime/wpmime_list_panel.html', variables)

def wpmime_list_select_temp(request):
    objlist = get_allitems_session(request,STORE_MIME)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('wpmime/wpmime_list_select.html', variables)