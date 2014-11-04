from models import *
from proxynow5_proj.proxynow5.utils import *
from django.db.models import Q

def query_all(keyword):
    q = Q(name__icontains=keyword)
    q = q | Q(displayname__icontains=keyword)
    return q