from django.http import *
from django.shortcuts import *
from forms import *
from models import *
from search import *
from proxynow5_proj.proxynow5.utils import *
from proxynow5_proj.proxynow5.Settings.models import *
from proxynow5_proj.proxynow5.Settings.views import *
from proxynow5_proj.proxynow5.Definition_Network.forms import *
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, InvalidPage
from django.template.context import RequestContext
from django.utils.translation import ugettext as _
from proxynow5_proj.proxynow5.forms import NavigateForm
from proxynow5_proj.proxynow5.exceptions import UIException
from django.template.loader import get_template
from django.db import transaction

#===============================================================================
# Network interface views
#===============================================================================
@login_required
@admin_access_required
def netint_save(request):
    form_title = ADD_NETINT_FORM_TITLE
    if request.method == 'POST':
        form = NetIntForm(request.POST)
        if form.is_valid():
            try:
                if request.is_ajax():
                    form.save(request)
                    return HttpResponse(u'success')
                
                else:
                    return HttpResponseRedirect('/netint/save/')
                
            except UIException, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
        
    elif 'id' in request.GET:
        form_title = EDIT_NETINT_FORM_TITLE
        id = request.GET['id']
        clone = ''
        if 'clone' in request.GET:
            clone = request.GET['clone']
            form_title = ADD_NETINT_FORM_TITLE
            
        try:
            o = NetInt.objects.get(id=id)
            name = o.name
            type = o.type
            hardware = o.hardware
            address = o.address
            netmask = o.netmask
            gateway = o.gateway
            mtu = o.mtu
            comment = o.comment
            form = NetIntForm({'name': name,
                               'type': type,
                               'hardware': hardware,
                               'address': address,
                               'netmask': netmask,
                               'gateway': gateway,
                               'mtu': mtu,
                               'comment': comment})
            
        except NetInt.DoesNotExist:
            pass
        
    else:
        form = NetIntForm()
        
    variables = RequestContext(request, {'form': form,
                                         'form_title': form_title})
    return render_to_response('netint/netint_save_form.html', variables)

@login_required
@admin_access_required
@transaction.commit_on_success
def netint_delete(request):
    if request.method == 'POST':
        if 'id' in request.POST:
            id = request.POST['id']
            pgsize = int(request.POST['pgsize'])
            pgnum = int(request.POST['pgnum'])
            search_by = request.POST.get('find', '')
            keyword = request.POST.get('text', '')
            confirm = request.POST.get('confirm', '')
            try:
                o = NetInt.objects.get(id=id)
                
            except NetInt.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            if confirm == '':
                n = o.netdhcp_set.count()
                n1 = o.nat_pf_set.count()
                n2 = o.natmasqinterfaces.count()
                show_msg = n > 0 or n1 > 0 or n2 > 0
                if show_msg and request.is_ajax():
                    t = get_template('netint/netint_confirm_delete.html')
                    msg = t.render(RequestContext(request, {'o': o,
                                                            'show_msg': show_msg}))
                    return json_result({'hasgroups': 1,
                                        'msg': msg})
            
            o.delete()
            if (search_by == '0' or search_by == '') and keyword == '':
                total = NetInt.objects.count()
                
            else:
                q = get_netint_query(search_by, keyword)
                total = NetInt.objects.filter(q).count()
            
            if total < pgsize or pgsize < 1:
                pgsize = total
        
            s = get_item_msg(total, pgsize, pgnum)
            if request.is_ajax():
                return json_result({'success': 1,
                                    'itemscount': s})
            
            else:
                return HttpResponseRedirect('/netint/')
            
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
def netint_list(request):
    template = 'netint/netint_list.html'
    return process_netint(request, template)

@login_required
@admin_access_required
def netint_page(request):
    dic = {
           'title': _(u'Interfaces'),
           'searchform': NetIntSearchForm(),
           'template': 'netint/netint_page.html',
           'add_label': _(u'New interface ...'),
           'dialog_title': _(u'Edit interface')
           }
    return get_page_list(request, NetInt, dic)

#===============================================================================
# Load balancing
#===============================================================================
@login_required
@admin_access_required
def get_list_balance(request):
    try:
        obj = ProxynowSettings.objects.get(name__iexact="NetBL")
        value = obj.value
        
    except ProxynowSettings.DoesNotExist:
        value = "0"
        
    objlist = NetInt.objects.all()
    dic = {
           'objlist': objlist,
           'value': value,
           'title': _(u'Link Load Balancing')
           }
    return render_to_response("netlb/netlb_page.html", dic)

@login_required
@admin_access_required
@transaction.commit_on_success
def netlb_savelist(request):
    try:
        if request.method == "POST":
            e = 0
           
            list = request.POST["listBL"]
                
            NetLB.objects.all().delete()
            
            if (list != ""):
                list_inter = list.split(',') 
                for x in list_inter:
                    try: 
                        ob = NetInt.objects.get(id=x)
                        obj = NetLB.objects.create(id=ob)
                        
                    except:
                        e = e + 1
                        pass
            
            if e > 0:
                return UIException("Failed when update the list interface to balance.") 
            
            return HttpResponse("success")
            
    except UIException, ex:
        return HttpResponse("error %s" % ex)

