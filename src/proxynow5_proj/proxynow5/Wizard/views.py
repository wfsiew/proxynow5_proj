from django.http import HttpResponse
from django.shortcuts import *
from django.template.context import Context
from django.template.loader import get_template
from django.utils.translation import ugettext as _
from forms import *
from import_user import *
from proxynow5_proj.proxynow5.Definition_Network.models import DefNet
from proxynow5_proj.proxynow5.Definition_User.forms import DefUserForm, \
    DefUserNameForm
from proxynow5_proj.proxynow5.WebProxy.forms import WPProfileForm, \
    WPProfileExceptForm, ADD_WPPROFILE_FORM_TITLE, EDIT_WPPROFILE_FORM_TITLE
from proxynow5_proj.proxynow5.WebProxy.models import WPProfile
from proxynow5_proj.proxynow5.Wizard.defined_object import LIST_GROUP_POLICY
from proxynow5_proj.proxynow5.Wizard.init import init_info
from proxynow5_proj.proxynow5.Wizard.list_group import group_user
from proxynow5_proj.proxynow5.Wizard.models import WizardSetup
from proxynow5_proj.proxynow5.Wizard.process_session import \
    get_items_session_byid, store_session, STORE_HOST, is_existed_in_session, \
    update_items_session, STORE_SCHEDULE
from proxynow5_proj.proxynow5.Wizard.profile_wizard import WPprofileSession
from proxynow5_proj.proxynow5.Wizard.save_wizard import save_wizard_info_obj
from proxynow5_proj.proxynow5.Wizard.util_wizard import init_get_data

#pls don't change this 
STORE_INFO = "STORE_INFO"
STORE_POLICY = "STORE_POLICY"
#store tempariry list of user in a group.
STORE_TEMP = "STORE_TEMPT"

SIGNAL_SEPERATE = "||*||*||*||"

# This is a dictionary of navigation .

'''
    Note: How it work and how config this wizad 
    
    dict is dictionary 
    
    Key : name of the form. 
          Each form we have got a name and it is unquie
        EX:
        at template(is called form in this case) (administrator_account.html) i put the name of the form is administratoraccount.
        at template (wizard/network_interfaces_definition.html) i put the name networkinterfacesdefinition.     
        and the name of the form it must be diffrent.
        
    values: that is some parameters for config.
        
        "next" : It mean When user click next button at form(client) , It will go to next fom 
         Ex :
         at form : administratoraccount when user click next button , that will send a request to server and get next form
         .Next form will be  networkinterfacesdefinition
         
        "skip" : It means When user click Skip button it will go to which form ,
        Example look like next
        
        "curpathtemplate" : the template for this form.
        EX:
            At the form administratoraccount , i will use the path of template wizard/administrator_account.html
            It mean when user go to this form administratoraccount System will get the template wizard/administrator_account.html
            and show it to user.
        
        
        "validation" : not use right now.
        
        "step" : this record the order form . It support to store in request session
        Ex:
            At administratoraccount form. that is first page to show use it must be step 0
            At  networkinterfacesdefinitionA,networkinterfacesdefinitionB why it is the same steps.
            bcos the user just choose one of them only , i just save what user want to stored.
'''


'''
    What we will do when we add a new form ?
    
    1. Define the name of the form and put it in dict (following above instruction.)
    
    2. Write code -- for check validation
        - create a new method to check the validation for that form ( validation part )
        - At the method check_validation add code to make sure when nameform == 'yournewform' then system must use this checking 
         (you have written above suggestion) for validation.
    
    3.Write code -- for next button
        - Because Each forms, we got diffrent controls completely so we must use another form also. 
        - So When user click next , this method will be called --> wizard_get_template
        - you have to write code to make sure user  see the right form ( using form (forms.py) and template .)  
    
    4.Write code -- for back button.
        - Because Each forms, we got diffrent controls completely so we must use another form also.
        - And the the data send back for client it also diffrent for each form.
        - for the case we have define for form in forms.py then we no need to code in javascript side.
        - for the case we don't define for form  in forms.py then we need to code in javascript side also 
        - incase of option radio javascript side will attachethe suitable value to suitable control. 
        
        - So when user click back button this method will be called --> wizard_get_template_back
        - you have to write code to make sure user see the right form ( using form (forms.py) and template .) and right data.
    
    5.Write code -- for skip button.
        -- wizard_skip 
        -- right now : no need to code for this one . 
        -- but you have to config properly for in dict var.
'''

dict = {"administratoraccount" : {"next" : ["networkinterfacesdefinition"] ,
                                  "skip" : "",
                                  "curpathtemplate" : "wizard/administrator_account.html",
                                  "validation" : "check_administrator_account",
                                  "step" : 0,
                                  },
        
        "networkinterfacesdefinition" : {"next" :["networkinterfacesdefinitionA","networkinterfacesdefinitionB"],
                                         "skip" :"trusted_network_range",
                                         "curpathtemplate" : "wizard/network_interfaces_definition.html",
                                         "validation" : "check_network_interfaces_definition",
                                         "step" : 1,
                                         },
        
        #Note : networkinterfacesdefinitionA and networkinterfacesdefinitionB 
        # is chlidrens of form networkinterfacesdefinition
        "networkinterfacesdefinitionA" : {"next" :["trusted_network_range"],
                                          "skip" : "trusted_network_range",
                                          "curpathtemplate" : "wizard/network_interfaces_definition_a.html",  
                                          "validation" :"check_network_interfaces_definitionA",
                                          "step" : 2,
                                          },
        
        "networkinterfacesdefinitionB" : {"next" : ["trusted_network_range"],
                                          "skip" : "trusted_network_range",
                                          "curpathtemplate" :  "wizard/network_interfaces_definition_b.html",
                                          "validation" :"check_network_interfaces_definitionB",
                                          "step" : 2,
                                          },
        
        "trusted_network_range" :{"next":["dns"], 
                                  "skip":"dns",
                                  "curpathtemplate" : "wizard/trusted_network_range.html",
                                  "validation" :"",
                                  "step":3,
                        },
        
        #Note that for the case of dns , we will have got 3 fom to return 
        # networkinterfacesdefinition,networkinterfacesdefinitionA,networkinterfacesdefinitionB  
        "dns"                             : {"next" : ["userauthentication"],
                                             "skip" : "", 
                                             "curpathtemplate" : "wizard/dns.html",
                                             "validation" : "check_dns",
                                             "step" : 4,   
                                            },
        
        "userauthentication" : {
                                "next" : ["internet_usage_policy","userauthenticationA","userauthenticationB"],
                                "skip" : "internet_usage_policy",
                                "curpathtemplate" :"wizard/user_authentication.html",
                                "step" :5, 
                                },
        
        "userauthenticationA" :{
                                  "next": ["internet_usage_policy"],
                                  "skip" : "internet_usage_policy",
                                  "curpathtemplate" : "wizard/user_authentication_a.html",
                                  "step" : 6,
                                  },
        
        "userauthenticationB":{
                                 "next" : ["internet_usage_policy"],
                                 "skip" : "internet_usage_policy",
                                 "curpathtemplate" : "wizard/user_authentication_b.html",
                                 "step" : 6,
                                 },
        
        "internet_usage_policy" : {
               "next" : ["finished"],
               "skip" : "",
               "curpathtemplate" : "wizard/internet_usage_policy.html",
               "step" : 7,
               },
        
        "finished" : {
                 "curpathtemplate" : "wizard/wellcome_proxynow.html",
                 "step" : 8,
               },
        }


dict_detination = {
                   "schedules" : "id_schedules",
                   "defnet" : "id_nets",
                   "defusers" : "members"
                   }

#Turn on and turn off wizard.
def wizard_profile_switch(request):
    dict_result = {} 
    
    try:
        if (request.is_ajax() and request.method == 'POST'):
            
            _status = request.POST['status']
            status = 0
            
            status = int(_status) 
            
#            WizardSetup.objects.all().delete()
#            WizardSetup.objects.create(iswizard = status)
            
            if status == 1 :
                dict_result['status'] = 'success'
                return json_result(dict_result)     
        
        else:
            dict_result['status'] = 'error'
            dict_result['error_info'] = 'System do not support' 
            return json_result(dict_result)     
        
    except Exception,ex:
        dict_result = {} 
        dict_result['status'] = 'error'
        dict_result['error_info'] = str(ex) 
        return json_result(dict_result)     
        

# This work when for firt time of loading wizard page.
def loadmainwizard(request):
    try:
        # Init the default vaules and put it in
        
        #Check whether wizard is existed or not.
        try:
            a = WizardSetup.objects.get(id=1)
            
            if (a.iswizard == 0):
                return HttpResponseRedirect("/")
            
        except WizardSetup.DoesNotExist:
            pass 
        
        init_info(request)
        
        frm = ADMINISTRATORACCOUNTfORM()
        c = RequestContext(request,{'title':CONFIGURATION_ADMINISTRATOR_FORM_TITLE,'form':frm })
        
        request.session["iswizard"] = "1"
        
        return render_to_response('main_page_wizard.html',c) 
    
    except Exception,e:
        print "Error Info loadmainwizard %s " %str(e)
        return HttpResponseRedirect("")
        pass
    
