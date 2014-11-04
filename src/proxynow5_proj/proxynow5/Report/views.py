from django.core.servers.basehttp import FileWrapper
from django.http import HttpResponse
from django.shortcuts import *
from django.template import Context, Template
from django.template.context import RequestContext
from django.template.loader import get_template
from exportcsv import *
from proxynow5_proj.proxynow5.NIC.models import NIC
from proxynow5_proj.proxynow5.Network.models import NetInt
from proxynow5_proj.proxynow5.Report.reportexportpdf import ReportTopUser
from proxynow5_proj.proxynow5.exceptions import UIException
from proxynow5_proj.proxynow5.utils import *
from proxynow5_proj.settings import REPORT_PATH_PDF, REPORT_PATH_CSV, \
    REPORT_PATH

from reportexportpdf import *
from forms import *
import mimetypes

from proxynow5_proj.rrd_info import *
from proxynow5_proj.reportrrd import *
from proxynow5_proj.reportobject import *
from proxynow5_proj.report import *
from proxynow5_proj.reportsendmail import *
from models import *
from proxynow5_proj.proxynow5.Report import reportexportpdf


#from proxynow5_proj.emailutils import *
#from proxynow5_proj import emailutils


#from reportexportpdf import *

# format from client to server:
# type : daily ,weekly ,monthly ,yearly
# email : lehuunghia10@gmail.com , lehuunghia....
    

def graphdata(request):
    try:
        
        ispage =  request.POST['ispage'] 
        
        ''' type of report 
        EX: cpu , ram , hd , netIO
        '''
        types = request.POST['types']
        
        ''' time for reporting
        EX : daily,monthly,weekly,yearly.
        '''
        typetime = request.POST['typetime']
        
        #returned list is path of images.
        s = generategraph(ispage,types,typetime)
            
        objpath = {'objpath' : s}
        
        return render_to_response('report/rpttime.html',{'objpath' : s}) 
    
    except UIException,e:
        print "Error Info : %s "  %str(e)
        return HttpResponse('Error Inof : %s' %str(e)) 
        
def hardware_load(request):
    try:
        return render_to_response('report/rpthardware.html',{'title': u'Hardware'}) 
    except UIException ,e :
        return HttpResponse('Error Info : %s' %e ) 
    
def networkusage_load(request):
    try:
        return render_to_response('report/rpthardware.html',{'title': u'Network Usage'}) 
    except UIException,e:
        return HttpResponse('Error Info : %s' %e )


'''This method support for user when click the navigation of report
    Ex : Top Top > Top user by Site(10.8.0.128)
'''
def rpt_get_back_cache(request):
    try:
        currentpage = request.GET['currentpage']
        sizepage = request.GET['sizepage']     
        topic = request.GET['topic']
        topicby = request.GET['topicby']
        timescale = request.GET['timescale']
        starttimescale = request.GET['starttimescale']
        endtimescale = request.GET['endtimescale']
        sortfield = request.GET['sortfield']
        status = request.GET['status']
        
        makerpt = rpt()

        lst = makerpt.navigation_list(topic, topicby ,timescale,starttimescale,endtimescale , sortfield)
        
        b = DevidePage(currentpage,sizepage,status,sortfield,topic)
        
        dict = b.Pagination(True,lst,'report/rpttopuser_list.html')
         
        if not dict.has_key('error'):
            dict['success'] = 'success'
            
        if not dict.has_key('error'):
            dict['success'] = 'success'  
            
        dict['nav_topic_by'] = topicby
        
        if timescale == "custom":
            dict['nav_timescale_start'] = starttimescale 
            dict['nav_timescale_end'] = endtimescale
        else:
            dict['nav_timescale_start'] = ""        
            dict['nav_timescale_end'] = ""
    
        dict['nav_timescale'] =  timescale
        dict['nav_topic'] = topic
        dict['nav_sort'] = sortfield
        dict['nav_nbrrow'] = sizepage
        
        return json_result(dict)
    
    except Exception,e:
        
        dict = {}
        dict['error'] = str(e)
        
        print "Error info at method rpt_get_back_cache (navigation sort) of Views.py %s" %e
        
        return json_result(dict)  
        
