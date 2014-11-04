import sys
import os 
from settings import DIRNAME
path = os.path.join(DIRNAME,'proxynow5')
path = os.path.join(path,'utils.py')
print "Path to show %s" %(path)
sys.path.append(path)

from django.core.paginator import Paginator, InvalidPage
from django.template.context import RequestContext
from django.template import Context,Template
from django.template.loader import get_template
from datetime import timedelta
import datetime
import sqlite3
from proxynow5 import utils
from reportobject import *
#from reportconnectsql import *
import reportconnectsql
from calendar import monthrange


'''
    This class is supported show name of col and let system knows that this col is sorted or not. 
'''
class tableheader():
    def __init__(self,name,value):
        self.name = name #this name can be translate
        self.value = value # this is real col , if empty that mean this col not sort
        
sortcommand = {
               'topuser': {
                           'host' : 'ORDER BY KByte DESC',
                           'request_asc' :  'ORDER BY Request ASC',
                           'request_desc' :  'ORDER BY Request DESC',
                           'durationinsec_asc' : 'ORDER BY DurationInsec ASC',
                           'durationinsec_desc' : 'ORDER BY DurationInsec DESC',
                           'kbyte_asc' : 'ORDER BY KByte ASC',
                           'kbyte_desc' : 'ORDER BY KByte DESC',   
                           },
               
               
               'tophost': {
                           'host' : 'ORDER BY KByte DESC',
                           'request_asc' : 'ORDER BY request ASC',
                           'request_desc': 'ORDER BY request DESC',
                           'durationinsec_asc': 'ORDER BY DurationInsec ASC',
                           'durationinsec_desc' : 'ORDER BY DurationInsec DESC',  
                           'kbyte_asc' : 'ORDER BY KByte ASC',
                           'kbyte_desc' : 'ORDER BY KByte DESC',  
                           },
               
               
               'topusersbyhost': {
                                 'host' : 'ORDER BY kbyte DESC',
                                 'request_asc' : 'ORDER BY request ASC',
                                 'request_desc': 'ORDER BY request DESC',
                                 'durationinsec_asc': 'ORDER BY DurationInsec ASC',
                                 'durationinsec_desc' : 'ORDER BY DurationInsec DESC',  
                                 'kbyte_asc' : 'ORDER BY kbyte ASC',
                                 'kbyte_desc' : 'ORDER BY kbyte DESC',  
                                 },
               
               
               'tophostbyuser' : {
                                  'host' : 'ORDER BY KByte DESC',
                                  'request_asc' : 'ORDER BY request ASC',
                                  'request_desc': 'ORDER BY request DESC',
                                  'durationinsec_asc': 'ORDER BY DurationInsec ASC',
                                  'durationinsec_desc' : 'ORDER BY DurationInsec DESC',
                                  'kbyte_asc' : 'ORDER BY KByte ASC',
                                  'kbyte_desc' : 'ORDER BY KByte DESC',
                                  },
               
               'topuserbymime' : {
                                  'host' : 'ORDER BY KByte DESC',
                                  'request_asc' :  'ORDER BY Request ASC',
                                  'request_desc' :  'ORDER BY Request DESC',
                                  'durationinsec_asc' : 'ORDER BY DurationInsec ASC',
                                  'durationinsec_desc' : 'ORDER BY DurationInsec DESC',
                                  'kbyte_asc' : 'ORDER BY KByte ASC',
                                  'kbyte_desc' : 'ORDER BY KByte DESC',  
                                },
               
               'topmimebyuser' :{
                                  'host' : 'ORDER BY KByte DESC',
                                  'request_asc' :  'ORDER BY Request ASC',
                                  'request_desc' :  'ORDER BY Request DESC',
                                  'durationinsec_asc' : 'ORDER BY DurationInsec ASC',
                                  'durationinsec_desc' : 'ORDER BY DurationInsec DESC',
                                  'kbyte_asc' : 'ORDER BY KByte ASC',
                                  'kbyte_desc' : 'ORDER BY KByte DESC',  
                                },
               
               'topmime': {
                           'host' : 'ORDER BY KByte DESC',
                           'request_asc' : 'ORDER BY Request ASC',
                           'request_desc' :  'ORDER BY Request DESC',
                           'kbyte_asc' : 'ORDER BY KByte ASC',
                           'kbyte_desc' : 'ORDER BY KByte DESC',  
                           },
               
               "topdestinationbymime" : { 'host' : 'ORDER BY KByte DESC',
                                          'request_asc' :  'ORDER BY Request ASC',
                                          'request_desc' :  'ORDER BY Request DESC',
                                          'durationinsec_asc' : 'ORDER BY DurationInsec ASC',
                                          'durationinsec_desc' : 'ORDER BY DurationInsec DESC',
                                          'kbyte_asc' : 'ORDER BY KByte ASC',
                                          'kbyte_desc' : 'ORDER BY KByte DESC', 
                                            
                                         }

               }



