from models import *
from proxynow5_proj.proxynow5.utils import *
from django.db.models import Q

def process(request, template):
    search_by = request.GET.get('find', '')
    keyword = request.GET.get('text', '')
    
    if (search_by == '0' or search_by == '') and keyword == '':
        return get_list(request, DefServices, template)
    
    else:
        q = get_query(search_by, keyword)    
        return get_list(request, DefServices, template, q)
    
def process_filter(request):
    search_by = request.GET.get('find', '')
    keyword = request.GET.get('text', '')
    
    if (search_by == '0' or search_by == '') and keyword == '':
        return DefServices.objects.all()
    
    else:
        q = get_query(search_by, keyword)
        return DefServices.objects.filter(q)
    
def get_query(search_by, keyword):
    if search_by == '1':
        q = query_defservicestcp(keyword)
        
    elif search_by == '2':
        q = query_defservicesudp(keyword)
        
    elif search_by == '3':
        q = query_defservicesicmp(keyword)
        
    elif search_by == '4':
        q = query_defservicesip(keyword)
        
    elif search_by == '5':
        q = query_defservicesgroup(keyword)
        
    else:
        q = query_all(keyword)
        
    return q

def query_all(keyword):
    q = Q(name__icontains=keyword)
    q = q | Q(comment__icontains=keyword)
    qtcp = Q(defservicestcp__dstport__icontains=keyword)
    qtcp = qtcp | Q(defservicestcp__srcport__icontains=keyword)
    qudp = Q(defservicesudp__dstport__icontains=keyword)
    qudp = qudp | Q(defservicesudp__srcport__icontains=keyword)
    try:
        type = int(keyword)
        qicmp = Q(defservicesicmp__type=type)
        
    except:
        qicmp = Q()
        
    try:
        code = int(keyword)
        qicmp = qicmp | Q(defservicesicmp__code=code)
        
    except:
        pass
    
    try:
        protocol = int(keyword)
        qip = Q(defservicesip__protocol=protocol)
        
    except:
        qip = Q()
        
    result = q | qtcp | qudp | qicmp | qip
    return result

def query_defservicestcp(keyword):
    q = Q(type=1)
    if keyword == '':
        return q
    
    q1 = Q(name__icontains=keyword)
    q2 = Q(comment__icontains=keyword)
    qtcp = Q(defservicestcp__dstport__icontains=keyword)
    qtcp = qtcp | Q(defservicestcp__srcport__icontains=keyword)
    result = q & (q1 | q2 | qtcp)
    return result

def query_defservicesudp(keyword):
    q = Q(type=2)
    if keyword == '':
        return q
    
    q1 = Q(name__icontains=keyword)
    q2 = Q(comment__icontains=keyword)
    qudp = Q(defservicesudp__dstport__icontains=keyword)
    qudp = qudp | Q(defservicesudp__srcport__icontains=keyword)
    result = q & (q1 | q2 | qudp)
    return result

def query_defservicesicmp(keyword):
    q = Q(type=3)
    if keyword == '':
        return q
    
    q1 = Q(name__icontains=keyword)
    q2 = Q(comment__icontains=keyword)
    try:
        type = int(keyword)
        qicmp = Q(defservicesicmp__type=type)
        
    except:
        qicmp = Q()
        
    try:
        code = int(keyword)
        qicmp = qicmp | Q(defservicesicmp__code=code)
        
    except:
        pass
    
    result = q & (q1 | q2 | qicmp)
    return result

def query_defservicesip(keyword):
    q = Q(type=4)
    if keyword == '':
        return q
    
    q1 = Q(name__icontains=keyword)
    q2 = Q(comment__icontains=keyword)
    try:
        protocol = int(keyword)
        qip = Q(defservicesip__protocol=protocol)
        
    except:
        qip = Q()
        
    result = q & (q1 | q2 | qip)
    return result
    
def query_defservicesgroup(keyword):
    q = Q(type=5)
    if keyword == '':
        return q
    
    q1 = Q(name__icontains=keyword)
    q2 = Q(comment__icontains=keyword)
    q3 = Q(defservicesgroup__member__name__icontains=keyword)
    q4 = Q(defservicesgroup__member__comment__icontains=keyword)
    q5 = Q(defservicesgroup__member__defservicestcp__dstport__icontains=keyword)
    q5 = q5 | Q(defservicesgroup__member__defservicestcp__srcport__icontains=keyword)
    q6 = Q(defservicesgroup__member__defservicesudp__dstport__icontains=keyword)
    q6 = q6 | Q(defservicesgroup__member__defservicesudp__srcport__icontains=keyword)
    try:
        type = int(keyword)
        q7 = Q(defservicesgroup__member__defservicesicmp__type=type)
        
    except:
        q7 = Q()
        
    try:
        code = int(keyword)
        q7 = q7 | Q(defservicesgroup__member__defservicesicmp__code=code)
        
    except:
        pass
    
    try:
        protocol = int(keyword)
        q8 = Q(defservicesgroup__member__defservicesip__protocol=protocol)
        
    except:
        q8 = Q()
        
    result = q & (q1 | q2 | q3 | q4 | q5 | q6 | q7 | q8)
    return result