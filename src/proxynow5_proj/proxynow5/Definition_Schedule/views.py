from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, InvalidPage
from django.core.serializers import json
from django.db.models import Q
from django.http import HttpRequest, HttpResponse
from django.shortcuts import HttpResponseRedirect, render_to_response
from django.template.context import Context
from django.template.loader import get_template
from django.utils import simplejson
from django.utils.translation import ugettext as _
from forms import *
from proxynow5_proj.proxynow5.Definition_Schedule.models import DefSchd
from proxynow5_proj.proxynow5.Wizard.process_session import STORE_SCHEDULE, \
    get_allitems_session, get_items_session_byid, is_existed_in_session, \
    update_items_session
from proxynow5_proj.proxynow5.forms import NavigateForm
from proxynow5_proj.proxynow5.utils import *
from search import *
import datetime
import proxynow5_proj.proxynow5.Wizard as wizard

ITEMS_PER_PAGE = 10

def AssignDataSchedule(DefSchdObjs, isedit):

    start = DefSchdObjs.start
    end = DefSchdObjs.end
    typeVar = DefSchdObjs.type
    data = {}
    
    data = {
            'id' : DefSchdObjs.id,
             'name' : DefSchdObjs.name,
             'type' : typeVar,
             'start_day_year_single' : start.year,
             'start_day_month_single' : start.month,
             'start_day_day_single' :  start.day,
             'start_time_hour_single' : start.hour,
             'start_time_min_single': start.minute,
                
             'end_day_year_single' : end.year,
             'end_day_month_single': end.month,
             'end_day_day_single': end.day,
             'end_time_hour_single': end.hour,
             'end_time_min_single': end.minute,
             'comment' : DefSchdObjs.comment,
             
             'start_time_hour_recuring' : start.hour ,
             'start_time_min_recuring' : start.minute,
             'end_time_hour_recuring' : end.hour,
             'end_time_min_recuring' :  end.minute,
             'checkbox_temp' :'',
            } 
     
    if typeVar == 2:
        number = DefSchdObjs.weekdays
        lst = convert2binary(number)
        data['checkbox_day'] = lst
    else:
        data['checkbox_day'] = []
        
    if (isedit == True):
        data['action'] = 'edit'
        data['nameexisted'] = DefSchdObjs.name
    else:
        data['action'] = ''
        data['nameexisted'] = ''
        
    return data
  
def HttpResponseSchedule(key, info):
    result = {}
    result[key] = info
    return HttpResponse(simplejson.dumps(result), mimetype='application/json')
    