headerdata = {
              'topuser' : [tableheader('Top',''),
                           tableheader('User',''),
                           tableheader('Request','request'),
                           tableheader('%',''),
                           tableheader('Duration','durationinsec'),
                           tableheader('%',''),
                           tableheader('Traffic','kbyte'),
                           tableheader('%','')],
              
              'tophost' : [tableheader('Top',''),
                           tableheader('Site',''),
                           tableheader('User',''),
                           tableheader('Request','request'),
                           tableheader('%',''),
                           tableheader('Duration','durationinsec'),
                           tableheader('%',''),
                           tableheader('Traffic','kbyte'),
                           tableheader('%','')],
              
              'topusersbyhost': [tableheader('Top',''),
                                tableheader('Users',''),
                                tableheader('Request','request'),
                                tableheader('%',''),
                                tableheader('Duration','durationinsec'),
                                tableheader('%',''),
                                tableheader('Traffic','kbyte'),
                                tableheader('%',''),
                                ],
              
              'tophostbyuser' : [tableheader('Top',''),
                                 tableheader('Site',''),
                                 tableheader('Request','request'),
                                 tableheader('%',''),
                                 tableheader('Duration','durationinsec'),
                                 tableheader('%',''),
                                 tableheader('Traffic','kbyte'),
                                 tableheader('%',''),
                                 ],
              
              "topuserbymime" :  [tableheader('Top',''),
                                  tableheader('User',''),
                                  tableheader('Request','request'),
                                  tableheader('%',''),
                                  tableheader('Duration','durationinsec'),
                                  tableheader('%',''),
                                  tableheader('Traffic','kbyte'),
                                  tableheader('%','')],
              
              "topmimebyuser" : [tableheader('Top',''),
                                 tableheader('Mime Type',''),
                                 tableheader('Request','request'),
                                 tableheader('%',''),
                                 tableheader('Duration','durationinsec'),
                                 tableheader('%',''),
                                 tableheader('Traffic','kbyte'),
                                 tableheader('%','')],
              
              "topmime" : [tableheader('Top',''),
                           tableheader('Mime Type',''),
                           tableheader('Request','request'),
                           tableheader('%',''),
                           tableheader('Traffic','kbyte'),
                           tableheader('%','')],
              
              "topdestinationbymime" : [tableheader('Top',''),
                                 tableheader('Destination',''),
                                 tableheader('Request','request'),
                                 tableheader('%',''),
                                 tableheader('Duration','durationinsec'),
                                 tableheader('%',''),
                                 tableheader('Traffic','kbyte'),
                                 tableheader('%','')],
              
              }


