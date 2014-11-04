from datetime import *
from proxynow5_proj.proxynow5.Administration.models import ADInfo
from proxynow5_proj.proxynow5.Definition_Network.models import DefNet, \
    DefNetHost, DefNetDNSHost, DefNetNetwork, DefNetGroup
from proxynow5_proj.proxynow5.Definition_Schedule.models import DefSchd
from proxynow5_proj.proxynow5.Definition_User.models import DefUser, DefUserName, \
    DefUserGroup
from proxynow5_proj.proxynow5.NAT.models import NAT_MASQ
from proxynow5_proj.proxynow5.NIC.models import *
from proxynow5_proj.proxynow5.Network.models import NetInt, NetDNSRelay
from proxynow5_proj.proxynow5.Settings.views import _save_setting
from proxynow5_proj.proxynow5.WebProxy.models import WPProfile, WPProfileExcept, \
    WPProfileSchd, WPSelectedCat, WPProfileWhiteList, WPProfileBlackList, \
    WPProfileAllowExt, WPProfileBlockExt, WPProfileAllowMIME, WPProfileBlockMIME, \
    WPProfileContentFilter, WPProfileExceptNet, WPProfileExceptURL, \
    WPProfileExceptUserInternal, WPProfileUserInternal, NetTrusted
from proxynow5_proj.proxynow5.WebProxy_Filter.models import WPCat, WPCatValue, \
    WPWhiteList, WPWhiteListValue, WPBlackList, WPBlackListValue, WPExt, WPExtValue, \
    WPContent, WPContentValue, WPMIME, WPMIMEValue
from proxynow5_proj.proxynow5.Wizard.models import WizardSetup
from proxynow5_proj.proxynow5.Wizard.process_session import STORE_SCHEDULE, \
    STORE_CATEGORY, STORE_WHITE_LIST, STORE_BLACK_LIST, STORE_EXTENSION, \
    STORE_CONTENT, STORE_MIME, STORE_HOST, STORE_EXEMPTED_HOSTS, STORE_EXEMPTED_URLS, \
    STORE_EXEMPTED_USERS, STORE_POLICY, get_items_session_byid, delete_session
from proxynow5_proj.proxynow5.Wizard.profile_wizard import WPprofileSession
from proxynow5_proj.proxynow5.Wizard.util_wizard import init_get_data
from proxynow5_proj.proxynow5.encrypt import *


INTERFACE_LOCAL_NAME = "Local Interfaces"
INTERFACE_EXTERNAL_NAME = "External HardWare"
PROFILE_DEFAULT = "Default_Policy"

'''
 type  = 1 is username,
         2 is user group
         
access type =  1,'Normal User',
               2,'Administrator'

'''

'''
    ---------------------------------------------------------
    ---------------------------------------------------------
        This part to save data to database.
    ---------------------------------------------------------
    ---------------------------------------------------------
'''