'''Previous Next Sort button'''    
def rpt_get_list(request):
    
    try:
        currentpage = request.GET['currentpage']
        sizepage = request.GET['sizepage']     
        topic = request.GET['topic']
        topicby = request.GET['topicby']
        timescale = request.GET['timescale']
        starttimescale = request.GET['starttimescale']
        endtimescale = request.GET['endtimescale']
        sortfield = request.GET['sortfield']
        status = request.GET['status']
        
        makerpt = rpt()
        
        #Get the list of data
        #tuple (fetchall,fetchsum)
        lst = makerpt.navigation_list(topic, topicby ,timescale,starttimescale,endtimescale , sortfield)
        
        # pagecurrent pagesize
        # Get Dictionary and return to client
        b = DevidePage(currentpage,sizepage,status,sortfield,topic)
        
        # Get the template of 
        # Todo catch the error here.
        if dicttemplate.has_key(topic):
            pathtemplate = dicttemplate[topic]
        
        # True ,False show header or not.
        returned_dict = b.Pagination(False,lst,pathtemplate)
        
        
        if not returned_dict.has_key('error'):
            returned_dict['success'] = 'success'  
            
        returned_dict['nav_topic_by'] = topicby
        
        if timescale == "custom":
            returned_dict['nav_timescale_start'] = starttimescale 
            returned_dict['nav_timescale_end'] = endtimescale
        else:
            returned_dict['nav_timescale_start'] = ""        
            returned_dict['nav_timescale_end'] = ""

        returned_dict['nav_timescale'] =  timescale
        returned_dict['nav_topic'] = topic
        returned_dict['nav_sort'] = sortfield
        returned_dict['nav_nbrrow'] = sizepage
    
        return json_result(returned_dict)    

    except UIException,e:
       
        # In the case it cause error here 
        # System will return the key error : let the client knows that it is error from server.
        dict = {}
        dict['error'] = str(e)
        
        print "Error info at method rpt_get_list (navigation sort) of Views.py %s" %e
        
        return json_result(dict) 
        
def websecurity_load(request):
    try:
        a = rpt()
        lst = a.TopUser();
        
        #pagecurrent pagesize status (navigation) ,sort , topic 
        b=DevidePage(1,20,0,'','topuser')
        
        # 1st param : define header is used or not
        # 2nd param : list object is find topuser default
        # 3nd param : don't send the template.
        # 4nd param : True is sendmail
        # 5nd param : sum value. 
        var = b.Pagination(True,lst,None,None,0)
        
        var['title'] =  u'Web Security'
        var['sendmail'] = 0
         
        return render_to_response('report/rptwebsecurity.html',var)
        
    except UIException , e :
        return HttpResponse('Error Inof --  : %s' %e )
    
'''
    Note:
    Type of searching time. (timescale)
    
    today : the current day (default)
    yesterday : 
    lastsevendays : last 7 days compare with current days
    lastthirtydays : last 30 days compare with current days
    custom : give user right to select time starttime and endtime
    others... format is months\years . if user select this option , i will the name to inmonthyear other keep
    
    When user click update button , Everything will pagecurrent will be reset.
'''
def report_update_list(request):
    
    try:
        topic = request.GET['topic']
        timescale = request.GET['timescale']
        nbrrow =  request.GET['nbrrow']
        byuser = request.GET['byuser']
        byhost = request.GET['byhost']
        bymime = request.GET['bymime']
        bymimeuser = request.GET['mimebyuser']
        destbymime = request.GET['destbymime']
        starttimescale = request.GET['starttimescale']
        endtimescale = request.GET['endtimescale'] 
        nbrrow = request.GET['nbrrow']
    
        makerpt = rpt()
        topicby = ""
        
        if topic == "topusersbyhost":
            topicby = byhost
        if topic == "tophostbyuser":
            topicby = byuser 
        if topic == "topuserbymime" :
            topicby = bymime
        if topic == "topmimebyuser" :
            topicby = bymimeuser
        if topic == "topdestinationbymime":
            topicby = destbymime
        
        lst = makerpt.navigation_list(topic,topicby,timescale,starttimescale,endtimescale,'host')
        # currentpage , pagezie , statusin
        # currentpage will be 1
        b = DevidePage(1,nbrrow,0,'host',topic)
        
        # Note report/rpttopuser_list.html will includes header and detail.
        # True , mean get header.
        dict = b.Pagination(True,lst,'report/rpttopuser_list.html')
    
        '''
            Add more variable into dict that will applied for returned value.
        '''  
    
        if topic == "topusersbyhost":
            dict['nav_topic_by'] = byhost
        if topic == "tophostbyuser":
            dict['nav_topic_by'] = byuser 
        if topic == "topuserbymime":
            dict['nav_topic_by'] = bymime
        if topic == "topmimebyuser":
            dict['nav_topic_by'] = bymimeuser
        if topic == "topdestinationbymime":
            dict['nav_topic_by'] = destbymime
        
        if timescale == "custom":
            dict['nav_timescale_start'] = starttimescale 
            dict['nav_timescale_end'] = endtimescale
        else:
            dict['nav_timescale_start'] = ""        
            dict['nav_timescale_end'] = ""
    
    
        dict['nav_timescale'] =  timescale
        dict['nav_topic'] = topic
        dict['nav_sort'] = 'host'
        dict['nav_nbrrow'] = nbrrow
    
        #Before i return data i want to check whether it is error or not.
        #if not i will return "success"  
        
        if not dict.has_key('error'):
            dict['success'] = 'success'  
    
        return json_result(dict)  
    
    except UIException,e:
        dict = {}
        dict['error'] = str(e)
                 
        print "Error info at method report_update_list (Update) of Views.py %s" %e
        
        return json_result(dict)
    
