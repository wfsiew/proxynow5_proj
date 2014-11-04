from django.shortcuts import *
from encrypt import *
from string import *
from django.http import HttpResponse
from django.conf import settings
from django.utils import simplejson
from django.utils.translation import ugettext as _
from django.core.paginator import Paginator, InvalidPage
from django.views.debug import ExceptionReporter
from proxynow5_proj.proxynow5.forms import NavigateForm
from proxynow5_proj.proxynow5.exceptions import UIException
import proxynow5_proj.proxynow5.Definition_User.models as DefUserModels
import os, urllib, sys, traceback
from datetime import datetime
import dbtracker

VALID_CHARS = "-_.() %s%s" % (ascii_letters, digits)

# decorator to check for admin access
def admin_access_required(f):
    def wrap(request, *args, **kwargs):
        if 'access_type' in request.session:
            if request.session['access_type'] == DefUserModels.DEFUSER_ACCESS_TYPES[1][0]:
                return f(request, *args, **kwargs)
            
        return HttpResponseRedirect('/')
        
    wrap.__doc__ = f.__doc__
    wrap.__name__ = f.__name__
    return wrap

# Custom login request decorator.
def custom_login_required(f):
    def wrap(request, *args, **kwargs):
        #this check the session if userid key exist, if not it will redirect to login page
        if 'iswizard' in request.session:
            if request.session['iswizard'] == "1":
                return f(request, *args, **kwargs)
            
            else:
                if request.user.is_authenticated() == True:
                    return f(request, *args, **kwargs)
                
        else:
            if request.user.is_authenticated() == True:
                return f(request, *args, **kwargs)
            
        return HttpResponseRedirect('/')
            
    wrap.__doc__ = f.__doc__
    wrap.__name__ = f.__name__
    return wrap

def json_form_error(form):
    errors = {'error': 1}
    errors['errors'] = form.errors
    return json_result(errors)

def json_result(dic):
    o = simplejson.dumps(dic)
    return HttpResponse(o, mimetype='application/json')

def get_item_msg(total, pgsize, pgnum):
    x = (pgnum - 1) * pgsize + 1
    y = pgnum * pgsize
    if total < y:
        y = total
        
    if total < 1:
        return ''
    
    else:
        return _(u'%(x)s to %(y)s of %(total)s') % {'x': x, 'y': y, 'total': total}
    
def get_list(request, klass, template, q=None, _objlist=None):
    pgsize = 0
    pgnum = 1
    hasprev = False
    hasnext = False
    
    try:
        if _objlist == None:
            if q == None:
                olist = get_list_or_404(klass)
                
            else:
                olist = klass.objects.filter(q)
                
        else:
            olist = _objlist
        
    except:
        olist = []
        
    total = len(olist)
        
    if 'pgsize' in request.GET and 'pgnum' in request.GET:
        try:
            pgsize = int(request.GET['pgsize'])
            pgnum = int(request.GET['pgnum'])
            
        except:
            pgsize = 0
            pgnum = 1
            
    if total < pgsize or pgsize < 1:
        pgsize = total
            
    item_msg = get_item_msg(total, pgsize, pgnum)
    paginator = Paginator(olist, pgsize)
        
    try:
        page = paginator.page(pgnum)
        objlist = page.object_list
        hasprev = page.has_previous()
        hasnext = page.has_next()
        
    except:
        objlist = olist
        
    variables = RequestContext(request, {'objlist': objlist,
                                         'has_prev': hasprev,
                                         'has_next': hasnext,
                                         'next_page': pgnum + 1,
                                         'prev_page': pgnum - 1,
                                         'item_msg': item_msg})
    return render_to_response(template, variables)
    
def get_page_list(request, klass, dic):
    title = dic['title']
    form = dic['searchform']
    template = dic['template']
    add_label = dic['add_label']
    dialog_title = dic['dialog_title']
    custom_data = dic.get('custom_data')
    nav_form = NavigateForm()
    pgsize = 0
    pgnum = 1
    hasprev = False
    hasnext = False
    
    try:
        olist = get_list_or_404(klass)
        
    except:
        olist = []
        
    total = len(olist)
    #show_item_display = total > 0
    
    if total < pgsize or pgsize < 1:
        pgsize = total
        
    item_msg = get_item_msg(total, pgsize, pgnum)
    paginator = Paginator(olist, pgsize)
    
    try:
        page = paginator.page(pgnum)
        objlist = page.object_list
        hasprev = page.has_previous()
        hasnext = page.has_next()
        
    except:
        objlist = olist
    
    variables = RequestContext(request, {'title': title,
                                         'form': form,
                                         'custom_data': custom_data,
                                         'nav_form': nav_form,
                                         'add_label': add_label,
                                         'dialog_title': dialog_title,
                                         'objlist': objlist,
                                         'has_prev': hasprev,
                                         'has_next': hasnext,
                                         'next_page': pgnum + 1,
                                         'prev_page': pgnum - 1,
                                         'item_msg': item_msg})
    return render_to_response(template, variables)

def encrypt_password(raw_password):
    return get_hexdigest('md5', SALT, raw_password)

def verify_password(raw_password, encrypted_password):
    return check_password(raw_password, encrypted_password, 'md5', SALT)

def encrypt_password_(raw_password):
    return encrypt_info(raw_password)

def decrypt_password_(encrypted_password):
    return decrypt_info(encrypted_password)

def create_folder(path):
    if os.path.exists(path):
        return True, ''
    
    else:
        os.system('mkdir %s' % (path))
        os.system('chown -R apache:apache "%s"' % path)
        return True, ''
        
    return False, ''

def get_file_extension(_file):
    try:
        ext = os.path.splitext(_file)
        return ext[1].lower()
    
    except:
        pass
    
    return ''

def replace_invalid_filename(filename, ch='_'):
    o = ''
    for c in filename:
        if c in VALID_CHARS:
            o += c
            
        else:
            o += ch
            
    return o

def get_date_str():
    o = datetime.now()
    s = o.strftime('%Y%m%d%H%M%S')
    return s

def get_obj_id(o):
    return id(o)

def is_empty_list(a, sep=','):
    if a is None:
        return True
    
    o = a.split(sep)
    if len(o) == 1 and o[0] == '':
        return True
    
    return False

def get_content_from_url(link):
    data = ''
    try:
        o = urllib.urlopen(link)
        data = o.read()
        o.close()
        
    except:
        pass
    
    return data

def validate_netmask(netmask):
    if netmask == '0.0.0.0':
        return
    
    correct_range = {128:1,192:1,224:1,240:1,248:1,252:1,254:1,255:1,0:1}
    m = netmask.split('.')
    
    for a in m:
        v = int(a)
        if correct_range.has_key(v) == False:
            raise UIException(_(u'The netmask %s is invalid.' % netmask))
            break
    
    if (m[0] == '0') or (m[0] != '255' and m[1] != '0') or (m[1] != '255' and m[2] != '0'):
        raise UIException(_(u'The netmask %s is invalid.' % netmask))
    
def get_exception_traceback(request):
    tb = traceback.format_exc()
    er = ExceptionReporter(request, *sys.exc_info())
    html_message = er.get_traceback_html()
    return html_message

def cleanup(request):
    folder = replace_invalid_filename(str(request.user))
    fpath = os.path.join(settings.DIRFILES, folder)
    try:
        os.system('rm -fr %s/' % (fpath))
        
    except Exception, e:
        print e