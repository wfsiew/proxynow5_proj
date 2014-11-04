from django import template
from proxynow5_proj.proxynow5.Network.models import *

register = template.Library()


    
@register.filter
def get_defbalance_check(o):
    
    # Interface is not existed in load balancing
    try:
        x=o.netlb_set.get(id=o)
        
        return "checked=%s" %"checked"
    except :
        return ""
    