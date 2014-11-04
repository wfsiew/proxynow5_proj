from proxynow5_proj.proxynow5.Definition_Schedule.models import DefSchd
from proxynow5_proj.proxynow5.WebProxy.models import WPProfile, WPProfileExcept
from proxynow5_proj.proxynow5.WebProxy_Filter.models import WPCat, WPWhiteList, \
    WPBlackList, WPExt, WPContent, WPMIME
from proxynow5_proj.proxynow5.Wizard.defined_object import schd001, \
    schd002, schd003, cat1, cat1_items_1, \
    cat1_items_2, whitelist1, whitelist_items_1_1, whitelist_items_1_2, blacklist1, \
    blacklist_items_1_1, blacklist_items_1_2, allow_extension1, block_extension2, \
    extension_items_1_1, extension_items_1_2, extension_items_2_1, \
    extension_items_2_2, content1, content_items_1_1, content_items_1_2, \
    allowed_mime1, blocked_mime2, allowed_mime_items_1_1, blocked_mime_items_2_2
from proxynow5_proj.proxynow5.Wizard.process_session import STORE_SCHEDULE, \
    STORE_CATEGORY, STORE_WHITE_LIST, STORE_BLACK_LIST, STORE_EXTENSION, \
    STORE_CONTENT, STORE_MIME, STORE_POLICY, store_session, get_items_session_byid, \
    STORE_INIT_INFO, delete_session
from proxynow5_proj.proxynow5.Wizard.profile_wizard import WPprofileSession
from proxynow5_proj.proxynow5.Wizard.util_wizard import init_get_data

'''
    ================================================================
    ================================================================
    |       This part to init the template session
    Todo: we can't check the name has existed or not , bcos the name can be changed
    by user.
    Solution :Check the id (not yet done) --> change later.
    ================================================================
    ================================================================
''' 


    
def init_schedules_session(request):
    
    try:
        '''
            we have checked outside the method ,if method is called or not
            so we no need to check here again.
            Note : just run one time only during wizard.
        '''
        nameschd001 = schd001.name.lower()
        store_session(request,STORE_SCHEDULE,nameschd001,"1",schd001)
        
        nameschd002 = schd002.name.lower()
        store_session(request,STORE_SCHEDULE,nameschd002,"2",schd002)
        
        nameschd003 = schd003.name.lower()
        store_session(request,STORE_SCHEDULE,nameschd003,"3",schd003)
        
    except Exception,ex:
        print "Error info init_schedules_session %s " %str(ex)
        pass
        
def init_category_session(request):
    
    try:
        '''
            we have checked outside the method ,if method is called or not
            so we no need to check here again.
            Note : just run one time only during wizard.
        '''
        
        for c in WPCat.objects.all():
            namecat1 = c.name.lower()
            obj = [c,['']]
            store_session(request,STORE_CATEGORY,namecat1,str(c.id),obj)
        
    except Exception,ex:
        print "Error info init_category_session %s" %str(ex)
        pass
        
    
def init_whitelist_session(request):
    try :
        '''
            we have checked outside the method ,if method is called or not
            so we no need to check here again.
            Note : just run one time only during wizard.
        '''
        
        namewhitelist = whitelist1.name.lower()
        obj = [whitelist1,[whitelist_items_1_1,whitelist_items_1_2]]
        store_session(request,STORE_WHITE_LIST,namewhitelist,"1",obj)
             
    except Exception,ex:
        print "Error info init_whitelist_session %s " %str(ex)
        pass
         
def init_blacklist_session(request):
    try:
        '''
            we have checked outside the method ,if method is called or not
            so we no need to check here again.
            Note : just run one time only during wizard.
        '''
        
        nameblacklist = blacklist1.name.lower()
        obj = [blacklist1,[blacklist_items_1_1,blacklist_items_1_2]]
        store_session(request,STORE_BLACK_LIST,nameblacklist,"1",obj)
        
    except Exception,ex:    
        print "Error info init_blacklist_session %s " %str(ex)
        pass

