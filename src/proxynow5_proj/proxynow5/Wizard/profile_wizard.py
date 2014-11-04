from proxynow5_proj.proxynow5.Definition_Network.models import DefNet
from proxynow5_proj.proxynow5.Definition_Schedule.models import DefSchd
from proxynow5_proj.proxynow5.Definition_User.models import DefUser
from proxynow5_proj.proxynow5.WebProxy.models import WPProfile, WPProfileExcept, \
    WPProfileSchd, WPSelectedCat, WPProfileWhiteList, WPProfileBlackList, \
    WPProfileAllowExt, WPProfileBlockExt, WPProfileAllowMIME, WPProfileBlockMIME, \
    WPProfileContentFilter, WPProfileExceptNet, WPProfileExceptURL, \
    WPProfileExceptUserInternal, WPProfileUserInternal, WPNet
from proxynow5_proj.proxynow5.WebProxy_Filter.models import WPCat, WPWhiteList, \
    WPBlackList, WPExt, WPMIME, WPContent
from proxynow5_proj.proxynow5.Wizard.process_session import \
    get_items_session_byid, STORE_SCHEDULE, STORE_CATEGORY, STORE_WHITE_LIST, \
    STORE_BLACK_LIST, STORE_EXTENSION, STORE_MIME, STORE_CONTENT, STORE_HOST





