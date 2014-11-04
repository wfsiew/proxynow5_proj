from django.http import *
from django.shortcuts import *
from django.contrib.auth.decorators import login_required
from django.template.context import RequestContext
from django.utils.translation import ugettext as _
from django.template.loader import get_template
from proxynow5_proj.proxynow5.utils import json_result, admin_access_required
from logtypes import LOG_TYPES
import os
from os import stat
from os.path import abspath
from stat import ST_SIZE

@login_required
@admin_access_required
def log_page(request):
    types = []
    for o in LOG_TYPES:
        types.append(o['name'])
        
    dic = LOG_TYPES[0]
    files = get_files_frompath(dic)
        
    variables = RequestContext(request, {'types': types,
                                         'files': files})
    return render_to_response('log/log_page.html', variables)

@login_required
@admin_access_required
def log_init(request):
    if request.method == 'POST':
        logtype = request.POST.get('type', '0')
        logfile = request.POST.get('file', '')
        filters = request.POST.get('filter', '')
        excludelist = ['GET /log/?', 'GET /log/files/', 'POST /log/init/', 'POST /log/run/']
        
        filename = get_log_file(logtype, logfile)
        logs, offset = get_init_lines(filename, 20, excludelist, filters)
        request.session['log_file'] = {'path': filename,
                                       'offset': offset}
        
        variables = RequestContext(request, {'logs': logs})
        return render_to_response('log/log_info.html', variables)
    
    return HttpResponse(u'invalid request')

@login_required
@admin_access_required
def log_run(request):
    if request.method == 'POST':
        logtype = request.POST.get('type', '0')
        logfile = request.POST.get('file', '')
        filters = request.POST.get('filter', '')
        excludelist = ['GET /log/?', 'GET /log/files/', 'POST /log/init/', 'POST /log/run/']
        
        try:
            filename = get_log_file(logtype, logfile)
            dic = request.session['log_file']
            logs, offset = get_logs(filename, dic['offset'], excludelist, filters)
            dic['offset'] = offset
            request.session['log_file'] = dic
            
            variables = RequestContext(request, {'logs': logs})
            return render_to_response('log/log_info.html', variables)
        
        except:
            return HttpResponse(u'failure')
    
    return HttpResponse(u'invalid request')

@login_required
@admin_access_required
def log_files(request):
    v = request.GET.get('type', '0')
    i = int(v)
    dic = LOG_TYPES[i]
    files = get_files_frompath(dic)
            
    variables = RequestContext(request, {'files': files})
    return render_to_response('log/log_file_option.html', variables)

def get_files_frompath(dic):
    commonnamelist = []
    fpath = dic['path']
    commonnames = dic['commonname']
    if commonnames != '':
        commonnamelist = commonnames.split(',')
        
    oneormany = dic['oneormany']
    dirs = os.listdir(fpath)
    files = []
    for o in dirs:
        p = os.path.join(fpath, o)
        if os.path.isfile(p):
            if oneormany == '1':
                files.append(o)
                
            else:
                if commonnamelist != []:
                    for c in commonnamelist:
                        j = o.lower().find(c.lower())
                        if j >= 0:
                            files.append(o)
                        
                else:
                    files.append(o)
                    
    return files

def get_log_file(logtype, logfile):
    i = int(logtype)
    dic = LOG_TYPES[i]
    fpath = dic['path']
    filename = os.path.join(fpath, logfile)
    return filename

def get_init_lines(path, num, excludelist=[], filters=''):
    o = open(path, 'r')
    lines = o.readlines()
    n = len(lines) - num
    ls = []
    if n > 0:
        ls = lines[n:]
        
    else:
        ls = lines
        
    tmpls = get_excludedlist(ls, excludelist)
    queue = get_filteredlist(tmpls, filters)
        
    offset = o.tell()
    o.close()
    
    return queue, offset

def get_logs(path, offset, excludelist=[], filters=''):
    ls = []
    o = open(path, 'r')
    o.seek(offset)
    line = o.readline()
    while line != "":
        ls.append(line)
        line = o.readline()
        
    pos = offset
    num_read = len(ls)
    if num_read > 0:
        pos = o.tell()
        
    tmpls = get_excludedlist(ls, excludelist)
    queue = get_filteredlist(tmpls, filters)
    
    o.close()
    
    return queue, pos

def get_excludedlist(ls, excludelist=[]):
    queue = []
    if excludelist == []:
        queue = ls
        
    else:
        for line in ls:
            found = False
            for v in excludelist:
                j = line.find(v)
                if j >= 0:
                    found = True
                    break
                
            if found == False:
                queue.append(line)
                
    return queue

def get_filteredlist(ls, filters=''):
    queue = []
    if filters == '':
        queue = ls
        
    else:
        filterlist = filters.split(',')
        for line in ls:
            found = False
            for v in filterlist:
                j = line.lower().find(v.lower())
                if j >= 0:
                    found = True
                    break
                
            if found == True:
                queue.append(line)
                
    return queue

def get_exclude(ls):
    grep = 'grep'
    s = ''
    if ls is None:
        return ''
    
    for p in ls:
        s += "| %s -v '%s' " % (grep, p)
        
    return s.strip()