def init_extension(request):
    
    try:
        '''
            we have checked outside the method ,if method is called or not
            so we no need to check here again.
            Note : just run one time only during wizard.
        '''
        
        nameextension1 = allow_extension1.name.lower()
        obj1 = [allow_extension1,[extension_items_1_1,extension_items_1_2]]
        store_session(request,STORE_EXTENSION,nameextension1,"1",obj1)
        
        nameextension2 = block_extension2.name.lower()
        obj2 = [block_extension2,[extension_items_2_1,extension_items_2_2]]
        store_session(request,STORE_EXTENSION,nameextension2,"2",obj2)
            
    except Exception,ex:
        print "Error info init_extension %s" %str(ex)
        pass
        

def init_content(request):
    try:
        '''
            we have checked outside the method ,if method is called or not
            so we no need to check here again.
            Note : just run one time only during wizard.
        '''
        
        namecontent = content1.name.lower()
        obj = [content1,[content_items_1_1,content_items_1_2]]
        store_session(request,STORE_CONTENT,namecontent,"1",obj)
            
    except Exception,ex:
        print "Error Info init_content %s " %str(ex)
        pass
     
def init_mime(request):
    try:
        '''
            we have checked outside the method ,if method is called or not
            so we no need to check here again.
            Note : just run one time only during wizard.
        '''
        
        nameallowmime1 = allowed_mime1.name.lower()
        obj1 = [allowed_mime1,[allowed_mime_items_1_1]]
        store_session(request,STORE_MIME,nameallowmime1,"1",obj1)
        
        nameblockmime2 = blocked_mime2.name.lower()
        obj2 = [blocked_mime2,[blocked_mime_items_2_2]]
        store_session(request,STORE_MIME,nameblockmime2,"2",obj2)
           
    except Exception,ex:
        print "Error Info init_mime %s" %str(ex)
        pass

def init_info(request):
    try:
        if STORE_INIT_INFO in request.session:
            
            a = request.session[STORE_INIT_INFO]
            
            try:
                nnn = int(a)
                
                if nnn != 1:
                    delete_session(request)
                    init_schedules_session(request)
                    init_category_session(request)
                    init_whitelist_session(request)
                    init_blacklist_session(request)
            
                    init_extension(request)
                    init_content(request)
                    init_mime(request)
            
                    init_policy(request)
                    
                    request.session[STORE_INIT_INFO] = 1 
            except:
                pass
        else:
            delete_session(request)
            init_schedules_session(request)
            init_category_session(request)
            init_whitelist_session(request)
            init_blacklist_session(request)
            
            init_extension(request)
            init_content(request)
            init_mime(request)
            
            init_policy(request)
            
            request.session[STORE_INIT_INFO] = 1
            
    except Exception,ex :
        print "Error Info init_info %s " %str(ex)
        request.session[STORE_INIT_INFO] = 1
        pass

'''
    ---------------------------------------------------------------------------
    ---------------------------------------------------------------------------
    | Init_OfficeHour_policy
    ---------------------------------------------------------------------------
    ---------------------------------------------------------------------------
'''
def get_init_schedule(request,lst_id):
    lst_schedule = []
    try:
        print "get_init_schedule"   
          
        for id_officehours in lst_id:
            try:
                obj =  DefSchd()
                obj = get_items_session_byid(request,STORE_SCHEDULE,str(id_officehours))
               
                if obj != None:
                    lst_schedule.append(obj)
                    
            except :
                pass
            
        return lst_schedule  
    
    except Exception,ex:
        print "Error Info get_init_schedule %s" %str(ex)
        return lst_schedule
        
    
def get_init_cat(request,lst_id):
    
    lst_cat = []
    try:
        print "get_init_cat"
      
        for id_cat in lst_id: 
            try:
                obj = get_items_session_byid(request,STORE_CATEGORY,str(id_cat))
                
                if obj != None :
                    o =WPCat()
                    [o,h] = obj
                        
                    if o != None:  
                        lst_cat.append(o) 
                    
            except :
                pass
             
        return lst_cat
    
    except Exception,ex:
        print "Error Info get_init_cat %s" %str(ex)
        return lst_cat

