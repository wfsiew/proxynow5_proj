from django.http import *
from django.shortcuts import *
from forms import *
from models import *
from search import *
from proxynow5_proj.proxynow5.utils import *
from proxynow5_proj.proxynow5.backends import AuthBackend
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, InvalidPage
from django.template.context import RequestContext
from django.utils.translation import ugettext as _
from proxynow5_proj.proxynow5.forms import NavigateForm
from proxynow5_proj.proxynow5.exceptions import UIException
from django.template.loader import get_template
from django.db import transaction

@login_required
@admin_access_required
def defuser_save(request):
    scope = ''
    level = ''
    form_title = ADD_FORM_TITLE
    
    if 'scope' in request.GET:
        scope = '-' + request.GET['scope']
        
    if request.method == 'GET' and 'level' in request.GET:
        level = '_' + request.GET['level']
        
    if request.method == 'POST':
        form = DefUserForm(request.POST)
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
                    return HttpResponseRedirect('/defuser/save/')
                
            except UIException, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
        
    elif 'id' in request.GET:
        form_title = EDIT_FORM_TITLE
        _id = request.GET['id']
        id = int(_id)
        clone = ''
            
        show_confirm_password = False
        if 'clone' in request.GET:
            clone = request.GET['clone']
            form_title = ADD_FORM_TITLE
            show_confirm_password = True
            
        name = ''
        type = 1
        comment = ''
        try:
            o = DefUser.objects.get(id=id)
            name = o.name
            type = o.type
            accesstype = o.accesstype
            comment = o.comment
            dic = {'name': name,
                   'type': type,
                   'accesstype': accesstype,
                   'comment': comment}
            form = get_defuser_form(type, clone, dic)
            if type == 1:
                defusername = o.defusername_set.get(id=id)
                displayname = defusername.displayname
                password = '********'
                form1 = DefUserNameForm({'displayname': displayname,
                                         'password': password})
                variables = RequestContext(request, {'form': form,
                                                     'form1': form1,
                                                     'level': level,
                                                     'scope': scope,
                                                     'show_confirm_password': show_confirm_password,
                                                     'type': type,
                                                     'form_title': form_title,
                                                     'dialog_title': _(u'Add user definition'),
                                                     'dialog_edit_title': _(u'Edit user definition')})
                return render_to_response('defuser/defuser_save_form.html', variables)
            
            elif type == 2:
                members = o.defusergroup_set.filter(gid=o)
                variables = RequestContext(request, {'form': form,
                                                     'type': type,
                                                     'members': members,
                                                     'level': level,
                                                     'scope': scope,
                                                     'form_title': form_title,
                                                     'dialog_title': _(u'Add user definition'),
                                                     'dialog_edit_title': _(u'Edit user definition')})
                return render_to_response('defuser/defuser_save_form.html', variables)
            
        except DefUserName.DoesNotExist:
            pass
        
    else:
        form = DefUserForm()
        form1 = DefUserNameForm()
        
    variables = RequestContext(request, {'form': form,
                                         'form1': form1,
                                         'show_confirm_password': True,
                                         'level': level,
                                         'scope': scope,
                                         'form_title': form_title,
                                         'dialog_title': _(u'Add user definition'),
                                         'dialog_edit_title': _(u'Edit user definition')})
    return render_to_response('defuser/defuser_save_form.html', variables)

@login_required
@admin_access_required
@transaction.commit_on_success
def defuser_delete(request):
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
                o = DefUser.objects.get(id=id)
                
            except DefUser.DoesNotExist:
                return HttpResponse(u'invalid id')
            
            if confirm == '':
                n = o.defusergroups.count()
                n1 = o.wpprofileinternalusers.count()
                n2 = o.wpprofileexceptinternalusers.count()
                show_msg = n > 0 or n1 > 0 or n2 > 0
                if show_msg and request.is_ajax():
                    t = get_template('defuser/defuser_confirm_delete.html')
                    msg = t.render(RequestContext(request, {'o': o,
                                                            'show_msg': show_msg}))
                    return json_result({'hasgroups': 1,
                                        'msg': msg})
                    
            name = o.name   
            o.delete()
            AuthBackend.delete_user(username=name)
            if (search_by == '0' or search_by == '') and keyword == '':
                total = DefUser.objects.count()
                
            else:
                q = get_query(search_by, keyword)
                total = DefUser.objects.filter(q).count()
            
            if total < pgsize or pgsize < 1:
                pgsize = total
                
            s = get_item_msg(total, pgsize, pgnum)
            if request.is_ajax():
                return json_result({'success': 1,
                                    'itemscount': s})
            
            else:
                return HttpResponseRedirect('/defuser/')
            
    return HttpResponse(u'invalid id')

@login_required
@admin_access_required
def defuser_list_panel(request):
    objlist = DefUser.objects.all()
    form = FilterForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('defuser/defuser_list_panel.html', variables)

@login_required
@admin_access_required
def defuser_list_select(request):
    objlist = process_filter(request)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('defuser/defuser_list_select.html', variables)

def defuser_list_panel_temp(request):
    objlist = DefUser.objects.all()
    form = FilterForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('defuser/defuser_list_panel.html', variables)

def defuser_list_select_temp(request):
    objlist = process_filter(request)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('defuser/defuser_list_select.html', variables)

@login_required
@admin_access_required
def defuser_list(request):
    template = 'defuser/defuser_list.html'
    return process(request, template)

@login_required
def defuser_page(request):
    dic = {
           'title': _(u'Users'),
           'searchform': SearchForm(),
           'template': 'defuser/defuser_page.html',
           'add_label': _(u'New user ...'),
           'dialog_title': _(u'Edit user')
           }
    return get_page_list(request, DefUser, dic)

#===============================================================================
# Views for normal user access
#===============================================================================
@login_required
def defuser_changepwd(request):
    if request.method == 'POST':
        form = DefUserNameForm_(request.POST)
        if form.is_valid():
            try:
                if request.is_ajax():
                    form.update(request)
                    return json_result({'success': 1,
                                        'msg': _(u'Your password was successfully updated.')})
                
                else:
                    return HttpResponseRedirect('/defuser/save/pwd/')
                
            except UIException, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
        
    else:
        try:
            id = request.session['user_id']
            o = DefUser.objects.get(id=id)
            form = DefUserNameForm_({'name': o.name,
                                    'password': '********'})
            variables = RequestContext(request, {'form': form,
                                                 'hide_cancel': True})
            return render_to_response('defuser/defuser_password_save_form.html', variables)
            
        except DefUser.DoesNotExist:
            pass
    
    form = DefUserNameForm_()
    variables = RequestContext(request, {'form': form,
                                         'hide_cancel': True})
    return render_to_response('defuser/defuser_password_save_form.html', variables)