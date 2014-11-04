from django.http import *
from django.shortcuts import *
from forms import *
from models import *
from search import *
from proxynow5_proj.proxynow5.utils import *
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
def defservices_info(request):
    id = 0
    type = 1
    form = DefServicesForm()
    try:
        _id = request.GET.get('id', '0')
        id = int(_id)
        o = DefServices.objects.get(id=id)
        type = o.type
        
    except:
        o = DefServices()
        
    if type == 1:
        defservicestcp = o.defservicestcp_set.get(id=o)
        form1 = DefServicesTCPForm()
        variables = RequestContext(request, {'o': o,
                                             'o1': defservicestcp,
                                             'form': form,
                                             'form1': form1})
        
    elif type == 2:
        defservicesudp = o.defservicesudp_set.get(id=o)
        form2 = DefServicesUDPForm()
        variables = RequestContext(request, {'o': o,
                                             'o2': defservicesudp,
                                             'form': form,
                                             'form2': form2})
        
    elif type == 3:
        defservicesicmp = o.defservicesicmp_set.get(id=o)
        form3 = DefServicesICMPForm()
        variables = RequestContext(request, {'o': o,
                                             'o3': defservicesicmp,
                                             'form': form,
                                             'form3': form3})
        
    elif type == 4:
        defservicesip = o.defservicesip_set.get(id=o)
        form4 = DefServicesIPForm()
        variables = RequestContext(request, {'o': o,
                                             'o4': defservicesip,
                                             'form': form,
                                             'form4': form4})
        
    elif type == 5:
        members = o.defservicesgroup_set.filter(gid=o)
        variables = RequestContext(request, {'o': o,
                                             'members': members,
                                             'form': form})
        
    else:
        variables = RequestContext(request, {'o': o,
                                             'form': form})
        
    t = get_template('defservices/defservices_info.html')
    content = t.render(variables)
    return json_result({'id': id,
                        'content': content})

@login_required
@admin_access_required
def defservices_save(request):
    scope = ''
    level = ''
    form_title = ADD_FORM_TITLE
    
    if 'scope' in request.GET:
        scope = '-' + request.GET['scope']
        
    if request.method == 'GET' and 'level' in request.GET:
        level = '_' + request.GET['level']
        
    if request.method == 'POST':
        form = DefServicesForm(request.POST)
        if form.is_valid():
            try:
                if request.is_ajax():
                    inner_form, o = form.save(request)
                    if inner_form != None:
                        return json_form_error(inner_form)
                    
                    elif 'level' in request.POST and o != None:
                        return json_result({'success': 1,
                                            'id': o.id,
                                            'name': o.get_html_repr()})
                    
                    else:
                        return HttpResponse(u'success')
                
                else:
                    return HttpResponseRedirect('/defservices/save/')
                
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
            
        name = ''
        type = 1
        comment = ''
        try:
            o = DefServices.objects.get(id=id)
            name = o.name
            type = o.type
            comment = o.comment
            dic = {'name': name,
                   'type': type,
                   'comment': comment}
            form = get_defservices_form(type, clone, dic)
            if type == 1:
                defservicestcp = o.defservicestcp_set.get(id=o)
                dstport = defservicestcp.dstport
                srcport = defservicestcp.srcport
                form1 = DefServicesTCPForm({'dstport': dstport,
                                            'srcport': srcport})
                variables = RequestContext(request, {'form': form,
                                                     'form1': form1,
                                                     'type': type,
                                                     'level': level,
                                                     'scope': scope,
                                                     'form_title': form_title,
                                                     'dialog_title': _(u'Add service definition'),
                                                     'dialog_edit_title': _(u'Edit service definition')})
                return render_to_response('defservices/defservices_save_form.html', variables)
                
            elif type == 2:
                defservicesudp = o.defservicesudp_set.get(id=o)
                dstport = defservicesudp.dstport
                srcport = defservicesudp.srcport
                form2 = DefServicesUDPForm({'dstport': dstport,
                                            'srcport': srcport})
                variables = RequestContext(request, {'form': form,
                                                     'form2': form2,
                                                     'type': type,
                                                     'level': level,
                                                     'scope': scope,
                                                     'form_title': form_title,
                                                     'dialog_title': _(u'Add service definition'),
                                                     'dialog_edit_title': _(u'Edit service definition')})
                return render_to_response('defservices/defservices_save_form.html', variables)
                
            elif type == 3:
                defservicesicmp = o.defservicesicmp_set.get(id=o)
                icmptype = defservicesicmp.type
                code = defservicesicmp.code
                form3 = DefServicesICMPForm({'icmptype': icmptype,
                                             'code': code})
                variables = RequestContext(request, {'form': form,
                                                     'form3': form3,
                                                     'type': type,
                                                     'level': level,
                                                     'scope': scope,
                                                     'form_title': form_title,
                                                     'dialog_title': _(u'Add service definition'),
                                                     'dialog_edit_title': _(u'Edit service definition'),
                                                     'icmptype_title': _(u'ICMP Types'),
                                                     'icmpcode_title': _(u'ICMP_Codes')})
                return render_to_response('defservices/defservices_save_form.html', variables)
            
            elif type == 4:
                defservicesip = o.defservicesip_set.get(id=o)
                protocol = defservicesip.protocol
                form4 = DefServicesIPForm({'protocol': protocol})
                variables = RequestContext(request, {'form': form,
                                                     'form4': form4,
                                                     'type': type,
                                                     'level': level,
                                                     'scope': scope,
                                                     'form_title': form_title,
                                                     'dialog_title': _(u'Add service definition'),
                                                     'dialog_edit_title': _(u'Edit service definition')})
                return render_to_response('defservices/defservices_save_form.html', variables)
            
            elif type == 5:
                members = o.defservicesgroup_set.filter(gid=o)
                variables = RequestContext(request, {'form': form,
                                                     'type': type,
                                                     'level': level,
                                                     'scope': scope,
                                                     'members': members,
                                                     'form_title': form_title,
                                                     'dialog_title': _(u'Add service definition'),
                                                     'dialog_edit_title': _(u'Edit service definition')})
                return render_to_response('defservices/defservices_save_form.html', variables)
            
        except DefServices.DoesNotExist:
            pass
    
    else:
        form = DefServicesForm()
        form1 = DefServicesTCPForm()
        form2 = DefServicesUDPForm()
        form3 = DefServicesICMPForm()
        form4 = DefServicesIPForm()
        
    variables = RequestContext(request, {'form': form,
                                         'form1': form1,
                                         'form2': form2,
                                         'form3': form3,
                                         'form4': form4,
                                         'level': level,
                                         'scope': scope,
                                         'form_title': form_title,
                                         'dialog_title': _(u'Add service definition'),
                                         'dialog_edit_title': _(u'Edit service definition'),
                                         'icmptype_title': _(u'ICMP Types'),
                                         'icmpcode_title': _(u'ICMP_Codes')})
    return render_to_response('defservices/defservices_save_form.html', variables)