nametable = {
             'topuser' : ["select Host,Request,KByte,DurationInsec from (select Host,sum(Request) as 'Request',sum(KByte) as 'KByte',sum(DurationInsec) as 'DurationInsec' from ( select Host,Request,KByte,DurationInsec from Incoming_TCP_requests_by_host_Summary where date(InsertDate) between date('%s') and date('%s')  Union All select Host as 'Host',Request as 'Request',KByte as 'KByte',DurationInsec as 'DurationInsec' from realtime.Incoming_TCP_requests_by_host_Summary where date(InsertDate) between date('%s') and date('%s')) group by Host)  %s",
                                "select coalesce(Sum(sumrequest),0) as 'sumrequest',coalesce(Sum(sumkbyte),0) as 'sumkbyte',coalesce(Sum(sumdurationinsec),0) as 'sumdurationinsec' from ( select coalesce(Sum(Request),0) as 'sumrequest' ,coalesce(Sum(KByte),0) as 'sumkbyte' ,coalesce(Sum(DurationInsec),0) as 'sumdurationinsec'  from Incoming_TCP_requests_by_host_Summary where date(InsertDate) between date('%s') and date('%s')  Union All select coalesce(Sum(Request),0) as 'sumrequest' ,coalesce(Sum(KByte),0) as 'sumkbyte' ,coalesce(Sum(DurationInsec),0) as 'sumdurationinsec'  from realtime.Incoming_TCP_requests_by_host_Summary where date(InsertDate) between date('%s') and date('%s'))"],
             
              
             'tophost' :["select host,VisitedWebsites,request,kbyte,durationinsec from (select count(Host) as 'host',VisitedWebsites,Sum(request) as 'request',Sum(kbyte) as 'kbyte',Sum(durationinsec) as 'durationinsec' from  (select Host, VisitedWebsites,Sum(Request) as 'request',Sum(KByte) as 'kbyte',Sum(DurationInsec) as 'durationinsec' from (select Host,VisitedWebsites,Request,KByte,DurationInsec from Incoming_TCP_requests_by_host where  date(InsertDate) between date('%s') and date('%s')  Union All select Host,VisitedWebsites,Request,KByte,DurationInsec from realtime.Incoming_TCP_requests_by_host where date(InsertDate) between date('%s') and date('%s')) group by VisitedWebsites,Host ) group by VisitedWebsites ) %s",
                         " select coalesce(sum(Request),0) as 'summaxrequest',coalesce(sum(KByte),0) as 'summaxkbyte',coalesce(sum(DurationInsec),0) as 'summaxdurationinsec'  from ( select Request,KByte,DurationInsec from Incoming_TCP_requests_by_host where date(InsertDate) between date('%s') and date('%s') Union All select Request,KByte,DurationInsec from realtime.Incoming_TCP_requests_by_host where date(InsertDate) between date('%s') and date('%s') ) "],
             
                
             'topusersbyhost' :["select host,request,kbyte,durationinsec from (select host,sum(request) as 'request',sum(kbyte) as 'kbyte',sum(durationinsec) as 'durationinsec' from  (select host,request,kbyte,durationinsec from Incoming_TCP_requests_by_host where date(InsertDate) between date('%s') and ('%s') and VisitedWebsites = '%s' Union All select host,request,kbyte,durationinsec from realtime.Incoming_TCP_requests_by_host where date(InsertDate) between date('%s') and date('%s') and VisitedWebsites = '%s') group by host) %s" ,
                                "select coalesce(sum(request),0) as 'request',coalesce(sum(kbyte),0) as 'kbyte',coalesce(sum(durationinsec),0) as 'durationinsec' from (select request,kbyte,durationinsec from Incoming_TCP_requests_by_host where date(InsertDate) between date('%s') and date('%s') and VisitedWebsites = '%s' Union All select request,kbyte,durationinsec from realtime.Incoming_TCP_requests_by_host where date(InsertDate) between date('%s') and date('%s') and VisitedWebsites = '%s') "],
             
             
             'tophostbyuser' : ["select VisitedWebsites,request,kbyte,durationinsec from (select VisitedWebsites,sum(request) as 'request', sum(kbyte) as 'kbyte',sum(durationinsec) as 'durationinsec' from (select host,VisitedWebsites,request,kbyte,durationinsec from Incoming_TCP_requests_by_host where date(InsertDate) between date('%s') and date('%s') and Host = '%s' Union All select host,VisitedWebsites,request,kbyte,durationinsec from realtime.Incoming_TCP_requests_by_host where date(InsertDate) between date('%s') and date('%s') and Host = '%s') group by VisitedWebsites)  %s" ,
                                "select coalesce(Sum(request),0) as 'sumrequest',coalesce(Sum(kbyte),0) as 'sumkbyte',coalesce(Sum(durationinsec),0) as 'sumdurationinsec' from (select request,kbyte,durationinsec from Incoming_TCP_requests_by_host where date(InsertDate) between date('%s') and date('%s') and Host = '%s' Union All select request,kbyte,durationinsec from realtime.Incoming_TCP_requests_by_host where date(InsertDate) between date('%s') and date('%s') and Host = '%s')  "],
             
             
             'topuserbymime' : ["select host,request,kbyte,durationinsec from (select host,sum(request) as 'request',sum(kbyte) as 'kbyte',sum(durationinsec) as 'durationinsec' from  (select host,request,kbyte,durationinsec from Requested_content_type_by_host where date(InsertDate) between date('%s') and ('%s') and ContentType = '%s' Union All select host,request,kbyte,durationinsec from realtime.Requested_content_type_by_host where date(InsertDate) between date('%s') and date('%s') and ContentType = '%s') group by host) %s",
                                "select coalesce(sum(request),0) as 'request',coalesce(sum(kbyte),0) as 'kbyte',coalesce(sum(durationinsec),0) as 'durationinsec' from (select request,kbyte,durationinsec from Requested_content_type_by_host where date(InsertDate) between date('%s') and date('%s') and ContentType = '%s' Union All select request,kbyte,durationinsec from realtime.Requested_content_type_by_host where date(InsertDate) between date('%s') and date('%s') and ContentType = '%s') "],
             
             
             'topmimebyuser' : ["select ContentType,request,kbyte,durationinsec from (select ContentType,sum(request) as 'request',sum(kbyte) as 'kbyte',sum(durationinsec) as 'durationinsec' from  (select ContentType,request,kbyte,durationinsec from Requested_content_type_by_host where date(InsertDate) between date('%s') and ('%s') and host = '%s' Union All select ContentType,request,kbyte,durationinsec from realtime.Requested_content_type_by_host where date(InsertDate) between date('%s') and date('%s') and host = '%s') group by ContentType) %s",
                                "select coalesce(sum(request),0) as 'request',coalesce(sum(kbyte),0) as 'kbyte',coalesce(sum(durationinsec),0) as 'durationinsec' from (select request,kbyte,durationinsec from Requested_content_type_by_host where date(InsertDate) between date('%s') and date('%s') and host = '%s' Union All select request,kbyte,durationinsec from realtime.Requested_content_type_by_host where date(InsertDate) between date('%s') and date('%s') and host = '%s') "],
             
             'topmime' : ["select ContentType,Request,KByte from (select ContentType,sum(Request) as 'Request',sum(KByte) as 'KByte' from ( select ContentType,Request,KByte from Requested_content_type where date(InsertDate) between date('%s') and date('%s')  Union All select ContentType as 'ContentType',Request as 'Request',KByte as 'KByte' from realtime.Requested_content_type where date(InsertDate) between date('%s') and date('%s')) group by ContentType)  %s",
                          "select coalesce(Sum(sumrequest),0) as 'sumrequest',coalesce(Sum(sumkbyte),0) as 'sumkbyte' from ( select coalesce(Sum(Request),0) as 'sumrequest' ,coalesce(Sum(KByte),0) as 'sumkbyte' from Requested_content_type where date(InsertDate) between date('%s') and date('%s')  Union All select coalesce(Sum(Request),0) as 'sumrequest' ,coalesce(Sum(KByte),0) as 'sumkbyte' from realtime.Requested_content_type where date(InsertDate) between date('%s') and date('%s'))"],
             
             'topdestinationbymime' : ["select Destination,request,kbyte,durationinsec from (select Destination,sum(request) as 'request',sum(kbyte) as 'kbyte',sum(durationinsec) as 'durationinsec' from  (select Destination,request,kbyte,durationinsec from Request_destinations_by_MIME where date(InsertDate) between date('%s') and ('%s') and ContentType = '%s' Union All select Destination,request,kbyte,durationinsec from realtime.Request_destinations_by_MIME where date(InsertDate) between date('%s') and date('%s') and ContentType = '%s') group by Destination) %s ",
                                       "select coalesce(sum(request),0) as 'request',coalesce(sum(kbyte),0) as 'kbyte',coalesce(sum(durationinsec),0) as 'durationinsec' from (select request,kbyte,durationinsec from Request_destinations_by_MIME where date(InsertDate) between date('%s') and date('%s') and ContentType = '%s' Union All select request,kbyte,durationinsec from realtime.Request_destinations_by_MIME where date(InsertDate) between date('%s') and date('%s') and ContentType = '%s') "], 
                            
            }

