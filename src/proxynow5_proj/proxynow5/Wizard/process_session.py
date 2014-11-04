from django.utils.translation import ugettext as _
from proxynow5_proj.proxynow5.Wizard.util_wizard import init_get_data
from proxynow5_proj.proxynow5.exceptions import UIException
'''
    nameTableSession : is STORE_CATEGORY,STORE_SCHEDULES....
    
'''
from proxynow5_proj.proxynow5.Definition_User.models import DefUser

# ["0",listname,[accesstype,]] 


#store schedule
STORE_SCHEDULE = "STORE_SCHEDULES___"

#store the host 
STORE_HOST = "STORE_HOSTS____"

STORE_CATEGORY = "STORE_CATEGORY_____"

STORE_WHITE_LIST = "STORE_WHITE_LIST__"

STORE_BLACK_LIST = "STORE_BLACK_LIST__"

STORE_EXTENSION = "STORE_EXTENSION__"

STORE_MIME = "STORE_MIME_"

STORE_CONTENT = 'STORE_CONTENT__'

STORE_EXEMPTED_HOSTS = 'STORE_EXEMPTED_HOSTS__'
 
STORE_EXEMPTED_URLS = 'STORE_EXEMPTED_URLS__'

STORE_EXEMPTED_USERS = 'STORE_EXEMPTED_USERS__'

STORE_POLICY = "STORE_POLICY"

STORE_NETSTRUST = "NET_STRUCT"

# This parameter to let system know if the system has been inited or not. 
# Pls don't change this text look at save_wizard 
STORE_INIT_INFO = "STORE_INIT_INFO_PROXYNOW"

STORE_ISINI = 'STORE_ISINI' 

lserror = []

def store_session(request,nameTableSession,nameobj,idobj,obj):
    
    try:
        dict_general = {}
        dict_key_map = {} 
        name = nameobj.lower()
        
        str_idobj = str(idobj)
        
        [dict_general,dict_key_map] = init_get_data(nameTableSession,request)
               
        dict_general[name] = obj
        dict_key_map[str_idobj] = name
        
        request.session[nameTableSession] = [dict_general,dict_key_map]
        
        return True
    except Exception,ex:
        print "Error Info store_session %s" %str(ex)
        return False
        
def is_existed_in_session(request,nameTableSession,nameObj):
   
    dict_general = {}
    dic_key_map = {}
        
    name = nameObj.lower()
    
    if nameTableSession in request.session:
        [dict_general,dic_key_map] = request.session[nameTableSession]
                       
        if dict_general.has_key(name):
            raise UIException(_(u'The name %s already exist.' % nameObj))
            
    

def get_allitems_session(request,nameTableSession):
    
    try:
        dict_general = {}
        dic_key_map = {}
        lst_obj = []
        
        [dict_general,dict_key_map] = init_get_data(nameTableSession,request)
        
        if nameTableSession == STORE_SCHEDULE:    
            for key_id in dict_general:
                obj = dict_general[key_id]
                if obj != None:
                    lst_obj.append(obj)

        else:
            for key_id in dict_general:
                obj = dict_general[key_id]
                if obj != None:
                    [o,h] = obj
                    if o!= None:
                        lst_obj.append(o) 
                            
        return lst_obj 
    
    except Exception,ex:
        print "Error Info get_allitems_schedule_session %s" %str(ex)
        return []

def get_allitems_session_user(dict_user):
    lst = []
    
    for key in dict_user:   
        o = DefUser()
        x = dict_user[key]
        o.name = x.name
        o.id = x.name
        o.type = 1
        lst.append(o)
        
    return lst
        
        
    
def get_items_session_byname(request,nameTableSession,nameObj):
    
    dict_general = {}
    dict_key_map = {}
    
    nameObj = nameObj.lower()
    
    if nameTableSession in request.session:
        [dict_general,dict_key_map] = request.session[nameTableSession]
        
        if dict_general.has_key(nameObj):
            return dict_general[nameObj]
    
    return None

