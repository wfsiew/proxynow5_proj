from django.http import *
from models import *
from forms import *
from django.shortcuts import *
from proxynow5_proj.proxynow5.utils import *
import loaddata
import sys, os
from django.conf import settings
from django.core import management
from django.core.servers.basehttp import FileWrapper
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.utils.translation import ugettext as _
from django.template.loader import get_template

def setting_save(request):
    if request.method == 'POST':
        name = request.POST['name']
        val = request.POST['value']
        _save_setting(name, val)
        return json_result({'success': 1,
                            'theme': val})
        
    else:
        try:
            if 'name' in request.GET:
                val = request.GET['name']
                o = ProxynowSettings.objects.get(name__iexact=val)
                return json_result({'success': 1,
                                    'theme': o.value})
            
        except:
            pass
        
    return HttpResponse('failure')

@login_required
@admin_access_required
def conf_page(request):
    variables = RequestContext(request, {'form': ImportForm(),
                                         'progress_msg': _(u'Importing in progress. Please wait...')})
    return render_to_response('conf/conf_form.html', variables)

@login_required
@admin_access_required
def conf_upload(request):
    variables = RequestContext(request, {'form': ImportForm()})
    return render_to_response('conf/upload_form.html', variables)

@login_required
@admin_access_required
def conf_import(request):
    if request.method == 'POST':
        form = ImportForm(request.POST, request.FILES)
        if form.is_valid():
            try:
                errors = _import(request, form)
                if errors == []:
                    return json_result({'success': 1,
                                        'msg': _(u'The settings have been imported successfully.')})
                    
                else:
                    t = get_template('conf/import_error.html')
                    msg = t.render(RequestContext(request, {'errors': errors}))
                    return json_result({'error': 1,
                                        'msg': msg})
            
            except Exception, e:
                return json_result({'error': 1,
                                    'msg': str(e)})
            
    else:
        form = ImportForm()
        
    return json_result({'error': 1,
                        'msg': 'fail to import settings'})

@login_required
@admin_access_required
def conf_export(request):
    fname = get_export_filename(request)
    folder = replace_invalid_filename(str(request.user))
    uid = get_date_str()
    _filename = 'proxynow5_config_export%s' % (uid)
    fpath = os.path.join(settings.DIRFILES, folder)
    status, msg = create_folder(fpath)
    filename = None
    if status:
        filename = os.path.join(fpath, _filename)
        
    if filename is None:
        return HttpResponse('fail to create folder %s' % (folder))
        
    sys.stdout = open(filename, 'w')
    err = ''
    
    try:
        excludelist = ['contenttypes', 'sessions', 'auth.permission']
        management.call_command('dumpdata', format='xml', indent=4, exclude=excludelist)
        
    except Exception, e:
        filename = None
        err = get_exception_traceback(request)
        
    finally:
        sys.stdout.close()
        sys.stdout = sys.__stdout__
        
    if filename is None:
	    return HttpResponse(err)
#        return HttpResponse('fail to export settings')
        
    return transmit_file(filename, fname)
        
def _save_setting(name, val):
    o, created = ProxynowSettings.objects.get_or_create(name=name)
    o.value = val
    o.save()
    
def _import(request, form):
    postedfile = request.FILES['filename']
    option = request.POST.get('option', '0')
    
    fileext = get_file_extension(postedfile.name)
    print fileext
    if fileext != '.xml':
        raise UIException(_(u'The file is not recognized by the system. Please check the file.'))
    
    # create the path to upload the file
    folder = replace_invalid_filename(str(request.user))
    uid = get_date_str()
    _filename = 'proxynow5_config_import%s.xml' % (uid)
    fpath = os.path.join(settings.DIRFILES, folder)
    status, msg = create_folder(fpath)
    filename = None
    if status:
        filename = os.path.join(fpath, _filename)
        
    if filename is None:
        raise UIException(_(u'Fail to create folder %(x)s') % {'x': folder})

    # write the uploaded file
    dest = open(filename, 'wb+')
    try:
        for chunk in postedfile:
            dest.write(chunk)
            
    finally:
        dest.close()
        
    errors = []
    # perform import
    management.call_command('flush', interactive=False)
    cmd = loaddata.Command()
    errors = cmd.handle(filename)
    
    return errors

def transmit_file(filename, fname):
    wrapper = FileWrapper(file(filename))
    response = HttpResponse(wrapper, content_type='application/octet-stream')
    response['Content-Disposition'] = 'attachment; filename="%s"' % (fname)
    response['Content-Length'] = os.path.getsize(filename)
    return response

def get_export_filename(request):
    name = 'proxynow5_config'
    ext = 'xml'  
    return '%s.%s' % (name, ext)