# This work when for firt time of loading wizard page.
def loadmainwizardReRun(request):
    try:
        # Init the default vaules and put it in
        
        init_info(request)    
        
        frm = ADMINISTRATORACCOUNTfORM()
        c = RequestContext(request,{'title':CONFIGURATION_ADMINISTRATOR_FORM_TITLE,'form':frm })
        
        request.session["iswizard"] = "1"
        
        return render_to_response('main_page_wizard.html',c) 
    
    except Exception,e:
        print "Error Info loadmainwizard %s " %str(e)
        return HttpResponseRedirect("")
        pass

'''
    Check validation of Form to make sure the data user has enterd is correct.
    Translate for the matched filed.
    Bcos django just return the id only , that make the user don't understant what field they need to modify or enter 
    for validation. 
'''
def get_real_text_for_error(txt):
    
    if txt == "emailnotifier":
        return  _(u'Email Address ')
    
    if txt == "adpassword":
        return _(u'Password ')
    
    if txt == "readpassword":
        return _(u'Confirmed Password ')
    
    if txt == "ipaddresslocal":
        return _(u'IP address')
    
    if txt == "netmaskaddresslocal":
        return _(u'Net Mask')
    
    if txt == "defaultgateway" :
        return _(u'Default Gateway')
    
    if txt == "ipaddresslocal_external":
        return _(u'IP address External ') 
     
    if txt == "netmaskaddresslocal_external":
        return _(u'Net Mask External')
    
    if txt == "defaultgateway_external":
        return _(u'Default Gateway External')
    
    if txt == "hardware_external":
        return _(u'Hard Ware External')
    
    if txt == "ipaddresslocal_internal":
        return _(u'IP address Local')
    
    if txt == "netmaskaddresslocal_internal":
        return _(u'Net Mask Local')

    if txt == "hardware_internal":
        return _(u'HardWare Local')
    
    if txt == "hardware":
        return _(u'HardWare') 
    
    if txt == "adserver":
        return _(u'AD Server Address')
    
    if txt == "addomain":
        return _(u"AD Domain")
    
    if txt == "adusername":
        return _(u"AD username")
    
    if txt == "adpassword":
        return _(u"AD password")
    
    if txt == "confirmadpassword":
        return _(u"AD confirm password")
    
    if txt == "ipaddress_range":
        return _(u"Ip address")
    
    else:
        return txt 
      
    return ""

'''
    ----------------------------------------------------------------------------
    Show the string error to user instead of list.
    ----------------------------------------------------------------------------
'''
def generate_error_msg(errors):
    
    lst_key_err = errors.keys()
    msg_error = ""
        
    for txt in lst_key_err:
        err = get_real_text_for_error(txt)
        msg_error = msg_error + "<p> " + err + " : " + errors[txt][0] + "</p>"
    
    return msg_error
    

'''
      ----------------------------------------------------------------------------
      This part is applied for checking validation of the form.
          Each forms we will have got diffrent validation.
          
      ----------------------------------------------------------------------------
'''

def check_administrator_account(request):
    try:
        
        frm = ADMINISTRATORACCOUNTfORM(request.POST)
        
        if frm.is_valid():
            return (True,"")
        else:
            err_msg = generate_error_msg(frm._get_errors())
            return (False,err_msg)
        
    except Exception,e:
        print "check_administrator_account %s" %str(e)
        return (False,str(e))
    

def check_network_interfaces_definition_a(request):
    try:
        frm = LOCALINTERFACEFORM(request.POST)
        
        if frm.is_valid():
            return (True,"")
        
        else:
            err_msg = generate_error_msg(frm._get_errors())
            return (False,err_msg)  
        
    except Exception,e:
        print "Error check_network_interfaces_definition_a %s" %str(e)
        a=""
        a= str(e)
        if a == "\'hardware_external\'":
            return (False,'Hardware External : This field is required.')
        
        return (False,str(e))

def check_network_interfaces_definition_b(request):
    try:
        frm = EXTERNALINTERFACEFORM(request.POST)
        
        if frm.is_valid():
            return (True,"")
        
        else:
            err_msg = generate_error_msg(frm._get_errors())
            return (False,err_msg)
        
    except Exception,e:
        print "check_network_interfaces_definition %s" %str(e)
        return (False,str(e))
    
def check_dns(request):
    try:
        first_dns = request.POST["wizard_primarydns"] 
        second_dns = request.POST["wizard_seconddns"]
        third_dns = request.POST["wizard_thirddns"]
        
        if first_dns == "" :
            return (False,_(u'Primary DNS : This field is required.'))  
        else:
            frm_dns = IpRange({'ipaddress_range' : first_dns})
            if not frm_dns.is_valid(): 
                return (False,"First DNS : IP is invalid.")
            
        if second_dns.strip()!= "":
            frm_sddns = IpRange({'ipaddress_range' : second_dns})
            if not frm_sddns.is_valid(): 
                return (False,"Second DNS : IP is invalid.")
        
        if third_dns.strip() != "":
            frm_tddns = IpRange({'ipaddress_range' : third_dns})
            if not frm_tddns.is_valid():
                return (False,"Tertiary : IP is invalid.")
    
        return (True,"")
    
    except Exception,e:
        print "check dns %s" %str(e)
        return (False,str(e))

def check_netstructed(request):
    try:
        strlst = ""
        lst_id = []
        
        strlst = request.POST["list_trustedIprange"] 
        
        if strlst == "":
            return (False,"Please Enter the Trusted Network")
        
        return (True,"")
    
    except Exception,ex:
        print "check_netstructed %s" %str(ex)
        return (False,str(ex))
        

def check_user_authentication(request):
    try:
        frm = USERAUTHENTICATEFORM(request.POST)
        
        if frm.is_valid():
            return (True,"")
        
        else:
            err_msg = generate_error_msg(frm._get_errors())
            return (False,err_msg)  
        
    except Exception,e : 
        print "check user authentication %s" %str(e)
        return (False,str(e))
        
# parameter . namefrm : Name of the form  
#             request : that is request client send to server (HTTP request)       
def check_validation(namefrm,request):
    
    if (namefrm == "administratoraccount"):
        return check_administrator_account(request)
    
    # This form awlas return true
    if (namefrm == "networkinterfacesdefinition"):
        return (True,"")
    
    if (namefrm == "networkinterfacesdefinitionA"):
        return check_network_interfaces_definition_a(request)
        
    if (namefrm == "networkinterfacesdefinitionB"):
        return check_network_interfaces_definition_b(request)
    
    if (namefrm == "trusted_network_range"):
        return check_netstructed(request)
    
    if (namefrm == "dns"):
        return check_dns(request)
    
    if (namefrm == "userauthentication"):
        return (True,"")
    
    if (namefrm == "userauthenticationA"):
        return check_user_authentication(request)
    
    if (namefrm == "userauthenticationB"):
        return (True,"")
            
    if (namefrm == "internet_usage_policy"):
        return (True,"")
'''
    ----------------------------------------------------------------------------
    Get which template is next back and skip
    As well as get the that template following the current path.
    ----------------------------------------------------------------------------
'''

# positiontemplate is reserved list of next template
# Get the next or skip , next form.
def get_name_form(namefrm,positiontemplate):
   
    name_next_form = ""
    name_skip_form = ""
    
    if (dict.has_key(namefrm)):
        dictin = {}
        dictin = dict[namefrm];
        
        if dictin.has_key("next"):
            name_next_form = dictin["next"][positiontemplate]
                  
        if dictin.has_key("skip"):
            name_skip_form = dictin["skip"]
        
        if dictin.has_key("step"):
            step = dictin["step"] 
    
    return (step,name_skip_form,name_next_form)

