from models import *
from proxynow5_proj.proxynow5.utils import *
from django.db.models import Q

#===============================================================================
# Category search queries
#===============================================================================
def process_wpcat(request, template):
    search_by = request.GET.get('find', '')
    keyword = request.GET.get('text', '')
    
    if (search_by == '0' or search_by == '') and keyword == '':
        return get_list(request, WPCat, template)
    
    else:
        q = get_wpcat_query(search_by, keyword)
        return get_list(request, WPCat, template, q)
    
def process_wpcat_filter(request):
    search_by = request.GET.get('find', '')
    keyword = request.GET.get('text', '')
    
    if (search_by == '0' or search_by == '') and keyword == '':
        return WPCat.objects.all()
    
    else:
        q = get_wpcat_query(search_by, keyword)
        return WPCat.objects.filter(q)
    
def get_wpcat_query(search_by, keyword):
    if search_by == '1':
        q = query_wpcat_prebuild(keyword)
        
    elif search_by == '2':
        q = query_wpcat_custom(keyword)
        
    else:
        q = query_wpcat_all(keyword)
        
    return q

def query_wpcat_all(keyword):
    q = Q(name__icontains=keyword)
    q = q | Q(comment__icontains=keyword)
    q1 = Q(wpcatvalue__url__icontains=keyword)
    result = q | q1
    return result

def query_wpcat_prebuild(keyword):
    q = Q(type=1)
    if keyword == '':
        return q
    
    q1 = Q(wpcatvalue__url__icontains=keyword)
    result = q & q1
    return result

def query_wpcat_custom(keyword):
    q = Q(type=2)
    if keyword == '':
        return q
    
    q1 = Q(wpcatvalue__url__icontains=keyword)
    result = q & q1
    return result

#===============================================================================
# Whitelist search queries
#===============================================================================
def process_wpwhitelist(request, template):
    keyword = request.GET.get('text', '')
    
    if keyword == '':
        return get_list(request, WPWhiteList, template)
    
    else:
        q = get_wpwhitelist_query(keyword)
        return get_list(request, WPWhiteList, template, q)
    
def process_wpwhitelist_filter(request):
    keyword = request.GET.get('text', '')
    
    if keyword == '':
        return WPWhiteList.objects.all()
    
    else:
        q = get_wpwhitelist_query(keyword)
        return WPWhiteList.objects.filter(q)
    
def get_wpwhitelist_query(keyword):
    q = query_wpwhitelist_all(keyword)
    return q

def query_wpwhitelist_all(keyword):
    q = Q(name__icontains=keyword)
    q = q | Q(comment__icontains=keyword)
    q1 = Q(wpwhitelistvalue__url__icontains=keyword)
    result = q | q1
    return result

#===============================================================================
# Blacklist search queries
#===============================================================================
def process_wpblacklist(request, template):
    keyword = request.GET.get('text', '')
    
    if keyword == '':
        return get_list(request, WPBlackList, template)
    
    else:
        q = get_wpblacklist_query(keyword)
        return get_list(request, WPBlackList, template, q)
    
def process_wpblacklist_filter(request):
    keyword = request.GET.get('text', '')
    
    if keyword == '':
        return WPBlackList.objects.all()
    
    else:
        q = get_wpblacklist_query(keyword)
        return WPBlackList.objects.filter(q)
    
def get_wpblacklist_query(keyword):
    q = query_wpblacklist_all(keyword)
    return q

def query_wpblacklist_all(keyword):
    q = Q(name__icontains=keyword)
    q = q | Q(comment__icontains=keyword)
    q1 = Q(wpblacklistvalue__url__icontains=keyword)
    result = q | q1
    return result

#===============================================================================
# Extension search queries
#===============================================================================
def process_wpext(request, template):
    keyword = request.GET.get('text', '')
    
    if keyword == '':
        return get_list(request, WPExt, template)
    
    else:
        q = get_wpext_query(keyword)
        return get_list(request, WPExt, template, q)
    
def process_wpext_filter(request):
    keyword = request.GET.get('text', '')
    
    if keyword == '':
        return WPExt.objects.all()
    
    else:
        q = get_wpext_query(keyword)
        return WPExt.objects.filter(q)
    
def get_wpext_query(keyword):
    q = query_wpext_all(keyword)
    return q
    
def query_wpext_all(keyword):
    q = Q(name__icontains=keyword)
    q = q | Q(comment__icontains=keyword)
    q1 = Q(wpextvalue__extension__icontains=keyword)  
    result = q | q1
    return result

#===============================================================================
# Content search queries
#===============================================================================
def process_wpcontent(request, template):
    keyword = request.GET.get('text', '')
    
    if keyword == '':
        return get_list(request, WPContent, template)
    
    else:
        q = get_wpcontent_query(keyword)
        return get_list(request, WPContent, template, q)
    
def process_wpcontent_filter(request):
    keyword = request.GET.get('text', '')
    
    if keyword == '':
        return WPContent.objects.all()
    
    else:
        q = get_wpcontent_query(keyword)
        return WPContent.objects.filter(q)
    
def get_wpcontent_query(keyword):
    q = query_wpcontent_all(keyword)
    return q
    
def query_wpcontent_all(keyword):
    q = Q(name__icontains=keyword)
    q = q | Q(comment__icontains=keyword)
    q1 = Q(wpcontentvalue__keyword__icontains=keyword)
    try:
        score = int(keyword)
        q2 = Q(wpcontentvalue__score=score)
        
    except:
        q2 = Q()
        
    result = q | q1 | q2
    return result

#===============================================================================
# MIME search queries
#===============================================================================
def process_wpmime(request, template):
    keyword = request.GET.get('text', '')
    
    if keyword == '':
        return get_list(request, WPMIME, template)
    
    else:
        q = get_wpmime_query(keyword)
        return get_list(request, WPMIME, template, q)
    
def process_wpmime_filter(request):
    keyword = request.GET.get('text', '')
    
    if keyword == '':
        return WPMIME.objects.all()
    
    else:
        q = get_wpmime_query(keyword)
        return WPMIME.objects.filter(q)
    
def get_wpmime_query(keyword):
    q = query_wpmime_all(keyword)
    return q

def query_wpmime_all(keyword):
    q = Q(name__icontains=keyword)
    q = q | Q(comment__icontains=keyword)
    q1 = Q(wpmimevalue__mime__icontains=keyword)
    result = q | q1
    return result