def get_items_session_byid(request,nameTableSession,idObj):
    
    try:
        dict_general = {}
        dict_key_map = {} 
        
        nameObj = ""
        
        str_idobj = str(idObj)
        
        [dict_general,dict_key_map] = init_get_data(nameTableSession,request)
                
        if dict_key_map.has_key(str_idobj):
            nameObj = dict_key_map[str_idobj]
            nameObj = nameObj.lower()
            
            if dict_general.has_key(nameObj):
                return dict_general[nameObj]
        
        return None
    except Exception,ex:
        print "Error Info get_items_session_byid %s " %str(ex)
        return None
    
def update_items_session(request,nameTableSession,nameObj,idObj,Obj):
    
    dict_general = {}
    dict_key_map = {} 
    
    oldname = ""
    newname = nameObj.lower();
    
    str_obj = str(idObj)
    
    if nameTableSession in request.session:
        [dict_general,dict_key_map] = request.session[nameTableSession]
    
    
    if dict_key_map.has_key(str_obj):
        oldname = dict_key_map[str_obj]
        
        if oldname == newname :
            dict_general[oldname] = Obj
            request.session[nameTableSession] = [dict_general,dict_key_map]
#            print "Old name"
#            [c,d] = dict_general[oldname]
#            print c.name
#            print c.comment
#            print ":;;;;;" 
            return Obj
        else:
            #Chcked the name is existed or not.
            if dict_general.has_key(newname):
                raise UIException(_(u'The name %s already exist.' % nameObj))
            else:
                del dict_general[oldname]
                
                dict_key_map[str_obj] = newname
                dict_general[newname] = Obj
                
                request.session[nameTableSession] = [dict_general,dict_key_map]
                return Obj
    else:
        print "ID is not existed"      
        
    return None    
 

def delete_session(request):
    
    try:
        if STORE_SCHEDULE in request.session: 
            del request.session[STORE_SCHEDULE]
            
        if STORE_HOST in request.session:
            del request.session[STORE_HOST]
        
        if STORE_CATEGORY in request.session:   
            del request.session[STORE_CATEGORY]
            
        if STORE_WHITE_LIST in request.session:
            del request.session[STORE_WHITE_LIST]
        
        if STORE_BLACK_LIST in request.session:
            del request.session[STORE_BLACK_LIST]
        
        if STORE_EXTENSION in request.session:
            del request.session[STORE_EXTENSION]
            
        if STORE_MIME in request.session:
            del request.session[STORE_MIME]
        
        if STORE_CONTENT in request.session:
            del request.session[STORE_CONTENT]
        
        if STORE_EXEMPTED_HOSTS in request.session:     
            del request.session[STORE_EXEMPTED_HOSTS]
        
        if STORE_EXEMPTED_URLS in request.session:
            del request.session[STORE_EXEMPTED_URLS]
        
        if STORE_EXEMPTED_USERS in request.session:  
            del request.session[STORE_EXEMPTED_USERS]
        
        if STORE_POLICY in request.session:
            del request.session[STORE_POLICY]
        
        print "Deletion Session."
        
    except Exception,ex:
        print "Error Info -- Deletion Session %s" %str(ex)
        pass
    
 

            

    
    
#ob = assi    gn_temp_schedule(officehours)
#ob.save()

#c1 = assign_temp_wpcat(cat1)  
#c1.save()  
#
#v1 = assign_temp_wcatvalue(cat1_items_1,c1)
#v1.save()

#w1 = assign_temp_wpwhitelist(whitelist1) 
#w1.save()
#v1 = assign_temp_wpwhitelistvalue(whitelist_items_1_1,w1)
#v1.save()

#b1 = assign_temp_wpblacklist(blacklist1)
#b1.save()
#
#b11 = assign_temp_wpblacklistvalue(blacklist_items_1_1,b1)
#b11.save()

#b =  assign_temp_wpext(allow_extension1)
#b.save()
#c = assign_temp_wpextvalue(extension_items_1_1,b)
#c.save()

#t = assign_temp_wpcontent(content1)
#t.save()
#k = assign_temp_wpcontentvalue(content_items_1_1,t)
#k.save()

#t = save_temp_wpmime(allowed_mime1)
#k = assign_temp_wpmimevalue(allowed_mime_items_1_1,t)
#k.save()



        