from models import *
from proxynow5_proj.proxynow5.utils import *
from django.db.models import Q

def process(request, template):
    search_by = request.GET.get('find', '')
    keyword = request.GET.get('text', '')
    
    if (search_by == '0' or search_by == '') and keyword == '':
        return get_list(request, AppCtrlRule, template)
    
    else:
        q = get_query(search_by, keyword)        
        return get_list(request, AppCtrlRule, template, q)
    
def get_query(search_by, keyword):
    if search_by == '1':
        q = query_allow(keyword)
        
    elif search_by == '2':
        q = query_block(keyword)
        
    else:
        q = query_all(keyword)
        
    return q

def query_all(keyword):
    q = Q(name__icontains=keyword)
    q = q | Q(comment__icontains=keyword)
    return q

def query_allow(keyword):
    q = Q(action=1)
    if keyword == '':
        return q
    
    q1 = Q(name__icontains=keyword)
    q2 = Q(comment__icontains=keyword)
    result = q & (q1 | q2)
    return result
    
def query_block(keyword):
    q = Q(action=2)
    if keyword == '':
        return q
    
    q1 = Q(name__icontains=keyword)
    q2 = Q(comment__icontains=keyword)
    result = q & (q1 | q2)
    return result
    
#===============================================================================
# Application Control - Application List search queries
#===============================================================================
def process_filter_appctrlapplist(request):
    search_by = request.GET.get('find', '')
    keyword = request.GET.get('text', '')
    
    if (search_by == '0' or search_by == '') and keyword == '':
        return AppCtrlAppList.objects.all()
    
    else:
        q = get_query_appctrlapplist(search_by, keyword)
        return AppCtrlAppList.objects.filter(q)
    
def get_query_appctrlapplist(search_by, keyword):
    if search_by == '1':
        q = query_name_appctrlapplist(keyword)
        
    elif search_by == '2':
        q = query_category_appctrlapplist(keyword)
        
    else:
        q = query_all_appctrlapplist(keyword)
        
    return q

def query_all_appctrlapplist(keyword):
    q = Q(name__icontains=keyword)
    q = q | Q(category__icontains=keyword)
    return q
    
def query_name_appctrlapplist(keyword):
    return Q(name__icontains=keyword)

def query_category_appctrlapplist(keyword):
    return Q(category__icontains=keyword)