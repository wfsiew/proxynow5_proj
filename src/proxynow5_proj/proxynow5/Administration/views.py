from django.http import *
from django.shortcuts import *
from django.template import *
from forms import *
from models import *
from proxynow5_proj.proxynow5.utils import *
from proxynow5_proj.proxynow5.exceptions import UIException
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.template.context import RequestContext
from django.utils.translation import ugettext as _
from django.template.loader import get_template

@login_required
@admin_access_required
def admin_save(request):
    if request.method == 'POST':
        form = AdminForm(request.POST)
        if form.is_valid():
            try:
                if request.is_ajax():
                    form.save(request)
                    return json_result({'success': 1,
                                        'msg': _(u'The admin setting was successfully updated.')})
                
                else:
                    return HttpResponseRedirect('/administration/save/')
                
            except UIException, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
        
    elif 'id' in request.GET:
        id = request.GET['id']
        try:
            o = Admin.objects.get(id=id)
            form = AdminForm({'datetime': o.datetime,
                              'timezone': o.timezone})
            variables = RequestContext(request, {'form': form,
                                                 'id': id,
                                                 'hide_cancel': True})
            return render_to_response('admin/admin_save_form.html', variables)
        
        except Admin.DoesNotExist:
            pass
        
    total = Admin.objects.count()
    id = ''
    if total > 0:
        o = Admin.objects.all()[0]
        id = o.id
        form = AdminForm({'datetime': o.datetime,
                          'timezone': o.timezone})
    
    else:
        form = AdminForm()
        
    variables = RequestContext(request, {'form': form,
                                         'id': id,
                                         'hide_cancel': True})
    return render_to_response('admin/admin_save_form.html', variables)

@login_required
@admin_access_required
def adinfo_save(request):
    if request.method == 'POST':
        form = ADInfoForm(request.POST)
        if form.is_valid():
            try:
                if request.is_ajax():
                    form.save(request)
                    return json_result({'success': 1,
                                        'msg': _(u'The active directory setting was successfully updated.')})
                
                else:
                    return HttpResponseRedirect('/adinfo/save/')
                
            except UIException, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
        
    elif 'id' in request.GET:
        id = request.GET['id']
        try:
            o = ADInfo.objects.get(id=id)
            form = ADInfoForm({'adserver': o.adserver,
                               'addomain': o.addomain,
                               'adusername': o.adusername,
                               'adpassword': o.adpassword})
            variables = RequestContext(request, {'form': form,
                                                 'id': id,
                                                 'hide_cancel': True})
            return render_to_response('adinfo/adinfo_save_form.html', variables)
        
        except ADInfo.DoesNotExist:
            pass
        
    total = ADInfo.objects.count()
    id = ''
    if total > 0:
        o = ADInfo.objects.all()[0]
        id = o.id
        form = ADInfoForm({'adserver': o.adserver,
                           'addomain': o.addomain,
                           'adusername': o.adusername,
                           'adpassword': o.adpassword})
    
    else:
        form = ADInfoForm()
        
    variables = RequestContext(request, {'form': form,
                                         'id': id,
                                         'hide_cancel': True})
    return render_to_response('adinfo/adinfo_save_form.html', variables)