funcobj ={
          'topuser' : 'func_topuser',
          'tophost' : 'func_tophost',
          'topusersbyhost' : 'func_topuserbyhost',
          'tophostbyuser' : 'func_tophostbyuser',
          'topuserbymime' : 'func_topuserbymime',
          'topmimebyuser' : 'func_topmimebyuser',
          'topmime' : 'func_topmime',
          'topdestinationbymime' : 'func_topdestinationbymime',
          }


dicttemplate = {
        'topuser' : "report/rpttopuser_list_detail.html",
        'tophost' : "report/rpttophost_list_detail.html",
        'topusersbyhost': "report/rpttopuserbyhost_list_detail.html",
        'tophostbyuser' : "report/rpttophostbyuser_list_detail.html",  
        'topuserbymime' : "report/rpttopuserbymime_list_detail.html", 
        'topmimebyuser' : "report/rpttopmimebyuser_list_detail.html",
        'topmime' : "report/rpttopmime_list_detail.html",
        'topdestinationbymime' : "report/rpttopdestinationbymime_list_detail.html",
        }

lst_none_filter = ['topuser','tophost','topmime']
lst_filter = ['topusersbyhost','tophostbyuser','topuserbymime','topmimebyuser','topdestinationbymime']  

# This method is called when 
# user click update button or navigation ,export pdf .......v.v.v.v
# Note :
# Today just getting date of today.
# yesterday , lastsevendays , lastthirtydays don't get the date of today.
def get_starttime_endtime(timescale ,todaydate,starttime,endtime ):
     
    try :
        
        if timescale == "today":
                startsearch = todaydate
                endsearch = todaydate
               
        elif timescale == "yesterday":
            startsearch = todaydate - timedelta(days=1) 
            endsearch = startsearch
           
        elif timescale == "lastsevendays":
            endsearch = todaydate - timedelta(days=1)
            startsearch = endsearch - timedelta(weeks=1)
            
        elif timescale == "lastthirtydays":
            endsearch = todaydate - timedelta(days=1)
            startsearch = endsearch - timedelta(days=30)
            
        elif timescale == "custom":
            lststarttime = []
            lstendtime = []
            
            lststarttime = starttime.split('-')
            lstendtime = endtime.split('-')
            
            startsearch = datetime.date(int(lststarttime[0]),int(lststarttime[1]),int(lststarttime[2]))
            endsearch = datetime.date(int(lstendtime[0]),int(lstendtime[1]),int(lstendtime[2])) 
            
        else:
           
            timescale = str(timescale)
            print timescale
             
            timeframe = []
            timeframe = timescale.split('-')
            
            #This method to get the number of days in a month (28 days or 29 or 30 or 31.)
         
            year = int(timeframe[1])
            month = int(timeframe[0])
            
            numberofdays = 30
            numberofdays = monthrange(year,  month)[1]
            
            #startsearch =  "1" +"-" + timescale
            #endsearch = str(numberofdays) + "-" + timescale 
            
            startsearch = datetime.date(year,month,01)
            endsearch = datetime.date(year,month,numberofdays)
            
        return (startsearch,endsearch)
    
    except Exception,e:
        # w
        startsearch = datetime.date(1900,01,01)
        endsearch = datetime.date(1900,01,01)
        print "Exception %s" %str(e)
        return (startsearch,endsearch)
        