def EditDefSchedule(request, form, id):     
    
    savetemp = request.POST.get('savetemp' ,'')
    name = form.cleaned_data['name']
    
    if savetemp == 'updatetemp':
        DefSchObjs = get_items_session_byid(request, STORE_SCHEDULE,id)
        
        if DefSchObjs == None:
            return HttpResponseSchedule('error', "This Schedule does not existed any more.")
        
        if name.lower() != DefSchObjs.name.lower() :
            is_existed_in_session(request, STORE_SCHEDULE, name)
            
    else:
        try:
            DefSchObjs = DefSchd.objects.get(id=id)
            
        except DefSchd.DoesNotExist:
            return HttpResponseSchedule('error', "This Schedule does not existed any more.")
    
    
    try: 
        typeVar = form.cleaned_data['type']
    
        DefSchObjs.type = int(form.cleaned_data['type'])
        DefSchObjs.name = form.cleaned_data['name']
        DefSchObjs.comment = form.cleaned_data['comment']

        if typeVar == '1' :
            startdateyear_single = form.cleaned_data['start_day_year_single']
            startdatemonth_single = form.cleaned_data['start_day_month_single']
            startdateday_single = form.cleaned_data['start_day_day_single']
    
            enddateyear_single = form.cleaned_data['end_day_year_single']
            enddatemonth_single = form.cleaned_data['end_day_month_single']
            enddateday_single = form.cleaned_data['end_day_day_single']
    
            starttimehour = form.cleaned_data['start_time_hour_single']
            starttimemin = form.cleaned_data['start_time_min_single']
    
            endtimehour = form.cleaned_data['end_time_hour_single']
            endtimemin = form.cleaned_data['end_time_min_single']
        
            a = datetime.datetime(int(startdateyear_single), int(startdatemonth_single), int(startdateday_single), int(starttimehour), int(starttimemin))
            b = datetime.datetime(int(enddateyear_single), int(enddatemonth_single), int(enddateday_single), int(endtimehour), int(endtimemin))
        
            DefSchObjs.start = a
            DefSchObjs.end = b
            DefSchObjs.weekdays = 0
            
            if savetemp == 'updatetemp':
                 update_items_session(request, STORE_SCHEDULE, name, id, DefSchObjs)
            else:
                DefSchObjs.save() 
            
        if typeVar == '2':
        
            starttimehour_recuring = form.cleaned_data['start_time_hour_recuring']
            starttimemin_recuring = form.cleaned_data['start_time_min_recuring']
            endtimehour_recuring = form.cleaned_data['end_time_hour_recuring']
            endtimemin_recuring = form.cleaned_data['end_time_min_recuring']
    
            weekdays = 0
            t = form.cleaned_data['checkbox_temp']
            ss = int(t, 2)
        
            a = datetime.datetime(1, 1, 1, int(starttimehour_recuring), int(starttimemin_recuring))
            b = datetime.datetime(1, 1, 1, int(endtimehour_recuring), int(endtimemin_recuring))
        
            DefSchObjs.start = a
            DefSchObjs.end = b
            DefSchObjs.weekdays = ss
            
            if savetemp == 'updatetemp':
                update_items_session(request, STORE_SCHEDULE, name, id, DefSchObjs)
            else:
                DefSchObjs.save()
            
        if 'level' in request.POST and DefSchObjs != None:
            print "o : %s -->" % DefSchObjs.id
            return json_result({'success': 1,
                                'id': DefSchObjs.id,
                                'name': DefSchObjs.__unicode__()})
        
    except Exception, e:
        return HttpResponseSchedule('error', "This Schedule does not existed any more.")
    
    return HttpResponseSchedule('Success', 'Edit Successfully') 
        
def AddDefSingeSchedule(request,form,savetemp):
    
    try:
        typevar = form.cleaned_data['type']
        name = form.cleaned_data['name']
        comment = form.cleaned_data['comment']
        
        #------------------ Single ----------------
        if typevar == "1" :
            startdateyear_single = form.cleaned_data['start_day_year_single']
            startdatemonth_single = form.cleaned_data['start_day_month_single']
            startdateday_single = form.cleaned_data['start_day_day_single']
        
            enddateyear_single = form.cleaned_data['end_day_year_single']
            enddatemonth_single = form.cleaned_data['end_day_month_single']
            enddateday_single = form.cleaned_data['end_day_day_single']
        
            starttimehour = form.cleaned_data['start_time_hour_single']
            starttimemin = form.cleaned_data['start_time_min_single']
        
            endtimehour = form.cleaned_data['end_time_hour_single']
            endtimemin = form.cleaned_data['end_time_min_single']
        
            a = datetime.datetime(int(startdateyear_single), int(startdatemonth_single), int(startdateday_single), int(starttimehour), int(starttimemin))
            b = datetime.datetime(int(enddateyear_single), int(enddatemonth_single), int(enddateday_single), int(endtimehour), int(endtimemin))
            
            if (savetemp != 1):
                obj = DefSchd.objects.create(name=name, type=1, start=a, end=b, weekdays=0, comment=comment)
            else:
                wizard.process_session.is_existed_in_session(request,wizard.process_session.STORE_SCHEDULE,name)
                obj = DefSchd(name=name, type=1, start=a, end=b, weekdays=0, comment=comment)
                obj.id = get_obj_id(obj) 
                wizard.process_session.store_session(request,wizard.process_session.STORE_SCHEDULE,name,obj.id,obj)
               
            return obj
            
        if typevar == "2":
            starttimehour_recuring = form.cleaned_data['start_time_hour_recuring']
            starttimemin_recuring = form.cleaned_data['start_time_min_recuring']
            endtimehour_recuring = form.cleaned_data['end_time_hour_recuring']
            endtimemin_recuring = form.cleaned_data['end_time_min_recuring']
            
            weekdays = 0
            t = form.cleaned_data['checkbox_temp']
            ss = int(t, 2)
            
            a = datetime.datetime(1, 1, 1, int(starttimehour_recuring), int(starttimemin_recuring))
            b = datetime.datetime(1, 1, 1, int(endtimehour_recuring), int(endtimemin_recuring))
            
            if (savetemp != 1):
                obj = DefSchd.objects.create(name=name, type=2, start=a, end=b, weekdays=ss, comment=comment)
            else:
                wizard.process_session.is_existed_in_session(request,wizard.process_session.STORE_SCHEDULE,name)
                obj = DefSchd(name=name, type=2, start=a, end=b, weekdays=ss, comment=comment)
                obj.id = get_obj_id(obj)
                wizard.process_session.store_session(request,wizard.process_session.STORE_SCHEDULE,name, obj.id, obj)
                
            return obj
    except UIException,ex:
        print "Error Info AddDefSingeSchedule %s" %str(ex) 
        raise UIException(str(ex))
    