def get_init_whitelist(request,lst_id):
    
    lst_whitelist = []
    try :
        print "get_init_whitelist_OfficeHour."
        
        for id_whitelist in lst_id:
            try:
                obj = get_items_session_byid(request,STORE_WHITE_LIST,str(id_whitelist))
                
                if obj != None :
                    o = WPWhiteList()
                    [o,h] = obj
                    
                    if o!= None:
                        lst_whitelist.append(o)
                    
            except:
                pass
                
        return lst_whitelist
    
    except Exception,ex:
        return lst_whitelist
        
def get_init_blacklist(request,lst_id):
    lst_blacklist = []
    try:
        print "get_init_blacklist_OfficeHour"
        
        for id_blacklist in lst_id: 
            try:
                
                obj = get_items_session_byid(request,STORE_BLACK_LIST,str(id_blacklist))
                
                if obj != None:
                    o = WPBlackList() 
                    [o,h] = obj
                    
                    if o != None:
                        lst_blacklist.append(o)
            except:
                pass
            
        return lst_blacklist
    
    except Exception,ex:
        print "Error Info get_init_blacklist %s " %str(ex)
        return lst_blacklist

def get_init_allowedextension(request,lst_id):
    lst_allowedextension = []
    try:
        print "get_init_allow_extension"
        
        for id_extension in lst_id:
            try:
                obj = get_items_session_byid(request,STORE_EXTENSION,str(id_extension))
                
                if obj != None:
                    o = WPExt()
                    [o,h] = obj
                    
                    if o != None:
                        lst_allowedextension.append(o)
               
            except:
                pass
            
        return lst_allowedextension
    
    except Exception,ex:
        print "Error Info get_init_allowedextension "
        return lst_allowedextension

def get_init_blockedextension(request,lst_id):
    
    lst_blockedextension = []
    try:
        print "get_init_blocked_extension"
       
        for id_extension in lst_id:
            try:
                obj = get_items_session_byid(request,STORE_EXTENSION,str(id_extension))
                
                if obj != None:
                    o = WPExt()
                    [o,h] = obj
                    
                    if o != None:
                        lst_blockedextension.append(o)
                
            except :
                pass
                
        return lst_blockedextension
    
    except Exception,ex:
        print "Error Info get_init_blockedextension %s " %str(ex)
        return lst_blockedextension
    
def get_init_content(request,lst_id):
    lst_content = []
    try:
        print "get_init_content"
       
        for id_content in lst_id :
            try:
                obj = get_items_session_byid(request,STORE_CONTENT,str(id_content))
                
                if obj != None :
                    o = WPContent()
                    [o,h] = obj
                    
                    if o != None:
                        lst_content.append(o)
            except :
                pass
        
        return lst_content
    
    except Exception,ex:
        return lst_content
    
def get_init_allowmime(request,lst_id):
    lst_mime = []
    
    try:
        print "get_init_allowmime"
        
        for id_mime in lst_id:
            try:
                obj = get_items_session_byid(request,STORE_MIME,str(id_mime))
                
                if obj != None:
                    o = WPMIME()
                    [o,h] = obj
                    
                    if o!= None:
                        lst_mime.append(o)
            except:
                pass
        
        return lst_mime
    
    except Exception,ex:
        print "Error Info get_init_allowmime %s " %str(ex)
        return lst_mime
        
def get_init_blockmime(request,lst_id):
    lst_mime = []
    try:
        print "get_init_blockmime"
       
        for id_content in lst_id:
            try:
                obj = get_items_session_byid(request,STORE_MIME,str(id_content))
                
                if obj != None: 
                    o = WPMIME()
                    [o,h] = obj
                    
                    if o!= None:
                        lst_mime.append(o)
            except :
                pass
        
        return lst_mime
    except Exception,ex:
        print "Error Info get_init_allowmime %s " %str(ex)
        return lst_mime
      