def netlb_toggle(request):
    try:
        if request.method == "POST":
            res = setting_save(request)
            return HttpResponse("success")
            
    except Exception,ex:
        return("error %s" %str(ex)) 
    
#===============================================================================
# Network route views
#===============================================================================
@login_required
@admin_access_required
def netroute_save(request):
    form_title = ADD_NETROUTE_FORM_TITLE
    if request.method == 'POST':
        form = NetRouteForm(request.POST)
        if form.is_valid():
            try:
                if request.is_ajax():
                    form.save(request)
                    return HttpResponse(u'success')
                
                else:
                    return HttpResponseRedirect('/netroute/save/')
                
            except UIException, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
    
    elif 'id' in request.GET:
        form_title = EDIT_NETROUTE_FORM_TITLE
        _id = request.GET['id']
        id = int(_id)
        clone = ''
        if 'clone' in request.GET:
            clone = request.GET['clone']
            form_title = ADD_NETROUTE_FORM_TITLE
            
        comment = ''
        try:
            o = NetRoute.objects.get(id=id)
            comment = o.comment
            dic = {'comment': comment}
            form = NetRouteForm(dic)
            variables = RequestContext(request, {'form': form,
                                                 'o': o,
                                                 'form_title': form_title,
                                                 'dialog1_title': _(u'Add network definition'),
                                                 'dialog1_edit_title': _(u'Edit network definition'),
                                                 'dialog2_title': _(u'Add network definition'),
                                                 'dialog2_edit_title': _(u'Edit network definition')})
            return render_to_response('netroute/netroute_save_form.html', variables)
            
        except NetRoute.DoesNotExist:
            pass
        
    else:
        form = NetRouteForm()
    
    variables = RequestContext(request, {'form': form,
                                         'form_title': form_title,
                                         'dialog1_title': _(u'Add network definition'),
                                         'dialog1_edit_title': _(u'Edit network definition'),
                                         'dialog2_title': _(u'Add network definition'),
                                         'dialog2_edit_title': _(u'Edit network definition')})
    return render_to_response('netroute/netroute_save_form.html', variables)

@login_required
@admin_access_required
@transaction.commit_on_success
def netroute_delete(request):
    if request.method == 'POST':
        if 'id' in request.POST:
            _id = request.POST['id']
            id = int(_id)
            pgsize = int(request.POST['pgsize'])
            pgnum = int(request.POST['pgnum'])
            search_by = request.POST.get('find', '')
            keyword = request.POST.get('text', '')
            try:
                o = NetRoute.objects.get(id=id)
                
            except NetRoute.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            o.delete()
            if (search_by == '0' or search_by == '') and keyword == '':
                total = NetRoute.objects.count()
                
            else:
                q = get_netroute_query(keyword)
                total = NetRoute.objects.filter(q).count()
            
            if total < pgsize or pgsize < 1:
                pgsize = total
        
            s = get_item_msg(total, pgsize, pgnum)
            if request.is_ajax():
                return HttpResponse(u'success|%s' % s)
            
            else:
                return HttpResponseRedirect('/netroute/')
            
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
def netroute_list(request):
    template = 'netroute/netroute_list.html'
    return process_netroute(request, template)

@login_required
@admin_access_required
def netroute_page(request):
    dic = {
           'title': _(u'Routing'),
           'searchform': NetRouteSearchForm(),
           'template': 'netroute/netroute_page.html',
           'add_label': _(u'New route ...'),
           'dialog_title': _('Edit route')
           }
    return get_page_list(request, NetRoute, dic)

@login_required
@admin_access_required
def netroute_gateway_defnet_save(request):
    scope = ''
    level = ''
    if 'scope' in request.GET:
        scope = '-' + request.GET['scope']
        
    if 'level' in request.GET:
        level = '_' + request.GET['level']
        
    form = DefNetForm()
    form1 = DefNetHostForm()
    form2 = DefNetDNSHostForm()
    form.set_netroutegateway_choices()
    variables = RequestContext(request, {'form': form,
                                         'form1': form1,
                                         'form2': form2,
                                         'level': level,
                                         'scope': scope,
                                         'dialog_title': _(u'Add network definition')})
    return render_to_response('defnet/defnet_save_form.html', variables)

