from time import *
import httplib, urllib
from datetime import datetime
from django.utils.translation import ugettext as _

STATUS_USED = 'Used'
STATUS_UNKNOWN = 'Unknown'
STATUS_INTERNAL_ERROR = 'Internal_error'

STATUS_SUCCESS = 'Success'
STATUS_INVALID_TOKEN = 'Invalid_token'

STATUS_NOT_EXPIRED = 'Not_expired'
STATUS_EXPIRED = 'Expired'
STATUS_INVALID_MODULE_ID = 'Invalid_module_ID'

PARAM_KEY = 'key'
PARAM_TOKEN = 'identity_id'
PARAM_MODULE_ID = 'module_id'
PARAM_TIMEZONE = 'timezone'

WARNING_REMINDER_DAYS = 14

UNKNOWN_RESPONSE = _(u'Unknown response')

def connect():
    conn = httplib.HTTPSConnection('license.internetnow.com.my')
    return conn

def close_connection(conn):
    try:
        if not conn is None:
            conn.close()
            
    except:
        pass

def activate(conn, key):
    params = urllib.urlencode({'key': key})
    headers = {'Content-type': 'application/x-www-form-urlencoded',
               'Accept': 'text/plain'}
    conn.request('POST', '/activate.aspx', params, headers)
    resp = conn.getresponse()
    if resp.status == 200:
        data = resp.read()
        return get_activate_status(data)
    
    return False, UNKNOWN_RESPONSE

def deactivate(conn, key, token):
    params = urllib.urlencode({PARAM_KEY: key,
                               PARAM_TOKEN: token})
    headers = {'Content-type': 'application/x-www-form-urlencoded',
               'Accept': 'text/plain'}
    conn.request('POST', '/deactivate.aspx', params, headers)
    resp = conn.getresponse()
    if resp.status == 200:
        data = resp.read()
        return get_deactivate_status(data)
    
    return False, UNKNOWN_RESPONSE

def read_info(conn, key, token):
    params = urllib.urlencode({PARAM_KEY: key,
                               PARAM_TOKEN: token})
    headers = {'Content-type': 'application/x-www-form-urlencoded',
               'Accept': 'text/plain'}
    conn.request('POST', '/read_license_field2.aspx', params, headers)
    resp = conn.getresponse()
    if resp.status == 200:
        data = resp.read()
        return get_info(data)
    
    return {}, UNKNOWN_RESPONSE

def check_expiry(conn, key, token, modid):
    timezone = get_timezone()
    params = urllib.urlencode({PARAM_KEY: key,
                               PARAM_TOKEN: token,
                               PARAM_MODULE_ID: modid,
                               PARAM_TIMEZONE: timezone})
    headers = {'Content-type': 'application/x-www-form-urlencoded',
               'Accept': 'text/plain'}
    conn.request('POST', '/check_expiry.aspx', params, headers)
    resp = conn.getresponse()
    if resp.status == 200:
        data = resp.read()
        return get_expiry_status(data)
    
    return False, False, UNKNOWN_RESPONSE

def check_license_status(key, token):
    conn = None
    info = {}
    msg = ''
    try:
        conn = connect()
        info, msg = read_info(conn, key, token)
        
    except:
        pass
    
    finally:
        close_connection(conn)
        
    return info, msg

#===============================================================================
# Helper methods
#===============================================================================
def get_info(resp):
    dic = {}
    if 'Success,' in resp:
        o = resp.split(',')
        n = len(o)
        for i in range(1, n, 2):
            dic[o[i]] = o[i + 1]
            
        return dic, ''
    
    elif resp == STATUS_INTERNAL_ERROR:
        return dic, _(u'The licensing server is currently have an internal error.')
    
    return dic, UNKNOWN_RESPONSE

def get_expiry_status(resp):
    if resp == STATUS_NOT_EXPIRED:
        return True, False, ''
    
    elif resp == STATUS_EXPIRED:
        return True, True, ''
    
    elif resp == STATUS_INVALID_TOKEN:
        return False, False, _(u'The activation key and identity token passed do not match up. Checking failed.')
    
    elif resp == STATUS_INVALID_MODULE_ID:
        return False, False, _(u'The module ID passed does not exist for this product.')
    
    elif resp == STATUS_INTERNAL_ERROR:
        return False, False, _(u'The licensing server is currently have an internal error. Try again in a few minutes. Checking failed.')
    
    return False, False, UNKNOWN_RESPONSE

def get_activate_status(resp):
    if resp == STATUS_USED:
        return False, _(u'The activation key has been activated before. Activation failed.')
    
    elif resp == STATUS_UNKNOWN:
        return False, _(u'The activation key does not exist on the licensing server database. Activation failed.')
    
    elif resp == STATUS_INTERNAL_ERROR:
        return False, _(u'The licensing server is currently have an internal error. Try again in a few minutes. Activation failed.')
    
    elif 'Success' in resp:
        o = resp.split(',')
        return True, o[1]
    
    return False, UNKNOWN_RESPONSE

def get_deactivate_status(resp):
    if resp == STATUS_SUCCESS:
        return True, ''
    
    elif resp == STATUS_INVALID_TOKEN:
        return False, _(u'The activation key and identity token passed do not match up. Deactivation failed.')
    
    elif resp == STATUS_INTERNAL_ERROR:
        return False, _(u'The licensing server is currently have an internal error. Try again in a few minutes. Deactivation failed.')
    
    return False, UNKNOWN_RESPONSE

def get_timezone():
    offset = timezone / -(3600)
    return offset

def get_datetime_from_dbstr(s):
    try:
        o = datetime.strptime(s, '%Y-%m-%d %H:%M:%S')
        return o
    
    except:
        return datetime.min

def get_fmt_datetime(s):
    o = get_datetime_from_dbstr(s)
    return o.strftime('%d %b %Y %H:%M:%S')

def get_fmt_date(s):
    o = get_datetime_from_dbstr(s)
    return o.strftime('%d %b %Y')

def get_datetime_str(o):
    return o.strftime('%d %b %Y %H:%M:%S')

def show_warning_reminder(dt):
    o = dt - datetime.utcnow()
    if o.days > 0 and o.days <= WARNING_REMINDER_DAYS:
        return True, o.days
    
    return False, 0

def get_default_info(key, token):
    default_val = _(u'Not activated')
    info = {'ActivationKey': key,
            'IdentityToken': token,
            'PN_EXPIRY_DATE': default_val,
            'PN_WEBPROXY_EXPIRY_DATE': default_val,
            'PN_No_of_Users': default_val,
            'PN_RESERVED1_EXPIRY_DATE': '',
            'PN_RESERVED2_EXPIRY_DATE': '',
            'PN_RESERVED3_EXPIRY_DATE': '',
            'PN_RESERVED4_EXPIRY_DATE': '',
            'PN_RESERVED5_EXPIRY_DATE': '',
            'ORG_PN_EXPIRY_DATE': datetime.max}
    return info