#def get_init_profile_OfficeHour():
#    
#    wprofile = WPProfile()
#    wprofile.name = "Office_Hour"
#    wprofile.location = 1
#    wprofile.catdef= 1
#    wprofile.sizequota = 1
#    wprofile.timequota = 1
#    wprofile.enable = 1 
#    wprofile.safesearchon = 1
#             
#    return wprofile
#
#
#def get_init_profileexception_OfficeHour():
#    
#    wpexceptprofile = WPProfileExcept()
#    wpexceptprofile.skipauth = 0
#    wpexceptprofile.skipcache = 1
#    wpexceptprofile.skipav = 1
#    wpexceptprofile.skipext = 1
#    wpexceptprofile.skipmime = 2
#    wpexceptprofile.skipurl = 2
#    wpexceptprofile.skipcontentfilter = 1
#    
#    return wpexceptprofile

def init_Unrestricted_policy(request):
    
    lst_schedule = []
    lst_cat = []
    lst_whitelist = []
    lst_blacklist = []
    lst_allowext = []
    lst_blockext = []
    lst_allowmime = []
    lst_blockmime = []
    lst_content = []
    lst_excepteduser = []
    lst_exceptedlink = []
    lst_exceptednet = []
     
    wprofile = WPProfile()
    wprofile.name = "Unrestricted"
    wprofile.location = 1
    wprofile.catdef= 2
    wprofile.sizequota = 0
    wprofile.timequota = 0
    wprofile.enable = 1 
    wprofile.safesearchon = 1
    
    wpexceptprofile = WPProfileExcept()
    wpexceptprofile.skipauth = 0
    wpexceptprofile.skipcache = 1
    wpexceptprofile.skipav = 1
    wpexceptprofile.skipext = 1
    wpexceptprofile.skipmime = 2
    wpexceptprofile.skipurl = 2
    wpexceptprofile.skipcontentfilter = 1
    
    # if schedule is always on, just supply empty value
    # lst_schedule = ''
    
#    lst_schedule = get_init_schedule(request,["1"])
    lst_schedule = ''
    lst_cat = get_init_cat(request,[])
    lst_whitelist = get_init_whitelist(request,["1"])
    lst_blacklist = get_init_blacklist(request,["1"])
    lst_allowext = get_init_allowedextension(request,["1"])
    lst_blockext = get_init_blockedextension(request,["1"])
    lst_content = get_init_content(request,["1"])
    lst_allowmime = get_init_allowmime(request,["1"])
    lst_blockmime = get_init_blockmime(request,["1"])
    
    policy_unrestricted = WPprofileSession(wprofile,
                                          lst_schedule,
                                          lst_cat,
                                          lst_whitelist,
                                          lst_blacklist,
                                          lst_allowext,
                                          lst_blockext,
                                          lst_allowmime,
                                          lst_blockmime,
                                          lst_content, 
                                          wpexceptprofile,
                                          lst_excepteduser,
                                          lst_exceptedlink, 
                                          lst_exceptednet)
    policy_unrestricted.id = 1
    
    return policy_unrestricted

def init_Unrestricted_Safe_policy(request):
    
    lst_schedule = []
    lst_cat = []
    lst_whitelist = []
    lst_blacklist = []
    lst_allowext = []
    lst_blockext = []
    lst_allowmime = []
    lst_blockmime = []
    lst_content = []
    lst_excepteduser = []
    lst_exceptedlink = []
    lst_exceptednet = []
     
    wprofile = WPProfile()
    wprofile.name = "Unrestricted But Block Unsafe Sites"
    wprofile.location = 2
    wprofile.catdef= 2
    wprofile.sizequota = 0
    wprofile.timequota = 0
    wprofile.enable = 1 
    wprofile.safesearchon = 1
    
    wpexceptprofile = WPProfileExcept()
    wpexceptprofile.skipauth = 0
    wpexceptprofile.skipcache = 1
    wpexceptprofile.skipav = 1
    wpexceptprofile.skipext = 1
    wpexceptprofile.skipmime = 2
    wpexceptprofile.skipurl = 2
    wpexceptprofile.skipcontentfilter = 1
    
