from models import *
from proxynow5_proj.proxynow5.utils import *
from django.db.models import Q

#===============================================================================
# Webproxy profile search queries
#===============================================================================
def process_wpprofile(request, template):
    search_by = request.GET.get('find', '')
    keyword = request.GET.get('text', '')
    
    if (search_by == '0' or search_by == '') and keyword == '':
        return get_list(request, WPProfile, template)
    
    else:
        q = get_wpprofile_query(search_by, keyword)        
        return get_list(request, WPProfile, template, q)
    
def get_wpprofile_query(search_by, keyword):
    if search_by == '1':
        q = query_standard(keyword)
        
    elif search_by == '2':
        q = query_transparent(keyword)
        
    else:
        q = query_wpprofile_all(keyword)
        
    return q

def query_wpprofile_all(keyword):
    q = Q(name__icontains=keyword)
    return q

def query_standard(keyword):
    q = Q(mode=1)
    if keyword == '':
        return q
    
    q1 = Q(name__icontains=keyword)
    result = q & q1
    return result

def query_transparent(keyword):
    q = Q(mode=2)
    if keyword == '':
        return q
    
    q1 = Q(name__icontains=keyword)
    result = q & q1
    return result

#===============================================================================
# Webproxy exception search queries
#===============================================================================
def process_wpprofileexcept(request, template):
    keyword = request.GET.get('text', '')
    
    if keyword == '':
        return get_list(request, WPProfileExcept, template)
    
    else:
        q = get_wpprofileexcept_query(keyword)
        return get_list(request, WPProfileExcept, template, q)

def get_wpprofileexcept_query(keyword):
    q = query_wpprofileexcept_all(keyword)
    return q

def query_wpprofileexcept_all(keyword):
    q = Q(name__icontains=keyword)
    return q