class WPprofileSession():
    
    '''
        Profile
    '''
    WPmainprofile = WPProfile()
    
    '''
        lst_Schedule
    '''
    lst_WPprofileSchedule_session = []
    
    '''
        lst_Filtering
    '''
    lst_WPprofileCat_session = []
    lst_WPprofileWhitelist_session = []
    lst_WPprofileBlacklist_session = []
    lst_WPprofileAllowext_session = []
    lst_WPprofileBlockext_session = []
    lst_WPprofileAllowmime_session = []
    lst_WPprofileBlockmime_session = []
    lst_WPprofileContentfilter_session = []
    
    '''
        Exception 
    '''
    WPexceptprofile = WPProfileExcept()
    
    '''
        Exempted
    '''
    lst_WPExemptedInternalUser = []
    lst_WPExemptedLink = []
    lst_WPExemptedNet = []
    
    '''
        Internal User
    '''
    lst_WPinternal_user = [] 
    
    '''
        This one is supported for host (that is get from trusted network) 
    '''
    lst_WPHost = []
    
    def __init__(self,in_WPmainprofile = None,
                 in_lst_WPprofileSchedule_session = None,
                 in_lst_WPprofileCat_session = None,
                 in_lst_WPprofileWhitelist_session = None,
                 in_lst_WPprofileBlacklist_session = None,
                 in_lst_WPprofileAllowext_session = None,
                 in_lst_WPprofileBlockext_session = None,
                 in_lst_WPprofileAllowmime_session = None,
                 in_lst_WPprofileBlockmime_session = None,
                 in_lst_WPprofileContentfilter_session = None,
                 in_WPexceptprofile = None,
                 in_lst_WPExemptedInternalUser = None,
                 in_lst_WPExemptedLink=None,
                 in_lst_WPExemptedNet = None):
        
        if in_WPmainprofile != None:
            self.WPmainprofile = in_WPmainprofile
            
            self.lst_WPprofileSchedule_session = in_lst_WPprofileSchedule_session
            
            self.lst_WPprofileCat_session = in_lst_WPprofileCat_session
            self.lst_WPprofileWhitelist_session = in_lst_WPprofileWhitelist_session
            self.lst_WPprofileBlacklist_session = in_lst_WPprofileBlacklist_session
            self.lst_WPprofileAllowext_session = in_lst_WPprofileAllowext_session
            self.lst_WPprofileBlockext_session = in_lst_WPprofileBlockext_session
            self.lst_WPprofileAllowmime_session = in_lst_WPprofileAllowmime_session
            self.lst_WPprofileBlockmime_session = in_lst_WPprofileBlockmime_session
            self.lst_WPprofileContentfilter_session = in_lst_WPprofileContentfilter_session
            
            self.WPexceptprofile = in_WPexceptprofile
            
            self.lst_WPExemptedInternalUser = in_lst_WPExemptedInternalUser
            self.lst_WPExemptedLink = in_lst_WPExemptedLink
            self.lst_WPExemptedNet = in_lst_WPExemptedNet
            
            self.lst_WPinternal_user = [] 
        else:
            self.WPmainprofile = WPProfile()
            self.lst_WPprofileSchedule_session = []
            
            self.lst_WPprofileCat_session = []
            self.lst_WPprofileWhitelist_session = []
            self.lst_WPprofileBlacklist_session = []
            self.lst_WPprofileAllowext_session = []
            self.lst_WPprofileBlockext_session = []
            self.lst_WPprofileAllowmime_session = []
            self.lst_WPprofileBlockmime_session = []
            self.lst_WPprofileContentfilter_session = []
            
            self.WPexceptprofile = WPProfileExcept()
            
            self.lst_WPExemptedInternalUser = []
            self.lst_WPExemptedLink = []
            self.lst_WPExemptedNet = []
            
            self.lst_WPinternal_user = [] 
    
    def get_list_profileschedule(self):
        lst = []
       
        for defsh in self.lst_WPprofileSchedule_session:
            try:
                a = WPProfileSchd(profileid = self.WPmainprofile,schedule = defsh) 
                lst.append(a)
            except Exception,ex:
                pass
            
        return lst
    
    def get_list_profilecat(self):
        lst = []

        for defcat in self.lst_WPprofileCat_session:
            try:
                b = WPSelectedCat(profileid = self.WPmainprofile,catid = defcat)
                lst.append(b)
            except Exception,ex:
                pass
            
        return lst
    
    def get_list_profile_whitelist(self):
        lst = []
         
        for defwhitelist in self.lst_WPprofileWhitelist_session:
            try:
                b = WPProfileWhiteList(profileid = self.WPmainprofile,whitelist = defwhitelist)
                lst.append(b)
            except Exception,ex:    
                pass
                
        return lst
    
    def get_list_profile_blacklist(self):
        lst = []
        
        for defblacklist in self.lst_WPprofileBlacklist_session:
            try:
                b = WPProfileBlackList(profileid = self.WPmainprofile,blacklist = defblacklist)
                lst.append(b)
            except Exception,ex:
                pass
            
        return lst   
    
    def get_list_profile_allowedextension(self):
        lst = []
        
        for defallowedextension in self.lst_WPprofileAllowext_session:
            try:
                b = WPProfileAllowExt(profileid = self.WPmainprofile,allowext = defallowedextension)
                lst.append(b)
            except Exception,ex:
                pass
    
        return lst
    
    def get_list_profile_blockextension(self):
        lst = []
        print self.lst_WPprofileBlockext_session
        for defblockextension in self.lst_WPprofileBlockext_session:
            try:
                b = WPProfileBlockExt(profileid = self.WPmainprofile,blockext = defblockextension)
                lst.append(b)
            except Exception,ex:
                pass
            
        return lst 
    
    def get_list_profile_content(self):
        
        lst = []
        
        for defcontent in self.lst_WPprofileContentfilter_session:
            try:
                b = WPProfileContentFilter(profileid = self.WPmainprofile, contentfilter = defcontent)
                lst.append(b)
            except Exception,ex:
                pass
            
        return lst 
    
    def get_list_profile_allowmime(self):
        lst = []
        
        for defallowmime in self.lst_WPprofileAllowmime_session:
            try:
                b = WPProfileAllowMIME(profileid = self.WPmainprofile, allowmime = defallowmime)
                lst.append(b)
            except Exception,ex:
                pass
            
        return lst 
    
    def get_list_profile_blockmmime(self):
        lst = []
        
        for defblockmime in self.lst_WPprofileBlockmime_session:
            try:
                b = WPProfileBlockMIME(profileid = self.WPmainprofile, blockmime = defblockmime)
                lst.append(b)
            except Exception,ex:
                pass
            
        return lst 
    
    def get_list_profile_exemptednet(self):
        lst = []
        
        for defnetobj in self.lst_WPExemptedNet:
            try:
                o = DefNet()
                o = defnetobj
                net_obj = WPProfileExceptNet(exceptid = self.WPexceptprofile , netid = o) 
                
                lst.append(net_obj)
            except Exception,ex:
                pass
                 
        return lst
    
    def get_list_profile_exemptedurl(self):
        lst = []
        
        for deflisturl in self.lst_WPExemptedLink:
            try:
                o = WPProfileExceptURL(exceptid = self.WPexceptprofile,url = deflisturl)
                lst.append(o)
                
            except Exception,ex:
                pass
        
        return lst
    
    def get_list_profile_exempteduser(self):
        lst = []
        x = ""
        
        for x in self.lst_WPExemptedInternalUser:
            try:
                if x.strip() != "":
                    o = DefUser()
                    o.name = x
                    o.id =x 
                    a = WPProfileUserInternal(profileid = self.WPmainprofile , userinternal = o)
                    
                    lst.append(a)
            except:
                pass
            
        return lst
        
    def set_authentication(self,namuser):
        
        try:
            if namuser.strip() != "":
                o = DefUser()
                o = DefUser.objects.get(name = namuser)
                self.lst_WPinternal_user.append(o)
                
        except DefUser.DoesNotExist:
            pass
     
    def set_profileschedule(self,request):
        
        try:
            lst_id_schedule = []
            lst_obj_schedule = []
            str_schedule = ""
            
            if 'schedules' in request.POST:
                str_schedule = request.POST['schedules']
            
            lst_id_schedule = str_schedule.split(',')
            
            for id_schedule in lst_id_schedule:
                try:
                    a = get_items_session_byid(request,STORE_SCHEDULE,int(id_schedule))
                    if a != None:
                        lst_obj_schedule.append(a)
                except Exception,ex:
                    pass
           
            self.lst_WPprofileSchedule_session = lst_obj_schedule
            
        except Exception,ex:
            print "Error Info set_profileschedule  %s" %str(ex)
            pass
    
    def set_profilecat(self,request):
        
        try:
            lst_id_cat = []
            lst_obj_cat = []
            str_cat = ""
            
            if 'cats' in request.POST:
                str_cat = request.POST['cats'] 
                
            lst_id_cat = str_cat.split(',')
            
            for id_cat in lst_id_cat:
                try:
                    [a,b] = get_items_session_byid(request,STORE_CATEGORY,int(id_cat))
                    
                    if a != None:
                        lst_obj_cat.append(a)
                        
                except Exception,ex:
                    pass
           
            self.lst_WPprofileCat_session = lst_obj_cat
        
        except Exception,ex:
            print "Error Info set_profilecat  %s" %str(ex)
            pass
    
    def set_profilewhitelist(self,request):
        
        try: 
            lst_id_whitelist = []
            lst_obj_whitelist = []
            str_whitelist = ""
            
            if 'whitelist' in request.POST:
                str_whitelist = request.POST['whitelist']
                
            lst_id_whitelist = str_whitelist.split(',')
            
            for id_whitelist in lst_id_whitelist:
                try:
                    [a,b] = get_items_session_byid(request,STORE_WHITE_LIST,int(id_whitelist))
                    
                    if a != None:
                        lst_obj_whitelist.append(a)
                        
                except Exception,ex:
                    pass 
            
            self.lst_WPprofileWhitelist_session = lst_obj_whitelist
            
        except Exception,ex :
            print "Error Info set_profilewhitelist  %s" %str(ex)
            pass
    
    def set_profileblacklist(self,request):
        
        try:
            lst_id_blacklist = []
            lst_obj_blacklist = []
            str_blacklist = ""
            
            if 'blacklist' in request.POST:
                str_blacklist = request.POST['blacklist'] 
                
            lst_id_blacklist = str_blacklist.split(',')
            
            for id_blacklist in lst_id_blacklist:
                try:
                    [a,b] = get_items_session_byid(request,STORE_BLACK_LIST,int(id_blacklist))
                    
                    if a != None:
                        lst_obj_blacklist.append(a)
                        
                except Exception,ex:
                    pass 
            
            self.lst_WPprofileBlacklist_session = lst_obj_blacklist
            
        except Exception,ex:
            print "Error Info set_profileblacklist  %s" %str(ex)
            pass
    
    def set_profileallowext(self,request):
        try:
            lst_id_allowext = []
            lst_obj_allowext = []
            str_allowext = ""
            
            if 'allowexts' in request.POST:
                str_allowext = request.POST['allowexts'] 
                
            lst_id_allowext = str_allowext.split(',')
            
            for id_extension in lst_id_allowext:
                try:
                    [a,b] = get_items_session_byid(request,STORE_EXTENSION,int(id_extension))
                    
                    if a != None:
                        lst_obj_allowext.append(a)
                        
                except Exception,ex:
                    pass 
            
            self.lst_WPprofileAllowext_session = lst_obj_allowext
            
        except Exception,ex:
            print "Error Info set_profileallowext  %s" %str(ex)
            pass
    
    def set_profileblockext(self,request):
        try:
            lst_id_blockext = []
            lst_obj_blockext = []
            str_blockext = ""
            
            if 'blockexts' in request.POST:
                str_blockext = request.POST['blockexts'] 
                
            lst_id_blockext = str_blockext.split(',')
           
            for id_extension in lst_id_blockext:
                try:
                    [a,b] = get_items_session_byid(request,STORE_EXTENSION,int(id_extension))
                    
                    if a != None:
                        lst_obj_blockext.append(a)
                        
                except Exception,ex:
                    pass 
            
            self.lst_WPprofileBlockext_session = lst_obj_blockext
            
        except Exception,ex:
            print "Error Info set_profileblockext  %s" %str(ex)
            pass    
        
    def set_profileallowmime(self,request):
        try:
            lst_id_allowmime = []
            lst_obj_allowmime = []
            str_allowmime = ""
            
            if 'allowmimes' in request.POST:
                str_allowmime = request.POST['allowmimes'] 
                
            lst_id_allowmime = str_allowmime.split(',')
            
            for id_mime in lst_id_allowmime:
                try:
                    [a,b] = get_items_session_byid(request,STORE_MIME,int(id_mime))
                    
                    if a != None:
                        lst_obj_allowmime.append(a)
                        
                except Exception,ex:
                    pass 
            
            self.lst_WPprofileAllowmime_session = lst_obj_allowmime
            
        except Exception,ex:
            print "Error Info set_profileallowmime  %s" %str(ex)
            pass 
    
    def set_profileblockmime(self,request):
        try:
            lst_id_blockmime = []
            lst_obj_blockmime = []
            str_blockmime = ""
            
            if 'blockmimes' in request.POST:
                str_blockmime = request.POST['blockmimes'] 
                
            lst_id_blockmime = str_blockmime.split(',')
            
            for id_mime in lst_id_blockmime:
                try:
                    [a,b] = get_items_session_byid(request,STORE_MIME,int(id_mime))
                    
                    if a != None:
                        lst_obj_blockmime.append(a)
                        
                except Exception,ex:
                    pass 
            
            self.lst_WPprofileBlockmime_session = lst_obj_blockmime
            
        except Exception,ex:
            print "Error Info set_profileblockmime  %s" %str(ex)
            pass 
    
    def set_profilecontent(self,request):
        try:
            lst_id_content = []
            lst_obj_content = []
            str_content = ""
            
            if 'contentfilters' in request.POST:
                str_content = request.POST['contentfilters'] 
                
            lst_id_content = str_content.split(',')
            
            for id_content in lst_id_content:
                try:
                    [a,b] = get_items_session_byid(request,STORE_CONTENT,int(id_content))
                    
                    if a != None:
                        lst_obj_content.append(a)
                        
                except Exception,ex:
                    pass 
                
            self.lst_WPprofileContentfilter_session = lst_obj_content
        except Exception,ex:
            print "Error Info set_profilecontent  %s" %str(ex)
            pass 
         
    def set_profileextempteduserinternal(self,request):
        try:
            str = ""
            lst = []

            if "exceptuserinternals" in request.POST:
                str = request.POST["exceptuserinternals"]
            
            if str == "":
                self.lst_WPExemptedInternalUser =[]
            else:
                lst = str.split(",")
                self.lst_WPExemptedInternalUser = lst

        except:
            pass
        
    def set_profileextemptedlink(self,request):
        try:
        
            lst_obj_url = []
            lst_id_url = []
            str_urls = ""
            
            if "excepturls" in request.POST:
                str_urls = request.POST["excepturls"] 
                
            lst_obj_url = str_urls.split("||")
            
            if str_urls == "" :
                self.lst_WPExemptedLink = []
            else:
                self.lst_WPExemptedLink = lst_obj_url
                
        except Exception,ex:
            print "Error Info set_profileextemptedlink  %s" %str(ex)
            pass  
        
    def set_profileextemptednet(self,request):
        try:
            lst_obj_net = []
            lst_id_net = []
            
            if "exceptnets" in request.POST:
                str_nets = request.POST["exceptnets"]
            
            lst_id_net = str_nets.split(",") 
            
            for idnet in lst_id_net:
                try:
                    a = get_items_session_byid(request,STORE_HOST,idnet)
                    
                    if a!= None:
                        o = DefNet() 
                        [o,h] = a                    
                        lst_obj_net.append(o)
                except:
                    pass
                
            self.lst_WPExemptedNet = lst_obj_net
        except Exception,ex:
            print "Error Info set_profileextemptednet  %s" %str(ex)
            pass
    
    def set_profile_host(self,lst_host):
        
        self.lst_WPHost = lst_host
    
    def set_profileexcept_defaulpolicy(self):
        
        self.WPexceptprofile.skipauth = 0
        self.WPexceptprofile.skipcache = 0
        self.WPexceptprofile.skipav = 0
        self.WPexceptprofile.skipext = 0
        self.WPexceptprofile.skipmime = 0
        self.WPexceptprofile.skipurl = 0
        self.WPexceptprofile.skipcontentfilter = 0  
    
    def set_profileexcept(self,request):
        try:
            skipauth = request.POST["skipauth"]
            skipcache = request.POST["skipcache"]
            skipav = request.POST["skipav"]
            skipext = request.POST["skipext"]
            skipmime = request.POST["skipmime"]
            skipurl = request.POST["skipurl"]
            skipcontentfilter = request.POST["skipcontentfilter"]
        
            self.WPexceptprofile.skipauth = int(skipauth)
            self.WPexceptprofile.skipcache = int(skipcache)
            self.WPexceptprofile.skipav = int(skipav)
            self.WPexceptprofile.skipext = int(skipext)
            self.WPexceptprofile.skipmime = int(skipmime)
            self.WPexceptprofile.skipurl = int(skipurl)
            self.WPexceptprofile.skipcontentfilter = int(skipcontentfilter)   
              
        except Exception,ex:
            print "Error Info set_profileexcept  %s" %str(ex)
            pass
    
    def set_profilelocation(self,_location):
        self.WPmainprofile.location = _location
        
    def set_profile_main_defaulpolicy(self,in_name,in_location,in_enable,in_timequota,in_sizequota,in_catdef,in_safesearchon):
        try:
            self.WPmainprofile.name = in_name
            self.WPmainprofile.location = in_location
            self.WPmainprofile.enable = in_enable
            self.WPmainprofile.timequota = in_timequota
            self.WPmainprofile.sizequota = in_sizequota
            self.WPmainprofile.catdef = in_catdef 
            self.WPmainprofile.safesearchon = in_safesearchon
            
        except Exception,ex:
            print "Error Info set_profile_main_defaulpolicy %s" %str(ex)
            pass
        
        
    def set_profilemain(self,request):
        try:
            
            _location = request.POST["location"]
            enable = 1
            timequota = request.POST["timequota"]
            sizequota = request.POST["sizequota"]
            catdef = request.POST["catdef"]
            name = request.POST["name"]
            safesearchon = request.POST["safesearchon"]
            
            try:
                location = int(_location)
            except:
                location = 1
                pass
            
            self.WPmainprofile.name = name 
            self.WPmainprofile.location = location
            self.WPmainprofile.enable = enable
            self.WPmainprofile.timequota = timequota
            self.WPmainprofile.sizequota =sizequota
            self.WPmainprofile.catdef = catdef
            self.WPmainprofile.safesearchon = safesearchon
             
        except Exception,ex :
            print "Error Info set_profilemain  %s" %str(ex)
            pass
            
    def set_profile(self,request):
        self.set_profilemain(request)
        self.set_profileexcept(request)
        self.set_profileschedule(request)
        self.set_profilecat(request)
        self.set_profilewhitelist(request)
        self.set_profileblacklist(request)
        self.set_profileallowext(request)
        self.set_profileblockext(request)
        self.set_profileallowmime(request)
        self.set_profileblockmime(request)
        self.set_profilecontent(request)
        self.set_profileextempteduserinternal(request)
        self.set_profileextemptedlink(request)
        self.set_profileextemptednet(request)
          
    def set_profile_create(self,request):
        try:
            self.set_profilemain(request)
            self.set_profileexcept(request)
            self.set_profileschedule(request)
            self.set_profilecat(request)
            self.set_profilewhitelist(request)
            self.set_profileblacklist(request)
            self.set_profileallowext(request)
            self.set_profileallowmime(request)
            self.set_profileblockmime(request)
            self.set_profilecontent(request)
            self.set_profileextempteduserinternal(request)
            self.set_profileextemptedlink(request)
            self.set_profileextemptednet(request)
        except Exception,ex:
            print "Error Info set_profile_create%s" %str(ex)
        
    def save(self,request):
        try:
            self.save_profile_session()
            self.save_profile_exception()
            self.save_profile_schedule_session(request)
            self.save_profile_cat_session(request)
            self.save_profile_whitelist_session(request)
            self.save_profile_blacklist_session(request)
            self.save_profile_allowext_session(request)
            self.save_profile_blockext_session(request)
            self.save_profile_allowmime_session(request)
            self.save_profile_blockmime_session(request)
            self.save_profile_content_session(request)
            self.save_profile_exceptNet(request)
            self.save_profile_exceptURL()
            self.save_profile_exceptinternaluser()
            self.save_profile_internaluser()
            
            self.save_profile_host()
            
        except Exception,ex:
            print "Error Info : %s"  %str(ex)
    
         
    def save_profile_session(self):
        o = WPProfile.objects.create(name = self.WPmainprofile.name ,
                                     location = self.WPmainprofile.location , 
                                     enable = self.WPmainprofile.enable ,
                                     timequota = self.WPmainprofile.timequota ,
                                     sizequota = self.WPmainprofile.sizequota,
                                     catdef =  self.WPmainprofile.catdef,
                                     safesearchon = self.WPmainprofile.safesearchon)
        