#    lst_schedule = get_init_schedule(request,["1"])
    lst_schedule = ''
    lst_cat = get_init_cat(request,["22","13","26"])
    lst_whitelist = get_init_whitelist(request,["1"])
    lst_blacklist = get_init_blacklist(request,["1"])
    lst_allowext = get_init_allowedextension(request,["1"])
    lst_blockext = get_init_blockedextension(request,["1"])
    lst_content = get_init_content(request,["1"])
    lst_allowmime = get_init_allowmime(request,["1"])
    lst_blockmime = get_init_blockmime(request,["1"])
    
    policy_unrestricted_safe = WPprofileSession(wprofile,
                                          lst_schedule,
                                          lst_cat,
                                          lst_whitelist,
                                          lst_blacklist,
                                          lst_allowext,
                                          lst_blockext,
                                          lst_allowmime,
                                          lst_blockmime,
                                          lst_content, 
                                          wpexceptprofile,
                                          lst_excepteduser,
                                          lst_exceptedlink, 
                                          lst_exceptednet)
    policy_unrestricted_safe.id = 2
    
    return policy_unrestricted_safe

def init_Strict_OfficeHour_policy(request):
    
    lst_schedule = []
    lst_cat = []
    lst_whitelist = []
    lst_blacklist = []
    lst_allowext = []
    lst_blockext = []
    lst_allowmime = []
    lst_blockmime = []
    lst_content = []
    lst_excepteduser = []
    lst_exceptedlink = []
    lst_exceptednet = []
     
    wprofile = WPProfile()
    wprofile.name = "Strict During Office Hour"
    wprofile.location = 3
    wprofile.catdef= 2
    wprofile.sizequota = 0
    wprofile.timequota = 0
    wprofile.enable = 1 
    wprofile.safesearchon = 1
    
    wpexceptprofile = WPProfileExcept()
    wpexceptprofile.skipauth = 0
    wpexceptprofile.skipcache = 1
    wpexceptprofile.skipav = 1
    wpexceptprofile.skipext = 1
    wpexceptprofile.skipmime = 2
    wpexceptprofile.skipurl = 2
    wpexceptprofile.skipcontentfilter = 1
    
    lst_schedule = get_init_schedule(request,["1"])
    lst_cat = get_init_cat(request,["5","29","30","31","32","33","34","35","36","37","38","39","26","16","42","23","3","8","18","21","9","43","17","11","22","12","4","13","15",])
    lst_whitelist = get_init_whitelist(request,["1"])
    lst_blacklist = get_init_blacklist(request,["1"])
    lst_allowext = get_init_allowedextension(request,["1"])
    lst_blockext = get_init_blockedextension(request,["1"])
    lst_content = get_init_content(request,["1"])
    lst_allowmime = get_init_allowmime(request,["1"])
    lst_blockmime = get_init_blockmime(request,["1"])
    
    policy_strict_officehour = WPprofileSession(wprofile,
                                          lst_schedule,
                                          lst_cat,
                                          lst_whitelist,
                                          lst_blacklist,
                                          lst_allowext,
                                          lst_blockext,
                                          lst_allowmime,
                                          lst_blockmime,
                                          lst_content, 
                                          wpexceptprofile,
                                          lst_excepteduser,
                                          lst_exceptedlink, 
                                          lst_exceptednet)
    policy_strict_officehour.id = 3
    
    return policy_strict_officehour