def AddScheduleView_temp(request):
    return AddScheduleView(request)

def AddScheduleView(request):
    
    if request.is_ajax() and request.method == 'POST':
        
        try:
           
            form = ScheduleForm(request.POST)
            #return HttpResponseSchedule('Success',request.POST)
            if form.is_valid():
                if 'savetemp' in request.POST:
                    
                    if (request.POST['savetemp'] == "inserttemp"):
                        o = AddDefSingeSchedule(request,form,1)
                    else:
                        o = AddDefSingeSchedule(request,form,0)
                else:    
                    o = AddDefSingeSchedule(request,form,0)
                    
                if 'level' in request.POST and o != None:                   
                    return json_result({'success': 1,
                                        'id': o.id,
                                        'name': o.__unicode__()})
                
                return HttpResponseSchedule('Success', 'Insert successfully.')
                
            else:
                return HttpResponseSchedule('invalid', form.errors)
                       
        except Exception, ex:
            return HttpResponseSchedule('error', str(ex))
           
    else:
        level = ''
        scope = ''
        
        if 'level' in request.GET: 
            level = '_' + request.GET['level']
            
        if 'scope' in request.GET:
            scope = '-' + request.GET['scope']
            
        form_title = ADD_FORM_TITLE 
        form = ScheduleForm()
        return render_to_response("schedule/schedule_add.html", {'form': form,
                                                                 'form_title': form_title,
                                                                 'level': level,
                                                                 'scope': scope,})
    
def RefreshScheduleView(request):
    form = DefSchd.objects.all()
    return render_to_response("schedule/defschedule_list.html", {'form': form})

def ShowMainPage(request):
    
    dic = {
           'title': _(u'Schedule'),
           'searchform': SearchForm(),
           'template': 'schedule/defschedule_page.html',
           'add_label': _(u'New schedule definition ...'),
           'dialog_title': _(u'Edit schedule definition')
           }
    return get_page_list(request, DefSchd, dic) 

@login_required
def DeleteScheduleView(request, id):
    try:
        pgsize = int(request.POST['pgsize'])
        pgnum = int(request.POST['pgnum'])
        confirm = request.POST.get('confirm', '')
        
        try:
            a = DefSchd.objects.get(id=id)
        except DefSchd.DoesNotExist:
            return HttpResponseSchedule('error', "This Schedule does not exist any more.Please refresh the page.")
        
        #Check the reference here. 
        if confirm == "":
            n1 = a.wpprofileschedules.count()
            show_msg = n1 > 0
            if show_msg:
                t = get_template('schedule/defschedule_confirm_delete.html') 
                msg = t.render(RequestContext(request, {'o': a,
                                                    'show_msg': show_msg}))
                
                return json_result({'hasgroups': 1,
                                    'msg': msg})
        
        a.delete()
        total = DefSchd.objects.count()
        
        if total < pgsize or pgsize < 1:
            pgsize = total
        
        s = get_item_msg(total, pgsize, pgnum)
        
        if s == "":
            s = "0"
            
        return json_result({'success': 1,
                            'itemscount': s})
        
    except Exception, e:
        #return HttpResponseSchedule('error','Delete is unsuccessfully')
        return HttpResponse(u'Error : %s' % str(e))
 