''' 
    current nameform : when user click next
    System will automatic get next form , you have defined in dict(config)  
'''
def wizard_get_template(nameform,request,datafixdata={}):
    d = {}
    try:
        if dict.has_key(nameform):
        
            pathtemplate = dict[nameform]["curpathtemplate"] 
            
            template = get_template(pathtemplate)
            
            print nameform
            
            if (nameform == "administratoraccount"):
                frm = ADMINISTRATORACCOUNTfORM()
                c = RequestContext(request,{'title':CONFIGURATION_ADMINISTRATOR_FORM_TITLE,'form':frm })
                
            if (nameform == "networkinterfacesdefinition"):
                position_next = 0 #Default
                
                #Note :For the case When user click Skip system will save ""
                if type(datafixdata) != str:
                    if datafixdata.has_key("position_next"):
                        position_next = datafixdata["position_next"]
                        
                c = RequestContext(request,{'title': CONFIGURATION_NETWORK_INTERFACES_FORM_TITLE })
                
            if (nameform == "networkinterfacesdefinitionA"):
                if type(datafixdata) != str:
                    frm = LOCALINTERFACEFORM(datafixdata)
                else:
                    frm = LOCALINTERFACEFORM()
                     
                c = RequestContext(request,{'title':CONFIGURATION_NETWORK_INTERFACES_FORM_TITLE,'form':frm})
                            
            if (nameform == "networkinterfacesdefinitionB"):
                if type(datafixdata) != str:
                    frm = EXTERNALINTERFACEFORM(datafixdata)
                else:
                    frm = EXTERNALINTERFACEFORM()
                    
                c = RequestContext(request,{'title': CONFIGURATION_NETWORK_INTERFACES_FORM_TITLE, 'form':frm})
               
            if (nameform == "trusted_network_range"):
                #2012-03-06 - ISM add this code from *wizard_get_template_back*
                #             to show the trusted network that is stored in session
                datafix_trustedIprange = "";
                datafix_trusted = [];
                datafix_obj_net = [];
                   
                if type(datafixdata) != str :
                    if datafixdata.has_key("list_trustedIprange"):
                        datafix_trustedIprange = datafixdata["list_trustedIprange"]
                    
                datafix_trusted = datafix_trustedIprange.split(',')
                datafix_defnet = DefNet()
                
                for id in datafix_trusted:
                    try:
                        aa = get_items_session_byid(request,STORE_HOST,id)
                        
                        if (aa != None):
                            #Get the defnet only.
                            datafix_defnet = aa[0]
                            datafix_obj_net.append(datafix_defnet)
                        
                    except Exception,ex:
                        print "Error Info during load trsuted network %s " %str(ex)
                        pass
                
                c = RequestContext(request,{'title': CONFIGURATION_TRUSTED_NETWORK ,'net' : datafix_obj_net})
            
            if (nameform == "dns"):
                wizard_primarydns = ""
                wizard_seconddns = ""
                wizard_thirddns = ""
                
                if type(datafixdata) != str:
                    if datafixdata.has_key("wizard_primarydns"):
                        wizard_primarydns = datafixdata["wizard_primarydns"]
                    
                    if datafixdata.has_key("wizard_seconddns"):
                        wizard_seconddns = datafixdata["wizard_seconddns"] 
                        
                    if datafixdata.has_key("wizard_thirddns"):
                        wizard_thirddns = datafixdata["wizard_thirddns"]  
                
                c = RequestContext(request,{'title':CONFIGURATION_DNS })
            
            if nameform == "userauthentication":
                position_next = 0
                
                if type(datafixdata) != str:
                    if datafixdata.has_key("position_next"):
                        position_next = datafixdata["position_next"] 
                        
                c = RequestContext(request,{'title': CONFIGURATION_USER_AUTHENTICATION})
                
            if nameform == "userauthenticationA":
                frm = USERAUTHENTICATEFORM() 
                c = RequestContext(request,{'title' : CONFIGURATION_USER_AUTHENTICATION,'form': frm }) 
                
            if nameform == "userauthenticationB":
                c = RequestContext(request,{'title' : CONFIGURATION_USER_AUTHENTICATION  });
                
            if nameform == "internet_usage_policy":
                
                gu = group_user()
                gu.make_group(request)
                
                # Store the info of the group , ["isoverride",[listuser],[accesstype,comment],dict_policy] 
                # and store the list user user 
                request.session[STORE_INFO] = [gu.group,gu.user]
                
                #get the name of list is used.
                dict_ref = gu.group
                statusgroup = ""
                lstuser = []
                commmet = ""
                accesstype = ""
                dict_policy = {}
                list_group = {}
                xNumber = 0
                
                for key in dict_ref:
                        
                    [status,lstuser,[comment,accesstype],dict_policy,arrange] = dict_ref[key]
                        
                    lst_temp = []
                    str_lst_temp = ""
#                    print request.session[STORE_POLICY]
                    
                    for keypolicy in dict_policy:
                        obj = get_items_session_byid(request, STORE_POLICY, int(keypolicy))
                        if obj != None:
                            n =  obj.WPmainprofile.name
                            lst_temp.append(n) 
                                
                    str_lst_temp = "Policies applied : " + ", ".join(lst_temp)
                    aaa = [status,key,lst_temp]
                            
                    list_group[arrange] = aaa
                            
                    xNumber += 1
                         
                c= RequestContext(request,{'title': CONFIGURATION_INTERNET_USAGE_POLICY,
                            'group': list_group });
                            
            if nameform == "finished":
                
                local_IPaddress = ""
                if request.session[2] == ['','']:
                    print "This step(2) has skipped."
                        
                else:
                    [nameform,dict_data2] = request.session[2]
                    print dict_data2     
                    if nameform == "networkinterfacesdefinitionA":
                        local_IPaddress = dict_data2["ipaddresslocal_internal"]
                    if nameform == "networkinterfacesdefinitionB":
                        local_IPaddress = dict_data2["ipaddresslocal"]
                       
                c = RequestContext(request,{'title' : CONFIGURATION_FINISHED ,'homepage' : local_IPaddress });
                
                          
            s = template.render(c)
            if (nameform == "networkinterfacesdefinition") or (nameform == "userauthentication"):
                d = {'form' : s, 'status':'success', 'position_next':position_next}
            elif (nameform == "dns"):
                d = {'form' : s, 'status':'success', 'wizard_primarydns' : wizard_primarydns, 'wizard_seconddns' : wizard_seconddns ,'wizard_thirddns' : wizard_thirddns}
            else:
                d = {'form' : s,'status':'success'}
            return d;
             
    except UIException,e :    
        print "Error Info wizard_get_template %s" %str(e)
        dict_error = {}
        dict_error['status'] = 'error'  
        dict_error['error_info'] = str(e)
        # note don't return json in this case bcos we just return dictionary
        return dict_error
         
'''
    action of getting the template back when user click back button.
'''
def wizard_get_template_back(nameform,storeddata,request):
    d = {}
    try:
        if dict.has_key(nameform):
        
            pathtemplate = dict[nameform]["curpathtemplate"] 
            
            template = get_template(pathtemplate)
            
            if (nameform == "administratoraccount"):
                
                if type(storeddata) != str:
                    frm = ADMINISTRATORACCOUNTfORM(storeddata)
                else:
                    frm = ADMINISTRATORACCOUNTfORM()
                    
                c = RequestContext(request,{'title':CONFIGURATION_ADMINISTRATOR_FORM_TITLE,'form':frm })
                s = template.render(c)
                d = {'form' : s,'status':'success'}  
                return d;
                
                    
            if (nameform == "networkinterfacesdefinition"):
                position_next = 0 #Default
                
                #Note :For the case When user click Skip system will save ""
                if type(storeddata) != str:
                    if storeddata.has_key("position_next"):
                        position_next = storeddata["position_next"]
                    
                c = RequestContext(request,{'title': CONFIGURATION_NETWORK_INTERFACES_FORM_TITLE })
                s = template.render(c)
                d = {'form' : s,'status':'success','position_next':position_next}  
                
                return d
            
                
            if (nameform == "networkinterfacesdefinitionA"):
                if type(storeddata) != str:
                    frm = LOCALINTERFACEFORM(storeddata)
                else:
                    frm = LOCALINTERFACEFORM()
                     
                c = RequestContext(request,{'title':CONFIGURATION_NETWORK_INTERFACES_FORM_TITLE,'form':frm})
                s = template.render(c)
                d = {'form' : s,'status':'success'}  
                return d
            
                            
            if (nameform == "networkinterfacesdefinitionB"):
                if type(storeddata) != str:
                    frm = EXTERNALINTERFACEFORM(storeddata)
                else:
                    frm = EXTERNALINTERFACEFORM()
                    
                c = RequestContext(request,{'title': CONFIGURATION_NETWORK_INTERFACES_FORM_TITLE, 'form':frm})
                s = template.render(c)
                d = {'form' : s,'status':'success'}  
                return d
            
            if (nameform == "trusted_network_range"):
                list_trustedIprange = "";
                lst_trusted = [];
                lst_obj_net = [];
                   
                if type(storeddata) != str :
                    if storeddata.has_key("list_trustedIprange"):
                        list_trustedIprange = storeddata["list_trustedIprange"]
                    
                lst_trusted = list_trustedIprange.split(',')
                defnet = DefNet()
                
                for id in lst_trusted:
                    try:
                        aa = get_items_session_byid(request,STORE_HOST,id)
                        
                        if (aa != None):
                            #Get the defnet only.
                            defnet = aa[0]
                            lst_obj_net.append(defnet)
                        
                    except Exception,ex:
                        print "Error Info during load trsuted network %s " %str(ex)
                        pass
                
                c = RequestContext(request,{'title': CONFIGURATION_TRUSTED_NETWORK ,'net' : lst_obj_net})
                s = template.render(c); 
                
                d = {'form' : s ,'status': 'success','list_trustedIprange':list_trustedIprange}
                return d
            
            if (nameform == "dns"):
                wizard_primarydns = ""
                wizard_seconddns = ""
                wizard_thirddns = ""
                
                if type(storeddata) != str:
                    if storeddata.has_key("wizard_primarydns"):
                        wizard_primarydns = storeddata["wizard_primarydns"]
                    
                    if storeddata.has_key("wizard_seconddns"):
                        wizard_seconddns = storeddata["wizard_seconddns"] 
                        
                    if storeddata.has_key("wizard_thirddns"):
                        wizard_thirddns = storeddata["wizard_thirddns"]  
                
                c = RequestContext(request,{'title':CONFIGURATION_DNS })
                s = template.render(c)
                d = {'form' : s,'status':'success' ,'wizard_primarydns' : wizard_primarydns, 'wizard_seconddns' : wizard_seconddns ,'wizard_thirddns' : wizard_thirddns }
                return d 
            
            if nameform == "userauthentication":
                position_next = 0
                
                if type(storeddata) != str:
                    if storeddata.has_key("position_next"):
                        position_next = storeddata["position_next"] 
                        
                c = RequestContext(request,{'title': CONFIGURATION_USER_AUTHENTICATION})
                s = template.render(c)
                d = {'form' : s,'status':'success','position_next':position_next}  
                
                return d
                
            if nameform == "userauthenticationA":
                frm = USERAUTHENTICATEFORM(storeddata) 
                c = RequestContext(request,{'title' : CONFIGURATION_USER_AUTHENTICATION,'form': frm }) 
                s = template.render(c)
                d = {'form':s,'status':'success'}
                return d 
                
            if nameform == "userauthenticationB":
                wizard_import_header = ""
                wizard_imported_content = ""
                wizard_seperate_field = ""
                position_next = ""
                wizard_default_pass_authb = ""
                
                if type(storeddata) != str:
                    if storeddata.has_key("wizard_import_header"):
                        wizard_import_header = storeddata["wizard_import_header"]
                    
                    if storeddata.has_key("wizard_imported_content"):
                        wizard_imported_content = storeddata["wizard_imported_content"]
                    
                    if storeddata.has_key("wizard_seperate_field"):
                        wizard_seperate_field = storeddata["wizard_seperate_field"]
                        
                    if storeddata.has_key("wizard_default_pass_authb"):
                        wizard_default_pass_authb = storeddata["wizard_default_pass_authb"] 
                    
                c = RequestContext(request,{'title' : CONFIGURATION_USER_AUTHENTICATION  });
                s = template.render(c)
                d = {'form':s,
                     'status':'success',
                     'wizard_import_header':wizard_import_header, 
                     'wizard_imported_content': wizard_imported_content,
                     'wizard_seperate_field' : wizard_seperate_field,
                     'wizard_default_pass_authb' : wizard_default_pass_authb
                     }
                
                return d
                
          
          
    except Exception,e :    
        print "Error Info wizard_get_template %s" %str(e)
        dict_result = {}
        dict_result['status'] = 'error' 
        dict_result['error_info'] = str(e)
        # note don't return json in this case bcos we just return dictionary
        return dict_result


