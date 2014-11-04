from models import *
from proxynow5_proj.proxynow5.utils import *
from django.db.models import Q
from sets import Set


KeySearch ={'Eng': ['MON','TUE','WED','THU','FRI','SAT','SUN'], }

def process(request, template):
    search_by = request.GET.get('find', '')
    keyword = request.GET.get('text', '')
    
    if (search_by=="0" or search_by == "") and  keyword == '':
        q = Q(type=1) | Q(type=2)
        return get_list(request, DefSchd, template,q)
    
    elif (search_by=="2" or search_by == "") and  keyword == '':
        q = Q(type=search_by)
        return  get_list(request, DefSchd, template,q)
    
    lstkeysearch = KeySearch['Eng']
    
    lstkey = []
    lstkey = keyword.split(',')
    
    lstposition = []
    
    empty = 0
    issearchday = 0 
    
    #Check whether words that you want to search that searching on date or not 
    for k in lstkey:
        try:
            position = 0
            searched = k.strip().upper()
            if searched != "":
                position = lstkeysearch.index(searched) + 1
                print "Get Postion : %s"  %(str(position))
                lstposition.append(position)
                issearchday = 1
                print "Search Day......."
        except:
            empty = 1
            pass
    
    if empty == 1 and len(lstposition) != 0:
        q = Q(type = -1)
        return get_list(request, DefSchd, template,q)
    
    if issearchday == 1:
        print "search day"
        objlist = query_date(search_by,lstposition,keyword)
        return get_list(request, DefSchd, template, None,objlist)
    
    # Search folowing the Datetime 
    # Search time
    objlist = query_time(search_by,keyword)
    return get_list(request, DefSchd, template,None,objlist)

# This method is applied for left panel , when user click search it will show the na
def process_filter(request):
    search_by = request.GET.get('find', '')
    keyword = request.GET.get('text', '')
    
    if (search_by=="0" or search_by == "") and  keyword == '':
        q = Q(type=1) | Q(type=2)
        objlist = DefSchd.objects.filter(q)
        return objlist 
    
    elif (search_by=="2" or search_by == "") and  keyword == '':
        q = Q(type=search_by)
        objlist = DefSchd.objects.filter(q)
        return objlist  
    
    lstkeysearch = KeySearch['Eng']
    
    lstkey = []
    lstkey = keyword.split(',')
    
    lstposition = []
    
    empty = 0
    issearchday = 0 
    
    #Check whether words that you want to search that searching on date or not 
    for k in lstkey:
        try:
            position = 0
            searched = k.strip().upper()
            if searched != "":
                position = lstkeysearch.index(searched) + 1
                print "Get Postion : %s"  %(str(position))
                lstposition.append(position)
                issearchday = 1
                print "Search Day......."
        except:
            empty = 1
            pass
    
    if empty == 1 and len(lstposition) != 0:
        q = Q(type = -1)
        objlist = DefSchd.objects.filter(q)
        return objlist
    
    if issearchday == 1:
        print "search day"
        objlist = query_date(search_by,lstposition,keyword)
        return objlist
    
    # Search folowing the Datetime 
    # Search time
    objlist = query_time(search_by,keyword)
    return objlist

    
    
def query_date(kind,lspostion,text):
    
    # the case of searching all.
    if kind == "0":
        q = Q(type = 1) | Q(type = 2)
    # the case searching specific options.    
    else:
        q = Q(type = kind)
    
    count = len(lspostion)
    
    # Set list of text that is searched by users.
    setkeywork = Set(lspostion)
    
    lst = DefSchd.objects.filter(q)
    
    lstobject =[]
    lstid = []
     
    for objlst in lst:
        aa = convert2binary(objlst.weekdays)
        setbinary = Set(aa)
        t = list(setkeywork & setbinary) 
        countfind = len(t)
        
        if count == countfind:
            lstobject.append(objlst)
            lstid.append(objlst.id)
          
    lst_name_comment = query_name_comment(q,text,lstid)
    
    for o in lst_name_comment:
        lstobject.append(o)
    
    return lstobject  


def query_time(kind,keywork):
  
    if keywork == "00":
        keywork = "0"
    
    if kind == "0":
        q = Q(type = 1) | Q(type = 2) 
    else:
        q = Q(type = kind)
    
    objlst = DefSchd.objects.filter(q) 
    lstobject = []
    lstid = [] 
    
    for obj in objlst:
        
        ''' if recurring then we don't care the year, month ,day , we just care about the Hour and miniutes.'''
        if obj.type == 2:
            if keywork in [obj.name,str(obj.start.hour),str(obj.start.minute),str(obj.end.hour),str(obj.end.minute)]:
                lstobject.append(obj)
                lstid.append(obj.id)
                
        elif obj.type == 1 :
            if keywork in [obj.name,str(obj.start.year),str(obj.start.month),str(obj.start.day),str(obj.start.hour),str(obj.start.minute),str(obj.end.year),str(obj.end.month),str(obj.end.day),str(obj.end.hour),str(obj.end.minute)]:
                lstobject.append(obj)
                lstid.append(obj.id)
                
    lst_name_comment = query_name_comment(q,keywork,lstid)
    
    for o in lst_name_comment:
        lstobject.append(o)
       
    return lstobject 

    
def query_name_comment(q,text,lstid): 
    lst_name_comment= [] 
    qname = Q(name__icontains=text)
    qcomment =  Q(comment__icontains=text)
    qid = Q(id__in = lstid)
     
    qtotal = q & (qname | qcomment) 
    
    if len(lstid) != 0 :  
        lst_name_comment = DefSchd.objects.filter(qtotal).exclude(qid)
    else:
        lst_name_comment = DefSchd.objects.filter(qtotal)
        
    return lst_name_comment

     