from django.contrib.auth import REDIRECT_FIELD_NAME
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.paginator import Paginator, InvalidPage
from django.db import transaction
from django.db.models import Q
from django.http import *
from django.shortcuts import *
from django.template.context import RequestContext
from django.template.loader import get_template
from django.utils.translation import ugettext as _
from forms import *
from models import *
from proxynow5_proj.proxynow5.Wizard.process_session import get_allitems_session
from proxynow5_proj.proxynow5.exceptions import UIException
from proxynow5_proj.proxynow5.forms import NavigateForm
from proxynow5_proj.proxynow5.utils import *
from search import *
   
def defnet_save_temp(request):
    print request.GET
    return defnet_save(request)

@custom_login_required
def defnet_save(request):
    scope = ''
    level = ''
    form_title = ADD_FORM_TITLE
    
    if 'scope' in request.GET:
        scope = '-' + request.GET['scope']
        
    if request.method == 'GET' and 'level' in request.GET:
        level = '_' + request.GET['level']
    
    if request.method == 'POST':
        form = DefNetForm(request.POST)
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
                    return HttpResponseRedirect('/defnet/save/')
                
            except UIException, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
        
    elif 'id' in request.GET:
        form_title = EDIT_FORM_TITLE
        _id = request.GET['id']
        id = int(_id)
        clone = ''
        
        wiz = request.GET.get('wiz' ,'')    
        
        if 'clone' in request.GET:
            clone = request.GET['clone']
            form_title = ADD_FORM_TITLE
            
        name = ''
        type = 1
        comment = ''
        try:
            if wiz == '':
                o = DefNet.objects.get(id=id)
                
            else:
                [lstnet, lstnettype] = get_items_session_byid(request, STORE_HOST, id)
                
                if not lstnet is None:
                    o = lstnet
                    wpnet = lstnettype
                    
                else: 
                    o = DefNet()
                    
            name = o.name
            type = o.type
            comment = o.comment
            dic = {'name': name,
                   'type': type,
                   'comment': comment}
            form = get_defnet_form(type, clone, dic)
            if type == 1:
                if wiz == '':
                    defnethost = o.defnethost_set.get(id=o)
                    host = defnethost.host
                    form1 = DefNetHostForm({'host': host})
                    
                else:
                    print 
                    host = wpnet.host
                    form1 = DefNetHostForm({'host': host})
                    
                variables = RequestContext(request, {'form': form,
                                                     'form1': form1,
                                                     'type': type,
                                                     'level': level,
                                                     'scope': scope,
                                                     'form_title': form_title,
                                                     'dialog_title': _(u'Add network definition'),
                                                     'dialog_edit_title': _(u'Edit user definition')})
                return render_to_response('defnet/defnet_save_form.html', variables)
                
            elif type == 2:
                if wiz == '':
                    defnetdnshost = o.defnetdnshost_set.get(id=o)
                    hostname = defnetdnshost.hostname
                    form2 = DefNetDNSHostForm({'hostname': hostname})
                    
                else:
                    hostname = wpnet.hostname
                    form2 = DefNetDNSHostForm({'hostname': hostname})
                    
                variables = RequestContext(request, {'form': form,
                                                     'form2': form2,
                                                     'type': type,
                                                     'level': level,
                                                     'scope': scope,
                                                     'form_title': form_title,
                                                     'dialog_title': _(u'Add network definition'),
                                                     'dialog_edit_title': _(u'Edit user definition')})
                return render_to_response('defnet/defnet_save_form.html', variables)
                
            elif type == 3:
                if wiz == '':
                    defnetnetwork = o.defnetnetwork_set.get(id=o)
                    ipaddress = defnetnetwork.ipaddress
                    netmask = defnetnetwork.netmask
                    
                else:
                    ipaddress = wpnet.ipaddress
                    netmask = wpnet.netmask
                    
                form3 = DefNetNetworkForm({'ipaddress': ipaddress,
                                           'netmask': netmask})
                variables = RequestContext(request, {'form': form,
                                                     'form3': form3,
                                                     'type': type,
                                                     'level': level,
                                                     'scope': scope,
                                                     'form_title': form_title,
                                                     'dialog_title': _(u'Add network definition'),
                                                     'dialog_edit_title': _(u'Edit user definition')})
                return render_to_response('defnet/defnet_save_form.html', variables)
            
            elif type == 4:
                members = o.defnetgroup_set.filter(gid=o)
                variables = RequestContext(request, {'form': form,
                                                     'type': type,
                                                     'members': members,
                                                     'level': level,
                                                     'scope': scope,
                                                     'form_title': form_title,
                                                     'dialog_title': _(u'Add network definition'),
                                                     'dialog_edit_title': _(u'Edit user definition')})
                return render_to_response('defnet/defnet_save_form.html', variables)
            
        except DefNet.DoesNotExist:
            pass
    
    else:
        form = DefNetForm()
        form1 = DefNetHostForm()
        form2 = DefNetDNSHostForm()
        form3 = DefNetNetworkForm()
        
    variables = RequestContext(request, {'form': form,
                                         'form1': form1,
                                         'form2': form2,
                                         'form3': form3,
                                         'level': level,
                                         'scope': scope,
                                         'form_title': form_title,
                                         'dialog_title': _(u'Add network definition'),
                                         'dialog_edit_title': _(u'Edit network definition')})
    return render_to_response('defnet/defnet_save_form.html', variables)