''' 
  When user click next button , this method will be called.

  Note that for the case step 4
  That is form of userauthentication
  When user choose for option 
  No,everyone is free to use internet.
  We will go to anth it will go to the page (not desing)
'''
def wizard_setup_next(request):
    try:
        name_next_form = ""
        name_skip_form = ""
        lsterror = ""
        d = {}
        
        namefrm = request.POST["wizard_identification_form"];
        position_next = request.POST["position_next"]; 
        
        #When user click next button , we need to check the entered values if it is corrected or not
        (result,lsterror) = check_validation(namefrm,request) 
        
        if result == True:
            # Get the the name of the form.
            (step,name_skip_form,name_next_form) = get_name_form(namefrm,int(position_next))
            
            #2012-03-06 - ISM add code to pass the list of trusted network range
            #             to show in the list
            if step > 0:
                step2 = step+1
            else:
                step2 = 1
            try:
                datafix = request.session[step2][1]
            except:
                datafix = {}
            
            #Check the condiction for the case 
            # if the current form is userauthenticationB
            # and the the next form is internet_usage_policy
            # then we will send the data of user list user to analyse
            
            #Todo return here
            if name_next_form == "finished":
                saveinfo = save_wizard_info_obj()
                saveinfo.save_wizard_info(request)
            
            d = wizard_get_template(name_next_form,request,datafix)
                               
            if d.has_key("status"):
                
                # Make sure the status of getting next template is successfully
                if d["status"] == "success":
                    #store in the session temporariy
                    lst = []
                    
                    lst = [namefrm,request.POST]
                    
                    request.session[step] = lst
                    
                    # in the case of form is userauthentication 
                    # when user select options 1 system will go to next next form , i will add
                    # next next step is empty , to notify the system next temp is skip
                    # options 2 and 3 will go next step.
                    if (namefrm == "userauthentication" and int(position_next) == 0):
                        lst = []
                        lst = ["",""]
                        request.session[step + 1] = lst
                    
                    #return render_to_response()
                    return json_result(d)
                
                else:
                    
                    error_dict = {'status': 'error','error_info' : d['error_info'] }
                    return json_result(error_dict)
                    
            else:
                error_dict = {'status':'error','error_info':_(u"System tem can't find the status variable during operation of getting template")}
                return json_result(error_dict)
                
        if result == False :
            error_dict = {'status':'error','error_info':lsterror}
            return json_result(error_dict)     
        
    except Exception,e:
        print "Error Info wizard_setup_next %s" %str(e)
        dict_result = {}
        dict_result['status'] = 'error' 
        dict_result['error_info'] = str(e)
        return json_result(dict_result)

def wizard_setup_back(request):
    
    try:
        name_next_form = ""
        name_skip_form = ""
         
        namefrm = request.POST["wizard_identification_form"];
        
        #position awlays = 0 for the case back. 
        (step,name_skip_form,name_next_form) = get_name_form(namefrm,0)
        
        #2012-03-06 - ISM add to save trusted network range
        #             in session if user click back button
#        if namefrm == "trusted_network_range":
        lst = []
        lst = [namefrm,request.POST]
        request.session[step] = lst
        
        #step it mean step of form.
        if step != 0:
            step = step - 1
        
        # Get the name of form 
        namefrm = request.session[step][0] 
        
        # if namefrm == "" it mean the user has skip then we keep backing a form .
        if namefrm == "" :
            
            if step != 0:
                step = step - 1
                 
        namefrm = request.session[step][0]
        storeddata = request.session[step][1]
        
        d = wizard_get_template_back(namefrm,storeddata,request) 
             
        return json_result(d) 
        
    except Exception ,e:
        print "Error Info wizard_setup_back %s" %str(e)
        dict_result = {}
        dict_result['status'] = 'error' 
        dict_result['error_info'] = str(e)
        return json_result(dict_result)

def wizard_skip(request):
    
    try:
        
        name_next_form = ""
        name_skip_form = ""
        d = {}
        
        namefrm = request.POST["wizard_identification_form"];
        
        (step,name_skip_form,name_next_form) = get_name_form(namefrm,0)
        
        if name_next_form in ['internet_usage_policy']:
            d = wizard_get_template(name_skip_form,request)
        else:
            d = wizard_get_template(name_skip_form,request) 
        
        if d.has_key("status"):
            
            if d["status"] == "success":
                
                lst = []
                lst = [namefrm,""]
                request.session[step] = lst
                
                if (namefrm == "networkinterfacesdefinition"):
                    lst = ["",""]
                    i = step + 1 
                    request.session[i] = lst
            
                if (namefrm == "userauthentication"):
                    lst = ["",""]
                    i = step + 1
                    request.session[i] = lst
            
                return json_result(d)
            
            else:
                
                error_dict = {'status': 'error','error_info' : d['error_info'] }
                return json_result(error_dict)
        
        else:
            error_dict = {'status': 'error','error_info' : d['error_info'] }
            return json_result(error_dict)
        
    except Exception,e:
        print "Error Info wizard_setup_skip %s" %str(e)
        dict_result = {}
        dict_result['status'] = 'error' 
        dict_result['error_info'] = str(e)
        return json_result(dict_result)

'''
    ----------------------------------------------------------------------------
    Process of importing and check the error.
    ----------------------------------------------------------------------------
'''

'''
    Show form to map fields 
'''
def wizard_import_settings(request):
    try:
        
        template = get_template("wizard/user_authentication_import_settings.html")
        frm = SETTINGSIMPORTFORM()
        c = RequestContext(request,{'title':CONFIGURATION_DNS,'form' : frm });
        s = template.render(c)
        
        d = {'status': 'success','form' : s}
        return json_result(d) 
    
    except Exception,e:
        print "wizard_import_settings %s" %str(e)
        dict_result = {}
        dict_result['status'] = 'error' 
        dict_result['error_info'] = str(e)
        return json_result(dict_result)
    
    
