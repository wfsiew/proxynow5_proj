from django.http import *
from django.shortcuts import *
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
from proxynow5_proj.proxynow5.exceptions import UIException
from django.template.loader import get_template
from django.db import transaction

@login_required
@admin_access_required
def nat_page(request):
    variables = RequestContext(request)
    return render_to_response('nat/nat_page.html', variables)

#===============================================================================
# Port forwarding
#===============================================================================
@login_required
@admin_access_required
def natpf_save(request):
    form_title = ADD_NAT_PF_FORM_TITLE
    if request.method == 'POST':
        form = NAT_PFForm(request.POST)
        if form.is_valid():
            try:
                if request.is_ajax():
                    form.save(request)
                    return HttpResponse(u'success')
                
                else:
                    return HttpResponseRedirect('/nat/pf/save/')
                
            except UIException, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
        
    elif 'id' in request.GET:
        form_title = EDIT_NAT_PF_FORM_TITLE
        id = request.GET['id']
        clone = ''
        if 'clone' in request.GET:
            clone = request.GET['clone']
            form_title = ADD_NAT_PF_FORM_TITLE
            
        try:
            o = NAT_PF.objects.get(id=id)
            interface = o.interface
            comment = o.comment
            dic = {'interface': interface,
                   'comment': comment}
            form = NAT_PFForm(dic)
            variables = RequestContext(request, {'form': form,
                                                 'o': o,
                                                 'form_title': form_title,
                                                 'dialog1_title': _(u'Add service definition'),
                                                 'dialog1_edit_title': _(u'Edit service definition'),
                                                 'dialog2_title': _(u'Add network definition'),
                                                 'dialog2_edit_title': _(u'Edit network definition'),
                                                 'dialog3_title': _(u'Add service definition'),
                                                 'dialog3_edit_title': _(u'Edit service definition')})
            return render_to_response('nat/natpf_save_form.html', variables)
            
        except NAT_PF.DoesNotExist:
            pass
        
    else:
        form = NAT_PFForm()
        
    variables = RequestContext(request, {'form': form,
                                         'form_title': form_title,
                                         'dialog1_title': _(u'Add service definition'),
                                         'dialog1_edit_title': _(u'Edit service definition'),
                                         'dialog2_title': _(u'Add network definition'),
                                         'dialog2_edit_title': _(u'Edit network definition'),
                                         'dialog3_title': _(u'Add service definition'),
                                         'dialog3_edit_title': _(u'Edit service definition')})
    return render_to_response('nat/natpf_save_form.html', variables)

@login_required
@admin_access_required
@transaction.commit_on_success
def natpf_delete(request):
    if request.method == 'POST':
        if 'id' in request.POST:
            id = request.POST['id']
            pgsize = int(request.POST['pgsize'])
            pgnum = int(request.POST['pgnum'])
            keyword = request.POST.get('text', '')
            try:
                o = NAT_PF.objects.get(id=id)
                
            except NAT_PF.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            o.delete()
            if keyword != '':
                q = get_natpf_query(keyword)
                total = NAT_PF.objects.filter(q).count()
                
            else:
                total = NAT_PF.objects.count()
                
            if total < pgsize or pgsize < 1:
                pgsize = total
        
            s = get_item_msg(total, pgsize, pgnum)
            if request.is_ajax():
                return HttpResponse(u'success|%s' % s)
            
            else:
                return HttpResponseRedirect('/nat/pf/')
            
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
def natpf_list(request):
    template = 'nat/natpf_list.html'
    return process_natpf(request, template)

@login_required
@admin_access_required
def natpf_page(request):
    dic = {
           'title': _(u'Port Forwarding'),
           'searchform': NATSearchForm(),
           'hide_search_selection': True,
           'template': 'nat/natpf_page.html',
           'add_label': _(u'New port forwarding ...'),
           'dialog_title': _(u'Edit port forwarding')
           }
    return get_page_list(request, NAT_PF, dic)