class DevidePage():
    
    '''
    Note :
    kind var will include 3 type
    if is -1 : previous
    if is  0 : keep
    if is  1 : next '''
    def __init__(self,currentpagein,pagesizein,statusin,sortfield,topic):
        self.currentpage = int(currentpagein)
        self.pagesize = int(pagesizein)
        self.status = int(statusin)
        self.sort = sortfield
        self.topic = topic
    
    '''
        This method will return the dictionary to client
        Dictionary will includes some basic information
        lstobject : The list data is searched, or sort or navigation.
        hasprev : previous button(navigation) is enabled or not.
        hasnext : next button(navigation) is enabled or not.
        item_msg : text of navigation Ex : 1 of 1 in .....
        lsheader : the header of data. 
        typeofinfo : to make decision which template will be used. EX template ..topuser.html or ..tophost.html 
        error    : When system got error that cause system can't work.
    '''    
    def Pagination(self,isheader,objlist,pathtemplate,issendmail = None,typeofsum = 0):
        
        if self.status == -1 :
            self.currentpage = self.currentpage -1
        if self.status == 1 :
            self.currentpage = self.currentpage +1
        if self.status == 0 :
            self.currentpage = self.currentpage + 0;
            print "Report cache current page " + str(self.currentpage) 
            
        paginator = Paginator(objlist[0], self.pagesize)
        
        try:
            total = len(objlist[0])
            
            if total < self.pagesize or self.pagesize < 1:
                self.pagesize = total 
            
            item_msg = utils.get_item_msg(total, self.pagesize, self.currentpage)
            page = paginator.page(self.currentpage)
            
            showedobjlist = page.object_list
            
            i = self.pagesize * (self.currentpage -1) + 1
            lstrow = []
            
            #this part will applied for object user.
            '''
                todo check header eixisted or not.
            '''
          
            if funcobj.has_key(self.topic):
                s = funcobj[self.topic]
                funcProfile = globals()[s]
                
                # showedobjlist : list data that got from sqlite
                # objlist[1] : list sum fromsqlite 
                # i count number.
                lstrow = funcProfile(showedobjlist,objlist[1],i,issendmail,typeofsum)
            
            hasprev = page.has_previous()
            hasnext = page.has_next()
            
            '''
                Check header
                Todo check header existed or not.
            '''
            if headerdata.has_key(self.topic):
                header = headerdata[self.topic]
                
            # This is for sending mail or not.
            sendmail = 1
            if issendmail == None :
                sendmail = 0
                print "None for sending mail"
            
            #temp i hard code typeofinfo.
            dict = {}
            
            if pathtemplate == None:
                dict = {'lstobject': lstrow , 
                        'hasprev' : hasprev , 
                        'hasnext' : hasnext ,
                        'item_msg': item_msg,
                        'currentpage' : self.currentpage,
                        'lsheader' : header,
                        'sortfield' : self.sort, 
                        'typeofinfo' : self.topic 
                        }
               
            else:
                template =  get_template(pathtemplate)
                
                #lstobject that is list object will be past to template .
                if isheader == True:
                    c = Context({'lstobject' : lstrow,'lsheader': header,'typeofinfo': self.topic,'sendmail':sendmail }) 
                else:
                    c = Context({'lstobject' : lstrow,'sendmail':sendmail}) 
                    
                lstobject = template.render(c)
                
                # Note lstobject : is not list , that is string html will be add from client.
                dict = {
                        'lstobject' : lstobject,
                        'hasprev' : hasprev , 
                        'hasnext' : hasnext ,
                        'item_msg': item_msg,
                        'currentpage' : self.currentpage,
                        'sortfield' :self.sort,
                    }
                     
            return dict 
        except Exception,e:
            #todo return error here
            dict = {
                    'error' : e,
                    }
            
            print "Error At method Pagination of class DevidePage : %s" %e
            return dict
        