@login_required
@admin_access_required
@transaction.commit_on_success
def defnet_delete(request):
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
                o = DefNet.objects.get(id=id)
                
            except DefNet.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            if confirm == '':
                n = o.defnetgroups.count()
                n1 = o.netroute_set.count()
                n2 = o.netdnsallownet_set.count()
                n3 = o.netdnsrelay_set.count()
                n4 = o.netroutegateways.count()
                n5 = o.appctrlskiplistnets.count()
                n6 = o.appctrlfornets.count()
                n7 = o.wpadvance_set.count()
                n8 = o.wpadvanceskip_set.count()
                n9 = o.wpnets.count()
                n10 = o.wpprofileexceptnets.count()
                n11 = o.natpfhosts.count()
                n12 = o.nat_masq_set.count()
                n13 = o.nat_dnat_snat_set.count()
                n14 = o.natdnatsnatoriginaldestinations.count()
                n15 = o.natdnatsnatnewdestinationhosts.count()
                n16 = o.natdnatsnatnewsourceaddresses.count()
                n17 = o.nettrusted_set.count()
                show_msg = n > 0 or n1 > 0 or n2 > 0 or n3 > 0 or n4 > 0 or n5 > 0 or n6 > 0 or n7 > 0 or n8 > 0 or n9 > 0 or n10 > 0 or \
                    n11 > 0 or n12 > 0 or n13 > 0 or n14 > 0 or n15 > 0 or n16 > 0 or n17 > 0
                if show_msg and request.is_ajax():
                    t = get_template('defnet/defnet_confirm_delete.html')
                    msg = t.render(RequestContext(request, {'o': o,
                                                            'show_msg': show_msg}))
                    return json_result({'hasgroups': 1,
                                        'msg': msg})
            
            o.delete()
            if (search_by == '0' or search_by == '') and keyword == '':
                total = DefNet.objects.count()
                
            else:
                q = get_query(search_by, keyword)
                total = DefNet.objects.filter(q).count()
            
            if total < pgsize or pgsize < 1:
                pgsize = total
        
            s = get_item_msg(total, pgsize, pgnum)
            if request.is_ajax():
                return json_result({'success': 1,
                                    'itemscount': s})
            
            else:
                return HttpResponseRedirect('/defnet/')
            
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
def defnet_list(request):
    template = 'defnet/defnet_list.html'
    return process(request, template)

@login_required
@admin_access_required
def defnet_page(request):
    dic = {
           'title': _(u'Networks'),
           'searchform': SearchForm(),
           'template': 'defnet/defnet_page.html',
           'add_label': _(u'New network definition ...'),
           'dialog_title': _(u'Edit network definition')
           }
    return get_page_list(request, DefNet, dic)

@login_required
@admin_access_required
def defnet_info(request):
    id = 0
    type = 1
    form = DefNetForm()
    try:
        _id = request.GET.get('id', '0')
        id = int(_id)
        o = DefNet.objects.get(id=id)
        type = o.type
        
    except:
        o = DefNet()
        
    if type == 1:
        defnethost = o.defnethost_set.get(id=o)
        form1 = DefNetHostForm()
        variables = RequestContext(request, {'o': o,
                                             'o1': defnethost,
                                             'form': form,
                                             'form1': form1})
    
    elif type == 2:
        defnetdnshost = o.defnetdnshost_set.get(id=o)
        form2 = DefNetDNSHostForm()
        variables = RequestContext(request, {'o': o,
                                             'o2': defnetdnshost,
                                             'form': form,
                                             'form2': form2})
        
    elif type == 3:
        defnetnetwork = o.defnetnetwork_set.get(id=o)
        form3 = DefNetNetworkForm()
        variables = RequestContext(request, {'o': o,
                                             'o3': defnetnetwork,
                                             'form': form,
                                             'form3': form3})
    
    elif type == 4:
        members = o.defnetgroup_set.filter(gid=o)
        variables = RequestContext(request, {'o': o,
                                             'members': members,
                                             'form': form})
        
    else:
        variables = RequestContext(request, {'o': o,
                                             'form': form})
    
    t = get_template('defnet/defnet_info.html')
    content = t.render(variables)
    return json_result({'id': id,
                        'content': content})

#===============================================================================
# Views for list selection
#===============================================================================
@login_required
@admin_access_required
def defnet_list_panel(request):
    objlist = DefNet.objects.all()
    form = FilterForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('defnet/defnet_list_panel.html', variables)

@login_required
@admin_access_required
def defnet_list_select(request):
    objlist = process_filter(request)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('defnet/defnet_list_select.html', variables)

@login_required
@admin_access_required
def defnet_list_panel_custom1(request):
    q = Q(type=1) | Q(type=2)
    objlist = DefNet.objects.filter(q)
    form = FilterDNSRelayForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('defnet/defnet_list_panel.html', variables)

@login_required
@admin_access_required
def defnet_list_select_custom1(request):
    objlist = process_filter_custom1(request)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('defnet/defnet_list_select.html', variables)

@login_required
@admin_access_required
def defnet_list_panel_custom2(request):
    objlist = DefNet.objects.all()
    form = FilterForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('defnet/defnet_list_panel.html', variables)

@login_required
@admin_access_required
def defnet_list_select_custom2(request):
    objlist = process_filter(request)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('defnet/defnet_list_select.html', variables)

@login_required
@admin_access_required
def defnet_list_panel_custom3(request):
    q = Q(type=1) | Q(type=2)
    objlist = DefNet.objects.filter(q)
    form = FilterRouteGatewayForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('defnet/defnet_list_panel.html', variables)

@login_required
@admin_access_required
def defnet_list_select_custom3(request):
    objlist = process_filter_custom1(request)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('defnet/defnet_list_select.html', variables)

def defnet_list_panel_temp(request):
    objlist = get_allitems_session(request,STORE_HOST)
    form = FilterForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('defnet/defnet_list_panel.html', variables)

def defnet_list_select_temp(request):
    objlist = get_allitems_session(request,STORE_HOST)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('defnet/defnet_list_select.html', variables)