def init_Strict_AfterOfficeHour_policy(request):
    
    lst_schedule = []
    lst_cat = []
    lst_whitelist = []
    lst_blacklist = []
    lst_allowext = []
    lst_blockext = []
    lst_allowmime = []
    lst_blockmime = []
    lst_content = []
    lst_excepteduser = []
    lst_exceptedlink = []
    lst_exceptednet = []
     
    wprofile = WPProfile()
    wprofile.name = "Strict After Office Hour"
    wprofile.location = 4
    wprofile.catdef= 2
    wprofile.sizequota = 0
    wprofile.timequota = 0
    wprofile.enable = 1 
    wprofile.safesearchon = 1
    
    wpexceptprofile = WPProfileExcept()
    wpexceptprofile.skipauth = 0
    wpexceptprofile.skipcache = 1
    wpexceptprofile.skipav = 1
    wpexceptprofile.skipext = 1
    wpexceptprofile.skipmime = 2
    wpexceptprofile.skipurl = 2
    wpexceptprofile.skipcontentfilter = 1
    
    lst_schedule = get_init_schedule(request,["2","3"])
    lst_cat = get_init_cat(request,["5","29","30","31","32","33","34","35","36","37","38","39","26","16","42","23","3","8","18","21","9","43","17","11","22","12","4","13","15",])
    lst_whitelist = get_init_whitelist(request,["1"])
    lst_blacklist = get_init_blacklist(request,["1"])
    lst_allowext = get_init_allowedextension(request,["1"])
    lst_blockext = get_init_blockedextension(request,["1"])
    lst_content = get_init_content(request,["1"])
    lst_allowmime = get_init_allowmime(request,["1"])
    lst_blockmime = get_init_blockmime(request,["1"])
    
    policy_strict_afterofficehour = WPprofileSession(wprofile,
                                          lst_schedule,
                                          lst_cat,
                                          lst_whitelist,
                                          lst_blacklist,
                                          lst_allowext,
                                          lst_blockext,
                                          lst_allowmime,
                                          lst_blockmime,
                                          lst_content, 
                                          wpexceptprofile,
                                          lst_excepteduser,
                                          lst_exceptedlink, 
                                          lst_exceptednet)
    policy_strict_afterofficehour.id = 4
    
    return policy_strict_afterofficehour

def init_Allow_FinancialSite_policy(request):
    
    lst_schedule = []
    lst_cat = []
    lst_whitelist = []
    lst_blacklist = []
    lst_allowext = []
    lst_blockext = []
    lst_allowmime = []
    lst_blockmime = []
    lst_content = []
    lst_excepteduser = []
    lst_exceptedlink = []
    lst_exceptednet = []
     
    wprofile = WPProfile()
    wprofile.name = "Allow Financial Site"
    wprofile.location = 5
    wprofile.catdef= 1
    wprofile.sizequota = 0
    wprofile.timequota = 0
    wprofile.enable = 1 
    wprofile.safesearchon = 1
    
    wpexceptprofile = WPProfileExcept()
    wpexceptprofile.skipauth = 0
    wpexceptprofile.skipcache = 1
    wpexceptprofile.skipav = 1
    wpexceptprofile.skipext = 1
    wpexceptprofile.skipmime = 2
    wpexceptprofile.skipurl = 2
    wpexceptprofile.skipcontentfilter = 1
    
#    lst_schedule = get_init_schedule(request,["1"])
    lst_schedule = ''
    lst_cat = get_init_cat(request,["6"])
    lst_whitelist = get_init_whitelist(request,["1"])
    lst_blacklist = get_init_blacklist(request,["1"])
    lst_allowext = get_init_allowedextension(request,["1"])
    lst_blockext = get_init_blockedextension(request,["1"])
    lst_content = get_init_content(request,["1"])
    lst_allowmime = get_init_allowmime(request,["1"])
    lst_blockmime = get_init_blockmime(request,["1"])
    
    policy_allow_financialsite = WPprofileSession(wprofile,
                                          lst_schedule,
                                          lst_cat,
                                          lst_whitelist,
                                          lst_blacklist,
                                          lst_allowext,
                                          lst_blockext,
                                          lst_allowmime,
                                          lst_blockmime,
                                          lst_content, 
                                          wpexceptprofile,
                                          lst_excepteduser,
                                          lst_exceptedlink, 
                                          lst_exceptednet)
    policy_allow_financialsite.id = 5
    
    return policy_allow_financialsite