def wizard_import_test(request):
    try:
    
        header = request.POST["wizard_import_header"]
        wizard_imported_content = request.POST["wizard_imported_content"]
        wizard_seperate_field = request.POST["wizard_seperate_field"]
        wizard_identification_form = request.POST["wizard_identification_form"]
        position_next = request.POST["position_next"]
        wizard_default_pass = request.POST["wizard_default_pass_authb"]
        
        if header.strip() == "":
            header = "Username" 
            
        #Todo
        if wizard_seperate_field.strip() == "":
            raise Exception("Note that the seperation field is empty.Please set the.")
        
        x = import_user()
        x.test_import(header,wizard_imported_content,wizard_seperate_field,wizard_default_pass)
        
        template = get_template("wizard/error_info_import.html")
        c = RequestContext(request,{'nbruser' : len(x.dic_user),'nbrgroup' : len(x.dic_group),'nbrerror' : len(x.lst_error),'obj_error' : x.lst_error })
        s = template.render(c)
        
        d = {'status' : 'success', 'form': s} 
        return json_result(d)
        
    except Exception,e:
        print "Error Info : wizard_import_test %s" %str(e)
        dict_result = {}
        dict_result['status'] = 'error' 
        dict_result['error_info'] = str(e)
        return json_result(dict_result)

def wizard_check_IPRange(request):
    try:
        iprange = ""
        
        iprange = request.POST["ipaddress_range"];
        dict_result = {}
        lstip = []
         
        # Note the user can enter two type info
        # 1.2.3.4 or 1.2.3.4/12
        # i will check the validation for two cases.
        
        lstip = iprange.split("/")
        
        if (len(lstip) !=1 and len(lstip) != 2):
            raise Exception("Enter a valid IPv4 address.")
        
        iprange = lstip[0]
         
        try:
            if len(lstip) == 2 :
                int(lstip[1])
                
        except Exception,e:
            raise Exception("Enter a valid IPv4 address.")
        
        frm = IpRange({'ipaddress_range' : iprange})
        
        if (frm.is_valid()):
            dict_result['status'] = 'success' 
            return json_result(dict_result)
        else:
            err_msg = generate_error_msg(frm._get_errors())
            dict_result['status'] = 'error'
            dict_result['error_info'] = err_msg
            return json_result(dict_result)
        
    except Exception,e:
        print "Error Info : wizard_check_IPRange %s" %str(e)
        dict_result = {}
        dict_result['status'] = 'error' 
        dict_result['error_info'] = str(e)
        return json_result(dict_result)

'''
    ----------------------------------------------------------------------------
        Create Groups and users.
    ----------------------------------------------------------------------------
'''

#This method happens when user click save(adding and edit) group
def wizard_save_group(request):
    dict_result = {}
    
    try :
        if request.is_ajax() and request.method == 'POST': 
            name = request.POST["name"]
            accesstype = request.POST["accesstype"]
            comment = request.POST["comment"]     
            action = request.POST["action"]
            
            #Todo : Recive the list from the client , not a string
            #     Then we can avoid the case of username or group got ,
            # NotYet Done 
            members = request.POST["members"]
            frm = ""
           
            if name.strip() == "":
                raise Exception(_(u"Name is required"))
            
            dict_group = {}
            dict_user = {}
            dict_policy = {}
            dict_temp_user = {}
            
            if STORE_INFO in request.session:   
                [dict_group,dict_user] = request.session[STORE_INFO]
                
            if action == 'add':
                if dict_group.has_key(name):
                    raise Exception(_(u"Name ") + name + (" has existed."))
                    
                elif dict_user.has_key(name):
                    raise Exception(_(u"Name ") + name + (" has existed."))
                     
                template = get_template("wizard/internal_usage_policy_row.html")  
                c = RequestContext(request,{'name': name })
                frm = template.render(c)
                
            # In the dict_group we just store the name of the user only
            if STORE_TEMP in request.session:   
                dict_temp_user = request.session[STORE_TEMP]
             
            listname = []
            listname = members.split(SIGNAL_SEPERATE)
            
            #Get the list of user and copy it to session
            #Assign user_temp to real dic user
            #real dic user will be update to database later.
            for key in dict_temp_user:
                if not dict_user.has_key(key):
                    dict_user[key] = dict_temp_user[key]
                              
            request.session[STORE_TEMP] = {}    
            
            if dict_group.has_key(name):
                
                old_isoverride = "0"
                old_listuser = []
                old_accesstype = ""
                old_comment = ""
                old_dict_policy = {}
                 
                [old_isoverride,old_listuser,[old_accesstype,old_comment],old_dict_policy,arrange] = dict_group[name]
                
                dict_group[name] = [old_isoverride,listname,[accesstype,comment],old_dict_policy,arrange]
            else:
                #This instance just use for get default policy only.
                dic_policy = {}
                getdictpolicy = group_user()   
                dic_policy = getdictpolicy.make_dictionary_policy()
                dict_group[name] = ["0",listname,[accesstype,comment],dic_policy] 
                
            request.session[STORE_INFO] = [dict_group,dict_user]
                
            
            dict_result["status"] = "success"
            dict_result["form"] = frm
            dict_result["action"] = action
            return json_result(dict_result)
               
    except Exception,e:
        
        print "Error Info wizard_save_group  : %s " %(str(e))
        dict_result = {}
        dict_result["status"] = "error"
        dict_result["error_info"] = (str(e))
        return json_result(dict_result)

#This method happens in case of saving the user.
#when user click save button.    
def wizard_save_user(request):
    dict_result = {}
    try:
        if request.is_ajax() and request.method == 'POST': 
            name = request.POST["name"] 
            accesstype = request.POST["accesstype"]
            displayname = request.POST["displayname"] 
            password = request.POST["password"]
            comment = request.POST["comment"]
            
            dic_temp_user = {}
            dict_group = {}
            dict_user = {}
            
            if name == "":
                raise Exception(_(u"Name is required."))
            
            if password == "":
                raise Exception(_(u"Password is required."))
            
            if STORE_INFO in request.session:
                [dict_group,dict_user] = request.session[STORE_INFO]
                
            if STORE_TEMP in request.session:
                dic_temp_user = request.session[STORE_TEMP] 
            #Check the user is existed or not.
            
        if dict_user.has_key(name) or dict_group.has_key(name) or dic_temp_user.has_key(name):           
            dict_result['status'] = 'error'
            dict_result['error_info'] = _(u'User Name '+ name +' has existed') 
            return json_result(dict_result) 
        
        else:
            dx = User_Group()
            dx.set_data(name, accesstype, displayname, password, comment)
            
            if not dic_temp_user.has_key(name):
                dic_temp_user[name] = dx
                request.session[STORE_TEMP] = dic_temp_user 
                
            template = get_template("wizard/internet_usage_policy_list_user.html")
            c = RequestContext(request,{'o' : dx })
            s = template.render(c)
            
            dict_result['status'] = 'success' 
            dict_result['form'] = s
            return json_result(dict_result) 
            
    except Exception , ex:
        print "Error Info wizard_save_user %s" %str(ex)
        
        dict_result = {}
        dict_result["status"] = "error"
        dict_result["error_info"] = str(ex)
        return json_result(dict_result) 
        
# This one show form Pls rename of method
def wizard_open_add_group(request):
    
    try:
        if request.is_ajax() and request.method == 'GET': 
            vartype = request.GET['type'];
            # if type = 1 --> user
            # if type = 2 --> group
            type = int(vartype)
            
            if type == 2:
                request.session[STORE_TEMP] = {}
             
            form = DefUserForm()
            form1 = DefUserNameForm()
            
            template = get_template("defuser/defuser_save_form.html")
            
            variables = {'form': form,
                                 'form1': form1,
                                 'show_confirm_password': False,
                                 'level': 1,
                                 'scope': 1,
                                 'type' : type,
                                 'form_title': '',
                                 'dialog_title': _(u'Add user definition'),
                                 'dialog_edit_title': _(u'Edit user definition')};
                                    
            c = RequestContext(request,variables)
            frm = template.render(c)
            
            return json_result({'status' : 'success' , 'form': frm});  
    
    except Exception,e:
        print "Error Info wizard_add_group_into_session %s" %(str(e)) 
        return json_result({'status' : 'error' , 'error_info': str(e)});

