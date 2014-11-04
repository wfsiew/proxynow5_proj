from Definition_User.models import *
from AD_User.models import *
from Definition_User import search as searchuser
from AD_User import search as searchaduser
from django.db.models import Q

def process_user_filter(request):
    search_by = request.GET.get('find', '')
    keyword = request.GET.get('text', '')
    lsuser = []
    lsaduser = []
    if (search_by == '0' or search_by == '') and keyword == '':
        lsuser = DefUser.objects.all()
        lsaduser = ADUser.objects.all()
        return lsuser, lsaduser
    
    else:
        lsuser, lsaduser = process_user_query(search_by, keyword)
        return lsuser, lsaduser
    
def process_user_query(search_by, keyword):
    lsuser = []
    lsaduser = []
    if search_by == '1':
        q = searchuser.query_all(keyword)
        lsuser = DefUser.objects.filter(q)
    
    elif search_by == '2':
        q = searchaduser.query_all(keyword)
        lsaduser = ADUser.objects.filter(q)
        
    else:
        q1 = searchuser.query_all(keyword)
        q2 = searchaduser.query_all(keyword)
        lsuser = DefUser.objects.filter(q1)
        lsaduser = ADUser.objects.filter(q2)
        
    return lsuser, lsaduser