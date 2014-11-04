from models import *
from proxynow5_proj.proxynow5.utils import *
from django.db.models import Q

def process(request, template):
    search_by = request.GET.get('find', '')
    keyword = request.GET.get('text', '')
    
    if (search_by == '0' or search_by == '') and keyword == '':
        return get_list(request, DefUser, template)
    
    else:
        q = get_query(search_by, keyword)
        return get_list(request, DefUser, template, q)
    
def process_filter(request):
    search_by = request.GET.get('find', '')
    keyword = request.GET.get('text', '')
    
    if (search_by == '0' or search_by == '') and keyword == '':
        return DefUser.objects.all()
    
    else:
        q = get_query(search_by, keyword)
        return DefUser.objects.filter(q)

def get_query(search_by, keyword):
    if search_by == '1':
        q = query_defusername(keyword)
        
    elif search_by == '2':
        q = query_defusergroup(keyword)
        
    else:
        q = query_all(keyword)
        
    return q

def query_all(keyword):
    q = Q(name__icontains=keyword)
    q = q | Q(comment__icontains=keyword)
    qusername = Q(defusername__displayname__icontains=keyword)
    result = q | qusername
    return result

def query_defusername(keyword):
    q = Q(type=1)
    if keyword == '':
        return q
    
    q1 = Q(name__icontains=keyword)
    q2 = Q(comment__icontains=keyword)
    qusername = Q(defusername__displayname__icontains=keyword)
    result = q & (q1 | q2 | qusername)
    return result

def query_defusergroup(keyword):
    q = Q(type=2)
    if keyword == '':
        return q
    
    q1 = Q(name__icontains=keyword)
    q2 = Q(comment__icontains=keyword)
    q3 = Q(defusergroup__member__name__icontains=keyword)
    q4 = Q(defusergroup__member__comment__icontains=keyword)
    q5 = Q(defusergroup__member__defusername__displayname__icontains=keyword)
    result = q & (q1 | q2 | q3 | q4 | q5)
    return result