#This method happens in case of clicking members buttons , for objective edit group,mebers
def wizard_open_edit_group(request):
    dict_result = {}  
    try:
        if request.is_ajax() and request.method == 'POST': 
            name = request.POST["name"]
        
            dict_group = {}
            dict_user = {}
            
            if STORE_INFO in request.session: 
                [dict_group,dict_user] = request.session[STORE_INFO] 
            
            #try to find dict_group is existed or not 
            if dict_group.has_key(name):
                isoverride = 1
                listname = []
                accesstype = 1
                dict_policy = {}
                comment = ""
                
                if dict_group.has_key(name):
                    [isoverride,listname,[accesstype,comment],dict_policy,arrange]  =  dict_group[name]
                
                dic = {'name': name,
                       'type': type,
                       'accesstype': accesstype,
                       'comment': comment}
                #form = get_defuser_form(type, clone, dic)
                form = DefUserForm(dic)
                
                members = []
                 
                variables = RequestContext(request,{'form': form,
                                     'type':2,
                                     'level': 2,
                                     'scope': 1,
                                     'form_title': 'Le Huu Nghia',
                                     'dialog_title': _(u'Add user definition'),
                                     'dialog_edit_title': _(u'Edit user definition')})
                
                template = get_template('defuser/defuser_save_form.html')
                s = template.render(variables)
                
                #to get the interface of user , we can't use the id in this case.
                # and then we will attach at javascript 
                
                for name in listname:
                    # 0  : name 1: css 2:classify
                    a = [name,"proxynow usericon spaceiconlist","users"]  
                    members.append(a)
                
                if len(members) ==1:
                    if members == "":
                        members = []
                else:
                    members.sort(key=lambda x: x[1])
                
                template2 = get_template('wizard/type_panel_edit_list.html')
                c2 = RequestContext(request,{'objlist': members}) 
                ss = template2.render(c2)
                 
                dict_result['status'] = 'success'
                dict_result['form'] =  s
                dict_result['members'] = ss 
                return json_result(dict_result)
         
    except Exception,ex:
        print "Error Info wizard_open_edit_group %s " %str(ex)
        dict_result['status'] = 'error'           
        dict_result['error_info'] =  str(ex)
        return json_result(dict_result)        
        
def wizard_delete_tempuser(request):
    dict_result = {}
        
    try:
        
        name = request.POST['name']
         
        dict_user_temp = {}
        dict_user_temp = request.session[STORE_TEMP]
        
        if dict_user_temp.has_key(name):
            del dict_user_temp[name] 
        
        dict_result['status'] = 'success'  
        return json_result(dict_result)
        
    except Exception,ex:
        
        dict_result = {}
        dict_result['status'] = 'error'
        dict_result['error_info'] = str(ex)  
        return json_result(dict_result)

#    This haapens when user click the addicon ,
#    System will show the list user(panel). that get from session  
#    Support for searching also.  
def wizard_getlistuser(request):
    dict_result = {}
    try:
        if request.is_ajax() and request.method == 'POST':
            dict_user = {}
            dict_group = {}
            lst_user = []
            type = ""
            
            type = request.POST["type"]
            
            if STORE_INFO in request.session:
                [dict_group,dict_user] = request.session[STORE_INFO]
            
            for key in dict_user:
                lst_user.append(key)
                
            lst_user.sort()
            
            if type == "list":
                template = get_template("wizard/internet_usage_policy_panel.html")
            if type == "search":
                template = get_template("wizard/internet_usage_policy_panel_list_user.html")
                
            c = RequestContext(request,{'objlist': lst_user })
            s = template.render(c)
            
            dict_result['status'] = 'success'
            dict_result['form'] = s
            return json_result(dict_result)  
   
    except Exception,ex:
        print "wizard_getlistuser %s" %str(ex)
        dict_result['status'] = 'error'
        dict_result['error_info'] = str(ex)
        return json_result(dict_result)

    
'''
    ----------------------------------------------------------------------------
        Create and show list of Policies 
    
    ----------------------------------------------------------------------------
''' 

# This happens when users click the Edit button
# Profiles applied : Office Hours Restricted , After office Hours Restricted
def wizard_open_dialog_policy(request):
    
    dict_result = {}
    
    try:
        if request.is_ajax() and request.method == 'POST': 
            namegroup = request.POST["name"]
            dict_group = {}
            dict_user = {}
            dict_policy = {}
            
            old_isoverride = "0"
            old_listuser =[]
            old_policy = {}
            old_accesstype = ""
            old_comment = ""
            
            dictkeymap_policy = {}
            dict_policy_list = {} 
            #Get List of defined policy.
            if STORE_INFO in request.session:
                [dict_group,dict_user] = request.session[STORE_INFO] 
                
            if dict_group.has_key(namegroup):
                [old_isoverride,old_listuser,[old_accesstype,old_comment],dict_policy,arrange] = dict_group[namegroup] 
            
            if STORE_POLICY in request.session:
                [dict_policy_list,dictkeymap_policy] = init_get_data(STORE_POLICY,request)
         
            lst = [] 
            for keypolicy in dictkeymap_policy:
                try:
                    #Check this group if is choosen or not
                    obj = get_items_session_byid(request,STORE_POLICY,keypolicy) 
                    result = "0"
                    ttt = obj.WPmainprofile.name
                    
                    
                    if dict_policy.has_key(str(keypolicy)):
                        result = "1"
                    
                    aa = [keypolicy,ttt,result]
                   
                    lst.append(aa)
                    
                except Exception,ex:
                    print "Error INfo %s " %str(ex)
                    pass
                
          
            template = get_template("wizard/internet_usage_policy_list.html")
            c = RequestContext(request,{'objlist': lst,'name':namegroup})
            s = template.render(c)
    
            dict_result['status'] = 'success'
            dict_result['form'] = s
            return json_result(dict_result)  
   
    except UIException,ex:
        print "Error info wizard_open_dialog_policy %s" %(str(ex))
        dict_result['status'] = 'error'
        dict_result['error_info'] = str(ex)
        return json_result(dict_result)   
       
#This happans when user click save list of policy
#EX : Total Restriction
#     Unrestricted
#--------
def wizard_save_policy(request):
    dict_result = {}
    
    if request.method == "POST":
        try:
            if request.is_ajax() and request.method == 'POST': 
                dict_group = {}
                dict_user = {}
                dict_policy = {}
                lst = []
                dictt = {}
                sinfo = ""
                arrange = []
                
                
                namegroup = request.POST["name"]
                listnamepolicy = request.POST["checkedpolicy"]
                
                lst = []
                lst = listnamepolicy.split(",")
                
                if STORE_INFO in request.session:
                    [dict_group,dict_user] = request.session[STORE_INFO] 
                       
                if dict_group.has_key(namegroup):
                    [old_isoverride,old_listuser,[old_accesstype,old_comment],dict_policy,arrange] = dict_group[namegroup] 
                    
                dict_policy = {}    
                lstname = []
                
                for key in lst:
                    try:
                        dict_policy[key] = ""
                        k = int(key)
                        choosename =  get_items_session_byid(request,STORE_POLICY,int(k))
                        
                        if choosename != None :
                            n = choosename.WPmainprofile.name
                            lstname.append(n)
                            
                    except Exception,ex:
                        pass
                        
                dict_group[namegroup] = [old_isoverride,old_listuser,[old_accesstype,old_comment],dict_policy,arrange]
                sinfo = "<ul style='padding:0 0 0 1; margin:0 0 0 0; list-style-type: square;'>"
                for list_Profile in lstname:
                    sinfo += "<li>%s</li>" % (list_Profile)
                sinfo += "</ul>"
#                sinfo = ",".join(lstname)
#                sinfo = 'Profiles applied : ' + sinfo
                   
                request.session[STORE_INFO] = [dict_group,dict_user]
                
                dict_result['status'] = 'success'
                dict_result['form'] = sinfo
                return json_result(dict_result)  
        
        except UIException,ex:
            print "Error Info wizard_save_policy %s" %(str(ex))
            dict_result['status'] = 'error'
            dict_result['error_info'] = str(ex)
            return json_result(dict_result)

# This support for edit or adding profile

def get_exceptvalue(aa):
    value = 0
    try:
        value = int(aa)  #x.skipauth
    except:
        value = 0
    
    return value