'''
 This method to support generate pdf.
'''

def gettypetitlepdf(topic):
    
    if topic == "topuser":
        return "TOP USER"
    
    if topic == "tophost":
        return "TOP HOST"
    
    if topic == "topmime":
        return "TOP MIME"
    
    if topic == "topusersbyhost":
        return "TOP USER BY SITE"
    
    if topic == "tophostbyuser":
        return "TOP SITE BY USER"
    
    if topic == "topmimebyuser":
        return "TOP MIME BY USER"
    
    if topic == "topdestinationbymime":
        return "TOP SITE BY MIME"
    
    if topic == "topuserbymime":
        return "TOP USER BY MIME"
    
    return ""

def getorderedby(sortfield):
    
    if sortfield == "host":
        return "Traffic (Descend)"
    
    if sortfield == "request_asc":
        return "Request (Ascend)"
    
    if sortfield == "request_desc":
        return "Request (Descend)"
    
    if sortfield == "durationinsec_asc":
        return "Duration (Ascend)"
    
    if sortfield == "durationinsec_desc":
        return "Duration (Descend)"
    
    if sortfield == "kbyte_asc":
        return "Traffic (Ascend)"
    
    if sortfield == "kbyte_desc":
        return "Traffic (Descend)"
    
    return ""    
   
def getpdfinfo(topic,topicby,timescale,starttimescale,endtimescale,sortfield):
       
    titletopic = gettypetitlepdf(topic)
    titlesortfield =  getorderedby(sortfield) 
    
    str1 = "Type       : %s <br/>Filter     : %s<br/>Time Frame : %s - %s<br/>Ordered by : %s " %(titletopic,topicby,starttimescale.strftime("%Y %B %d"),endtimescale.strftime("%Y %B %d"),titlesortfield)
    
    return str1
    
