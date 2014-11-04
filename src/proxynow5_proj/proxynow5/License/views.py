from django.http import *
from django.shortcuts import *
from forms import *
from models import *
from proxynow5_proj.proxynow5.utils import *
from proxynow5_proj.proxynow5.License.license import *
from django.contrib.auth.decorators import login_required
from django.template.context import RequestContext
from django.utils.translation import ugettext as _
from proxynow5_proj.proxynow5.exceptions import UIException
from proxynow5_proj.proxynow5.Definition_User.models import DefUser
from django.template.loader import get_template
from django.db import transaction
from django.db.models import Q
from datetime import datetime

USER_LIMIT_MSG = _(u'The activation key entered has insufficient number of users. You have already created %(x)s users while the key only allows %(y)s users. Please enter another key or delete some of the users.')
WARNING_EXPIRY_MSG = _(u'ProxyNow! 5 will be expiring in %(x)s days.')

@login_required
@admin_access_required
def lic_page(request):
    totalusers = get_total_users()
    showuserlimit = False
    userlimitmsg = ''
    showwarningreminder = False
    expirydaysmsg = ''
    if 'id' in request.GET:
        id = request.GET['id']
        try:
            o = License.objects.get(identitytoken=id)
            form = LicenseForm({'licensekey': o.activationkey})
            info, msg = get_license_info(o.activationkey, o.identitytoken, None, True)
            
            totallicusers = info['PN_No_of_Users']
            if totallicusers < totalusers:
                userlimitmsg = USER_LIMIT_MSG % {'x': totalusers, 'y': totallicusers}
                showuserlimit = True
                
            showwarningreminder, reminderdays = show_warning_reminder(info['ORG_PN_EXPIRY_DATE'])
            if showwarningreminder:
                expirydaysmsg = WARNING_EXPIRY_MSG % {'x': reminderdays}
                
            variables = RequestContext(request, {'form': form,
                                                 'id': id,
                                                 'info': info,
                                                 'totalusers': totalusers,
                                                 'userlimitmsg': userlimitmsg,
                                                 'showuserlimit': showuserlimit,
                                                 'expirydaysmsg': expirydaysmsg,
                                                 'showwarningreminder': showwarningreminder})
            return render_to_response('license/lic_form.html', variables)
        
        except License.DoesNotExist:
            pass
            
    total = License.objects.count()
    id = ''
    info = {}
    if total > 0:
        o = License.objects.all()[0]
        id = o.identitytoken
        form = LicenseForm({'licensekey': o.activationkey})
        info, msg = get_license_info(o.activationkey, o.identitytoken, None, True)
        totallicusers = info['PN_No_of_Users']
        if totallicusers < totalusers:
            userlimitmsg = USER_LIMIT_MSG % {'x': totalusers, 'y': totallicusers}
            showuserlimit = True
            
        showwarningreminder, reminderdays = show_warning_reminder(info['ORG_PN_EXPIRY_DATE'])
        if showwarningreminder:
            expirydaysmsg = WARNING_EXPIRY_MSG % {'x': reminderdays}
        
    else:
        form = LicenseForm()
        info = get_default_info('', '')
    
    variables = RequestContext(request, {'form': form,
                                         'id': id,
                                         'info': info,
                                         'totalusers': totalusers,
                                         'userlimitmsg': userlimitmsg,
                                         'showuserlimit': showuserlimit,
                                         'expirydaysmsg': expirydaysmsg,
                                         'showwarningreminder': showwarningreminder})
    return render_to_response('license/lic_form.html', variables)

@login_required
@admin_access_required
def lic_activate(request):
    conn = None
    contents = ''
    totalusers = get_total_users()
    showuserlimit = False
    userlimitmsg = ''
    showwarningreminder = False
    expirydaysmsg = ''
    if request.method == 'POST':
        form = LicenseForm(request.POST)
        if form.is_valid():
            try:
                key = request.POST['licensekey']
                if request.is_ajax():
                    conn = connect()
                    status, m = activate(conn, key)
                    if status == True:
                        _info, msg = get_license_info(key, m, conn, False)
                        if msg == '':
                            form.save(_info)
                            info = convert_info(_info)
                            totallicusers = info['PN_No_of_Users']
                            if totallicusers < totalusers:
                                userlimitmsg = USER_LIMIT_MSG % {'x': totalusers, 'y': totallicusers}
                                showuserlimit = True
                                
                            showwarningreminder, reminderdays = show_warning_reminder(_info['ORG_PN_EXPIRY_DATE'])
                            if showwarningreminder:
                                expirydaysmsg = WARNING_EXPIRY_MSG % {'x': reminderdays}
            
                            t = get_template('license/lic_info.html')
                            contents = t.render(RequestContext(request, {'info': info,
                                                                         'id': m,
                                                                         'totalusers': totalusers,
                                                                         'userlimitmsg': userlimitmsg,
                                                                         'showuserlimit': showuserlimit}))
                            wt = get_template('license/lic_warning.html')
                            wcontents = wt.render(RequestContext(request, {'expirydaysmsg': expirydaysmsg,
                                                                           'showwarningreminder': showwarningreminder}))
                            _contents = '%s\n%s' % (contents, wcontents)
                            close_connection(conn)
                            conn = None
                            return json_result({'success': 1,
                                                'contents': _contents,
                                                'msg': _(u'The license key was successfully activated.')})
                            
                        else:
                            raise UIException(msg)
                        
                    else:
                        raise UIException(m)
                    
            except UIException, e:
                close_connection(conn)
                return HttpResponse(e)
            
            finally:
                close_connection(conn)
                
        else:
            return json_form_error(form)
                
    return HttpResponse(u'invalid request')