def wizard_load_wpprofile(request):
     
     if request.method == "POST":
        
        if "id" in request.POST: 
            _id = request.POST["id"]
            form_title = EDIT_WPPROFILE_FORM_TITLE
            
            try:
                dict_policy = {}
                dict_keymap = {}
                
                status = "0"
                lst_user = []
                accesstype = ""
                comment = ""
                dict_policy = {}
                id = int(_id) 
                
                obj = get_items_session_byid(request,STORE_POLICY,id) 
                
                if obj != None:
                   
                    name = obj.WPmainprofile.name
                    location = obj.WPmainprofile.location
                    enable = obj.WPmainprofile.enable
                    timequota = obj.WPmainprofile.timequota
                    sizequota = obj.WPmainprofile.sizequota
                    catdef = obj.WPmainprofile.catdef
                    safesearchon = obj.WPmainprofile.safesearchon
                    
                    scheduleon = 0
                    
                    if len(obj.lst_WPprofileSchedule_session) > 0:
                        scheduleon = 0
                        
                    else:
                        scheduleon = 1
                        
                    dic = {'name': name,
                           'location': location,
                           'enable': enable,
                           'timequota': timequota,
                           'sizequota': sizequota,
                           'catdef': catdef,
                           'safesearchon': safesearchon,
                           'scheduleon': scheduleon}
                    
                    form = WPProfileForm(dic)
                    schedules = obj.get_list_profileschedule() #obj.lst_WPprofileSchedule_session
                    userinternals = [] # o.wpprofileuserinternal_set.filter(profileid=o)
                    userexternals =  [] # o.wpprofileuserexternal_set.filter(profileid=o)
                    allowextensions = obj.get_list_profile_allowedextension() #[] #o.wpprofileallowext_set.filter(profileid=o)
                    blockextensions = obj.get_list_profile_blockextension() #[] #o.wpprofileblockext_set.filter(profileid=o)
                    allowmimes = obj.get_list_profile_allowmime()  #o.wpprofileallowmime_set.filter(profileid=o)
                    blockmimes = obj.get_list_profile_blockmmime() #[] #o.wpprofileblockmime_set.filter(profileid=o)
                    cats = obj.get_list_profilecat() #o.wpselectedcat_set.filter(profileid=o)
                    whitelist = obj.get_list_profile_whitelist()   #o.wpprofilewhitelist_set.filter(profileid=o)
                    blacklist = obj.get_list_profile_blacklist() # obj.lst_WPprofileBlacklist_session #o.wpprofileblacklist_set.filter(profileid=o)
                    contentfilters = obj.get_list_profile_content() #[] #o.wpprofilecontentfilter_set.filter(profileid=o)
                    nets = [] #obj.get_list_profile_exemptednet() #o.wpnet_set.filter(profileid=o)
                    #x = o.wpprofileexcept_set.get(profileid=o)
                    
                    skipauth = get_exceptvalue(obj.WPexceptprofile.skipauth)  #x.skipauth
                    skipcache = get_exceptvalue(obj.WPexceptprofile.skipcache)
                    skipav = get_exceptvalue(obj.WPexceptprofile.skipav) 
                    skipext = get_exceptvalue(obj.WPexceptprofile.skipext)  #x.
                    skipmime = get_exceptvalue(obj.WPexceptprofile.skipmime) #x.skipmime
                    skipurl = get_exceptvalue(obj.WPexceptprofile.skipurl) #x.skipurl
                    skipcontentfilter = get_exceptvalue(obj.WPexceptprofile.skipcontentfilter) #x.skipcontentfilter
                    
                    dictexcept = {'skipauth': skipauth,
                                  'skipcache': skipcache,
                                  'skipav': skipav,
                                  'skipext': skipext,
                                  'skipmime': skipmime,
                                  'skipurl': skipurl,
                                  'skipcontentfilter': skipcontentfilter}
                    formexcept = WPProfileExceptForm(dictexcept)
                    
                    exceptnets = obj.get_list_profile_exemptednet() #x.wpprofileexceptnet_set.filter(exceptid=x)
                    excepturls = obj.get_list_profile_exemptedurl() #[] #x.wpprofileexcepturl_set.filter(exceptid=x)
                    exceptuserinternals = obj.get_list_profile_exempteduser() #[] #x.wpprofileexceptuserinternal_set.filter(exceptid=x)
                    exceptuserexternals = [] #x.wpprofileexceptuserexternal_set.filter(exceptid=x)
                    variables = RequestContext(request, {'form': form,
                                                         'formexcept': formexcept,
                                                         'iswizard' : "1",
                                                         'id' :id,
                                                         'schedules': schedules,
                                                         'userinternals': userinternals,
                                                         'userexternals': userexternals,
                                                         'allowextensions': allowextensions,
                                                         'blockextensions': blockextensions,
                                                         'allowmimes': allowmimes,
                                                         'blockmimes': blockmimes,
                                                         'cats': cats,
                                                         'whitelist': whitelist,
                                                         'blacklist': blacklist,
                                                         'contentfilters': contentfilters,
                                                         'nets': nets,
                                                         'exceptnets': exceptnets,
                                                         'excepturls': excepturls,
                                                         'exceptuserinternals': exceptuserinternals,
                                                         'exceptuserexternals': exceptuserexternals,
                                                         'level': "_1",
                                                         'scope': "-profile",
                                                         'form_title': form_title,
                                                         'dialog1_title': _(u'Add schedule definition'),
                                                         'dialog1_edit_title': _(u'Edit schedule definition'),
                                                         'dialog2_title': _(u'Add user definition'),
                                                         'dialog2_edit_title': _(u'Edit user definition'),
                                                         'dialog3_title': _(u'Add extension'),
                                                         'dialog3_edit_title': _(u'Edit extension'),
                                                         'dialog4_title': _(u'Add extension'),
                                                         'dialog4_edit_title': _(u'Edit extension'),
                                                         'dialog5_title': _(u'Add MIME'),
                                                         'dialog5_edit_title': _(u'Edit MIME'),
                                                         'dialog6_title': _(u'Add MIME'),
                                                         'dialog6_edit_title': _(u'Edit MIME'),
                                                         'dialog7_title': _(u'Add category'),
                                                         'dialog7_edit_title': _(u'Edit category'),
                                                         'dialog8_title': _(u'Add whitelist'),
                                                         'dialog8_edit_title': _(u'Edit whitelist'),
                                                         'dialog9_title': _(u'Add blacklist'),
                                                         'dialog9_edit_title': _(u'Edit blacklist'),
                                                         'dialog10_title': _(u'Add content'),
                                                         'dialog10_edit_title': _(u'Edit content'),
                                                         'dialog11_title': _(u'Add network definition'),
                                                         'dialog11_edit_title': _(u'Edit network definition'),
                                                         'dialog12_title': _(u'Add network definition'),
                                                         'dialog12_edit_title': _(u'Edit network definition'),
                                                         'dialog13_title': _(u'Add user definition'),
                                                         'dialog13_edit_title': _(u'Edit user definition'),
                                                         'dialog14_editurl_title': _(u'Edit URL'),
                                                         'dialog14_import_title': _(u'Import'),
                                                         'dialog14_export_title': _(u'Export')})
                    return render_to_response('wpprofile/wpprofile_save_form.html', variables)
                
                else:
                    return HttpResponse("System can't find this policy.") 
                   
            except Exception,ex:
                return HttpResponse("Error Info wizard_profile_save %s" %str(ex))
            
        else:
            
            form = WPProfileForm()
            formexcept = WPProfileExceptForm()
    
            variables = RequestContext(request, {'form': form,
                                                 'formexcept': formexcept,
                                                 'level': "_1",
                                                 'iswizard' : "1",
                                                 'scope': "-profile",
                                                 'dialog1_title': _(u'Add schedule definition'),
                                                 'dialog1_edit_title': _(u'Edit schedule definition'),
                                                 'dialog2_title': _(u'Add user definition'),
                                                 'dialog2_edit_title': _(u'Edit user definition'),
                                                 'dialog3_title': _(u'Add extension'),
                                                 'dialog3_edit_title': _(u'Edit extension'),
                                                 'dialog4_title': _(u'Add extension'),
                                                 'dialog4_edit_title': _(u'Edit extension'),
                                                 'dialog5_title': _(u'Add MIME'),
                                                 'dialog5_edit_title': _(u'Edit MIME'),
                                                 'dialog6_title': _(u'Add MIME'),
                                                 'dialog6_edit_title': _(u'Edit MIME'),
                                                 'dialog7_title': _(u'Add category'),
                                                 'dialog7_edit_title': _(u'Edit category'),
                                                 'dialog8_title': _(u'Add whitelist'),
                                                 'dialog8_edit_title': _(u'Edit whitelist'),
                                                 'dialog9_title': _(u'Add blacklist'),
                                                 'dialog9_edit_title': _(u'Edit blacklist'),
                                                 'dialog10_title': _(u'Add content'),
                                                 'dialog10_edit_title': _(u'Edit content'),
                                                 'dialog11_title': _(u'Add network definition'),
                                                 'dialog11_edit_title': _(u'Edit network definition'),
                                                 'dialog12_title': _(u'Add network definition'),
                                                 'dialog12_edit_title': _(u'Edit network definition'),
                                                 'dialog13_title': _(u'Add user definition'),
                                                 'dialog13_edit_title': _(u'Edit user definition'),
                                                 'dialog14_editurl_title': _(u'Edit URL'),
                                                 'dialog14_import_title': _(u'Import'),
                                                 'dialog14_export_title': _(u'Export')})
            return render_to_response('wpprofile/wpprofile_save_form.html', variables)

    