def init_Allow_JobSite_policy(request):
    
    lst_schedule = []
    lst_cat = []
    lst_whitelist = []
    lst_blacklist = []
    lst_allowext = []
    lst_blockext = []
    lst_allowmime = []
    lst_blockmime = []
    lst_content = []
    lst_excepteduser = []
    lst_exceptedlink = []
    lst_exceptednet = []
     
    wprofile = WPProfile()
    wprofile.name = "Allow Job Site"
    wprofile.location = 6
    wprofile.catdef= 1
    wprofile.sizequota = 0
    wprofile.timequota = 0
    wprofile.enable = 1 
    wprofile.safesearchon = 1
    
    wpexceptprofile = WPProfileExcept()
    wpexceptprofile.skipauth = 0
    wpexceptprofile.skipcache = 1
    wpexceptprofile.skipav = 1
    wpexceptprofile.skipext = 1
    wpexceptprofile.skipmime = 2
    wpexceptprofile.skipurl = 2
    wpexceptprofile.skipcontentfilter = 1
    
#    lst_schedule = get_init_schedule(request,["1"])
    lst_schedule = ''
    lst_cat = get_init_cat(request,["12"])
    lst_whitelist = get_init_whitelist(request,["1"])
    lst_blacklist = get_init_blacklist(request,["1"])
    lst_allowext = get_init_allowedextension(request,["1"])
    lst_blockext = get_init_blockedextension(request,["1"])
    lst_content = get_init_content(request,["1"])
    lst_allowmime = get_init_allowmime(request,["1"])
    lst_blockmime = get_init_blockmime(request,["1"])
    
    policy_allow_jobsite = WPprofileSession(wprofile,
                                          lst_schedule,
                                          lst_cat,
                                          lst_whitelist,
                                          lst_blacklist,
                                          lst_allowext,
                                          lst_blockext,
                                          lst_allowmime,
                                          lst_blockmime,
                                          lst_content, 
                                          wpexceptprofile,
                                          lst_excepteduser,
                                          lst_exceptedlink, 
                                          lst_exceptednet)
    policy_allow_jobsite.id = 6
    
    return policy_allow_jobsite

def init_LessStict_AfterOfficeHour_policy(request):
    
    lst_schedule = []
    lst_cat = []
    lst_whitelist = []
    lst_blacklist = []
    lst_allowext = []
    lst_blockext = []
    lst_allowmime = []
    lst_blockmime = []
    lst_content = []
    lst_excepteduser = []
    lst_exceptedlink = []
    lst_exceptednet = []
     
    wprofile = WPProfile()
    wprofile.name = "Less Strict After Office Hour"
    wprofile.location = 7
    wprofile.catdef= 2
    wprofile.sizequota = 0
    wprofile.timequota = 0
    wprofile.enable = 1 
    wprofile.safesearchon = 1
    
    wpexceptprofile = WPProfileExcept()
    wpexceptprofile.skipauth = 0
    wpexceptprofile.skipcache = 1
    wpexceptprofile.skipav = 1
    wpexceptprofile.skipext = 1
    wpexceptprofile.skipmime = 2
    wpexceptprofile.skipurl = 2
    wpexceptprofile.skipcontentfilter = 1
    
    lst_schedule = get_init_schedule(request,["2","3"])
    lst_cat = get_init_cat(request,["22","13","26"])
    lst_whitelist = get_init_whitelist(request,["1"])
    lst_blacklist = get_init_blacklist(request,["1"])
    lst_allowext = get_init_allowedextension(request,["1"])
    lst_blockext = get_init_blockedextension(request,["1"])
    lst_content = get_init_content(request,["1"])
    lst_allowmime = get_init_allowmime(request,["1"])
    lst_blockmime = get_init_blockmime(request,["1"])
    
    policy_lessstrict_afterofficehour = WPprofileSession(wprofile,
                                          lst_schedule,
                                          lst_cat,
                                          lst_whitelist,
                                          lst_blacklist,
                                          lst_allowext,
                                          lst_blockext,
                                          lst_allowmime,
                                          lst_blockmime,
                                          lst_content, 
                                          wpexceptprofile,
                                          lst_excepteduser,
                                          lst_exceptedlink, 
                                          lst_exceptednet)
    policy_lessstrict_afterofficehour.id = 7
    
    return policy_lessstrict_afterofficehour

