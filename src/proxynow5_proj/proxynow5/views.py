# Create your views here.
from AD_User.models import ADUser
from Definition_User.models import DefUser
from django.conf import settings
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.http import *
from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.template.loader import get_template
from django.utils.translation import ugettext as _
from forms import UserFilterForm, AuthForm
from proxynow5_proj.proxynow5.Wizard.models import WizardSetup
from search import *
from utils import json_form_error, json_result, cleanup

def main(request):
    accesstype = DEFUSER_ACCESS_TYPES[0][0]
    '''
            Check the wizard existed is called or not . then 
    '''
    try:
        a = WizardSetup.objects.get(id = 1)
        iswizard = 0
        iswizard = a.iswizard
        '''
            Todo : Delete all the session . that related to the configs
        '''
        if iswizard == 1:
            return HttpResponseRedirect("wizard/")
        
    except WizardSetup.DoesNotExist:
        return HttpResponseRedirect("wizard/")
    
    try:
        if not request.session['access_type'] is None:
            accesstype = request.session['access_type']
            
    except:
        pass
    
    form = AuthForm()
    variables = RequestContext(request, {'release': settings.RELEASE,
                                         'form': form,
                                         'progress_msg': _(u'Loading ...'),
                                         'user': request.user,
                                         'accesstype': accesstype})
    #request.session.set_test_cookie()
    return render_to_response('main_page.html', variables)

def login(request):
    if request.method == 'POST':
        form = AuthForm(request.POST)
        if form.is_valid():
            try:
                if request.is_ajax():
                    user = form.authenticate(request)
                    if not user is None:
                        accesstype = request.session['access_type']
                        auth.login(request, user)
                        if accesstype == DEFUSER_ACCESS_TYPES[0][0]:
                            return json_result({'success': 1,
                                                'accesstype': accesstype})
                        
                        else:
                            ts = get_template('theme_select.html')
                            themeselect = ts.render(RequestContext(request))
                            return json_result({'success': 1,
                                                'accesstype': accesstype,
                                                'themeselect': themeselect})

                    else:
                        return json_form_error(form)
                    
                else:
                    return HttpResponseRedirect('/')
                
            except Exception, e:
                return HttpResponse(e)
            
        else:
            return json_form_error(form)
        
    else:
        form = AuthForm()

    variables = RequestContext(request, {'form': form})
    return render_to_response('registration/login.html', variables)

def logout(request):
    cleanup(request)
    auth.logout(request)
    #request.session.set_test_cookie()
    form = AuthForm()
    t = get_template('registration/login.html')
    ts = get_template('theme_select.html')
    loginform = t.render(RequestContext(request, {'form': form}))
    themeselect = ts.render(RequestContext(request))
    return json_result({'success': 1,
                        'loginform': loginform,
                        'themeselect': themeselect})

@login_required
def menu(request):
    variables = RequestContext(request)
    accesstype = request.session['access_type']
    if accesstype == DEFUSER_ACCESS_TYPES[0][0]:
        return render_to_response('menu_user.html', variables)
    
    else:
        return render_to_response('menu.html', variables)

def blocked(request):
    dic = {'release': settings.RELEASE,
           'product_url': 'http://www.proxynow.com.my'}
    defreason = _(u'The URL you have requested is blocked by Surf Protection. If you think this is wrong, please contact your administrator')
    
    if request.method == 'POST':
        version = request.POST.get('version', '5')
        url = request.POST.get('url', '')
        admin_email = request.POST.get('admin_email', '')
        reason = request.POST.get('reason', defreason)
        
        dic['version'] = version
        dic['url'] = url
        dic['admin_email'] = admin_email
        dic['reason'] = reason
        
    elif request.method == 'GET':
        version = request.GET.get('version', '5')
        url = request.GET.get('url', '')
        admin_email = request.GET.get('admin_email', '')
        reason = request.GET.get('reason', defreason)
        
        dic['version'] = version
        dic['url'] = url
        dic['admin_email'] = admin_email
        dic['reason'] = reason
        
    variables = RequestContext(request, dic)
    return render_to_response('blocked.html', variables)

#===============================================================================
# This view is for checking the server when the server is rebooting.
# It will response ok when the server has been rebooted.
#===============================================================================
def checkserver(request):
    return HttpResponse(u'ok')

@login_required
def user_list_panel(request):
    userlist = DefUser.objects.all()
    aduserlist = ADUser.objects.all()
    form = UserFilterForm()
    variables = RequestContext(request, {'userlist': userlist,
                                         'aduserlist': aduserlist,
                                         'form': form})
    return render_to_response('user_list_panel.html', variables)

@login_required
def user_list_select(request):
    userlist, aduserlist = process_user_filter(request)
    variables = RequestContext(request, {'userlist': userlist,
                                         'aduserlist': aduserlist})
    return render_to_response('user_list_select.html', variables)