@login_required
@transaction.commit_on_success
def defservices_delete(request):
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
                o = DefServices.objects.get(id=id)
                
            except DefServices.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            if confirm == '':
                n = o.defservicesgroups.count()
                n1 = o.natpforiginalports.count()
                n2 = o.natpfnewservices.count()
                n3 = o.natdnatsnatoriginalports.count()
                n4 = o.natdnatsnatnewdestinationports.count()
                n5 = o.natdnatsnatnewsourceports.count()
                show_msg = n > 0 or n1 > 0 or n2 > 0 or n3 > 0 or n4 > 0 or n5 > 0
                if show_msg and request.is_ajax():
                    t = get_template('defservices/defservices_confirm_delete.html')
                    msg = t.render(RequestContext(request, {'o': o,
                                                            'show_msg': show_msg}))
                    return json_result({'hasgroups': 1,
                                        'msg': msg})
            
            o.delete()
            if (search_by == '0' or search_by == '') and keyword == '':
                total = DefServices.objects.count()
                
            else:
                q = get_query(search_by, keyword)
                total = DefServices.objects.filter(q).count()
            
            if total < pgsize or pgsize < 1:
                pgsize = total
        
            s = get_item_msg(total, pgsize, pgnum)
            if request.is_ajax():
                return json_result({'success': 1,
                                    'itemscount': s})
            
            else:
                return HttpResponseRedirect('/defservices/')
            
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
def defservices_list(request):
    template = 'defservices/defservices_list.html'
    return process(request, template)

@login_required
@admin_access_required
def defservices_page(request):
    dic = {
           'title': _(u'Services'),
           'searchform': SearchForm(),
           'template': 'defservices/defservices_page.html',
           'add_label': _(u'New service definition ...'),
           'dialog_title': _(u'Edit service definition')
           }
    return get_page_list(request, DefServices, dic)

def defservices_icmp_types(request):
    level = ''
    if request.method == 'GET' and 'level' in request.GET:
        level = '_' + request.GET['level']
        
    variables = RequestContext(request, {'types': ICMP_TYPES,
                                         'level': level})
    return render_to_response('defservices/icmp_types.html', variables)

def defservices_icmp_codes(request):
    level = ''
    if request.method == 'GET' and 'level' in request.GET:
        level = '_' + request.GET['level']
        
    if 'type' in request.GET:
        t = request.GET['type']
        codes = get_icmp_codes(t)
        variables = RequestContext(request, {'codes': codes,
                                             'level': level})
        return render_to_response('defservices/icmp_codes.html', variables)
    
    return HttpResponse(u'invalid type')

#===============================================================================
# Views for list selection
#===============================================================================
@login_required
@admin_access_required
def defservices_list_panel(request):
    objlist = DefServices.objects.all()
    form = FilterForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('defservices/defservices_list_panel.html', variables)

@login_required
@admin_access_required
def defservices_list_select(request):
    objlist = process_filter(request)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('defservices/defservices_list_select.html', variables)

@login_required
@admin_access_required
def defservices_list_panel_custom1(request):
    objlist = DefServices.objects.all()
    form = FilterForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('defservices/defservices_list_panel.html', variables)

@login_required
@admin_access_required
def defservices_list_select_custom1(request):
    objlist = process_filter(request)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('defservices/defservices_list_select.html', variables)