#===============================================================================
# Masquerading
#===============================================================================
@login_required
@admin_access_required
def natmasq_save(request):
    form_title = ADD_NAT_MASQ_FORM_TITLE
    if request.method == 'POST':
        form = NAT_MASQForm(request.POST)
        if form.is_valid():
            try:
                if request.is_ajax():
                    form.save(request)
                    return HttpResponse(u'success')
                
                else:
                    return HttpResponseRedirect('/nat/masq/save/')
                
            except UIException, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
        
    elif 'id' in request.GET:
        form_title = EDIT_NAT_MASQ_FORM_TITLE
        id = request.GET['id']
        clone = ''
        if 'clone' in request.GET:
            clone = request.GET['clone']
            form_title = ADD_NAT_MASQ_FORM_TITLE
            
        try:
            o = NAT_MASQ.objects.get(id=id)
            interface = o.interface
            location = o.location
            comment = o.comment
            dic = {'interface': interface,
                   'location': location,
                   'comment': comment}
            form = NAT_MASQForm(dic)
            variables = RequestContext(request, {'form': form,
                                                 'o': o,
                                                 'form_title': form_title,
                                                 'dialog1_title': _(u'Add network definition'),
                                                 'dialog1_edit_title': _(u'Edit network definition')})
            return render_to_response('nat/natmasq_save_form.html', variables)

        except NAT_MASQ.DoesNotExist:
            pass
        
    else:
        form = NAT_MASQForm()
        
    variables = RequestContext(request, {'form': form,
                                         'form_title': form_title,
                                         'dialog1_title': _(u'Add network definition'),
                                         'dialog1_edit_title': _(u'Edit network definition')})
    return render_to_response('nat/natmasq_save_form.html', variables)

@login_required
@admin_access_required
@transaction.commit_on_success
def natmasq_delete(request):
    if request.method == 'POST':
        if 'id' in request.POST:
            id = request.POST['id']
            pgsize = int(request.POST['pgsize'])
            pgnum = int(request.POST['pgnum'])
            keyword = request.POST.get('text', '')
            try:
                o = NAT_MASQ.objects.get(id=id)
                
            except NAT_MASQ.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            loc = o.location
            ls = NAT_MASQ.objects.order_by('location')
            tls = tuple(ls)
            o.delete()
            update_locations_after_delete(loc, tls)
            if keyword != '':
                q = get_natmasq_query(keyword)
                total = NAT_MASQ.objects.filter(q).count()
                
            else:
                total = NAT_MASQ.objects.count()
                
            if total < pgsize or pgsize < 1:
                pgsize = total
        
            s = get_item_msg(total, pgsize, pgnum)
            if request.is_ajax():
                return HttpResponse(u'success|%s' % s)
            
            else:
                return HttpResponseRedirect('/nat/masq/')
            
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
@transaction.commit_on_success
def natmasq_save_location(request):
    if request.method == 'POST':
        if 'id' in request.POST:
            _id = request.POST['id']
            _swapid = request.POST['swapid']
            id = int(_id)
            swapid = int(_swapid)
            
            try:
                o = NAT_MASQ.objects.get(id=id)
                x = NAT_MASQ.objects.get(id=swapid)
                
            except NAT_MASQ.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            old_loc = o.location
            new_loc = x.location
            ls = NAT_MASQ.objects.order_by('location')
            tls = tuple(ls)
            
            o.location = new_loc
            o.save()
            update_locations_after_update(old_loc, new_loc, tls)
            return HttpResponse(u'success')
        
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
def natmasq_list(request):
    template = 'nat/natmasq_list.html'
    return process_natmasq(request, template)

@login_required
@admin_access_required
def natmasq_page(request):
    dic = {
           'title': _(u'Masquerading'),
           'searchform': NATSearchForm(),
           'hide_search_selection': True,
           'template': 'nat/natmasq_page.html',
           'add_label': _(u'New masquerading rule ...'),
           'dialog_title': _(u'Edit masquerading rule')
           }
    return get_page_list(request, NAT_MASQ, dic)