def report_pdf(request):
    try:
        currentpage = request.GET['currentpage']
        sizepage = request.GET['sizepage']     
        topic = request.GET['topic']
        topicby = request.GET['topicby']
        timescale = request.GET['timescale']
        starttimescale = request.GET['starttimescale']
        endtimescale = request.GET['endtimescale']
        sortfield = request.GET['sortfield']
        
        print starttimescale
        print endtimescale
        
        # Check the folder is existed or not 
        # if not existed it will create.
        (resultcreate,errorcreate) = create_folder(REPORT_PATH_PDF)
        
        if resultcreate == False:
            dict_info = {}
            dict_info['error'] = str(errorcreate)
            return json_result(dict_info)
        
        ttt = datetime.datetime.now()
        ran = epoch(ttt)
        namefilepdf = topic + str(ran) + ".pdf" 
        
        lstrow = []
        
        makerpt = rpt()
        # lst : is a tuple (a,b)
        # a : List object is ge
        # in this method already support get_starttime_endtime
        lst = makerpt.navigation_list(topic, topicby ,timescale,starttimescale,endtimescale , sortfield)
        
        todaydate = datetime.date.today()
        (starttimesearch , endtimesearch ) = report.get_starttime_endtime(timescale, todaydate, starttimescale, endtimescale)
              
        pdfinfo = getpdfinfo(topic, topicby, timescale, starttimesearch, endtimesearch, sortfield)
        
        if funcobj.has_key(topic):
            s = funcobj[topic]
            funcProfile = globals()[s]
            lstrow = funcProfile(lst[0],lst[1],1)
        
        response = HttpResponse(mimetype='application/pdf')
        response['Content-Disposition'] = 'attachment; filename=' + namefilepdf
        
        '''
            Todo: catch the case of empty list.
        '''
        if len(lstrow)==0:
            dict = {}
            dict['error'] = "System can't generate empty pdf file." 
            return json_result(dict)
        
        if topic == 'topuser' : 
            reportpdf = reportexportpdf.ReportTopUser(queryset=lstrow,titilein = pdfinfo)
        if topic == 'tophost': 
            reportpdf = ReportTopSite(queryset=lstrow,titilein = pdfinfo)
        if topic == 'topusersbyhost':
            reportpdf = ReportTopUserByHost(queryset=lstrow,titilein = pdfinfo)
        if topic == 'tophostbyuser':
            reportpdf = ReportTopSiteByUser(queryset=lstrow,titilein = pdfinfo)   
        if topic == 'topmime' :
            reportpdf = ReportTopMime(queryset=lstrow,titilein = pdfinfo)
        if topic == 'topuserbymime': 
            reportpdf = ReportTopUserbyMime(queryset=lstrow,titilein = pdfinfo)
        if topic == 'topdestinationbymime':
            reportpdf = ReportTopDestbyMime(queryset=lstrow,titilein = pdfinfo)
        if topic == 'topmimebyuser':
            reportpdf = ReportTopMimebyUser(queryset=lstrow,titilein = pdfinfo)
                
        namefilepdffull = os.path.join(REPORT_PATH_PDF,namefilepdf)
                
        reportpdf.generate_by(PDFGenerator,namefilepdffull)
        
        dict = {}
        dict['success'] = namefilepdf
             
        return json_result(dict)
       
        
    except UIException,e:
        dict = {}
        dict['error'] = str(e)
        
        print "Error info at method rpt_get_list (report pdf) of Views.py %s" %e
        return json_result(dict)
        

def report_csv(request):
    try:
        currentpage = request.GET['currentpage']
        sizepage = request.GET['sizepage']     
        topic = request.GET['topic']
        topicby = request.GET['topicby']
        timescale = request.GET['timescale']
        starttimescale = request.GET['starttimescale']
        endtimescale = request.GET['endtimescale']
        sortfield = request.GET['sortfield']
        
        # Check the folder is existed or not 
        # If not existed it will created
        (resultcreate,errorcreate) = create_folder(REPORT_PATH_CSV)
        
        if resultcreate == False:
            dict_info = {}
            dict_info['error'] = str(errorcreate)
            return json_result(dict_info)
        
        ttt = datetime.datetime.now()
        ran = epoch(ttt)
        namefilecsv = topic + str(ran) + ".csv"
        fullpathfilecsv = os.path.join(REPORT_PATH_CSV,namefilecsv)
        
        lstrow = []
        makerpt = rpt() 
        
        # In this method , is supported the get_starttime_endtime
        lst = makerpt.navigation_list(topic, topicby ,timescale,starttimescale,endtimescale , sortfield)
       
        if funcobj.has_key(topic):
            s = funcobj[topic]
            funcProfile = globals()[s]
            lstrow = funcProfile(lst[0],lst[1],1,True)
        
        if len(lstrow) == 0:
            dict_info = {}
            dict_info['error'] = "System can't generate empty csv file." 
            return json_result(dict_info) 
    
        f = open(fullpathfilecsv, 'wb')
    
        try:
            if topic == "tophost":
                (result, errorstr) = export_tophost_csv(f,lstrow)
            if topic =="topuser":
                (result, errorstr) = export_topuser_csv(f,lstrow)
            if topic == "topusersbyhost":
                (result, errorstr) = export_topusersbyhost_csv(f,lstrow)  
            if topic == "tophostbyuser":
                (result, errorstr) = export_tophostbyuser_csv(f,lstrow)
            if topic == "topmime":
                (result, errorstr) = export_topmime_csv(f,lstrow)
            if topic == "topuserbymime":
                (result, errorstr) = export_topuserbymime_csv(f,lstrow)
            if topic == "topmimebyuser":
                (result, errorstr) = export_topmimebyuser(f,lstrow)
            if topic == "topdestinationbymime":
                (result, errorstr) = export_topdestbymime(f,lstrow)
                
        finally:
            f.close()
    
        if result == False:
            dict_info = {}
            dict_info['error'] = str(errorstr)
            return json_result(dict_info)
    
        dict_info = {}
        dict_info['success'] = namefilecsv    
    
        return json_result(dict_info)
    
    except UIException,e:
        print "Error Info : report_csv %s " %str(e)  
        dict_info = {}
        dict_info['error'] = str(e)
        return json_result(dict_info)
    
