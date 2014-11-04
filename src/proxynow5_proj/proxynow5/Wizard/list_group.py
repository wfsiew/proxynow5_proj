from django.utils.translation import ugettext as _
from proxynow5_proj.proxynow5.Wizard import process_session, defined_object
from proxynow5_proj.proxynow5.Wizard.import_user import import_user
from proxynow5_proj.proxynow5.Wizard.init import init_policy

# LIST_GROUP_SETTING
# - This is exactly how it appears in wizard
# - From TOP to BOTTOM, this is how to arrange it

LIST_GROUP_SETTING = [ _(u'Directors'),
                       _(u'Accounts'),
                       _(u'Sales & Marketing'),
                       _(u'Human Resources'),
                       _(u'Purchasing'),
                       _(u'Information Technology'),
                       _(u'Customer Service'),
                       _(u'Research & Development'),
                       _(u'Guests'),
                       _(u'Production'),
                       _(u'Maintenance & Operations'),
                       _(u'Logistics'),
                       _(u'Legal'),
                       _(u'Security'),
                       _(u'Audit'),
                     ]

########### LIST_GROUP_SETTING_POLICY ############
# format is : '<number>|<number>|...'            #
# <number represent digit of ID of the policies  #
# applied to the profile above.                  #
# Policies referred in init.py, scroll to the    #
# bottom, refer dict_keymap["<number>"],         #
# <number> is the id to put here                 #
# | <-- (called as 'pipe') act as separator      #
# Applied to each profile as arrange above,      #
# top to bottom, start from 1 ....n              #
##################################################

LIST_GROUP_SETTING_POLICY = [
                             '2',
                             '3|5|7',
                             '3|7',
                             '3|6|7',
                             '3|7',
                             '2',
                             '3|7',
                             '2',
                             '3|7',
                             '3|7',
                             '3|7',
                             '3|7',
                             '3|7',
                             '3|7',
                             '3|7',
                             ]

class group_user():
    
    group = {}
    previous_group = {}
    user = {}
    
    def __init__(self):
        self.group = {}
        self.previous_group = {}
        self.user = {}
    
    def make_dictionary_policy(self):
        
        dict_policy ={}
        
        for namepolicy in  defined_object.LIST_GROUP_POLICY: 
            if dict_policy.has_key(namepolicy):
                print "Name %s has existed in policy during time init the group policy."
            else :
                dict_policy[namepolicy] = [0,{}]
                 
    
        return dict_policy 
        
    '''
        Note : 
            dict_group : type is dictionary , 
            key is name of the group,
            format of value , that is a list
            [0] : include 0,1 --> if 0 it means this one is not ovverride.
                              --> if 1 it means this one is ovverrid.
            [1] : list members(users)
            [2] = [accesstype,comment]   
            [3] = {} dictionary of policy:
                key : name of policy : Ex Unrestricted,Office Hour Restricted,After Office Hour Restricted.
                Note : isselectd key , It means this policy is checked by user or not , True is checked ,False is oppisted.
                value is dictionary : 
                    key : name of setting for policy : Ex Authentication ,Quta,Schedule.......  
                    value : is dictionary.
                        key : name of setting 
                        
                        Ex : in the Authentication we got the list of user and then the key of this case will be users
                             and the value will be list of users.
                        Ex : in the Quta we got two settings Daily time quota and Daily size quota
                             then we have two keys one is Dailytimequota and other is Dailysizequota
                             value will the the list also { 'Dailytimequota' : ['1234'] , 'Dailysizequota' : ['4567']
                        
                        value : is the list
                    
        LIST_GROUP_SETTING is default key , 
        so if dict_group it has got the key then group will be override. 
    '''
    def make_group(self,in_group_user_request):
        
        try :
            previous_group = in_group_user_request.POST
            group_user_request = in_group_user_request.POST 
          
#            dict_policy = {'1':'', '2':''} 
            
            for xGroup in range(0, len(LIST_GROUP_SETTING)):
                if self.group.has_key(LIST_GROUP_SETTING[xGroup]):
                    print "Group got key."
                else:
                    #default_dict_policy = {'1':''}
                    
                    dict_policy = {}
                    tempLIST = LIST_GROUP_SETTING_POLICY[xGroup].split('|')
                    
                    for xx in range(0, len(tempLIST)):
                        dict_policy[tempLIST[xx]] = ''
                     
                    #dict_policy = {LIST_GROUP_SETTING_POLICY[xGroup]: ''}
                    self.group[LIST_GROUP_SETTING[xGroup]] = ["0",[],["",""],dict_policy, xGroup+1]
            
            if group_user_request == None:
                print "Make Group . We don't recive any groups from previous form."
                 
            else:
                print group_user_request
                
                header = group_user_request["wizard_import_header"]
                wizard_imported_content = group_user_request["wizard_imported_content"]
                wizard_seperate_field = group_user_request["wizard_seperate_field"]
                wizard_identification_form = group_user_request["wizard_identification_form"]
                position_next = group_user_request["position_next"]
                wizard_default_pass = group_user_request["wizard_default_pass_authb"]
                
                if header == "":
                    header = "Username"
                
                x = import_user()
                x.test_import(header,wizard_imported_content,wizard_seperate_field,wizard_default_pass) 
                self.user =  x.dic_user
                dic = x.dic_group
                
                #This part to override the list of user.
                for o in dic:
                    if self.group.has_key(o):
                        self.group[o] = ["1",dic[o],["",""],dict_policy]
                        
                    else:
                        self.group[o] = ["1",dic[o],["",""],dict_policy]
               
                print "Finished attached."
                       
        except Exception,e:
            print "Error Info make_group %s" %(str(e))
            pass
            
            
            
            
            
            
                