#===============================================================================
# DNAT/SNAT
#===============================================================================
@login_required
@admin_access_required
def natdnatsnat_save(request):
    form_title = ADD_NAT_FORM_TITLE
    if request.method == 'POST':
        form = NAT_DNAT_SNATForm(request.POST)
        if form.is_valid():
            try:
                if request.is_ajax():
                    form.save(request)
                    return HttpResponse(u'success')
                
                else:
                    return HttpResponseRedirect('/nat/dnatsnat/save/')
                
            except UIException, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
        
    elif 'id' in request.GET:
        form_title = EDIT_NAT_FORM_TITLE
        id = request.GET['id']
        clone = ''
        if 'clone' in request.GET:
            clone = request.GET['clone']
            form_title = ADD_NAT_FORM_TITLE
            
        try:
            o = NAT_DNAT_SNAT.objects.get(id=id)
            mode = o.mode
            autoCreatePFRule = o.autoCreatePFRule
            comment = o.comment
            dic = {'mode': mode,
                   'autoCreatePFRule': autoCreatePFRule,
                   'comment': comment}
            form = NAT_DNAT_SNATForm(dic)
            variables = RequestContext(request, {'form': form,
                                                 'o': o,
                                                 'form_title': form_title,
                                                 'dialog1_title': _(u'Add network definition'),
                                                 'dialog1_edit_title': _(u'Edit network definition'),
                                                 'dialog2_title': _(u'Add service definition'),
                                                 'dialog2_edit_title': _(u'Edit service definition'),
                                                 'dialog3_title': _(u'Add network definition'),
                                                 'dialog3_edit_title': _(u'Edit network definition'),
                                                 'dialog4_title': _(u'Add network definition'),
                                                 'dialog4_edit_title': _(u'Edit network definition'),
                                                 'dialog5_title': _(u'Add service definition'),
                                                 'dialog5_edit_title': _(u'Edit service definition'),
                                                 'dialog6_title': _(u'Add network definition'),
                                                 'dialog6_edit_title': _(u'Edit network definition'),
                                                 'dialog7_title': _(u'Add service definition'),
                                                 'dialog7_edit_title': _(u'Edit service definition')})
            return render_to_response('nat/natdnatsnat_save_form.html', variables)

        except NAT_DNAT_SNAT.DoesNotExist:
            pass
        
    else:
        form = NAT_DNAT_SNATForm()
        
    variables = RequestContext(request, {'form': form,
                                         'form_title': form_title,
                                         'dialog1_title': _(u'Add network definition'),
                                         'dialog1_edit_title': _(u'Edit network definition'),
                                         'dialog2_title': _(u'Add service definition'),
                                         'dialog2_edit_title': _(u'Edit service definition'),
                                         'dialog3_title': _(u'Add network definition'),
                                         'dialog3_edit_title': _(u'Edit network definition'),
                                         'dialog4_title': _(u'Add network definition'),
                                         'dialog4_edit_title': _(u'Edit network definition'),
                                         'dialog5_title': _(u'Add service definition'),
                                         'dialog5_edit_title': _(u'Edit service definition'),
                                         'dialog6_title': _(u'Add network definition'),
                                         'dialog6_edit_title': _(u'Edit network definition'),
                                         'dialog7_title': _(u'Add service definition'),
                                         'dialog7_edit_title': _(u'Edit service definition')})
    return render_to_response('nat/natdnatsnat_save_form.html', variables)

@login_required
@admin_access_required
@transaction.commit_on_success
def natdnatsnat_delete(request):
    if request.method == 'POST':
        if 'id' in request.POST:
            id = request.POST['id']
            pgsize = int(request.POST['pgsize'])
            pgnum = int(request.POST['pgnum'])
            keyword = request.POST.get('text', '')
            try:
                o = NAT_DNAT_SNAT.objects.get(id=id)
                
            except NAT_DNAT_SNAT.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            o.delete()
            if keyword != '':
                q = get_natdnatsnat_query(keyword)
                total = NAT_DNAT_SNAT.objects.filter(q).count()
                
            else:
                total = NAT_DNAT_SNAT.objects.count()
                
            if total < pgsize or pgsize < 1:
                pgsize = total
        
            s = get_item_msg(total, pgsize, pgnum)
            if request.is_ajax():
                return HttpResponse(u'success|%s' % s)
            
            else:
                return HttpResponseRedirect('/nat/dnatsnat/')
            
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
def natdnatsnat_list(request):
    template = 'nat/natdnatsnat_list.html'
    return process_natdnatsnat(request, template)

@login_required
@admin_access_required
def natdnatsnat_page(request):
    dic = {
           'title': _(u'DNAT/SNAT'),
           'searchform': NATSearchForm(),
           'hide_search_selection': True,
           'template': 'nat/natdnatsnat_page.html',
           'add_label': _(u'New NAT rule ...'),
           'dialog_title': _(u'Edit NAT rule')
           }
    return get_page_list(request, NAT_DNAT_SNAT, dic)