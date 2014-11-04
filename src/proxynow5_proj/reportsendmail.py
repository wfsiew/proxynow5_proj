from django.http import HttpResponse
from django.template import Context, Template
from django.template.context import RequestContext
from django.template.loader import get_template
import rrd_info, emailutils

from settings import REPORT_PATH_PDF, REPORT_PATH_CSV, \
    REPORT_PATH, REPORT_PATH_IMAGE,DBFILE
import report

import reportconnectsql
from reportobject import *
import reportrrd
import os

import mimetypes
from calendar import monthrange

#import views

top_report = 15

def typeofreport(typetime):
    tprept = "" 
    
    if typetime == "days":
        tprept = "Daily"
    if typetime == "weeks":
        tprept = "Weekly"
    if typetime == "months":
        tprept = "Monthly"
    if typetime == "years":
        tprept = "Yearly"
    
    return tprept

def getstarttimefortop(typetime,endtime):
    
    if typetime == "days":
        return endtime
    
    if typetime == "weeks":
        starttime = endtime - timedelta(weeks=1)
        return starttime
    
    if typetime == "months":
        numberofdays = monthrange(endtime.year, endtime.month)[1]
        starttime = endtime - timedelta(days=numberofdays)
        return starttime
    
    if typetime == "years":
        starttime = endtime - timedelta(days=365)
        return starttime 
        
def change(typetime):
    tprept = "" 
    
    if typetime == "days":
        tprept = "days"
    if typetime == "weeks":
        tprept = "weeks"
    if typetime == "months":
        tprept = "_months"
    if typetime == "years":
        tprept = "_years"
    
    return tprept

# type : days ,weeks ,months ,years
def gettimeframe(type, starttime,endtime):
    s1 = starttime.strftime("%Y %B %d")
    s2 = endtime.strftime("%Y %B %d")
    
    if type == 'days':
        return s1
    
    return s1 + " - " +  s2  
    