class save_wizard_info_obj():
    lserror = []
    
    def __init__(self):
        pass
    
    ''''
        save schedule, 
        Note : we don't delete data anymore , so , if the data 've been there already, we need to
        to update ,
    '''           
    def save_temp_schedule(self, obj):  
        try:
            tempt_obj = DefSchd.objects.get(name=obj.name)
            tempt_obj.comment = obj.comment
            tempt_obj.start = obj.start
            tempt_obj.end = obj.end
            tempt_obj.weekdays = obj.weekdays
            tempt_obj.type = obj.type 
            
            tempt_obj.save()
            
        except DefSchd.DoesNotExist: 
            tempt_obj = DefSchd.objects.create(name=obj.name, comment=obj.comment, start=obj.start, end=obj.end, weekdays=obj.weekdays, type=obj.type)
        
        return tempt_obj 
    
    ''''
        save wpcat,
        Note : we don't delete data anymore, so if the data 've been there we need to update
   
    ''' 
    def save_temp_wpcat(self, obj):
        try: 
            tempt_obj = WPCat.objects.get(name=obj.name)
            tempt_obj.comment = obj.comment
            
            tempt_obj.save()
            
            # Note we will delete the datas 
            WPCatValue.objects.filter(uid=tempt_obj).delete()
            
        except WPCat.DoesNotExist:
            tempt_obj = WPCat.objects.create(name=obj.name, comment=obj.comment, type=2)
            
        return tempt_obj
    
    '''
        save wpcat-values
    '''
    def save_temp_wcatvalue(self, obj, parent):
        temp_obj = WPCatValue.objects.create(uid=parent, url=obj.url)
        return temp_obj 
    
    
    '''
        save whitelist
    '''
    def save_temp_wpwhitelist(self, obj):
        try:
            temp_obj = WPWhiteList.objects.get(name=obj.name)
            temp_obj.comment = obj.comment
            
            temp_obj.save()
            
            #Note we will delete the data
            WPWhiteListValue.objects.filter(uid=temp_obj).delete()
            
        except WPWhiteList.DoesNotExist:
            temp_obj = WPWhiteList.objects.create(name=obj.name, comment=obj.comment)
            
        return temp_obj 
    
    '''
        save whitelist_value
    '''    
    def save_temp_wpwhitelistvalue(self, obj, parent):
        temp_obj = WPWhiteListValue.objects.create(uid=parent, url=obj.url)
        return temp_obj
    
    '''
        save blacklist
    '''
    def save_temp_wpblacklist(self, obj): 
        try:
            temp_obj = WPBlackList.objects.get(name=obj.name)
            temp_obj.comment = obj.comment
            
            temp_obj.save()
            
            #Note we will delete the data.
            WPBlackListValue.objects.filter(uid=temp_obj).delete()
            
        except WPBlackList.DoesNotExist:
            temp_obj = WPBlackList.objects.create(name=obj.name, comment=obj.comment)
            
        return temp_obj
    
    '''
        save blacklistvalues
    '''
    def save_temp_wpblacklistvalue(self, obj, parent):
        temp_obj = WPBlackListValue.objects.create(uid=parent, url=obj.url)
        return temp_obj
    
    '''
        save extension
    '''
    def save_temp_wpext(self, obj):
        try:
            temp_obj = WPExt.objects.get(name=obj.name)
            temp_obj.comment = obj.comment
            
            temp_obj.save()
            
            WPExtValue.objects.filter(uid=temp_obj).delete()
            
        except WPExt.DoesNotExist:
            temp_obj = WPExt.objects.create(name=obj.name, comment=obj.comment)
        return temp_obj 
        
    '''
        save extension values
    '''
    def save_temp_wpextvalue(self, obj, parent):
        temp_obj = WPExtValue.objects.create(uid=parent, extension=obj.extension) 
        return temp_obj
    
    '''
        Assign content
    '''
    def save_temp_wpcontent(self, obj):
        try:
            temp_obj = WPContent.objects.get(name=obj.name)
            temp_obj.comment = obj.comment
            
            temp_obj.save()
            
            WPContentValue.objects.filter(uid=temp_obj).delete()
        except WPContent.DoesNotExist:
            temp_obj = WPContent.objects.create(name=obj.name, comment=obj.comment)
            
        return temp_obj
    
    '''
        Assign Content Values
    '''
    def save_temp_wpcontentvalue(self, obj, parent):
        temp_obj = WPContentValue.objects.create(uid=parent, keyword=obj.keyword, score=obj.score)
        return temp_obj
    
    '''
    '''
    def save_temp_wpmime(self, obj):
        try:
            temp_obj = WPMIME.objects.get(name=obj.name)
            temp_obj.comment = obj.comment
            
            temp_obj.save()
            
            WPMIMEValue.objects.filter(uid=temp_obj)
            
        except WPMIME.DoesNotExist:
            temp_obj = WPMIME.objects.create(name=obj.name, comment=obj.comment)
            
        return temp_obj
    
    def save_temp_wpmimevalue(self, obj, parent):
        temp_obj = WPMIMEValue.objects.create(uid=parent, mime=obj.mime)
        return temp_obj 
    
    '''
        Note : we don't support the def-group right now.
    '''            
    def save_temp_defnet_db_all(self, mainobj, typeobj):
        
        try:
            defnet = DefNet.objects.get(name=mainobj.name)
            defnet.comment = mainobj.comment
            defnet.type = mainobj.type
            defnet.save()
            
            # Delete old data.
            if (defnet.type == 1):
                DefNetHost.objects.filter(id=defnet).delete()
            if (defnet.type == 2):
                DefNetDNSHost.objects.filter(id=defnet).delete()
            if (defnet.type == 3):
                DefNetNetwork.objects.filter(id=defnet).delete()
            
            # create new data 
            if (defnet.type == 1):
                DefNetHost.objects.create(id=defnet, host=typeobj.host) 
            if (defnet.type == 2):
                DefNetDNSHost.objects.create(id=defnet, hostname=typeobj.hostname)
            if (defnet.type == 3):  
                DefNetNetwork.objects.create(id=defnet, ipaddress=typeobj.ipaddress, netmask=typeobj.netmask)
                   
        except DefNet.DoesNotExist:
            defnet = DefNet.objects.create(name=mainobj.name, type=mainobj.type, comment=mainobj.comment)
            
            if (defnet.type == 1):
                DefNetHost.objects.create(id=defnet, host=typeobj.host) 
            if (defnet.type == 2):
                DefNetDNSHost.objects.create(id=defnet, hostname=typeobj.hostname)
            if (defnet.type == 3):  
                DefNetNetwork.objects.create(id=defnet, ipaddress=typeobj.ipaddress, netmask=typeobj.netmask)
            
    def save_temp_defgroup_db(self, mainobj, typeobj):
        if mainobj.type == 4 :
            defnet = DefNet.objects.get(name=mainobj.name)
            
            for lst_m in typeobj:
                try:
                    m = DefNet.objects.get(name=lst_m.name) 
                    DefNetGroup.objects.create(gid=defnet, member=m)
                except DefNet.DoesNotExist:
                    pass
    
  
    '''
        --------------------------------------------------
        --------------------------------------------------
            This part to catch the error
        --------------------------------------------------
        --------------------------------------------------
    '''
    def catch_error(self, type_info , key, error):
        global lserror    
        error = 'Name %s : %s' % (key, error)
        ee = [type_info, error]
        self.lserror.append(ee)
    
    
    def save_administrator_email(self, dict_request):
        try:
            name = "adminemail"
            val = dict_request['emailnotifier']
            _save_setting(name, val)
            
        except Exception, ex:   
            print "Error info save_administrator_email %s " % str(ex)
            pass
    
    def save_administrator_account(self, dict_request):
        
        # hard code this user. 
        try: 
            name = "admin"
            comment = ""
            password = dict_request["adpassword"]
            
            try:
                defuser = DefUser.objects.get(name="admin")
                
                # This catch for the case defusername is not existed
                try:
                    m = defuser.defusername_set.get(id=defuser)
                    m.password = get_hexdigest('md5', SALT, password)
                    m.save()
                    
                except DefUserName.DoesNotExist :
                    DefUserName.objects.create(id=defuser, displayname=name, password=password)
                    
            except DefUser.DoesNotExist:
                
                # Note type = 1 : type of user.
                # accesstype = 2 admin
                defuser = DefUser.objects.create(name=name, type=1, accesstype=2, comment=comment)
                DefUserName.objects.create(id=defuser, displayname=name, password=get_hexdigest('md5', SALT, password))
            
           
            return (True, "")
            
        except Exception, ex:
            print "Error Info save_administrator_account %s" % str(ex)
            return (False, str(ex))
            
    def save_one_network_interface(self, dict_request):      
        try:
            # Delete the existed
            name = INTERFACE_LOCAL_NAME
            IPaddress = dict_request["ipaddresslocal"] 
            netmask = dict_request["netmaskaddresslocal"]
            defaultgateway = dict_request["defaultgateway"]
            id_hard_ware = dict_request["hardware"] 
            
            mtu = "1500"
            comment = ""
            try:
                nic = NIC.objects.get(id=id_hard_ware)
            
            except NIC.DoesNotExist:
                return (False, "System can't find hardware") 
            
            netint = NetInt.objects.create(name=name, type=1, hardware=nic, address=IPaddress,
                                           netmask=netmask, gateway=defaultgateway, mtu=mtu, comment=comment)
            
            return (True, "") 
           
        except Exception, ex: 
            print "Error Info save_one_network_interface %s" % (str(ex))
            return (False, str(ex))   
        
    def save_local_network_interfaces(self, dict_request):
        
        try:
            local_name = INTERFACE_LOCAL_NAME
            local_IPaddress = dict_request["ipaddresslocal_internal"]
            local_netmask = dict_request["netmaskaddresslocal_internal"]
            local_idhard_ware = dict_request["hardware_internal"]
            comment = ""
            mtu = "1500"
             
            try :
                local_nic = NIC.objects.get(id=local_idhard_ware)
            except NIC.DoesNotExist:
                return (False, "System can't find hardware")
            
            netint = NetInt.objects.create(name=local_name, type=1, hardware=local_nic, address=local_IPaddress,
                                           netmask=local_netmask, gateway="", mtu=mtu, comment=comment)
            
            
            return (True, "") 
        except Exception, ex:
            print "Error Info save_local_network_interfaces %s " % (str(ex))
            return (False, str(ex))
                 
    
    def save_external_network_interfaces(self, dict_request):
        try:
            external_name = INTERFACE_EXTERNAL_NAME
            external_Ipaddress = dict_request["ipaddresslocal_external"]
            external_netmask = dict_request["netmaskaddresslocal_external"]
            external_idhard_ware = dict_request["hardware_external"]
            external_default_gateway = dict_request["defaultgateway_external"]
            comment = ""
            mtu = "1500"
              
            try:
                external_nic = NIC.objects.get(id=external_idhard_ware)
            except:
                return (False, "System can't find hardware")
            
            netint = NetInt.objects.create(name=external_name, type=1, hardware=external_nic, address=external_Ipaddress,
                                           netmask=external_netmask, gateway=external_default_gateway, mtu=mtu, comment=comment)
            
            print "Insert External Network Interface is successfully."
            return (True, "")
        
        except Exception, e:
            
            print "Error Info save_local_network_interfaces %s " % (str(e))
            return (False, str(e))
        
        
    def save_two_network_interface(self, dict_request):
        
        (result1, cause1) = self.save_local_network_interfaces(dict_request)
        (result, cause) = self.save_external_network_interfaces(dict_request)
        
    def save_user_authentication(self, dict_request):
        try:
            
            adserver = dict_request["adserver"]
            addomain = dict_request["addomain"]
            adusername = dict_request["adusername"]
            adpassword = dict_request["confirmadpassword"]
            
            try:
                ADInfo.objects.all().delete()
            except:
                pass
            
            o = ADInfo.objects.create(adserver=adserver,
                                      addomain=addomain,
                                      adusername=adusername,
                                      adpassword=adpassword)
            return (True, "")
        
        except Exception, ex:
            print "Error Info : save_user_authentication %s" % str(ex)
            return (False, str(ex))
            
    def save_DNS(self, dict_request):
                                  
        firsthost = dict_request["wizard_primarydns"]
        secondhost = dict_request["wizard_seconddns"]
        thirdhost = dict_request["wizard_thirddns"]
        
        if firsthost != "":
            a1_name = "First DNS__" + firsthost
            a1_comment = "Wizard configuration created for DNS"
            
            try:
                a1 = DefNet.objects.get(name=a1_name)
                a1.comment = a1_comment
                a1.save()
                
                NetDNSRelay.objects.create(id=a1)
                
            except DefNet.DoesNotExist:
                a1 = DefNet.objects.create(name=a1_name, comment=a1_comment, type=1)
                a1_1 = DefNetHost.objects.create(host=firsthost, id=a1)
                NetDNSRelay.objects.create(id=a1)
                
        if secondhost != "":
            
            a2_name = "Seconde DNS_" + secondhost
            a2_comment = "Wizard configuration created for DNS"
            
            try:
                a2 = DefNet.objects.get(name=a2_name)
                a2.comment = a2_comment
                a2.save()
                
                NetDNSRelay.objects.create(id=a2)
                
            except DefNet.DoesNotExist:
                
                a2 = DefNet.objects.create(name=a2_name, comment=a2_comment, type=1)
                a2_2 = DefNetHost.objects.create(host=secondhost, id=a2)
                NetDNSRelay.objects.create(id=a2)
        
        if thirdhost != "":
            a3_name = "Third DNS__" + thirdhost
            a3_comment = "Wizard configuration created for DNS"
            
            try:
                a3 = DefNet.objects.get(name=a3_name)
                a3.comment = a3_comment
                a3.save()
                
                NetDNSRelay.objects.create(id=a3)
                
            except DefNet.DoesNotExist :
                a3 = DefNet.objects.create(name=a3_name, comment=a3_comment, type=1)
                a3_3 = DefNetHost.objects.create(host=thirdhost, id=a3) 
                NetDNSRelay.objects.create(id=a3)
    
    def save_netstructed(self, dict_request, request):
        
        str_id_net = dict_request["list_trustedIprange"]
        lst_id = []
        
        lst_id = str_id_net.split(",")
        id = 0
        
        for id in lst_id:
            try:
                dictobj = {}
                dictobjkey = {}
                
                [dictobj, dictobjkey] = init_get_data(STORE_HOST, request)
                
                a = get_items_session_byid(request, STORE_HOST, id)
                
                if a != None :
                    #Get defnet
                    defnetobj = a[0]
                    # Get the name of this object bcos the name can be changed.
                    # so we get the object from session after that get the name
                    # and search in db then it will be ok
                    
                    try:
                        defobj = DefNet.objects.get(name=defnetobj.name)
                        NetTrusted.objects.create(netid=defobj)
                        
                    except DefNet.DoesNotExist:
                        print "System can not find .Net"
                        pass
                        
            except Exception, ex:
                print "Error Info save_netstructed %s " % str(ex)
                pass
    
    '''
        Note: dict_user is dictionary user
        format of dict:
        
        key : is name of user
        value : include all of information of user.
        
    '''    
    def save_list_user(self, dict_user): 
        try:
            list_error = []
            print dict_user
            
            for key in dict_user:
                try :
                    x = dict_user[key]
                    
                    username = x.name
                    typeaccess = x.accesstype
                    dispalyname = x.displayname
                    password = get_hexdigest('md5', SALT, x.password)
                    comment = x.comment
                    group = x.Group
                    
                    '''
                        Check the existed UserName
                    '''
                    try:
                        if username.strip() != "":
                            defuser = DefUser.objects.get(name=username)
                            defuser.comment = comment
                            defuser.save()
                            
                            try:
                                m = defuser.defusername_set.get(id=defuser)
                                m.password = password
                                m.display = dispalyname 
                                m.save()
                            
                            except DefUserName.DoesNotExist :
                                DefUserName.objects.create(id=defuser, displayname=dispalyname, password=password)
                    
                    
                    #Create a new UserName 
                    except DefUser.DoesNotExist:
                        #Temp accesstype set 1 --> normal user.
                        defuser = DefUser.objects.create(name=username, type=1, accesstype=1, comment=comment)
                        defusername = DefUserName.objects.create(id=defuser, displayname=dispalyname, password=password)
                        
                except Exception, err:
                    print "Error Info during loop dictionary of user at save_list_user . We got this method %s" % (str(err))
                    list_error.append(str(err)) 
            
                
            if len(list_error) == 0 :
                return (True, [])
            else:
                return (False, list_error)
              
        except Exception, err:
            print "Error Info save_list_user %s" % str(err) 
            return (False, [str(err)])
    
    '''
        Note :
        Format of dict_group is : dictionary type and value is list String(that name of user) inside this group.
        {'namegroup' : ['tinh1','tinh2','tinh3'] }
        
        Note: for the case of Group We just store at DefUser and DefGroup we don't store at DefUserName for password....
    '''     
    def save_group_user(self, dict_group, in_list_update):
        
        list_error = []
        
        try:
            
            for key in dict_group:
                
                if key in in_list_update:
                    try:
                        # dict_group[name] = ["0",listname,[accesstype,comment],dic_policy] 
                        namegroup = key
                        lst_user = []
                        ischecked = "0"
                        accesstype = ""
                        comment = ""
                        dict_policy = {}
                        [ischecked, lst_user, [accesstype, comment], dict_policy,arrange] = dict_group[key]
                        
                        # Check the Group Name is existed or not , if not we will create a new group
                        #         
                        try :
                            defgroup = DefUser.objects.get(name=namegroup)
                            
                        except DefUser.DoesNotExist:
                            defgroup = DefUser.objects.create(name=namegroup, type=2, accesstype=1, comment="")
                        
                        
                        # note that delete whole members. in this grtoup
                        DefUserGroup.objects.filter(gid=defgroup).delete()
                             
                        for nameuser in lst_user:
                            try: 
                                
                                # Get the user and add to the group
                                if nameuser.strip() != "" :
                                    try :
                                        defuser = DefUser.objects.get(name=nameuser)
                                        o = DefUserGroup.objects.create(gid=defgroup, member=defuser)
                                    
                                    #    
                                    except DefUser.DoesNotExist, ex:
                                        
                                        '''
                                            This case is rarely happens , just 0.01% only
                                            When we add group the user in this group not exist in database,
                                            then we need to create a user and information of that user.
                                            
                                            That look like never happens , bcos we will create list user first then we add group later.
                                            bcos we need user.
                                            
                                            In the case the user not insert successful ,
                                            when we add group system will automatic create that user and add into group
                                        '''
                                        
                                        defuser = DefUser.objects.create(name=nameuser , type=1, accesstype=1, comment="")
                                        
                                        '''
                                            insert DefUserName. for the case  user is not existed.
                                        '''
                                        try:
                                            m = defuser.defusername_set.get(id=defuser)
                                        except DefUserName.DoesNotExist :
                                            DefUserName.objects.create(id=defuser, displayname="", password="user123")
                                        
                                        o = DefUserGroup.objects.create(gid=defgroup, member=defuser)
                                        pass
                                    
                                
                            except Exception, ex :
                                print "Error Info : Loop for User ( %s ) in Group ( %s ) " % (nameuser, key)
                                list_error.append(str(ex))
                                
                    except Exception, ex:
                        print "Error Info : Loop for Group  at method save_group_user %s " % (key)
                        list_error.append(str(ex))
                
            if len(list_error) == 0 :
                return (True, "")
            else:
                return (False, list_error)
                
        except Exception, ex :
            print "Error Info main save_group_user %s" % str(ex)
            return (False, [str(ex)])
        
                 
    '''
        --------------------------------------------------
        --------------------------------------------------
            This part to store into the list object to database
        --------------------------------------------------
        --------------------------------------------------
    '''
    
    def save_schedule_db(self, dict_schedule):
        try:
            for key in dict_schedule:
                try:
                    obj_schedlue = dict_schedule[key]
                    self.save_temp_schedule(obj_schedlue) 
                except Exception, e:
                    print "Error Info save_schedule_db for item %s : %s " % (key, str(e))
                    self.catch_error('Schedule', key, str(e))
                    
        except Exception, ex :
            print "Error Info save_schedule_db %s" % str(ex)
            pass
                
    def save_wpcat_db(self, dict_wpcat):
        try:
            for key in dict_wpcat:
                try:
                    [temp_wcatobj, lst_temp_wcatitems] = dict_wpcat[key]
        
                    wcat = self.save_temp_wpcat(temp_wcatobj)
                    
                    for temp_wcatitems in lst_temp_wcatitems:
                        try:
                            name = temp_wcatitems.url
                            wcat_items = self.save_temp_wcatvalue(temp_wcatitems, wcat)
                        except Exception, e1:
                            print "Error Info save_wpcat_db for each value %s : %s " % (name, str(e1))
                            self.catch_error('WPCat_values', name, str(e1))
                            
                except Exception, e2:
                    print "Error Info save_wpcat_db for item %s : %s" % (key, str(e2))
                    self.catch_error('WPCat', key, str(e2))
                    
        except Exception, ex:
            print "Error Info save_wpcat_db %s" % str(ex)
            pass
        
    def save_whitelist_db(self, dict_whitelist):
        try:
            for key in dict_whitelist:
                try:
                    [temp_whitelistobj, lst_temp_whitelistitems] = dict_whitelist[key]
        
                    wlist = self.save_temp_wpwhitelist(temp_whitelistobj)
                    
                    for temp_whitelistitems in lst_temp_whitelistitems:
                        try:
                            name = temp_whitelistitems.url
                            wlist_items = self.save_temp_wpwhitelistvalue(temp_whitelistitems, wlist)
                        except Exception, e1:
                            print "Error Info save_whitelist_db for value %s : %s " % (name, str(e1))
                            self.catch_error('WhiteList_values', name, str(e1))
                            
                except Exception, e2:
                    print "Error Info save_whitelist_db for item %s : %s " % (key, str(e2))
                    self.catch_error('WhiteList', key, str(e2))
                    
        except Exception, ex:
            print "Error Info save_whitelist_db %s " % str(ex)
            pass
    
    def save_blacklist_db(self, dict_blacklist):
        try:
            for key in dict_blacklist:
                try:
                    [temp_blacklistobj, lst_temp_blacklistitems] = dict_blacklist[key]
        
                    wlist = self.save_temp_wpblacklist(temp_blacklistobj)
                    
                    for temp_blacklistitems in lst_temp_blacklistitems:
                        try:
                            name = temp_blacklistitems.url
                            wlist_items = self.save_temp_wpblacklistvalue(temp_blacklistitems, wlist)
                        except Exception, e1:
                            print "Error Info  save_blacklist_db for value %s : %s" % (name, str(e1))
                            self.catch_error('BlackList_values', name, str(e1))
                            
                except Exception, e2:
                    print "Error Info save_blacklist_db for item %s : %s " % (key, e2)
                    self.catch_error('BlackList', key, str(e2))
                    
        except Exception, ex :
            print "Error Info save_blacklist_db %s " % str(ex)
            pass            
        
    def save_extension_db(self, dict_extension):
        try:
            for key in dict_extension:
                try:
                    [temp_extensiontobj, lst_temp_extensionitems] = dict_extension[key]
        
                    wlist = self.save_temp_wpext(temp_extensiontobj)
                    
                    for temp_extensionitems in lst_temp_extensionitems:
                        try:
                            name = temp_extensionitems.extension
                            ex_items = self.save_temp_wpextvalue(temp_extensionitems, wlist)
                        except Exception, e1:
                            print "Error Info save_extension_db for value %s : %s " % (name, str(e1))
                            self.catch_error('Extension_values', name, str(e1))
                            
                except Exception, e2:
                    print "Error Info save_extension_db for item %s : %s " % (key, str(e2))
                    self.catch_error('Extension', key, str(e2))
                    
        except Exception, ex :
            print "Error Info save_extension_db %s " % str(ex)
            pass      
        
    def save_content_db(self, dict_content):
        try:
            for key in dict_content:
                try:
                    [temp_contentobj, lst_temp_contentitems] = dict_content[key]
        
                    wlist = self.save_temp_wpcontent(temp_contentobj)
                    
                    for temp_extensionitems in lst_temp_contentitems:
                        try:
                            name = temp_extensionitems.keyword
                            content_items = self.save_temp_wpcontentvalue(temp_extensionitems, wlist)
                        except Exception, e1:
                            print "Error Info save_content_db %s : %s" % (name, str(e1))
                            self.catch_error('Content_values', name, str(e1))
                            
                except Exception, e2:
                    print "Error Info save_content_db %s : %s" % (key, str(e2))
                    self.catch_error('Content', key, str(e2))
                    
        except Exception, ex :
            print "Error Info save_content_db %s" % str(ex)
            pass   
     
    def save_mime_db(self, dict_mime):
        try:
            for key in dict_mime:
                try:
                    [temp_mimeobj, lst_temp_mimeitems] = dict_mime[key]
        
                    wlist = self.save_temp_wpmime(temp_mimeobj)
                    
                    for temp_mimeitems in lst_temp_mimeitems:
                        try:
                            name = temp_mimeitems.mime
                            content_items = self.save_temp_wpmimevalue(temp_mimeitems, wlist)
                        except Exception, e1:
                            print "Error Info save_mime_db for value %s : %s " % (name, str(e1))
                            self.catch_error('Mime_values', name, str(e1))
                            
                except Exception, e2:
                    print "Error Info save_mime_db for item %s : %s " % (key, str(e2)) 
                    self.catch_error('Mime', key, str(e2))
                    
        except Exception, ex:
            print "Error Info save_mime_db %s " % str(ex)
            pass   
    
    
    def save_policy_db(self, namegroup, dict_policy_info, lst_user):
        
        lst_policy = []
        status = "0"
        
        for key in dict_policy_info:
            [status, wpprofile1] = dict_policy_info[key]
            
            if (status == "1"):
                wpprofile1.set_authentication(lst_user)
                wpprofile1.save()
    
    def save_defnet_bd(self, dict_host):
        
        try:
            for key in dict_host:
                try:
                    a, b = dict_host[key]
                    self.save_temp_defnet_db_all(a, b) 
                except Exception, ex1 :
                    print "Error Info save_defnet_bd %s : %s " % (key, str(ex1))
                    
        except Exception, ex:
            print "Error Info save_defnet_bd %s" % str(ex)
            pass
            
    
    def delete_all_data(self):
        
        '''
            Delete admin page.
        '''
        ADInfo.objects.all().delete()
        print "Delete ADInfo"
        
        '''
            Delete NAT_MASQ. 
        '''
        NAT_MASQ.objects.all().delete()
        print "Delete NAT_MASQ"
        
        '''
            Delete Net Interface
            Don't delete this database , just update
        '''
        NetInt.objects.all().delete()
        print "Delete NetInt"
        
        
        NetTrusted.objects.all().delete()
        print "Delete NetTrusted"
        
        '''
            Delete all the NetDNSRelay 
            This is deleted.
        '''
        NetDNSRelay.objects.all().delete()
        print "Delete NetDNSRelay"
        
        WPProfileSchd.objects.all().delete()
        print "Delete WPProfileSchd"
        
        WPProfileUserInternal.objects.all().delete()
        print "Delete WPProfileUserInternal" 
        
        WPProfileWhiteList.objects.all().delete()
        print "Delete WPProfileWhiteList"
        
        WPProfileBlackList.objects.all().delete()
        print "Delete WPProfileBlackList"
        
        WPSelectedCat.objects.all().delete()
        print "Delete WPSelectedCat"
        
        '''
            Delete Extension
        '''
        WPProfileAllowExt.objects.all().delete()
        print "Delete WPProfileAllowExt"
        
        WPProfileBlockExt.objects.all().delete()
        print "Delete WPProfileBlockExt"
        
        '''
            Delete Mime
        '''
        WPProfileAllowMIME.objects.all().delete()
        print "Delete WPProfileAllowMIME"
        
        WPProfileBlockMIME.objects.all().delete()
        print "Delete WPProfileBlockMIME"
        
        '''
            Delete Content Filter
        '''
        WPProfileContentFilter.objects.all().delete()
        print "Delete WPProfileContentFilter"
        
        '''
            Delete Except
        '''
        WPProfileExcept.objects.all().delete()
        print "Delete WPProfileExcept"
        
        '''
            delete Exception
        '''
        WPProfileExceptURL.objects.all().delete()
        print "Delete WPProfileExceptURL"
        
        WPProfileExceptNet.objects.all().delete()
        print "Delete WPProfileExceptNet"
        
        WPProfileExceptUserInternal.objects.all().delete()
        print "Delete WPProfileExceptUserInternal"
        
        '''
            Delete Profile
        '''
        WPProfile.objects.all().delete()
        print "Delete WPProfile"
        
        '''
            Delete the Schedule.
            Don't delete this one just update.
            
        '''
        #DefSchd.objects.all().delete()
        
        '''
            Delete the Cat
            Don't Delete This one , just update
        '''
        #WPCatValue.objects.all().delete()
        #WPCat.objects.all().delete()
        
        '''
            Delete the WhiteList and BlackList
            Don;t delete this one , just update.
        '''
        #WPWhiteListValue.objects.all().delete()
        #WPWhiteList.objects.all().delete()
        
        #WPBlackListValue.objects.all().delete()
        #WPBlackList.objects.all().delete()
        
        '''
            Delete Extension
            Don't Delete this one ,just update
        '''
        #WPExtValue.objects.all().delete()
        #WPExt.objects.all().delete()
        
        '''
            Delete Content and Delete Mime
            don't delete this one ,just update.
        '''
        #WPContentValue.objects.all().delete()
        #WPContent.objects.all().delete()
        
        #WPMIMEValue.objects.all().delete()
        #WPMIME.objects.all().delete()
        
        '''
            ToDo : delete the NetWork Trusted first.
            Don't delete this one , just update
        '''
        #DefNetGroup.objects.all().delete()
        #DefNetDNSHost.objects.all().delete()
        #DefNetHost.objects.all().delete()
        #DefNetNetwork.objects.all().delete()
        #DefNet.objects.all().delete()
    
        '''
        '''
        DefUserGroup.objects.all().delete()
        print "Delete DefUserGroup"
        
        DefUser.objects.all().delete()
        print "Delete DefUser"
    
    
    def update_status_wizard(self, request, status):
        try:
            WizardSetup.objects.all().delete()
            WizardSetup.objects.create(iswizard=status)
            
        except Exception, ex:
            print "Error Info update_status_wizard : %s" % str(ex)
            pass
    
    def get_trustednet(self, request, str_id_net):
        lst_id = []
        lst_id = str_id_net.split(",")
        id = 0
        lst_host_obj = []
          
        for id in lst_id:
            try:
                dictobj = {}
                dictobjkey = {}
                
                [dictobj, dictobjkey] = init_get_data(STORE_HOST, request)
                
                a = get_items_session_byid(request, STORE_HOST, id)
                
                if a != None :
                    #Get defnet
                    defnetobj = a[0]
                    lst_host_obj.append(defnetobj)
                        
            except Exception, ex:
                print "Error Info save_netstructed %s " % str(ex)
                pass
        
        return lst_host_obj
        
        
    def save_default_profile_wizard(self, request, dict_policy, dict_user, str_id_net, in_location, in_timequota, in_sizequota, in_catdef, in_safesearchon):
        #o = WPprofileSession()
        try:
            name_policy_default = PROFILE_DEFAULT
            locataion = in_location
            enable = 1
            timequota = in_timequota
            sizequota = in_sizequota
            catdef = in_catdef
            safesearchon = in_safesearchon
            lst_host_obj = []
            
            result = True
            number_index = 1
            
            while (result):
                
                if dict_policy.has_key(name_policy_default):
                    name_policy_default = name_policy_default + "_" + str(number_index)
                    number_index = number_index + 1 
                else:
                    result = False
            
            lst_host_obj = self.get_trustednet(request, str_id_net)
                       
            oo = WPprofileSession()
            oo.set_profile_main_defaulpolicy(name_policy_default, locataion, enable, timequota, in_sizequota, in_catdef, in_safesearchon)
            oo.set_profileexcept_defaulpolicy()
            oo.set_profile_host(lst_host_obj)
            
            '''
                set the list user 
            '''
            for xxxx in dict_user:
                ttt = dict_user[xxxx]
                nameuser = ttt.name
                
                if nameuser != "":
                    oo.set_authentication(nameuser)
            
            oo.save(request)
        
        except Exception, ex:
            print "Error Info save_default_profile_wizard %s " % str(ex)
            pass
            
    
    def save_masquerading_db(self, request, str_id_net, nbr_interface):
        try:
            location_index = 1 
            lst_host_obj = []
            
            # Then user just create one interface.
            
            lst_host_obj = self.get_trustednet(request, str_id_net) 
            
            try:
                if nbr_interface == 1:
                    o = NetInt.objects.get(name=INTERFACE_LOCAL_NAME)
                if nbr_interface == 2: 
                    o = NetInt.objects.get(name=INTERFACE_EXTERNAL_NAME)
                     
            except NetInt.DoesNotExist:
                print "Error Info save_masquerading_db System can't find the net interface"
                return 
                
            for x in lst_host_obj:
                try:
                    oodefnet = DefNet.objects.get(name=x.name)
                
                    if oodefnet != None:
                        NAT_MASQ.objects.create(network=oodefnet,
                                                interface=o,
                                                comment="Created by configuration wizard",
                                                location=location_index)
                        location_index = location_index + 1
                        
                except DefNet.DoesNotExist:
                    print "Error Info save_masquerading_db can't find the defnet "
                    pass
                    
        except Exception, ex:
            print "Error Info save_masquerading_db %s" % str(ex)
            pass
        
    def save_wizard_info(self, request):
        
        try:
            
            # temparary don't delete data
            
            str_id_netstructed = ""
            dict_host_insert = {}
            dict_host_mapkey = {}
            str_id_net = ""
            
            is_first_finish = request.POST["is_finished"]
            
            if is_first_finish == "1":
            
                self.delete_all_data()
                
                '''
                    support for masquer
                '''
                is_two_interface = 1 
                
                [dict_host_insert, dict_host_mapkey] = init_get_data(STORE_HOST, request)
                
                typeupdate = request.POST["insertdept"]
                
                list_update = typeupdate.split(',')
                
                self.save_defnet_bd(dict_host_insert)
                
                if 0 in request.session:
                    try:
                        [namefrom, dict_data] = request.session[0]
                        self.save_administrator_email(dict_data)
                        self.save_administrator_account(dict_data)
                    except:
                        pass
                    
                if 2 in request.session:
                    try:
                        if request.session[2] == ['', '']:
                            print "This step(2) has skipped."
                            
                        else:
                            [nameform, dict_data2] = request.session[2]
                            
                            if nameform == "networkinterfacesdefinitionA":
                                self.save_two_network_interface(dict_data2)
                                is_two_interface = 2
                            if nameform == "networkinterfacesdefinitionB":
                                self.save_one_network_interface(dict_data2)
                    except:
                        pass
                    
                if 3 in request.session:
                    try:
                        if request.session[3] == [u'trusted_network_range', '']:
                            print "This step(3) has skipped."
                        else: 
                            [nameform, dict_data33] = request.session[3]
                            str_id_net = dict_data33["list_trustedIprange"]
                            self.save_netstructed(dict_data33, request) 
                    except:
                        pass    
                
                if 4 in request.session:
                    try:
                        [nameform, dict_data3] = request.session[4]
                        self.save_DNS(dict_data3)
                    except:
                        pass
                    
                if 6 in request.session:
                    try:
                        [aa , bb] = request.session[6]
                        
                        if [aa, bb] == ['', '']:
                            print "This step(6) has skipped."
                        elif aa == 'userauthenticationA':
                            [nameform, dict_data5] = request.session[6]
                            self.save_user_authentication(dict_data5)
                    except:
                        pass
                
                try:   
                    dict_user = {}
                    dict_group = {}
                    
                    [dict_group, dict_user] = request.session["STORE_INFO"]
                    
                    self.save_list_user(dict_user)
                    self.save_group_user(dict_group, list_update)
                except:
                    pass
                
                #save the defnet.
                  
                #save wizard info 
                # get the first position that is data we need to insert into database
                
                dict_schedule_insert = {}
                dict_schedule_mapkey = {}
                [dict_schedule_insert, dict_schedule_mapkey] = init_get_data(STORE_SCHEDULE, request)
                self.save_schedule_db(dict_schedule_insert)
               
                
                   
