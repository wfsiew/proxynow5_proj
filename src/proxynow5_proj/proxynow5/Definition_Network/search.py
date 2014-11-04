from models import *
from proxynow5_proj.proxynow5.utils import *
from django.db.models import Q

def process(request, template):
    search_by = request.GET.get('find', '')
    keyword = request.GET.get('text', '')
    
    if (search_by == '0' or search_by == '') and keyword == '':
        return get_list(request, DefNet, template)
    
    else:
        q = get_query(search_by, keyword)        
        return get_list(request, DefNet, template, q)
    
def process_filter(request):
    search_by = request.GET.get('find', '')
    keyword = request.GET.get('text', '')
    
    if (search_by == '0' or search_by == '') and keyword == '':
        return DefNet.objects.all()
    
    else:
        q = get_query(search_by, keyword)
        return DefNet.objects.filter(q)
    
def process_filter_custom1(request):
    search_by = request.GET.get('find', '')
    keyword = request.GET.get('text', '')
    
    if (search_by == '0' or search_by == '') and keyword == '':
        q = Q(type=1) | Q(type=2) | Q(type=4)
        return DefNet.objects.filter(q)
    
    else:
        q = get_query(search_by, keyword)
        return DefNet.objects.filter(q)
    
def get_query(search_by, keyword):
    if search_by == '1':
        q = query_defnethost(keyword)
        
    elif search_by == '2':
        q = query_defnetdnshost(keyword)
        
    elif search_by == '3':
        q = query_defnetnetwork(keyword)
        
    elif search_by == '4':
        q = query_defnetgroup(keyword)
        
    else:
        q = query_all(keyword)
        
    return q

def query_all(keyword):
    q = Q(name__icontains=keyword)
    q = q | Q(comment__icontains=keyword)
    qhost = Q(defnethost__host__icontains=keyword)
    qdnshost = Q(defnetdnshost__hostname__icontains=keyword)
    qnetwork = Q(defnetnetwork__ipaddress__icontains=keyword)
    qnetwork = qnetwork | Q(defnetnetwork__netmask__icontains=keyword)
    result = q | qhost | qdnshost | qnetwork
    return result

def query_defnethost(keyword):
    q = Q(type=1)
    if keyword == '':
        return q
    
    q1 = Q(name__icontains=keyword)
    q2 = Q(comment__icontains=keyword)
    qhost = Q(defnethost__host__icontains=keyword)
    result = q & (q1 | q2 | qhost)
    return result

def query_defnetdnshost(keyword):
    q = Q(type=2)
    if keyword == '':
        return q
    
    q1 = Q(name__icontains=keyword)
    q2 = Q(comment__icontains=keyword)
    qdnshost = Q(defnetdnshost__hostname__icontains=keyword)
    result = q & (q1 | q2 | qdnshost)
    return result

def query_defnetnetwork(keyword):
    q = Q(type=3)
    if keyword == '':
        return q
    
    q1 = Q(name__icontains=keyword)
    q2 = Q(comment__icontains=keyword)
    qnetwork = Q(defnetnetwork__ipaddress__icontains=keyword)
    qnetwork = qnetwork | Q(defnetnetwork__netmask__icontains=keyword)
    result = q & (q1 | q2 | qnetwork)
    return result

def query_defnetgroup(keyword):
    q = Q(type=4)
    if keyword == '':
        return q
    
    q1 = Q(name__icontains=keyword)
    q2 = Q(comment__icontains=keyword)
    q3 = Q(defnetgroup__member__name__icontains=keyword)
    q4 = Q(defnetgroup__member__comment__icontains=keyword)
    q5 = Q(defnetgroup__member__defnethost__host__icontains=keyword)
    q6 = Q(defnetgroup__member__defnetdnshost__hostname__icontains=keyword)
    q7 = Q(defnetgroup__member__defnetnetwork__ipaddress__icontains=keyword)
    q7 = q7 | Q(defnetgroup__member__defnetnetwork__netmask__icontains=keyword)
    result = q & (q1 | q2 | q3 | q4 | q5 | q6 | q7)
    return result