class rpt():
    
    
    def __init__(self):
        self.sqlsum =''
        
    ''' convention of getting sqlcommand
        topic : top_user , top_host .....
        timescale : today , yesterday .......
        sort: 
        
        Type of searching time. (timescale)
        today : the current day (default)
        yesterday : 
        lastsevendays : last 7 days compare with current days
        lastthirtydays : last 30 days compare with current days
        custom : give user right to select time starttime and endtime
        others... format is months\years . if user select this option , i will the name to inmonthyear other keep 
    '''
    def get_sqlcommand(self,topic,timescale):
        
        if timescale in ['today','yesterday','lastsevendays','lastthirtydays','custom']:
            return topic + '_' +  timescale 
        else:
            return topic + '_' + 'inmonthyear' 
    
    def get_sortcommand(self,topic,sort):
        
        if sortcommand.has_key(topic):
            dicsort = {} 
            dicsort = sortcommand[topic]
            
            if dicsort.has_key(sort):
                return dicsort[sort]
        return "" 
    
    '''
     Get the sql command and return the list
    '''
    def navigation_list(self,topic,topicby,timescale,starttime,endtime,sort):
        
        keytable = self.get_sqlcommand(topic,timescale)
        
        # topic is topuser , tophost , topuserbyhost , tophostbyuser
        # sort is Kbyte asc ..... 
        sortcommand = self.get_sortcommand(topic, sort)   
     
        '''
            todo : catch the case not existed here.
        '''
        if nametable.has_key(topic):
            sqlcommand = nametable[topic][0]
            sqlsumcommand = nametable[topic][1]
            print "Existed defined command (Navigation) "
        else:
            '''
                Todo: catch this case
            '''
            print "Not Existed defined command (Navigation) "
            
       
        todaydate = datetime.date.today()
           
        (startsearch,endsearch) = get_starttime_endtime(timescale, todaydate, starttime, endtime) 
        
