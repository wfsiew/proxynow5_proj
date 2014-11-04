from django.http import *
from django.shortcuts import *
from forms import *
from models import *
from proxynow5_proj.proxynow5.utils import *
from proxynow5_proj.proxynow5.resourceutils import *
from proxynow5_proj.proxynow5.License.license import *
from proxynow5_proj.proxynow5.License.models import License
from django.contrib.auth.decorators import login_required
from django.template.context import RequestContext
from django.utils.translation import ugettext as _
from django.template.loader import get_template
from datetime import datetime

@login_required
@admin_access_required
def dashboard_page(request):
    currdate, dashboard, niclist = get_dashboard_info()
    lic = get_license_status()
    form = RefreshForm()
    hd_info = GetHD()
    swap_info = GetSwapMem()
    ram_info = GetPhysicalMem()
    cpu_info = GetCPU(value=False)
    ram_total = get_total_ram(ram_info)
    swap_total = get_total_swap(swap_info)
    hd_total = get_total_hd(hd_info)
    if dashboard is None:
        dashboard = Dashboard(cpu=cpu_info, ram=ram_info[1], swap=swap_info[1], hd=hd_info[1],
                              version='', avpattern='', request=0, block=0, malware=0)
    variables = RequestContext(request, {'title': _(u'Dashboard for'),
                                         'currdate': currdate,
                                         'form': form,
                                         'dashboard': dashboard,
                                         'lic': lic,
                                         'ram_total': ram_total,
                                         'swap_total': swap_total,
                                         'hd_total': hd_total,
                                         'niclist': niclist})
    return render_to_response('dashboard/dashboard_page.html', variables)

@login_required
@admin_access_required
def dashboard_data(request):
    currdate, o, niclist = get_dashboard_info()
    t = get_template('dashboard/dashboard_nic_list.html')
    nic = t.render(RequestContext(request, {'niclist': niclist}))
    dic = None
    try:
        info = get_resource_info()
        if o == None:
            dic = {'currdate': currdate,
                   'cpu': info['cpu'],
                   'ram': info['ram'],
                   'swap': info['swap'],
                   'hd': info['hd'],
                   'avpattern': '',
                   'request': 0,
                   'block': 0,
                   'malware': 0,
                   'niclist': nic}
            
        else:
            dic = {'currdate': currdate,
                   'cpu': info['cpu'],
                   'ram': info['ram'],
                   'swap': info['swap'],
                   'hd': info['hd'],
                   'avpattern': o.avpattern,
                   'request': o.request,
                   'block': o.block,
                   'malware': o.malware,
                   'niclist': nic}
        
    except Exception as err:
        dic = {'currdate': currdate,
               'error': 1}
        print err
        
    print dic
    return json_result(dic)

def get_dashboard_info():
    datenow = datetime.now()
    currdate = datenow.strftime('%a %b %d %H:%M:%S %Y')
    dashboard = None
    dashboardcount = 0
    try:
        dashboardcount = Dashboard.objects.count()
        
    except:
        pass
    
    if dashboardcount > 0:
        dashboard = Dashboard.objects.all()[0]
        
    niclist = DashboardNIC.objects.all()
    return currdate, dashboard, niclist

def get_resource_info():
    hd_info = GetHD()
    swap_info = GetSwapMem()
    ram_info = GetPhysicalMem()
    cpu_info = GetCPU()
    print hd_info
    print ram_info
    print cpu_info
    
    dic = {'cpu': cpu_info,
           'ram': ram_info[1],
           'swap': swap_info[1],
           'hd': hd_info[1]}
    
    print dic 
    
    return dic

def get_license_status():
    dic = {}
    statusmsg = _(u'Not activated')
    try:
        o = License.objects.all()[0]
        info, msg = get_license_info(o.activationkey, o.identitytoken, None)
        if info['PN_EXPIRY_DATE'] != statusmsg:
            statusmsg = _(u'Activated')
            dic = {'status': statusmsg,
                   'basesoftware': info['PN_EXPIRY_DATE'],
                   'webproxy': info['PN_WEBPROXY_EXPIRY_DATE']}
            
        else:
            dic = {'status': statusmsg,
                   'basesoftware': statusmsg,
                   'webproxy': statusmsg}
        
    except:
        dic = {'status': statusmsg,
               'basesoftware': statusmsg,
               'webproxy': statusmsg}
        
    return dic

def get_license_info(key, token, conn=None):
    _conn = None
    info = {}
    msg = ''
    try:
        if conn is None:
            _conn = connect()
            
        else:
            _conn = conn
            
        _info, msg = read_info(_conn, key, token)
        info = convert_info(_info)
        
    except:
        info = get_default_info(key, token)
        
    finally:
        if conn is None:
            close_connection(_conn)
            
    return info, msg

def convert_info(info):
    dic = {'ActivationKey': info['ActivationKey'],
           'IdentityToken': info['IdentityToken'],
           'PN_EXPIRY_DATE': get_fmt_date(info['PN_EXPIRY_DATE']),
           'PN_WEBPROXY_EXPIRY_DATE': get_fmt_date(info['PN_WEBPROXY_EXPIRY_DATE']),
           'DateOfActivation': get_fmt_datetime(info['DateOfActivation']),
           'PN_No_of_Users': int(info['PN_No_of_Users']),
           'PN_RESERVED1_EXPIRY_DATE': get_fmt_datetime(info['PN_RESERVED1_EXPIRY_DATE']),
           'PN_RESERVED2_EXPIRY_DATE': get_fmt_datetime(info['PN_RESERVED2_EXPIRY_DATE']),
           'PN_RESERVED3_EXPIRY_DATE': get_fmt_datetime(info['PN_RESERVED3_EXPIRY_DATE']),
           'PN_RESERVED4_EXPIRY_DATE': get_fmt_datetime(info['PN_RESERVED4_EXPIRY_DATE']),
           'PN_RESERVED5_EXPIRY_DATE': get_fmt_datetime(info['PN_RESERVED5_EXPIRY_DATE']),
           'ORG_PN_EXPIRY_DATE': get_datetime_from_dbstr(info['PN_EXPIRY_DATE'])}
    return dic

def get_total_ram(ram_info):
    try:
        val = ram_info[0]
        v = round(val / 1048576, 1)
        return '%s MB' % v
    
    except:
        return '0 MB'
    
def get_total_swap(swap_info):
    try:
        val = swap_info[0]
        v = round(val / 1048576, 1)
        return '%s MB' % v
    
    except:
        return '0 MB'

def get_total_hd(hd_info):
    try:
        val = hd_info[0]
        v = round(val / 1073741824, 1)
        return '%s GB' % v
    
    except:
        return '0 GB'