def init_LessStrict_OfficeHour_policy(request):
    
    lst_schedule = []
    lst_cat = []
    lst_whitelist = []
    lst_blacklist = []
    lst_allowext = []
    lst_blockext = []
    lst_allowmime = []
    lst_blockmime = []
    lst_content = []
    lst_excepteduser = []
    lst_exceptedlink = []
    lst_exceptednet = []
     
    wprofile = WPProfile()
    wprofile.name = "Less Strict During Office Hour"
    wprofile.location = 8
    wprofile.catdef= 2
    wprofile.sizequota = 0
    wprofile.timequota = 0
    wprofile.enable = 1 
    wprofile.safesearchon = 1
    
    wpexceptprofile = WPProfileExcept()
    wpexceptprofile.skipauth = 0
    wpexceptprofile.skipcache = 1
    wpexceptprofile.skipav = 1
    wpexceptprofile.skipext = 1
    wpexceptprofile.skipmime = 2
    wpexceptprofile.skipurl = 2
    wpexceptprofile.skipcontentfilter = 1
    
    lst_schedule = get_init_schedule(request,["1"])
    lst_cat = get_init_cat(request,["22","13","26"])
    lst_whitelist = get_init_whitelist(request,["1"])
    lst_blacklist = get_init_blacklist(request,["1"])
    lst_allowext = get_init_allowedextension(request,["1"])
    lst_blockext = get_init_blockedextension(request,["1"])
    lst_content = get_init_content(request,["1"])
    lst_allowmime = get_init_allowmime(request,["1"])
    lst_blockmime = get_init_blockmime(request,["1"])
    
    policy_lessstrict_officehour = WPprofileSession(wprofile,
                                          lst_schedule,
                                          lst_cat,
                                          lst_whitelist,
                                          lst_blacklist,
                                          lst_allowext,
                                          lst_blockext,
                                          lst_allowmime,
                                          lst_blockmime,
                                          lst_content, 
                                          wpexceptprofile,
                                          lst_excepteduser,
                                          lst_exceptedlink, 
                                          lst_exceptednet)
    policy_lessstrict_officehour.id = 8
    
    return policy_lessstrict_officehour

'''
    This part to get list policy
'''    
def init_policy(request):
    
    dict_policy = {}
    dict_keymap = {}
    
    request.session[STORE_POLICY] = [dict_policy,dict_keymap]
    
#    [dict_policy,dict_keymap] = init_get_data(STORE_POLICY,request)
     
#    if not dict_keymap.has_key("1"):
        
    o1 = init_Unrestricted_policy(request)
    name1 = o1.WPmainprofile.name.lower()   
    dict_policy[name1] = o1
    dict_keymap["1"] = name1
    
    o2 = init_Unrestricted_Safe_policy(request)
    name2 = o2.WPmainprofile.name.lower()   
    dict_policy[name2] = o2
    dict_keymap["2"] = name2
    
    o3 = init_Strict_OfficeHour_policy(request)
    name3 = o3.WPmainprofile.name.lower()   
    dict_policy[name3] = o3
    dict_keymap["3"] = name3
    
    o4 = init_Strict_AfterOfficeHour_policy(request)
    name4 = o4.WPmainprofile.name.lower()   
    dict_policy[name4] = o4
    dict_keymap["4"] = name4
    
    o5 = init_Allow_FinancialSite_policy(request)
    name5 = o5.WPmainprofile.name.lower()   
    dict_policy[name5] = o5
    dict_keymap["5"] = name5
    
    o6 = init_Allow_JobSite_policy(request)
    name6 = o6.WPmainprofile.name.lower()   
    dict_policy[name6] = o6
    dict_keymap["6"] = name6
    
    o7 = init_LessStict_AfterOfficeHour_policy(request)
    name7 = o7.WPmainprofile.name.lower()   
    dict_policy[name7] = o7
    dict_keymap["7"] = name7
    
    o8 = init_LessStrict_OfficeHour_policy(request)
    name8 = o8.WPmainprofile.name.lower()   
    dict_policy[name8] = o8
    dict_keymap["8"] = name8
        
    request.session[STORE_POLICY] = [dict_policy,dict_keymap]
#        print "init profile hour"
#    else:
#        print "can't init profile hour "
        