#        if timescale == "today":
#            startsearch = todaydate
#            endsearch = todaydate
#           
#        elif timescale == "yesterday":
#            startsearch = todaydate - timedelta(days=1) 
#            endsearch = todaydate
#           
#        elif timescale == "lastsevendays":
#            startsearch = todaydate - timedelta(weeks=1)
#            endsearch = todaydate
#                
#        elif timescale == "lastthirtydays":
#            startsearch = todaydate - timedelta(days=30)
#            endsearch = todaydate
#            
#        elif timescale == "custom":
#            startsearch = starttime
#            endsearch = endtime
#            
#        else:
#            timeframe = []
#            timeframe = timescale.split('-')
#            numberofdays = monthrange(int(timeframe[1]), int(timeframe[0]))[1]
#            startsearch = "1" +"-" + timescale
#            endsearch = str(numberofdays) + "-" + timescale
            
        if topic in lst_none_filter:    
            sqlcommand = sqlcommand %(str(startsearch),str(endsearch),str(startsearch),str(endsearch),str(sortcommand))
            self.sqlsum = sqlsumcommand %(str(startsearch),str(endsearch),str(startsearch),str(endsearch))
        elif  topic in lst_filter:
            sqlcommand = sqlcommand %(str(startsearch),str(endsearch),str(topicby),str(startsearch),str(endsearch),str(topicby),str(sortcommand))
            self.sqlsum = sqlsumcommand %(str(startsearch),str(endsearch),str(topicby),str(startsearch),str(endsearch),str(topicby))
                      
        prodata = reportconnectsql.ProcessData()
        prodata.connectsqlite()
        prodata.attachotherdb()
        
        fetall = prodata.getdatasqlite(sqlcommand)
        
        i = 1
        lstrow = []
        
        fetsum  = prodata.getdatasqlite(self.sqlsum)
        
        prodata.closeconnection()
        
        #for (Host,Request,KByte,DurationInsec,date) in fetall:
        #    rowdata = rptTopUser(str(i), str(Host), str('1'),'0', str(Request), '0', str(DurationInsec), '0', str(KByte), '0',date)
        #    i = i + 1
        #    lstrow.append(rowdata) 
          
        #return lstrow
        return  (fetall,fetsum)
        
    '''
        This method applied when first load.
    '''
    def TopUser(self):
        
        '''
            Default
        '''
        
        sqlcommand = nametable['topuser'][0]
        sqlsumcommand = nametable['topuser'][1]
        
        t = datetime.date.today()
        sqlsum = sqlsumcommand %('now','now','now','now')
        
        sqlcommand = sqlcommand %('now','now','now','now',' ORDER BY KByte DESC')
        
        #sqlcommand = sqlcommand % ("%Y-%m", "2011-10")
        
        prodata = reportconnectsql.ProcessData()
        prodata.connectsqlite()
        prodata.attachotherdb()
        
        #print "SQL Command %s" %sqlcommand
        #print "Sum User command %s" %(sqlsum)
        
        fetall = prodata.getdatasqlite(sqlcommand)
        i = 1
        lstrow = []
        
        fetsum = prodata.getdatasqlite(sqlsum)
        
        prodata.closeconnection()
         
        return (fetall, fetsum)
        

   

        