@login_required
@admin_access_required
def lic_deactivate(request):
    conn = None
    info = {}
    contents = ''
    totalusers = get_total_users()
    if request.method == 'POST':
        if 'id' in request.POST:
            try:
                id = request.POST['id']
                o = License.objects.get(identitytoken=id)
                form = LicenseForm(request.POST)
                if form.is_valid():
                    if request.is_ajax():
                        conn = connect()
                        status, m = deactivate(conn, o.activationkey, o.identitytoken)
                        close_connection(conn)
                        conn = None
                        if status == True:
                            info = get_default_info(o.activationkey, o.identitytoken)
                            t = get_template('license/lic_info.html')
                            contents = t.render(RequestContext(request, {'info': info,
                                                                         'id': '',
                                                                         'totalusers': totalusers,
                                                                         'userlimitmsg': '',
                                                                         'showuserlimit': False,
                                                                         'expirydaysmsg': '',
                                                                         'showwarningreminder': False}))
                            return json_result({'success': 1,
                                                'contents': contents,
                                                'msg': _(u'The license key was successfully deactivated.')})
                        
                        else:
                            raise UIException(m)
                
                else:
                    return json_form_error(form)
                
            except License.DoesNotExist:
                close_connection(conn)
                return HttpResponse(_(u'License record not found.'))
                    
            except UIException, e:
                close_connection(conn)
                return HttpResponse(e)
            
            finally:
                close_connection(conn)
                
    return HttpResponse(u'invalid request')

def get_license_info(key, token, conn=None, convert=False):
    _conn = None
    info = {}
    msg = ''
    try:
        if conn is None:
            _conn = connect()
            
        else:
            _conn = conn
            
        _info, msg = read_info(_conn, key, token)
        stat1, exp1, msg1 = _check_expiry(key, token, 0, _conn)
        stat2, exp2, msg2 = _check_expiry(key, token, 1, _conn)
        _info['PN_EXPIRED'] = exp1
        _info['PN_WEBPROXY_EXPIRED'] = exp2
        if convert == True:
            info = convert_info(_info)
            info['PN_EXPIRED'] = exp1
            info['PN_WEBPROXY_EXPIRED'] = exp2
            
        else:
            info = _info
            info['ORG_PN_EXPIRY_DATE'] = get_datetime_from_dbstr(_info['PN_EXPIRY_DATE'])
        
    except:
        info = get_default_info(key, token)
        
    finally:
        if conn is None:
            close_connection(_conn)
        
    return info, msg

def _check_expiry(key, token, mod, conn):
    stat = False
    exp = False
    msg = ''
    try:    
        stat, exp, msg = check_expiry(conn, key, token, mod)
        
    except:
        pass
            
    return stat, exp, msg

def convert_info(info):
    dic = {'ActivationKey': info['ActivationKey'],
           'IdentityToken': info['IdentityToken'],
           'PN_EXPIRY_DATE': get_fmt_datetime(info['PN_EXPIRY_DATE']),
           'PN_WEBPROXY_EXPIRY_DATE': get_fmt_datetime(info['PN_WEBPROXY_EXPIRY_DATE']),
           'DateOfActivation': get_fmt_datetime(info['DateOfActivation']),
           'PN_No_of_Users': int(info['PN_No_of_Users']),
           'PN_RESERVED1_EXPIRY_DATE': get_fmt_datetime(info['PN_RESERVED1_EXPIRY_DATE']),
           'PN_RESERVED2_EXPIRY_DATE': get_fmt_datetime(info['PN_RESERVED2_EXPIRY_DATE']),
           'PN_RESERVED3_EXPIRY_DATE': get_fmt_datetime(info['PN_RESERVED3_EXPIRY_DATE']),
           'PN_RESERVED4_EXPIRY_DATE': get_fmt_datetime(info['PN_RESERVED4_EXPIRY_DATE']),
           'PN_RESERVED5_EXPIRY_DATE': get_fmt_datetime(info['PN_RESERVED5_EXPIRY_DATE']),
           'ORG_PN_EXPIRY_DATE': get_datetime_from_dbstr(info['PN_EXPIRY_DATE'])}
    return dic

def get_total_users():
    total = 0
    try:
        q = Q(type=1)
        ls = DefUser.objects.filter(q)
        total = len(ls)
        
    except:
        pass
    
    return total