#                dict_wpcat_insert = {}
#                dict_wpcat_mapkey = {}
#                [dict_wpcat_insert, dict_wpcat_mapkey] = init_get_data(STORE_CATEGORY, request)
#                self.save_wpcat_db(dict_wpcat_insert)
               
                
                
                dict_whitelist_insert = {}
                dict_whitelist_mapkey = {}
                [dict_whitelist_insert, dict_whitelist_mapkey] = init_get_data(STORE_WHITE_LIST, request)
                self.save_whitelist_db(dict_whitelist_insert)
               
                
                
                dict_blacklist_insert = {}
                dict_blacklist_mapkey = {}
                [dict_blacklist_insert, dict_blacklist_mapkey] = init_get_data(STORE_BLACK_LIST, request)
                self.save_blacklist_db(dict_blacklist_insert)
               
                
                dict_extension_insert = {}
                dict_extension_mapkey = {}
                [dict_extension_insert, dict_extension_mapkey] = init_get_data(STORE_EXTENSION, request)
                self.save_extension_db(dict_extension_insert)
               
                
                 
                dict_content_db_insert = {}
                dict_content_mapkey = {}
                [dict_content_db_insert, dict_content_mapkey] = init_get_data(STORE_CONTENT, request)
                self.save_content_db(dict_content_db_insert) 
               
                
               #print request.session[STORE_MIME]
                dict_mime_db_insert = {}
                dict_mime_db_mapkey = {}
                [dict_mime_db_insert, dict_mime_db_mapkey] = init_get_data(STORE_MIME, request)
                self.save_mime_db(dict_mime_db_insert)                       
               
                
                # Note
                # ["0",[],["",""],default_dict_policy]
                status_group = "0"
                lst_user = []
                accesstype = ""
                comment = ""
                default_dict_policy = {}
                typeupdate = ""
                
                location_index = 1
                
                for key_main in dict_group:
                    if key_main in list_update:
                        
                        [status_group, lst_user, [accesstype, comment], default_dict_policy,arrange] = dict_group[key_main]
                        
                        for key in default_dict_policy:
                            try:
                                list_obj_user = []
                                _key = int(key)
                                obj = get_items_session_byid(request, STORE_POLICY, _key)
                                
                                if obj != None:
                                    nameprofile = obj.WPmainprofile.name
                                    try:
                                        objwprofile = WPProfile.objects.get(name=nameprofile)
                                        list_obj_user = lst_user
                                        
                                        username = key_main
                                    
                                        try:
                                            try:
                                                if username.strip() != "":
                                                    objuser = DefUser.objects.get(name=username)
                                                    WPProfileUserInternal.objects.create(profileid=objwprofile, userinternal=objuser)
                                                    
                                            except DefUser.DoesNotExist:
                                                print "Error Info save_profile to database -- can not find user. "
                                                pass
                                               
                                        except:
                                            print "Error Info save_profile to database"
                                            pass 
                                        
                                    except WPProfile.DoesNotExist: 
                                        obj.set_authentication(key_main)
                                        obj.set_profilelocation(location_index)
                                        obj.save(request)
                                        location_index = location_index + 1
                            
                            except Exception, ex:
                                print "Error Info save_profile to database %s " % str(ex)
                                pass
                
                '''
                    create policy defalut
                '''
                dict_policy = {}
                dict_policy_map = {}
                timequota = "0"
                sizequota = "0"
                catdef = "0"
                safesearchon = "2"
                
                [dict_policy, dict_policy_map] = init_get_data(STORE_POLICY, request)
                
                self.save_default_profile_wizard(request, dict_policy, dict_user, str_id_net, location_index, timequota, sizequota, catdef, safesearchon)
                
                self.save_masquerading_db(request, str_id_net, is_two_interface)
                 
                self.update_status_wizard(request, '0')
            
                delete_session(request)
                
                request.session['iswizard'] = "0"
                    
                request.session["STORE_INIT_INFO_PROXYNOW"] = "0" 
                print "Save finished"
            
            else:
                print "User click many times for insert wizard."
                
        except Exception, ex:
            print "Error Info Save wizard: %s" % str(ex)
            
            self.update_status_wizard(request, '0')
            delete_session(request)
            request.session['iswizard'] = "0"
            request.session["STORE_INIT_INFO_PROXYNOW"] = "0" 
        
    