def convert2binary(n):
    '''convert denary integer n to binary string bStr'''
    lst = []
    bStr = ''
    if n < 0:  raise ValueError, "must be a positive integer"
    if n == 0: return '0'
    while n > 0:
        bStr = str(n % 2) + bStr
        n = n >> 1
        
    if (8 - len(bStr) <= 0):
        return '00000000'
    
    s = ""
    count = 8 - len(bStr) 
    for i in range(0, count):
        s = s + "0";
    
    bStr = s + bStr;
    
    #Check the number is ok or not
    for i in range(0, 8): 
        if bStr[i] == '1':
            lst.append(i)
    
    return lst

def EditScheduleView_temp(request, id):
    return EditScheduleView(request, id)
    
def EditScheduleView(request, id):
    level = ''
    scope = ''
    
    if 'level' in request.GET:
        level = '_' + request.GET['level']
            
    if 'scope' in request.GET:
        scope = '-' + request.GET['scope']
        
    if request.method == 'POST':
        
        form = ScheduleForm(request.POST)
        
        if form.is_valid():
            return EditDefSchedule(request, form, id) 
            #return HttpResponseSchedule('Invalid',id)       
            
        else:
            return HttpResponseSchedule('invalid', form.errors)
    else:
        
        wiz = request.GET.get('wiz' ,'')
        
        if wiz == '1':
           
            form_title = EDIT_FORM_TITLE
            DefSchdObjs = DefSchd()
            DefSchdObjs = get_items_session_byid(request,STORE_SCHEDULE ,id)
            if DefSchdObjs == None:
                print "NONe"
                
            data = AssignDataSchedule(DefSchdObjs, True)
            form = ScheduleForm(data)
            
            variables = RequestContext(request,{'form' : form,
                                                'level' : level,
                                                'scope' : scope,
                                                'form_title' : form_title})
            
            return render_to_response('schedule/schedule_add.html',variables) 
            
            
        else:
            form_title = EDIT_FORM_TITLE
            DefSchdObjs = DefSchd.objects.get(id=id)
            data = AssignDataSchedule(DefSchdObjs, True)
            form = ScheduleForm(data)
            
            return render_to_response("schedule/schedule_add.html", {'form': form,
                                                                 'level': level,
                                                                 'scope': scope,
                                                                 'form_title': form_title})
        
def CloneSchedule(request, id):
    DefSchdObjs = DefSchd.objects.get(id=id)
    data = AssignDataSchedule(DefSchdObjs, False)
    form = ScheduleForm(data)
    form_title = ADD_FORM_TITLE
    return render_to_response("schedule/schedule_add.html", {'form': form,
                                                             'form_title': form_title})    

@login_required
def defschedule_list(request):
    #return get_list(request, DefSchd, 'schedule/defschedule_list.html')
    template = 'schedule/defschedule_list.html'
    return process(request, template)

@login_required
def defschedule_page(request):
    dic = {
           'searchform': SearchForm(),
           'template': 'defservices/defservices_page.html',
           'add_label': _(u'New service definition ...'),
           'dialog_title': _(u'Edit service definition')
           }
    return get_page_list(request, DefSchd, dic) 

def defschedule_list_panel_temp(request):
    objlist = get_allitems_session(request,STORE_SCHEDULE)
    form = FilterForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('schedule/defschedule_list_panel.html', variables)

@login_required
def defschedule_list_panel(request):
    objlist = DefSchd.objects.all()
    form = FilterForm()
    variables = RequestContext(request, {'objlist': objlist,
                                         'form': form})
    return render_to_response('schedule/defschedule_list_panel.html', variables)

def defschedule_list_panel_search_temp(request):
    objlist = get_allitems_session(request,STORE_SCHEDULE)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('schedule/defschedule_list_select.html', variables)

@login_required
def defschedule_list_panel_search(request):
    
    objlist = process_filter(request)
    variables = RequestContext(request, {'objlist': objlist})
    return render_to_response('schedule/defschedule_list_select.html', variables)
    