'''
'''
def download_reportfile(request):
    
    try :
        
        namefile = request.GET['path_file']
        
        (rootfile,extensionfile) = os.path.splitext(namefile)
        
        if extensionfile == ".pdf":   
            fullpathfile = os.path.join(REPORT_PATH_PDF,namefile)
            contenttype = "application/pdf"
            
        if extensionfile == ".csv":
            fullpathfile = os.path.join(REPORT_PATH_CSV,namefile)
            contenttype = "application/csv"
        
        filename     =  fullpathfile #"C:\ex2.pdf" # Select your file here.
        
        response = HttpResponse(file(filename).read())
    
        response['Content-Length']      = os.path.getsize(filename)    
        response['Content-Disposition'] = "attachment;filename=" + namefile
        response['Content-Type'] = contenttype
    
        return response
    
    except UIException,e:
        print "Error Info : download_reportfile %s " %(str(e))
        
        dict = {}
        dict['error'] = str(e)
        
        return json_result(dict)


def AssigndataToFormSaveHostMail(objReportByEmail):
        
    data = {
            'fromemail' : objReportByEmail.emailfromaddress,
            'smtphost' : objReportByEmail.smtphost,
            'smtpport' :objReportByEmail.smtpport,
            'smtpuser' :objReportByEmail.smtpuser,
            'smtppass' :objReportByEmail.smtppass,
            'smtprepass' : objReportByEmail.smtppass,
            'smtpsecure' : objReportByEmail.smtpsecure
            } 
    
    return data ;

def reportloademailsettingreport(request):
    try:
        index = request.POST['dataindex'];
       
        if (index == '0'):
            dict  = {}
            dict = loadpage(); 
            dict['index'] = '0'
            dict['success'] = 'success'
            return render_to_response('report/rpt_save_form.html',RequestContext(request, dict))
        
        elif index == '1' :
            frm_save_setting = ""
            
            if ReportServerMail.objects.all().count() == 0:
                frm_save_setting = HostEmailForm()
                
            else:
                objReportServerMail =  ReportServerMail.objects.all()[0]
                frmdata = AssigndataToFormSaveHostMail(objReportServerMail)
                frm_save_setting = HostEmailForm(frmdata)
            
            return render_to_response('report/rpt_save_host_email.html',{'form': frm_save_setting});
            
    except UIException,e :
        return HttpResponse("Error Info %s" %str(e))
        
def reportloadsetting(request):
    try:
        return render_to_response('report/rpt_schedule_setting.html',{'title': u'Scheduled Reports'})
    except UIException,e :
        return HttpResponse("Error Info %s" %str(e))
    
'''
    This method is supported for case in user click enable or disable the feature of sending email.
'''
def report_toggle_status(request):
    try:
        # type will be inclueded : days, weeks, months ,yearly.  
        type = request.POST['type']
        active = request.POST['active']
        
        try :
            rpttype = ReportType.objects.get(type = type)
            rpttype.active = active
            rpttype.save()
            print "change the active %s" %(rpttype.active)
            
        except ReportType.DoesNotExist :
            rpttype = ReportType.objects.create(type = type , active = active)   
        
        rstdict = {}
        rstdict['success'] = 'success'
        rstdict['type'] = type
        
        return json_result(rstdict)
    
    except UIException,e :
        
        rstdict = {}
        rstdict['error'] = str(e)
        return json_result(rstdict)  
         

def report_save_email(request):
    
    try:
        if request.method == 'POST':
            type = request.POST['type']
            email = request.POST['email']
            
            frm = ListEmailForm({'email':email})
            
            if frm.is_valid():
                 
                try:
                    typerpt = ReportType.objects.get(type=type)
                except ReportType.DoesNotExist:
                    typerpt = ReportType.objects.create(type=type,active=0)
                       
                #Check email address exist on list or not.
                try:
                    lstemail = ReportListEmail.objects.get(emailaddress = email)
                    
                except ReportListEmail.DoesNotExist :
                    lstemail = ReportListEmail.objects.create(emailaddress = email)
                    
                try:
                    ReportByEmail.objects.get(emailaddress=lstemail,type=typerpt)
                    
                    rstdict1 = {}
                    rstdict1['error'] = "This email address is existed."
                    return json_result(rstdict1)
                
                except ReportByEmail.DoesNotExist:
                    a = ReportByEmail.objects.create(emailaddress=lstemail,type=typerpt)
                   
                rstdict = {}
                rstdict['id'] = a.id
                rstdict['email'] = email
                rstdict['success'] = 'success'
                rstdict['type'] = type
                return json_result(rstdict)
             
            else:
                rstdict1 = {}
                rstdict1['error'] = "Email Address is invalid."
                return json_result(rstdict1) 
            
    except UIException,e:
        rstdict = {}
        rstdict['error'] = e 
        return json_result(rstdict)  
    
