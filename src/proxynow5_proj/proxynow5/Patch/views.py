from django.http import *
from django.shortcuts import *
from django.template import *
from upgrade import *
from proxynow5_proj.proxynow5.utils import *
from proxynow5_proj.proxynow5.exceptions import UIException
from django.contrib.auth.decorators import login_required
from django.template.context import RequestContext
from django.utils.translation import ugettext as _
from django.template.loader import get_template

@login_required
@admin_access_required
def patch_page(request):
    version = get_version()
    upgradelist = get_upgrade_list()
    variables = RequestContext(request, {'version': version,
                                         'upgradelist': upgradelist})
    return render_to_response('patch/patch_page.html', variables)

@login_required
@admin_access_required
def upgrade_list(request):
    _showbeta = request.GET.get('beta', '1')
    showbeta = True
    if _showbeta == '0':
        showbeta = False

    upgradelist = get_upgrade_list(showbeta)
    variables = RequestContext(request, {'upgradelist': upgradelist})
    return render_to_response('patch/patch_upgrade_list.html', variables)

@login_required
@admin_access_required
def upgrade_details(request):
    version = request.GET.get('ver', '')
    link = 'http://www.internetnow.com.my/download/ProxyNow5/Updates/%s/details.txt' % version
    content = ''
    if link != '':
        content = get_content_from_url(link)
        
    variables = RequestContext(request, {'content': content})
    return render_to_response('patch/patch_version_details_panel.html', variables)

@login_required
@admin_access_required
def upgrade_confirm(request):
    version = request.GET.get('ver', '')
    variables = RequestContext(request, {'version': version})
    return render_to_response('patch/patch_confirm_upgrade.html', variables)

@login_required
@admin_access_required
def restart_server(request):
    cmd = 'reboot'
    os.system(cmd)
    return HttpResponse(u'success')

@login_required
@admin_access_required
def upgrade_begin(request):
    #run upgrade process
    version = request.GET.get('ver', '')
    cmd = 'cd /proxynowBackups;echo %s > runupgrade.txt &' % version
    os.system(cmd)
    variables = RequestContext(request, {'progress_msg': _(u'The server is restarting. Please wait ...')})
    return render_to_response('patch/patch_upgrading_panel.html', variables)

def upgrade_log_init(request):
    filename = '/proxynowBackups/update.txt'
    logs, offset, error, complete = get_init_lines(filename, 20)
    request.session['upgrade_file'] = {'path': filename,
                                       'offset': offset}
    
    t = get_template('patch/patch_upgrading_info.html')
    content = t.render(RequestContext(request, {'logs': logs}))
    return json_result({'error': error,
                        'complete': complete,
                        'content': content})
    
def upgrade_log_run(request):
    filename = '/proxynowBackups/update.txt'
    
    try:
        dic = request.session['upgrade_file']
        logs, offset, error, complete = get_logs(filename, dic['offset'])
        dic['offset'] = offset
        request.session['upgrade_file'] = dic
        
        t = get_template('patch/patch_upgrading_info.html')
        content = t.render(RequestContext(request, {'logs': logs}))
        return json_result({'error': error,
                            'complete': complete,
                            'content': content})
    
    except:
        pass
    
    return json_result({'error': 1,
                        'content': ''})

def get_init_lines(path, num):
    o = open(path, 'r')
    lines = o.readlines()
    n = len(lines) - num
    ls = []
    error = 0
    complete = 0
    if n > 0:
        ls = lines[n:]
        
    else:
        ls = lines
        
    for t in ls:
        try:
            i = t.find(UPGRADE_FAILED_TOKEN)
            if i >= 0:
                error = 1
                break
            
            j = t.find(UPGRADE_SUCCESS_TOKEN)
            if j >= 0:
                complete = 1
            
        except:
            pass
        
    offset = o.tell()
    o.close()
    
    return ls, offset, error, complete

def get_logs(path, offset):
    ls = []
    error = 0
    complete = 0
    o = open(path, 'r')
    o.seek(offset)
    line = o.readline()
    while line != "":
        ls.append(line)
        i = line.find(UPGRADE_FAILED_TOKEN)
        if i >= 0:
            error = 1
            break
        
        j = line.find(UPGRADE_SUCCESS_TOKEN)
        if j >= 0:
            complete = 1
        
        line = o.readline()
        
    pos = offset
    num_read = len(ls)
    if num_read > 0:
        pos = o.tell()
        
    o.close()
    
    return ls, pos, error, complete