#===============================================================================
# Network DHCP server
#===============================================================================
@login_required
@admin_access_required
def netdhcp_save(request):
    form_title = ADD_NETDHCP_FORM_TITLE
    if request.method == 'POST':
        form = NetDHCPForm(request.POST)
        if form.is_valid():
            try:
                if request.is_ajax():
                    form.save(request)
                    return HttpResponse(u'success')
                
                else:
                    return HttpResponseRedirect('/netdhcp/save/')
                
            except UIException, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
        
    elif 'netid' in request.GET:
        form_title = EDIT_NETDHCP_FORM_TITLE
        netid = request.GET['netid']
        if 'clone' in request.GET:
            form_title = ADD_NETDHCP_FORM_TITLE
            
        try:
            o = NetDHCP.objects.get(netid=netid)
            start = o.start
            end = o.end
            dnsserver1 = o.dnsserver1
            dnsserver2 = o.dnsserver2
            gateway = o.gateway
            domain = o.domain
            leasetime = o.leasetime
            form = NetDHCPForm({'netid': netid,
                                'start': start,
                                'end': end,
                                'dnsserver1': dnsserver1,
                                'dnsserver2': dnsserver2,
                                'gateway': gateway,
                                'domain': domain,
                                'leasetime': leasetime})
            
        except NetDHCP.DoesNotExist:
            pass
        
    else:
        form = NetDHCPForm()
        
    variables = RequestContext(request, {'form': form,
                                         'form_title': form_title})
    return render_to_response('netdhcp/netdhcp_save_form.html', variables)

@login_required
@admin_access_required
@transaction.commit_on_success
def netdhcp_delete(request):
    if request.method == 'POST':
        if 'netid' in request.POST:
            netid = request.POST['netid']
            pgsize = int(request.POST['pgsize'])
            pgnum = int(request.POST['pgnum'])
            keyword = request.POST.get('text', '')
            try:
                o = NetDHCP.objects.get(netid=netid)
                
            except NetDHCP.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            o.delete()
            if keyword != '':
                q = get_netdhcp_query(keyword)
                total = NetDHCP.objects.filter(q).count()
                
            else:
                total = NetDHCP.objects.count()
            
            if total < pgsize or pgsize < 1:
                pgsize = total
        
            s = get_item_msg(total, pgsize, pgnum)
            if request.is_ajax():
                return HttpResponse(u'success|%s' % s)
            
            else:
                return HttpResponseRedirect('/netdhcp/')
            
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
def netdhcp_list(request):
    template = 'netdhcp/netdhcp_list.html'
    return process_netdhcp(request, template)

@login_required
@admin_access_required
def netdhcp_page(request):
    dic = {
           'title': _(u'DHCP'),
           'searchform': NetDHCPSearchForm(),
           'hide_search_selection': True,
           'template': 'netdhcp/netdhcp_page.html',
           'add_label': _(u'New DHCP server ...'),
           'dialog_title': _(u'Edit DHCP server')
           }
    return get_page_list(request, NetDHCP, dic)

#===============================================================================
# Network DNS
#===============================================================================
@login_required
@admin_access_required
def netdns_page(request):
    allow_net = NetDNSAllowNet.objects.all()
    relay = NetDNSRelay.objects.all()
    variables = RequestContext(request, {'allow_net': allow_net,
                                         'relay': relay,
                                         'dialog_title': _(u'DNS'),
                                         'dialog1_title': _(u'Add network definition'),
                                         'dialog1_edit_title': _(u'Edit network definition'),
                                         'dialog2_title': _(u'Add network definition'),
                                         'dialog2_edit_title': _(u'Edit network definition')})
    return render_to_response('netdns/netdns_page.html', variables)

@login_required
@admin_access_required
@transaction.commit_on_success
def netdns_allownet_save(request):
    if request.method == 'POST':
        data = request.POST['data']
        
        ids = data.split(',')
        fail_list = []
        for id in ids:
            try:
                m = get_object_or_404(DefNet, id=id)
                o = NetDNSAllowNet.objects.create(id=m)
                
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
def netdns_allownet_delete(request):
    if request.method == 'POST':
        if 'id' in request.POST:
            _id = request.POST['id']
            id = int(_id)
            try:
                o = NetDNSAllowNet.objects.get(id=id)
                
            except NetDNSAllowNet.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            o.delete()
            return HttpResponse(u'success')
        
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
@transaction.commit_on_success
def netdns_relay_save(request):
    if request.method == 'POST':
        data = request.POST['data']
        
        ids = data.split(',')
        fail_list = []
        for id in ids:
            try:
                m = get_object_or_404(DefNet, id=id)
                o = NetDNSRelay.objects.create(id=m)
                
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
def netdns_relay_delete(request):
    if request.method == 'POST':
        if 'id' in request.POST:
            _id = request.POST['id']
            id = int(_id)
            try:
                o = NetDNSRelay.objects.get(id=id)
                
            except NetDNSRelay.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            o.delete()
            return HttpResponse(u'success')
        
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
def netdns_relay_defnet_save(request):
    scope = ''
    level = ''
    if 'scope' in request.GET:
        scope = '-' + request.GET['scope']
        
    if 'level' in request.GET:
        level = '_' + request.GET['level']
        
    form = DefNetForm()
    form1 = DefNetHostForm()
    form2 = DefNetDNSHostForm()
    form.set_netdnsrelay_choices()
    variables = RequestContext(request, {'form': form,
                                         'form1': form1,
                                         'form2': form2,
                                         'level': level,
                                         'scope': scope,
                                         'dialog_title': _(u'Add network definition')})
    return render_to_response('defnet/defnet_save_form.html', variables)