def wizard_wpprofile_save(request):
    scope = ''
    level = ''
    form_title = ADD_WPPROFILE_FORM_TITLE
    
    dict_result = {}
          
    if request.method == 'POST':
       
        if 'save_type' in request.POST:
            form = WPProfileForm(request.POST)
            if form.is_valid():
                try:
                    if request.is_ajax():
                        dict_group = {}
                        dict_user = {}
                        
                        name = request.POST["name"]
                        id = 0
                        rr = False
                        
                        if request.POST["save_type"] == "updatetype":
                            _id = request.POST["id"]
                            id = int(_id) 
                            obj = get_items_session_byid(request,STORE_POLICY,id)
                            
                            if obj != None:
                                oldname = obj.WPmainprofile.name
                                                                
                                if name.lower() != oldname.lower():
                                    is_existed_in_session(request, STORE_POLICY, name)
                                    
                                obj.set_profile(request)
                                s_obj = update_items_session(request, STORE_POLICY, name, id, obj) 
                                
                                if s_obj != None: 
                                    rr = True 
                            
                        if request.POST["save_type"] == "inserttype":
                            
                            is_existed_in_session(request, STORE_POLICY, name)
                            #using instance to avoid the memory.
                            obj = WPprofileSession()
                            obj.set_profile(request)
                            sss = WPProfile()
                            id = int(get_obj_id(sss))
                            
                            rr = store_session(request,STORE_POLICY,name,id,obj)
                            
                        if rr == True:                
                            template = get_template("wizard/internet_usage_policy_list_item.html") 
                            c= RequestContext(request,{'name': name,'key': id });
                            s = template.render(c) 
                            dict_result['status'] = 'success'
                            dict_result['form'] = s
                        else :
                            dict_result['status'] = 'error'
                            dict_result['error_info'] = 'System can not store.' 
                        
                        return json_result(dict_result) 
                        
                except UIException, e:
                    dict_result['status'] = 'error'
                    dict_result['error_info'] = str(e) 
                    return json_result(dict_result)          
                       
            else:
                s = generate_error_msg(form._get_errors())
                dict_result['status'] = 'error'
                dict_result['error_info'] = s
                return json_result(dict_result)     
    
            
                   
   

































 
#This method happens when user click button customise.    
#def wizard_open_profile(request):
#    dict_result = {}
#    try:
#        if request.is_ajax() and request.method == 'POST':   
#            nameprofile = request.POST["nameprofile"]
#            
#            form = WPProfileForm()
#            formexcept = WPProfileExceptForm()
#            
#            variables = Context({'form': form,
#                                             'formexcept': formexcept,
#                                             'form_title': 'khong',
#                                             'dialog1_title': _(u'Add schedule definition'),
#                                             'dialog1_edit_title': _(u'Edit schedule definition'),
#                                             'dialog2_title': _(u'Add user definition'),
#                                             'dialog2_edit_title': _(u'Edit user definition'),
#                                             'dialog3_title': _(u'Add extension'),
#                                             'dialog3_edit_title': _(u'Edit extension'),
#                                             'dialog4_title': _(u'Add extension'),
#                                             'dialog4_edit_title': _(u'Edit extension'),
#                                             'dialog5_title': _(u'Add MIME'),
#                                             'dialog5_edit_title': _(u'Edit MIME'),
#                                             'dialog6_title': _(u'Add MIME'),
#                                             'dialog6_edit_title': _(u'Edit MIME'),
#                                             'dialog7_title': _(u'Add category'),
#                                             'dialog7_edit_title': _(u'Edit category'),
#                                             'dialog8_title': _(u'Add whitelist'),
#                                             'dialog8_edit_title': _(u'Edit whitelist'),
#                                             'dialog9_title': _(u'Add blacklist'),
#                                             'dialog9_edit_title': _(u'Edit blacklist'),
#                                             'dialog10_title': _(u'Add content'),
#                                             'dialog10_edit_title': _(u'Edit content'),
#                                             'dialog11_title': _(u'Add network definition'),
#                                             'dialog11_edit_title': _(u'Edit network definition'),
#                                             'dialog12_title': _(u'Add network definition'),
#                                             'dialog12_edit_title': _(u'Edit network definition'),
#                                             'dialog13_title': _(u'Add user definition'),
#                                             'dialog13_edit_title': _(u'Edit user definition'),
#                                             'dialog14_editurl_title': _(u'Edit URL'),
#                                             'dialog14_import_title': _(u'Import'),
#                                             'dialog14_export_title': _(u'Export')}) 
#            
#           
#            template = get_template("wpprofile/wpprofile_save_form.html")
#            s = template.render(variables)
#            
#            dict_result['status'] = 'success'
#            dict_result['form'] = s
#            return json_result(dict_result) 
#        
#    except Exception,ex:
#        print "Error Info wizard_open_profile %s" %str(ex)
#        dict_result['status'] = 'error'
#        dict_result['error_info'] = str(ex)
#        return json_result(dict_result)
        

'''
    ----------------------------------------------------------------------------
        Creat schedule.
    
    ----------------------------------------------------------------------------
'''
#This method happens when the user click save the schedule
#def wizard_save_schedule(request):
#    try:
#        dict_result = {}
#        
#        if request.is_ajax() and request.method == 'POST':
#            try:
#                dict_schedule = {}
#                type = ""
#                nameschedule = request.POST["name"]
#                form = ScheduleForm(request.POST)
#                #return HttpResponseSchedule('Success',request.POST)
#        
#                if form.is_valid():
#                    
#                    if STORE_SCHEDULE in request.session:
#                        dict_schedule = request.session[STORE_SCHEDULE]
#                    
#                    dict_schedule[nameschedule] = ['schedules',request.POST]
#                    request.session[STORE_SCHEDULE] = dict_schedule
#                    
#                    dict_result['status'] = 'success'
#                    dict_result['name'] = nameschedule
#                    
#                else:
#                    dict_result['status'] = 'error'
#                    dict_result['error_info'] = form.errors
#                    
#                return json_result(dict_result) 
#                 
#            except Exception, ex:
#                print "Error Info wizard_save_schedule %s" %str(ex)
#                dict_result['status'] = 'error'
#                dict_result['error_info'] = str(ex)
#                return json_result(dict_result) 
#        
#    except Exception,err:
#        print "Error Info wizard_save_schedule %s" %str(err)
#        dict_result['status'] = 'error'
#        dict_result['error_info'] = form.errors
#        return json_result(dict_result) 

'''
    ----------------------------------------------------------------------------
    Create a def net.
    ----------------------------------------------------------------------------
'''          
#def wizard_save_defnet(request):
#    dict_result = {}
#    try:
#        form = DefNetForm(request.POST)
#        name = request.POST['name']
#        type = request.POST['type']
#        
#        dict_net = {}
#        dict_net_group = {}
#        
#        if form.is_valid():
#            
#            if STORE_HOST in request.session:
#                [dict_net,dict_net_group] = request.session[STORE_HOST]
#                
#            if dict_net.has_key(name) or dict_net_group.has_key(name):
#                raise Exception ("Name is existed.") 
#            
#            if type in ['1','2','3']:
#                if type == '1' :
#                    dict_net[name] = ['host',request.POST]
#                if type == '2' :
#                    dict_net[name] = ['dns_host',request.POST]
#                if type == '3':
#                    dict_net[name] = ['network',request.POST]     
#            else:
#                dict_net_group[name] = ['network_group',request.POST] 
#            
#            #dict_net[name] = request.POST  
#            request.session[STORE_HOST] = [dict_net,dict_net_group]
#            
#            dict_result['status'] = 'success'   
#            dict_result['name'] = name 
#            
#        else:
#            dict_result['status'] = 'error'
#            dict_result['error_info'] = form._get_errors()
#            
#        return json_result(dict_result) 
#    except Exception,ex:
#        dict_result['status'] = 'error'
#        dict_result['error_info'] = str(ex) 
#        return json_result(dict_result) 
    

#def wizard_show_defnet_level2(request):
#    dict_result = {}
#    try:
#        if request.is_ajax() and request.method == 'POST':   
#            form = DefNetForm(request.POST)
#        
#        
#    except Exception,ex:
#        dict_result['status'] = 'error'
#        dict_result['error_info'] = str(ex) 
#        return json_result(dict_result) 


'''
     Search and add some components in profile.
'''
def wizard_search_profile(request):
    dict_result = {}
    
    if request.is_ajax() and request.method == 'POST':    
        try:
            type = request.POST['type']
            init = request.POST['init']
            
            lst_object = []
            lst_search = []
            
            dict_search = {}
            dict_search_group = {}
             
            '''
                Temparary just support for user, don't support for group.
            '''
            
            if type == "defusers":
                if STORE_INFO in request.session:
                    [dict_search_group,dict_search] = request.session[STORE_INFO]
                        
            if type in "defusers":
                for objkey in dict_search:
                    lst_search.append(["users",objkey])
                
                
            lst_search.sort(key=lambda x: x[1])
            
            print lst_search
            
            if init == '0':
                template = get_template("wizard/type_panel.html")
            else:
                template = get_template("wizard/type_panel_list.html")
            
            if dict_detination.has_key(type):
                destintaion = dict_detination[type]  
            
            c = Context({'objlist' : lst_search, 'type': type,'destination' : destintaion})
            s = template.render(c)
            
            dict_result['status'] = 'success'
            dict_result['form'] = s
            return json_result(dict_result) 
        
        except Exception,ex:
            dict_result['status'] = 'error'
            dict_result['error_info'] = str(ex) 
#            return json_result(dict_result) 
            
         
def load_network_interface(request):
    try:
        return render_to_response('main_page_wizard.html',{'title':CONFIGURATION_ADMINISTRATOR_FORM_TITLE}) 
    except Exception,e:
        print "Error Info %s" %str(e)
        pass
    