from django.http import *
from django.shortcuts import *
from django.template import *
from forms import *
from models import *
from search import *
from proxynow5_proj.proxynow5.utils import *
from proxynow5_proj.proxynow5.sortablelist import *
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, InvalidPage
from django.template.context import RequestContext
from django.utils.translation import ugettext as _
from proxynow5_proj.proxynow5.forms import NavigateForm
from proxynow5_proj.proxynow5.Settings.models import ProxynowSettings
from proxynow5_proj.proxynow5.exceptions import UIException
from proxynow5_proj.proxynow5.Settings.views import _save_setting
from django.template.loader import get_template
from django.db import transaction

@login_required
@admin_access_required
def appctrl_save(request):
    if request.method == 'POST':
        val = request.POST['value']
        _save_setting('appctrl', val)
        return HttpResponse(u'success')
    
    return HttpResponse(u'failure')

@login_required
@admin_access_required
def appctrlrule_save(request):
    form_title = ADD_FORM_TITLE
    if request.method == 'POST':
        form = AppCtrlRuleForm(request.POST)
        if form.is_valid():
            try:
                if request.is_ajax():
                    form.save(request)
                    return HttpResponse(u'success')
                
                else:
                    return HttpResponseRedirect('/appctrlrule/save/')
                
            except UIException, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
        
    elif 'id' in request.GET:
        form_title = EDIT_FORM_TITLE
        _id = request.GET['id']
        id = int(_id)
        clone = ''
        if 'clone' in request.GET:
            clone = request.GET['clone']
            form_title = ADD_FORM_TITLE
            
        try:
            o = AppCtrlRule.objects.get(id=id)
            name = o.name
            location = o.location
            enable = o.enable
            action = o.action
            comment = o.comment
            dic = {'name': name,
                   'location': location,
                   'enable': enable,
                   'action': action,
                   'comment': comment}
            form = AppCtrlRuleForm(dic)
            skiplist = o.appctrlskiplist_set.filter(aid=o)
            applyto = o.appctrlfor_set.filter(aid=o)
            whichapp = o.appctrlwhichapp_set.filter(aid=o)
            variables = RequestContext(request, {'form': form,
                                                 'skiplist': skiplist,
                                                 'applyto': applyto,
                                                 'whichapp': whichapp,
                                                 'form_title': form_title,
                                                 'dialog1_title': _(u'Add network definition'),
                                                 'dialog1_edit_title': _(u'Edit network definition'),
                                                 'dialog2_title': _(u'Add network definition'),
                                                 'dialog2_edit_title': _(u'Edit network definition')})
            return render_to_response('appctrlrule/appctrlrule_save_form.html', variables)
            
        except AppCtrlRule.DoesNotExist:
            pass
        
    else:
        form = AppCtrlRuleForm()
        
    variables = RequestContext(request, {'form': form,
                                         'form_title': form_title,
                                         'dialog1_title': _(u'Add network definition'),
                                         'dialog1_edit_title': _(u'Edit network definition'),
                                         'dialog2_title': _(u'Add network definition'),
                                         'dialog2_edit_title': _(u'Edit network definition')})
    return render_to_response('appctrlrule/appctrlrule_save_form.html', variables)

@login_required
@admin_access_required
@transaction.commit_on_success
def appctrlrule_delete(request):
    if request.method == 'POST':
        if 'id' in request.POST:
            _id = request.POST['id']
            id = int(_id)
            pgsize = int(request.POST['pgsize'])
            pgnum = int(request.POST['pgnum'])
            search_by = request.POST.get('find', '')
            keyword = request.POST.get('text', '')
            try:
                o = AppCtrlRule.objects.get(id=id)
                
            except AppCtrlRule.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            loc = o.location
            ls = AppCtrlRule.objects.order_by('location')
            tls = tuple(ls)
            o.delete()
            update_locations_after_delete(loc, tls)
            if (search_by == '0' or search_by == '') and keyword == '':
                total = AppCtrlRule.objects.count()
                
            else:
                q = get_query(search_by, keyword)
                total = AppCtrlRule.objects.filter(q).count()
                
            if total < pgsize or pgsize < 1:
                pgsize = total
        
            s = get_item_msg(total, pgsize, pgnum)
            if request.is_ajax():
                return HttpResponse(u'success|%s' % s)
            
            else:
                return HttpResponseRedirect('/appctrlrule/')
            
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
@transaction.commit_on_success
def appctrlrule_save_enable(request):
    if request.method == 'POST':
        if 'id' in request.POST:
            _id = request.POST['id']
            _enable = request.POST['enable']
            id = int(_id)
            enable = int(_enable)
            try:
                o = AppCtrlRule.objects.get(id=id)
                
            except AppCtrlRule.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            o.enable = enable
            o.save()
            return HttpResponse(u'success')
            
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
@transaction.commit_on_success
def appctrlrule_save_location(request):
    if request.method == 'POST':
        if 'id' in request.POST:
            _id = request.POST['id']
            _swapid = request.POST['swapid']
            id = int(_id)
            swapid = int(_swapid)
            
            try:
                o = AppCtrlRule.objects.get(id=id)
                x = AppCtrlRule.objects.get(id=swapid)
                
            except AppCtrlRule.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            old_loc = o.location
            new_loc = x.location
            ls = AppCtrlRule.objects.order_by('location')
            tls = tuple(ls)
            
            o.location = new_loc
            o.save()
            update_locations_after_update(old_loc, new_loc, tls)
            return HttpResponse(u'success')
        
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
def appctrlrule_list(request):
    template = 'appctrlrule/appctrlrule_list.html'
    return process(request, template)

@login_required
@admin_access_required
def appctrlrule_page(request):
    appctrlenable = False
    try:
        o = ProxynowSettings.objects.get(name__iexact='appctrl')
        appctrlenable = o.value == '1'
        
    except:
        pass
    
    dic = {
           'title': _(u'Application Control'),
           'searchform': SearchForm(),
           'custom_data': appctrlenable,
           'template': 'appctrlrule/appctrlrule_page.html',
           'add_label': _(u'New rule ...'),
           'dialog_title': _(u'Edit application control rule')
           }
    return get_page_list(request, AppCtrlRule, dic)

#===============================================================================
# Views for list selection: Application Control - Application List
#===============================================================================
@login_required
@admin_access_required
def appctrlapplist_list_panel(request):
    objlist = AppCtrlAppList.objects.all()
    form = FilterAppCtrlAppListForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('appctrlapplist/appctrlapplist_list_panel.html', variables)

@login_required
@admin_access_required
def appctrlapplist_list_select(request):
    objlist = process_filter_appctrlapplist(request)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('appctrlapplist/appctrlapplist_list_select.html', variables)