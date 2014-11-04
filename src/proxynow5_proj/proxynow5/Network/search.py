from models import *
from proxynow5_proj.proxynow5.utils import *
from django.db.models import Q

#===============================================================================
# Network interface search queries
#===============================================================================
def process_netint(request, template):
    search_by = request.GET.get('find', '')
    keyword = request.GET.get('text', '')
    
    if (search_by == '0' or search_by == '') and keyword == '':
        return get_list(request, NetInt, template)
    
    else:
        q = get_netint_query(search_by, keyword)        
        return get_list(request, NetInt, template, q)

def get_netint_query(search_by, keyword):
    q = query_netint_all(keyword)
    return q

def query_netint_all(keyword):
    q = Q(name__icontains=keyword)
    q = q | Q(hardware__icontains=keyword)
    q = q | Q(address__icontains=keyword)
    q = q | Q(netmask__icontains=keyword)
    q = q | Q(gateway__icontains=keyword)
    try:
        mtu = int(keyword)
        q = q | Q(mtu=mtu)
        
    except:
        pass
    
    q = q | Q(comment__icontains=keyword)
    return q

#===============================================================================
# Network route search queries
#===============================================================================
def process_netroute(request, template):
    search_by = request.GET.get('find', '')
    keyword = request.GET.get('text', '')
    
    if (search_by == '0' or search_by == '') and keyword == '':
        return get_list(request, NetRoute, template)
    
    else:
        q = get_netroute_query(search_by, keyword)
        return get_list(request, NetRoute, template, q)
    
def get_netroute_query(search_by, keyword):
    if search_by == '1':
        q = query_netroute_netid_defnethost(keyword)
        
    elif search_by == '2':
        q = query_netroute_netid_defnetdnshost(keyword)
        
    elif search_by == '3':
        q = query_netroute_netid_defnetnetwork(keyword)
        
    elif search_by == '4':
        q = query_netroute_netid_defnetgroup(keyword)
        
    elif search_by == '5':
        q = query_netroute_gwid_defnethost(keyword)
        
    elif search_by == '6':
        q = query_netroute_gwid_defnetdnshost(keyword)
        
    else:
        q = query_netroute_all(keyword)
        
    return q

def query_netroute_all(keyword):
    q = Q(netid__name__icontains=keyword)
    q = q | Q(netid__comment__icontains=keyword)
    q = q | Q(gwid__name__icontains=keyword)
    q = q | Q(gwid__comment__icontains=keyword)
    q = q | Q(comment__icontains=keyword)
    q1 = Q(netid__defnethost__host__icontains=keyword)
    q1 = q1 | Q(netid__defnetdnshost__hostname__icontains=keyword)
    q1 = q1 | Q(netid__defnetnetwork__ipaddress__icontains=keyword)
    q1 = q1 | Q(netid__defnetnetwork__netmask__icontains=keyword)
    q2 = Q(gwid__defnethost__host__icontains=keyword)
    q2 = q2 | Q(gwid__defnetdnshost__hostname__icontains=keyword)
    q2 = q2 | Q(gwid__defnetnetwork__ipaddress__icontains=keyword)
    q2 = q2 | Q(gwid__defnetnetwork__netmask__icontains=keyword)
    result = q | q1 | q2
    return result

def query_netroute_netid_defnethost(keyword):
    q = Q(netid__type=1)
    if keyword == '':
        return q
    
    q1 = Q(netid__name__icontains=keyword)
    q2 = Q(netid__comment__icontains=keyword)
    qhost = Q(netid__defnethost__host__icontains=keyword)
    result = q & (q1 | q2 | qhost)
    return result

def query_netroute_netid_defnetdnshost(keyword):
    q = Q(netid__type=2)
    if keyword == '':
        return q
    
    q1 = Q(netid__name__icontains=keyword)
    q2 = Q(netid__comment__icontains=keyword)
    qdnshost = Q(netid__defnetdnshost__hostname__icontains=keyword)
    result = q & (q1 | q2 | qdnshost)
    return result

def query_netroute_netid_defnetnetwork(keyword):
    q = Q(netid__type=3)
    if keyword == '':
        return q
    
    q1 = Q(netid__name__icontains=keyword)
    q2 = Q(netid__comment__icontains=keyword)
    qnetwork = Q(netid__defnetnetwork__ipaddress__icontains=keyword)
    qnetwork = qnetwork | Q(netid__defnetnetwork__netmask__icontains=keyword)
    result = q & (q1 | q2 | qnetwork)
    return result

def query_netroute_netid_defnetgroup(keyword):
    q = Q(netid__type=4)
    if keyword == '':
        return q
    
    q1 = Q(netid__name__icontains=keyword)
    q2 = Q(netid__comment__icontains=keyword)
    q3 = Q(netid__defnetgroup__member__name__icontains=keyword)
    q4 = Q(netid__defnetgroup__member__comment__icontains=keyword)
    q5 = Q(netid__defnetgroup__member__defnethost__host__icontains=keyword)
    q6 = Q(netid__defnetgroup__member__defnetdnshost__hostname__icontains=keyword)
    q7 = Q(netid__defnetgroup__member__defnetnetwork__ipaddress__icontains=keyword)
    q7 = q7 | Q(defnetgroup__member__defnetnetwork__netmask__icontains=keyword)
    result = q & (q1 | q2 | q3 | q4 | q5 | q6 | q7)
    return result

def query_netroute_gwid_defnethost(keyword):
    q = Q(gwid__type=1)
    if keyword == '':
        return q
    
    q1 = Q(gwid__name__icontains=keyword)
    q2 = Q(gwid__comment__icontains=keyword)
    qhost = Q(gwid__defnethost__host__icontains=keyword)
    result = q & (q1 | q2 | qhost)
    return result

def query_netroute_gwid_defnetdnshost(keyword):
    q = Q(gwid__type=2)
    if keyword == '':
        return q
    
    q1 = Q(gwid__name__icontains=keyword)
    q2 = Q(gwid__comment__icontains=keyword)
    qdnshost = Q(gwid__defnetdnshost__hostname__icontains=keyword)
    result = q & (q1 | q2 | qdnshost)
    return result
    
#===============================================================================
# Network DHCP server
#===============================================================================
def process_netdhcp(request, template):
    keyword = request.GET.get('text', '')
    
    if keyword == '':
        return get_list(request, NetDHCP, template)
    
    else:
        q = get_netdhcp_query(keyword)
        return get_list(request, NetDHCP, template, q)

def get_netdhcp_query(keyword):
    q = query_netdhcp_all(keyword)
    return q

def query_netdhcp_all(keyword):
    q = Q(netid__name__icontains=keyword)
    q = q | Q(start__icontains=keyword)
    q = q | Q(end__icontains=keyword)
    q = q | Q(dnsserver1__icontains=keyword)
    q = q | Q(dnsserver2__icontains=keyword)
    q = q | Q(gateway__icontains=keyword)
    q = q | Q(domain__icontains=keyword)
    try:
        leasetime = int(keyword)
        q = q | Q(leasetime=leasetime)
    
    except:
        pass
    
    return q