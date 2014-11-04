from models import *
from proxynow5_proj.proxynow5.utils import *
from django.db.models import Q

#===============================================================================
# Port forwarding search queries
#===============================================================================
def process_natpf(request, template):
    keyword = request.GET.get('text', '')
    
    if keyword == '':
        return get_list(request, NAT_PF, template)
    
    else:
        q = get_natpf_query(keyword)
        return get_list(request, NAT_PF, template, q)
    
def get_natpf_query(keyword):
    q = query_natpf_all(keyword)
    return q

def query_natpf_all(keyword):
    q = Q(interface__name__icontains=keyword)
    q = q | Q(originalPort__name__icontains=keyword)
    q = q | Q(host__name__icontains=keyword)
    q = q | Q(newService__name__icontains=keyword)
    q = q | Q(comment__icontains=keyword)
    return q

#===============================================================================
# Masquerading search queries
#===============================================================================
def process_natmasq(request, template):
    keyword = request.GET.get('text', '')
    
    if keyword == '':
        return get_list(request, NAT_MASQ, template)
    
    else:
        q = get_natmasq_query(keyword)
        return get_list(request, NAT_MASQ, template, q)
    
def get_natmasq_query(keyword):
    q = query_natmasq_all(keyword)
    return q

def query_natmasq_all(keyword):
    q = Q(network__name__icontains=keyword)
    q = q | Q(interface__name__icontains=keyword)
    q = q | Q(comment__icontains=keyword)
    return q

#===============================================================================
# DNAT/SNAT search queries
#===============================================================================
def process_natdnatsnat(request, template):
    keyword = request.GET.get('text', '')
    
    if keyword == '':
        return get_list(request, NAT_DNAT_SNAT, template)
    
    else:
        q = get_natdnatsnat_query(keyword)
        return get_list(request, NAT_DNAT_SNAT, template, q)

def get_natdnatsnat_query(keyword):
    q = query_natdnatsnat_all(keyword)
    return q

def query_natdnatsnat_all(keyword):
    q = Q(originalSource__name__icontains=keyword)
    q = q | Q(originalPort__name__icontains=keyword)
    q = q | Q(originalDestination__name__icontains=keyword)
    q = q | Q(newDestinationHost__name__icontains=keyword)
    q = q | Q(newDestinationPort__name__icontains=keyword)
    q = q | Q(newSourceAddress__name__icontains=keyword)
    q = q | Q(newSourcePort__name__icontains=keyword)
    q = q | Q(comment__icontains=keyword)
    return q