def sendmail(typetimedbin):
    try:
        timescale = 'custom' 
        
        # typetime will be : days ,weeks,_months,_years
        typetimedb = typetimedbin;
        typetime = change(typetimedb)
        titlereport = typeofreport(typetimedb)
        
        endtimescale =datetime.datetime.now()
        
        # for case of sending mail , we will minus one day to make report.
         
        endtimescale = endtimescale - timedelta(days=1)
        
        starttimescale = getstarttimefortop(typetimedb, endtimescale)
        
        # timeframe : to show the time frame to user.
        # Ex From time to Time.  
        timeframe = gettimeframe(typetimedb, starttimescale, endtimescale)
        
        topicby = ""
        sortfield = "host"
        
        htmltopuser = ""
        htmltophost = ""
        htmltopmime = ""
        
        plaintexttopuser = ""
        plaintexttophost = ""
        plaintexttopmime = ""
         
        plaintext = ""
        
        lsttopic = ['topuser','tophost','topmime']   
        
        for topic in lsttopic :  
            makerpt = report.rpt()
            lst = makerpt.navigation_list(topic, topicby ,timescale,starttimescale,endtimescale , sortfield)
            #current page,pagesize,navigation.
            lengthcontent =  len(lst[0])
            
            if lengthcontent == 0:
                 lengthcontent = 1
            
            b = report.DevidePage(1,top_report,0,'host',topic)
            
            # Note report/rpttopuser_list.html will includes header and detail.
            # True , mean get header.
            # Parameters
            # True include header . False is not include
            # lst  inlcude data will be showed
            # True to decide this is sendmail.
            # Type of sum : 1 get sum only the current row. [For send mail case we just get]
            # Type of sume : 0 get sum all rows 
             
            dict = b.Pagination(True,lst,'report/rpttopuser_list.html',True,1)
            lstrow = []
            
            #make example of text here.
            
            if topic == "topuser": 
                plaintexttopuser = func_topuser_plaintext(lst[0],lst[1],1,top_report)
            if topic == "tophost":
                plaintexttophost = func_tophost_plaintext(lst[0],lst[1],1,top_report) 
            if topic == "topmime":
                plaintexttopmime = func_topmime_plaintext(lst[0],lst[1],1,top_report) 
                         
            #dictxt = b.Pagination(True,lst,'report/rpttopuser_list.txt')
            
            if dict.has_key('lstobject'):  
                if topic == "topuser": 
                    htmltopuser = htmltopuser + dict['lstobject']
                if topic == "tophost":
                    htmltophost = htmltophost + dict['lstobject']
                if topic == "topmime":
                    htmltopmime = htmltopmime + dict['lstobject'] 
                    
            ls_img = []
            ls_contentid = []
        
        htmlpic =""
        (resutl,htmlpic,ls_img,ls_contentid) = sendmail_hardware(typetime)
      
        # Get template mail.
        templatesend =  get_template('report/rpt_sendmail.html')
        c = Context({'httptraffic_htmltopuser' : htmltopuser,
                     'httptraffic_htmltophost': htmltophost,
                     'httptraffic_htmltopmime' : htmltopmime,
                     'graph' :htmlpic,
                     'titlehardware' : 'Hardware',
                     'titlehttptraffic' : 'HTTP Traffic',
                     'titletopuser':'Top 15 Users',
                     'titletophost' : 'Top 15 Sites',
                     'titlereport' : 'Report Proxynow5',
                     'titletopmime' : 'Top 15 Mime',
                     'timeframe' : timeframe ,
                     'typereport' : titlereport})
        
        mainhtml = templatesend.render(c)   
           
        # Call template for plain text.
        templateplaintext =  get_template('report/rpt_sendmail.txt')
        
        c1 = Context({'titiletopuser' : 'Top 15 Users',
                    'listuser' : plaintexttopuser,
                    'titletophost' : 'Top 15 Host',
                    'listhost' : plaintexttophost,
                    'titilemime' : 'Top 15 Mime',
                    'listmime' : plaintexttopmime,
                    'titlereport' : 'Report Proxynow5',
                    'timeframe' : timeframe , 
                    'typereport' : titlereport,
                    
                    })
        
        mainhtmlplain = templateplaintext.render(c1)
        
        emailutils.send_report(mainhtml , mainhtmlplain, ls_img, ls_contentid,typetimedb,titlereport) 
            
        return HttpResponse('success')
    
    except Exception,e:
        print "Error %s" %(e)
        return HttpResponse('Error %s' %str(e))

def sendmail_hardware(typetime):
    
    try :
        
        ispage = 'hardware'
        lsttypes = "cpu|cpu|hardware,ram|usedram|hardware,hd|swapusage*hdusage|hardware"
        #lsttypes = types.split(',')
        
        plaintext = "Pleas look at Rich text mode."
        ls_img = []
        ls_contentid = []
        
        s = reportrrd.generategraph(ispage,lsttypes,typetime)
        s1 = reportrrd.generategraph('netusage',lsttypes,typetime)
        
        # Add the path of picture
        for i in range(0,len(s)):
            path = s[i]
            (root,filepath) = os.path.split(path)
            fullpath = os.path.join(REPORT_PATH_IMAGE,filepath)
            ls_img.append(fullpath)
        
        for j in range(0,len(s1)): 
            path = s1[j]
            (root,filepath) = os.path.split(path)
            fullpath = os.path.join(REPORT_PATH_IMAGE,filepath)
            ls_img.append(fullpath)
            
        # Add the list content id 
        s.extend(s1)
        
        for i in range(0,len(s)):
            ls_contentid.append("myimage" + str(i)) 
        
        html = '<br/>'  
        for i in range(0,len(s)):
            tag = "<img src='cid:myimage%s' />" %str(i)
            html = html + '<p>' + tag + '</p>'
               
        #emailutils.send_report(html, plaintext, ls_img, ls_contentid)
        
        return (True,html,ls_img,ls_contentid)
        
    except Exception,e:
        print "Error %s" %str(e)
        return (False,"","","")
    
            
#sendmail_topuser("")
        