'''
This methoded is supported when user click to delete email address
'''
def report_delete_email(request):
   
    try:
     
        id = request.POST['id']
        
        try :
            obj = ReportByEmail.objects.get(id=id);
            obj.delete()
            
            resultdict = {}
            resultdict['success'] = "success"; 
            return json_result(resultdict)   
           
        except ReportByEmail.DoesNotExist :
            resultdict = {}
            resultdict['success'] = "success"; 
            return json_result(resultdict)
        
    except UIException,e:
        resultdict = {}
        resultdict['error'] = str(e); 
        return json_result(resultdict) 

''' This method is happend when user click save host of email.'''
def report_save_host_mail(request):
    try:
       
        fromemailaddfield =  request.POST["fromemail"];
        smtphostfield = request.POST["smtphost"];
        smtpportfield = request.POST["smtpport"];
        smtpuserfield = request.POST["smtpuser"];
        smtppassfield = request.POST["smtppass"];
        smtprepassfield =  request.POST["smtprepass"];   
        smtpsecurefield = request.POST["smtpsecure"];
     
        frm = HostEmailForm(request.POST)
        
        '''Try to check the pass and repass is matched or not'''
        if (smtppassfield != smtprepassfield):
            resultdict = {}
            resultdict['error'] = 'Password is not matched.' 
            return json_result(resultdict)    
        
        '''
        Check valid form or not
        '''
        if frm.is_valid():
            if ReportServerMail.objects.all().count() == 0:
                ReportServerMail.objects.create(emailfromaddress = fromemailaddfield,smtphost = smtphostfield,smtpport=smtpportfield,smtpuser=smtpuserfield,smtppass = smtppassfield,smtpsecure = smtpsecurefield) 
            else :
                objhost = ReportServerMail.objects.all()[0]
                objhost.emailfromaddress = fromemailaddfield 
                objhost.smtphost = smtphostfield
                objhost.smtpport = smtpportfield
                objhost.smtpuser = smtpuserfield
                objhost.smtpsecure = smtpsecurefield
                
                if smtppassfield != "**********":
                    objhost.smtppass = smtppassfield
                
                objhost.save()  
             
            resultdict = {}
            resultdict['success'] = 'success' 
            return json_result(resultdict)    
        else:
            resultdict = {}
            resultdict['invalid'] = frm.errors; 
            return json_result(resultdict)  
            
    except UIException,e:
        resultdict = {}
        resultdict['error'] = str(e); 
        return json_result(resultdict) 
        
'''This method is getting data from sqllite 
to show which email adddress is entered (daily,weekly,monthly)
'''
def loadpage():
    try :
        # Get all the types from 
        rpttype = ReportType.objects.all()
        dict = {}
        # Iterate for each type of report () types include : day,month,year,
        for eachtyperpt in rpttype: 
            type = eachtyperpt.type
            active = eachtyperpt.active
                
            typeinfo = 'type' + '_' + type
            activeinfo = 'active' + '_' + type
            lstinfo = 'list'+ '_' + type
                 
            lstrptemail = eachtyperpt.reportbyemail_set.all()
                
            if not dict.has_key(typeinfo):
                dict[typeinfo] = type
                
            if not dict.has_key(activeinfo):
                dict[activeinfo] =  active  
                
            if not dict.has_key(lstrptemail):
                dict[lstinfo] = lstrptemail 
                      
                # Get each value of Id , and Emailaddress
#                for eachreportbyemail in lstrptemail:
#                    print eachreportbyemail.id
#                    print eachreportbyemail.emailaddress.emailaddress
                    
                #print lstrptemail.get_name()
        
        return dict
    
    except UIException,e :
        print "Error info : views report method loadpage()  %s" %(e)
        return {}    
    

        

          
        
        