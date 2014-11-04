from django.utils.translation import ugettext as _

'''
condiction is not valid for importing:
    - userName must be unquie , if not .
    - the lenth in a line must equal line of header
    - 

'''


class cls_errors():
    
    line = "0"
    reason = ""
    
    def __init__(self,line,reason):
        self.line = line
        self.reason = reason
        

'''
    Import user first ,after that import group.
'''
class User_Group():
    
    name = ''
    accesstype = ''
    displayname = ''
    password = ''
    comment = ''
    Group = '' 
    
    is_group = False
    is_map_pass = False
        
    def map(self,lsheadr,lscontent,defalut_pass):
        
        try:    
            header_len =  len(lsheadr)
            lscontent_len = len(lscontent)
            
            #if (lscontent_len < header_len  ):
            #    return (False,"the item of header and item of content is diffrent")
            
            try: 
                for i in range(0,header_len):
                    self.map_field(lsheadr[i], lscontent[i])
                
                #if user don't pass pasword then system will use the default pass
                if self.is_map_pass == False:
                    self.password = defalut_pass
                
            except Exception,e:
                if str(e) == "list index out of range":
                    return (False,"Please check the field is enough or not.")
                
                return (False,str(e))
                
            if self.name == "":
                return (False,_(u"User name is required")) 
                
            return(True,"")
        
        except Exception,e:
            print "Error Info Map %s" %str(e)
            return (False,str(e))
    
    # 
    def map_field(self,keyfield,mapvalue):
        
        if (keyfield == "Username"):
            self.name = mapvalue
            
        if (keyfield == "Typeaccess"):
            self.accesstype = mapvalue
        
        if (keyfield == "Dispalyname"):
            self.displayname = mapvalue
            
        if (keyfield == "Password"):
            self.password = mapvalue
            self.is_map_pass = True
            
        if (keyfield == "Comment"):
            self.comment = mapvalue
            
        if (keyfield == "Group"):
            self.Group = mapvalue
            if self.Group == "":
                self.is_group = False
            else:
                self.is_group = True
                
    def set_data(self,in_username,in_typeacccess,in_display,in_password,in_comment):
        self.name = in_username
        self.accesstype = in_typeacccess
        self.displayname = in_display
        self.password = in_password
        self.comment = in_comment
        
       
class import_user():
    
     # is stored for the case of group
    dic_group = {} 
        
    dic_user = {}
        
    lst_header = []
    lst_content = []
    lst_group = []
    lst_error = []
    
    def __init__(self):
        self.dic_group = {} 
        self.dic_user = {}
        self.lst_error = []
        
            
    def test_import(self,header,wizard_imported_content,wizard_seperate_field,default_password):
        
        if (wizard_imported_content == ""):
            print "Content is empty , System can't test."
            return
        
        lst_header = header.split(wizard_seperate_field)
        lst_content =wizard_imported_content.split("\n")
        
        total_field = len(lst_header)
        total_line = len(lst_content) 
        
        # this one loop for each line so we will get total_line
        for i in range(0,total_line):
            result = False
            dx = User_Group()
            cause = ""
            
            ls_content1 = lst_content[i].split(wizard_seperate_field)
            (result,cause) = dx.map(lst_header,ls_content1,default_password)
            
            if (result == True):        
                
                if (dx.password == ""):
                    txt_err = _(u"Password is required.")
                    # Store the line and the error msg.                    
                    err = cls_errors(i+1,txt_err)
                    self.lst_error.append(err)
                         
                elif self.dic_user.has_key(dx.name):
                    txt_err = _(u"User name %s already exists") %(dx.name)
                    err = cls_errors(i+1,txt_err)
                    self.lst_error.append(err) 
                
                else:
                    self.dic_user[dx.name] = dx
                    
                    #check is it group or not
                    ## ["0",listname,[accesstype,]] 
                    if (dx.is_group):
                        if (self.dic_user.has_key(dx.Group)):
                            txt_err = _(u"User name %s already exists") %(dx.Group)
                            err = cls_errors(i+1,txt_err)
                            self.lst_error.append(err) 
                
                        elif (self.dic_group.has_key(dx.Group)):
                            lst_g = self.dic_group[dx.Group]
                            lst_g.append(dx.name)
                            self.dic_group[dx.Group] = lst_g  
                                     
                        else:
                            lst_g = []
                            lst_g.append(dx.name)
                            self.dic_group[dx.Group] = lst_g
            else:
                txt_err = cause
                err = cls_errors(i + 1,txt_err)
                self.lst_error.append(err)
                     
            