#        o = WPProfile.objects.create(name="name", location=1, enable=1,
#                                             timequota=12, sizequota=13,
#                                             catdef=1)
        self.WPmainprofile = o
    
    def save_profile_exception(self): 
        exception_profile = WPProfileExcept.objects.create(skipauth = self.WPexceptprofile.skipauth, \
                                       skipcache = self.WPexceptprofile.skipcache,\
                                       skipav = self.WPexceptprofile.skipav,\
                                       skipext = self.WPexceptprofile.skipext , \
                                       skipmime = self.WPexceptprofile.skipmime ,\
                                       skipurl = self.WPexceptprofile.skipurl,\
                                       skipcontentfilter = self.WPexceptprofile.skipcontentfilter , \
                                       profileid  = self.WPmainprofile )
        self.WPexceptprofile = exception_profile
        
    def save_profile_schedule_session(self,request):
        
        '''
            search the id of schedue
            
            Note: we need to get from the session first ,to avoid the bug 
            if user change all the object then we still can detect when saving into database.
            
        '''
        print "Save Schedule"
        
        for schedule_temp in self.lst_WPprofileSchedule_session:
            try : 
                obj = get_items_session_byid(request,STORE_SCHEDULE,schedule_temp.id)
                
                if obj != None:
                    def_sch_tem = None
                    def_sch_tem = DefSchd.objects.get(name=obj.name)
                    
                    try:
                        if def_sch_tem != None:
                            ab = WPProfileSchd.objects.create(profileid = self.WPmainprofile,schedule = def_sch_tem)
                            
                    except Exception,ex:
                        print "System can't create Schedule of Profile"
                    
            except DefSchd.DoesNotExist:
                print "Schedule is not eixsted.So Schedule Profile can't insert."
                
                
    def save_profile_cat_session(self,request):
        
        '''
           search the if of cat 
        '''
        print "save the cat session"
        for cat_temp in self.lst_WPprofileCat_session:
            try:
                obj = get_items_session_byid(request, STORE_CATEGORY, cat_temp.id)
                
                if obj != None:  
                    [a,b] = obj
                    def_cat_temp = None
                    def_cat_temp = WPCat.objects.get(name = a.name)
                    try:
                        if def_cat_temp != None: 
                            WPSelectedCat.objects.create(profileid = self.WPmainprofile,catid=def_cat_temp)
                        
                    except Exception,ex:
                        print "System can't create Cat of Profile"
                    
            except WPCat.DoesNotExist:
                print "Category is not existed.So Category Profile can't insert. "
                
    
    def save_profile_whitelist_session(self,request):
        
        '''
           search the if of whitelilst 
        '''
        print "save whitelist session"
        
        for whitelist_temp in self.lst_WPprofileWhitelist_session:
            try:
                obj = get_items_session_byid(request, STORE_WHITE_LIST, whitelist_temp.id)
                
                if obj != None:
                    [a,b] = obj
                    def_whitelist_temp = None
                    def_whitelist_temp = WPWhiteList.objects.get(name = a.name)
                    try:
                        if def_whitelist_temp != None:
                            WPProfileWhiteList.objects.create(profileid = self.WPmainprofile,whitelist=def_whitelist_temp)
                            
                    except Exception,ex:
                        print "System can't create Whitelist of Profile"
                        
            except WPWhiteList.DoesNotExist:
                print "whitelist is not existed.So Whitelist Profile can't insert."
                
    def save_profile_blacklist_session(self,request):
        
        '''
           search the if of black list
        '''
        
        print "save black list session"
        for blacklist_temp in self.lst_WPprofileBlacklist_session:
            try:
                obj = get_items_session_byid(request, STORE_BLACK_LIST, blacklist_temp.id)
                
                if obj!= None:
                    [a,b] = obj
                    def_blacklist_temp = None
                    def_blacklist_temp = WPBlackList.objects.get(name = a.name)
                    try:
                        if def_blacklist_temp != None:
                            WPProfileBlackList.objects.create(profileid = self.WPmainprofile,blacklist=def_blacklist_temp)
                    except Exception,ex:
                        print "System can't create Blacklist of Profile"
                    
            except WPBlackList.DoesNotExist:
                print "Blacklist is not existed.So Blacklist Profile can't insert"
        
    def save_profile_allowext_session(self,request):
        
        '''
           search the if of Allow extension 
        '''
        print "save profile allow extension"
        
        for allowext_temp in self.lst_WPprofileAllowext_session:
            try:
                obj = get_items_session_byid(request, STORE_EXTENSION, allowext_temp.id)
                
                if obj != None:
                    [a,b] = obj
                    def_allowext_temp = None
                    def_allowext_temp = WPExt.objects.get(name = a.name)
                    try:
                        if def_allowext_temp != None:
                            WPProfileAllowExt.objects.create(profileid = self.WPmainprofile,allowext=def_allowext_temp)
                    except Exception,ex:
                        print "System can't create Allowextension of Profile."
                        
            except WPExt.DoesNotExist:
                print "Allowextension is not existed.So AllowExtension Profile can't insert"
        
    def save_profile_blockext_session(self,request):
        
        '''
           search the if of Allow extension 
        '''
        
        print "save Block extension"
        
        for allowext_temp in self.lst_WPprofileBlockext_session:
            try:
                obj = get_items_session_byid(request, STORE_EXTENSION, allowext_temp.id)
                
                if obj != None:  
                    [a,b] = obj
                    def_blockowext_temp = None
                    def_blockowext_temp = WPExt.objects.get(name = a.name)
                    try:
                        if def_blockowext_temp != None:
                            WPProfileBlockExt.objects.create(profileid = self.WPmainprofile,blockext=def_blockowext_temp)
                            
                    except Exception,ex:
                        print "System can't create BlockExtension of Profile "
                        
            except WPExt.DoesNotExist:
                print "Blockextension is not existed.So Blockextension Profile can't insert"
        
    def save_profile_allowmime_session(self,request):
        
        '''
           search the if of Allow extension 
        '''
        
        for allowmime_temp in self.lst_WPprofileAllowmime_session:
            try:
                obj = get_items_session_byid(request, STORE_MIME, allowmime_temp.id)
                
                if obj != None:
                    [a,b] = obj
                    def_allowmime_temp = None
                    def_allowmime_temp = WPMIME.objects.get(name = a.name)
                    try:
                        if def_allowmime_temp != None:
                            WPProfileAllowMIME.objects.create(profileid = self.WPmainprofile,allowmime = def_allowmime_temp)
                            
                    except Exception,ex:
                        print "System can't create AllowMime of Profile "
                        
            except WPMIME.DoesNotExist:
                print "AllowMime is not existed.So AllowMime Profile can't insert"
        
    def save_profile_blockmime_session(self,request):
        
        '''
           search the if of Allow extension 
        '''
        print "save block mime"
        
        for blockmime_temp in self.lst_WPprofileBlockmime_session:
            try:
                obj = get_items_session_byid(request, STORE_MIME, blockmime_temp.id)
                
                if obj != None:
                    [a,b] = obj
                    def_blockmime_temp = None 
                    def_blockmime_temp = WPMIME.objects.get(name = a.name)
                    try:
                        if def_blockmime_temp != None:
                            WPProfileBlockMIME.objects.create(profileid = self.WPmainprofile,blockmime = def_blockmime_temp)
                            
                    except Exception,ex:
                        print "System can't create BlockMime of Profile "
                   
            except WPMIME.DoesNotExist:
                print "BlockMime is not existed.So BlockMime Profile can't insert"
        
    def save_profile_content_session(self,request):
        
        '''
           search the if of Allow extension 
        '''
        for contentfilter_temp in self.lst_WPprofileContentfilter_session:
            try:
                obj = get_items_session_byid(request, STORE_CONTENT, contentfilter_temp.id)
                
                if obj != None:
                    [a,b] = obj
                    def_content_temp = None
                    def_content_temp = WPContent.objects.get(name = a.name)
                    try:
                        if def_content_temp != None:
                            WPProfileContentFilter.objects.create(profileid = self.WPmainprofile,contentfilter = def_content_temp)
                        
                    except Exception,ex:
                        print "Error Info nnnnn %s "  %str(ex)
                    
            except WPContent.DoesNotExist:
                pass
    
    def save_profile_exceptNet(self,request):
        
        for temp_Net in self.lst_WPExemptedNet:
            try:
                obj = get_items_session_byid(request, STORE_HOST, temp_Net.id)
                
                if obj != None:
                    [a,b] = obj
                    tt = None
                    tt = DefNet.objects.get(name = a.name)
                    
                    try:
                        if tt != None : 
                            WPProfileExceptNet.objects.create(exceptid = self.WPexceptprofile, \
                                           netid = tt)
                    except Exception,ex:
                        pass
                        
            except DefNet.DoesNotExist:
                pass 
                
    def save_profile_exceptURL(self):
        for temp_url in self.lst_WPExemptedLink:
            try:
                WPProfileExceptURL.objects.create(exceptid = self.WPexceptprofile,\
                                                  url = temp_url)
            except Exception,ex:
                pass
    
    def save_profile_internaluser(self):
        
        for o in self.lst_WPinternal_user:
            try:
                if o != None: 
                    WPProfileUserInternal.objects.create(profileid = self.WPmainprofile , userinternal = o)
            except :
                pass
                      
    def save_profile_exceptinternaluser(self):
        
        for temp_user in self.lst_WPExemptedInternalUser:
            try:
                obj_user_temp = DefUser.objects.get(name = temp_user)
                try :
                    
                    WPProfileExceptUserInternal.objects.create(exceptid = self.WPexceptprofile , \
                                            userinternal = obj_user_temp)
                except Exception,ex:
                    pass
                    
            except DefUser.DoesNotExist:
                pass
   
    def save_profile_host(self):
        for o in self.lst_WPHost:
            try:
                t = DefNet()
                t = DefNet.objects.get(name = o.name)
                try:
                    WPNet.objects.create(profileid=self.WPmainprofile,netid=t)
                except:
                    pass
            except DefNet.DoesNotExist:
                pass
            
            