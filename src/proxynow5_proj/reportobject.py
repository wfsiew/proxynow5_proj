from django.core.paginator import Paginator, InvalidPage
from django.template.context import RequestContext
from django.template import Context,Template
from django.template.loader import get_template
from datetime import timedelta
import datetime
from settings import DIRNAME
from proxynow5 import utils

'''
    This class will show information of User
'''
class rptTopUser():
    
    def __init__(self,UserNbrIn,UsersIn,RequestIn,RequestPercentIn,DurationIn,DurationPercentIn,TrafficIn,TrafficPercentIn):
        
        '''
        Number of User ordering
        Ex : 1,2,3,4,5,6,7,8.............
        '''
        self.usernbr = UserNbrIn
        
        '''
        User of access 
        Ex : 10.8.0.128
        '''
        self.users = UsersIn
        
        
        '''
        Request 
        '''
        self.request = RequestIn
        
        '''
        Request In Percentage.
        '''
        self.requestpercentage = RequestPercentIn
        
        ''' 
        Duration of user acccess
        '''
        self.duration = DurationIn
        
        '''
        Duration of percent.
        '''
        self.durationpercentage = DurationPercentIn
        
        '''
        Duration of trafffic.
        '''
        self.traffic = TrafficIn
        
        '''
        Duration of trafic percent
        '''
        self.trafficpercentage = TrafficPercentIn     
        
        

class rptTopHost():
    
    def __init__(self,tophostin,hostin,visitedwebsites,requestin,requestpercentagein,durationin,durationpercentagein,trafficin,trafficpercentagein):
        
        self.tophost = tophostin  
        self.host = hostin 
        
        self.visitedwebsite = visitedwebsites
        
        self.request = requestin
        self.requestpercentage = requestpercentagein 
        
        self.duration = durationin
        self.durationpercentage = durationpercentagein 
        
        self.traffic = trafficin
        self.trafficpercentage = trafficpercentagein  
        
class rptTopUserByHost():
    
    def __init__(self,topin,usersin,requestin,requestpercentagein,durationin,durationpercentagein,trafficin,trafficpercentagein): 
        
        self.top = topin
        
        self.user = usersin
        
        self.request = requestin
        self.requestpercentage = requestpercentagein
        
        self.duration = durationin
        self.durationpercentage = durationpercentagein
        
        self.traffic = trafficin
        self.trafficpercentage = trafficpercentagein
 
class rptTopHostByUser():
    
    def __init__(self,topin,hostin,requestin,requestpercentagein,durationin,durationpercentagein,trafficin,trafficpercentagein): 
        self.top = topin
        
        self.host = hostin
        
        self.request = requestin
        self.requestpercentage = requestpercentagein
        
        self.duration = durationin
        self.durationpercentage = durationpercentagein
        
        self.traffic = trafficin
        self.trafficpercentage = trafficpercentagein
        
class rptTopuserByMime():
    
    def __init__(self,topin,hostin,requestin,requestpercentagein,durationin,durationpercentagein,trafficin,trafficpercentagein):
        self.top = topin
        
        self.host = hostin
        
        self.request = requestin
        self.requestpercentage = requestpercentagein
        
        self.duration = durationin
        self.durationpercentage = durationpercentagein
        
        self.traffic = trafficin
        self.trafficpercentage = trafficpercentagein
        
class rptTopMimeByUser():
    
    def __init__(self,tophostin,contenttypein,requestin,requestpercentagein,durationin,durationpercentagein,trafficin,trafficpercentagein):
        
        self.tophost = tophostin  
        self.contenttype = contenttypein
        
        self.request = requestin
        self.requestpercentage = requestpercentagein 
        
        self.duration = durationin
        self.durationpercentage = durationpercentagein 
        
        self.traffic = trafficin
        self.trafficpercentage = trafficpercentagein  
        
class rptTopMime():
    
    def __init__(self,topin,contenttypein,requestin,requestpercentin,trafficin,trafficpercentin):
        self.top = topin
        self.contentype = contenttypein
        self.request = requestin
        self.requestpercentage = requestpercentin
        self.traffic = trafficin
        self.trafficpercentage =  trafficpercentin 

class rptTopDestinationbyMime():
    
    def __init__(self,topin,destinationin,requestin,requestpercentagein,durationin,durationpercentagein,trafficin,trafficpercentagein): 
        self.top = topin
        self.destination = destinationin
        self.request = requestin
        self.requestpercentage = requestpercentagein
        self.duration = durationin
        self.durationpercentage = durationpercentagein
        self.traffic = trafficin
        self.trafficpercentage = trafficpercentagein
        
        
def changetotime(second):
    
    hour = int(float(second) / 3600)

    remin = float(second) % 3600
    
    min = int(remin / 60)
    
    sec = int(remin % 60)
    s = '%0*d' % (2, hour) + ":" + '%0*d' % (2, min) + ":" + '%0*d' % (2, sec)
    
    return s


#Unit of capacity KB 
def changetoMB_GB(capacity):
    
    GB = 1024 *1024
    MB = 1024
    sizeout = '%.2f KB' %capacity
    
    if capacity >= GB:
        sizeusage = capacity / GB
        
        sizeout = '%.2f GB' % sizeusage
        
    if (capacity>= MB and capacity<GB):
        sizeusage = capacity / MB
        
        sizeout = '%.2f MB' % sizeusage
    
    return sizeout
    
def changeformattext(frmtext):
    
    stripfrmtext = frmtext;
    
    stripfrmtext = stripfrmtext.strip() 
    
    if stripfrmtext == '<error>':
        return 'error'
    
    if stripfrmtext == '<secure>':
        return 'secure'
    
    if stripfrmtext == '<unknown>':
        return 'unknown'
    
    return stripfrmtext
    
    
def calpercentage(request,sumrequest,kbyte,sumkbyte,durationinsec,sumdurationinsec):
    
    requestpercent = "0"
    durationpercent = "0"
    trafficpercent = "0"
    
    durationinsec = int(durationinsec)
    request = int(request)
    
    if sumrequest != 0: 
        requestpercent = "%.2f" % round(float(request) * 100 / sumrequest,2)
        
    if sumdurationinsec != 0:      
        durationpercent = "%.2f" % round(float(durationinsec *100)/ sumdurationinsec,2)
        
    if sumkbyte != 0:     
        trafficpercent = "%.2f" % round(float(kbyte) * 100/ sumkbyte,2)
    
    return (requestpercent,durationpercent,trafficpercent)    

#
# typeofsum :1 get current row only.
def func_topuser(objlist,objsum,countnbr,is_pdf_csv=None,typeofsum=0):
    
    try :
        lstrow = []
        
        (sumrequest,sumkbyte,sumdurationinsec) = objsum[0]
        
        sumrequest = float(sumrequest)
        sumkbyte = float(sumkbyte)
        sumdurationinsec = float(sumdurationinsec) 
        
        crtrequest = 0
        crtduration = 0
        crtkbyte = 0
         
        for j in range (0,len(objlist)):
            # (Host,Request,KByte,DurationInsec,date)
           
            (Host,Request,KByte,DurationInsec) = objlist[j]
            
            crtrequest =  crtrequest + Request
            crtduration = crtduration + DurationInsec
            crtkbyte = crtkbyte + KByte 
            
            (requestpercent,durationpercent,trafficpercent)  = calpercentage(Request,sumrequest,KByte,sumkbyte,DurationInsec,sumdurationinsec)
            
            tt = changetotime(DurationInsec)   
            sizeusage = changetoMB_GB(KByte)
            namehost = changeformattext(Host)
            
            rowdata = rptTopUser(str(countnbr), str(namehost),str(Request), requestpercent, tt, durationpercent, str(sizeusage), trafficpercent)
            countnbr = countnbr + 1 
            lstrow.append(rowdata) 
        

        # Add summary here 
        if (is_pdf_csv == None):
            timesummary = changetotime(sumdurationinsec)  
            sizeusagesummary = changetoMB_GB(sumkbyte)
            rowdata = rptTopUser("-","Total",sumrequest,"-",timesummary,"-",sizeusagesummary,"-")
            lstrow.append(rowdata)
        
        if typeofsum == 1 :
            crttimesummary = changetotime(crtduration)  
            crtsizeusagesummary = changetoMB_GB(crtkbyte)
            rowdata1 = rptTopUser("-","Total",crtrequest,"-",crttimesummary,"-",crtsizeusagesummary,"-")
            lstrow.append(rowdata1)
            
        return lstrow   
    except Exception,e:
        print "Error at func_topuser %s" %str(e)
        return []         

def func_tophost(objlist,objsum,countnbr,is_pdf_csv=None,typeofsum=0):
    try:
        
        lstrow = []
        (sumrequest,sumkbyte,sumdurationinsec) = objsum[0]
        
        sumrequest = float(sumrequest)
        sumkbyte = float(sumkbyte)
        sumdurationinsec = float(sumdurationinsec) 
    
        crtrequest = 0
        crtduration = 0
        crtkbyte = 0 
        
        for j in range (0,len(objlist)):
            (host,VisitedWebsites,request,kbyte,durationinsec) = objlist[j]
            
            crtrequest =  crtrequest + request
            crtduration = crtduration + durationinsec
            crtkbyte = crtkbyte + kbyte
            
            (requestpercent,durationpercent,trafficpercent)  = calpercentage(request,sumrequest,kbyte,sumkbyte,durationinsec,sumdurationinsec)
            
            tt = changetotime(durationinsec)
            sizeusage = changetoMB_GB(kbyte)
            namevisit = changeformattext(VisitedWebsites)
            
            rowdata = rptTopHost(str(countnbr),str(host),namevisit ,str(request), str(requestpercent), tt, str(durationpercent), str(sizeusage),str(trafficpercent)) 
            countnbr = countnbr + 1
            lstrow.append(rowdata) 
            
        # Add summary here 
        if (is_pdf_csv == None):
            timesummary = changetotime(sumdurationinsec)  
            sizeusagesummary = changetoMB_GB(sumkbyte)
            rowdata = rptTopHost("-","-","Total",sumrequest,"-",timesummary,"-",sizeusagesummary,"-")
        
            lstrow.append(rowdata)
        
        if typeofsum == 1:
            crttimesummary = changetotime(crtduration)  
            crtsizeusagesummary = changetoMB_GB(crtkbyte)
            rowdata = rptTopHost("-","-","Total",crtrequest,"-",crttimesummary,"-",crtsizeusagesummary,"-")
            
            lstrow.append(rowdata)
            
        return lstrow 
    except Exception,e:
        print "Error at func_tophost %s" %str(e)
        return []
    
def func_topuserbyhost(objlist,objsum,countnbr,is_pdf_csv=None,typeofsum=0):  
    try:
        lstrow = []
        (sumrequest,sumkbyte,sumdurationinsec) = objsum[0]
        
        sumrequest = float(sumrequest)
        sumkbyte = float(sumkbyte)
        sumdurationinsec = float(sumdurationinsec) 
              
        for j in range (0,len(objlist)):
            (host,request,kbyte,durationinsec) = objlist[j]
            
            (requestpercent,durationpercent,trafficpercent)  = calpercentage(request,sumrequest,kbyte,sumkbyte,durationinsec,sumdurationinsec)
                
            tt = changetotime(durationinsec)
            sizeusage = changetoMB_GB(kbyte)
            namehost = changeformattext(host)
        
            rowdata = rptTopUserByHost(str(countnbr),str(namehost),str(request),requestpercent,str(tt), durationpercent, str(sizeusage), trafficpercent)
            countnbr = countnbr + 1 
            lstrow.append(rowdata) 
        
        # Add summary here 
        if (is_pdf_csv == None):
            timesummary = changetotime(sumdurationinsec)  
            sizeusagesummary = changetoMB_GB(sumkbyte)
            rowdata = rptTopUserByHost("-","Total",sumrequest,"-",timesummary,"-",sizeusagesummary,"-")
        
            lstrow.append(rowdata)
        
        return lstrow
    except Exception,e:
        print "Error at func_topuserbyhost %s" %str(e)
        return []

def func_tophostbyuser(objlist,objsum,countnbr,is_pdf_csv=None,typeofsum=0):
    try:
        lstrow = []
        (sumrequest,sumkbyte,sumdurationinsec) = objsum[0]
    
        for j in range (0,len(objlist)):
            (VisitedWebsites,request,kbyte,durationinsec) = objlist[j]
            
            (requestpercent,durationpercent,trafficpercent)  = calpercentage(request,sumrequest,kbyte,sumkbyte,durationinsec,sumdurationinsec)
            
            tt = changetotime(durationinsec)
            sizeusage = changetoMB_GB(kbyte)
            namevistedweb = changeformattext(VisitedWebsites)
        
            rowdata = rptTopHostByUser(str(countnbr),namevistedweb,request,requestpercent,str(tt), durationpercent, str(sizeusage), trafficpercent)
            countnbr = countnbr + 1 
            lstrow.append(rowdata)
            
        # Add summary here 
        if (is_pdf_csv == None):
            timesummary = changetotime(sumdurationinsec)  
            sizeusagesummary = changetoMB_GB(sumkbyte)
            rowdata = rptTopHostByUser("-","Total",sumrequest,"-",timesummary,"-",sizeusagesummary,"-")
        
            lstrow.append(rowdata)
        
        return lstrow 
    except Exception,e:
        print "Error at func_tophostbyuser %s" %str(e)
        return []

def func_topuserbymime(objlist,objsum,countnbr,is_pdf_csv=None,typeofsum=0):
    try:
        lstrow = []
        (sumrequest,sumkbyte,sumdurationinsec) = objsum[0]
        
        sumrequest = float(sumrequest)
        sumkbyte = float(sumkbyte)
        sumdurationinsec = float(sumdurationinsec) 
              
        for j in range (0,len(objlist)):
            (host,request,kbyte,durationinsec) = objlist[j]
            
            (requestpercent,durationpercent,trafficpercent)  = calpercentage(request,sumrequest,kbyte,sumkbyte,durationinsec,sumdurationinsec)
                
            tt = changetotime(durationinsec)
            sizeusage = changetoMB_GB(kbyte)
            namehost = changeformattext(host)
            
            rowdata = rptTopuserByMime(str(countnbr),str(namehost),str(request),requestpercent,str(tt), durationpercent, str(sizeusage), trafficpercent)
            countnbr = countnbr + 1 
            lstrow.append(rowdata) 
        
        # Add summary here 
        if (is_pdf_csv == None):
            timesummary = changetotime(sumdurationinsec)  
            sizeusagesummary = changetoMB_GB(sumkbyte)
            rowdata = rptTopuserByMime("-","Total",sumrequest,"-",timesummary,"-",sizeusagesummary,"-")
        
            lstrow.append(rowdata)
        
        return lstrow
    except Exception,e:
        print "Error at func_topuserbymime %s" %str(e)
        return []
    
def func_topmimebyuser(objlist,objsum,countnbr,is_pdf_csv=None,typeofsum=0):
    
    try:
        lstrow = []
        (sumrequest,sumkbyte,sumdurationinsec) = objsum[0]
        
        sumrequest = float(sumrequest)
        sumkbyte = float(sumkbyte)
        sumdurationinsec = float(sumdurationinsec) 
              
        for j in range (0,len(objlist)):
            (ContentType,request,kbyte,durationinsec) = objlist[j]
            
            (requestpercent,durationpercent,trafficpercent)  = calpercentage(request,sumrequest,kbyte,sumkbyte,durationinsec,sumdurationinsec)
                
            tt = changetotime(durationinsec)
            sizeusage = changetoMB_GB(kbyte)
            namecontenttype = changeformattext(ContentType)
        
            rowdata = rptTopMimeByUser(str(countnbr),str(namecontenttype),str(request),requestpercent,str(tt), durationpercent, str(sizeusage), trafficpercent)
            countnbr = countnbr + 1 
            lstrow.append(rowdata) 
        
        # Add summary here 
        if (is_pdf_csv == None):
            timesummary = changetotime(sumdurationinsec)  
            sizeusagesummary = changetoMB_GB(sumkbyte)
            rowdata = rptTopMimeByUser("-","Total",sumrequest,"-",timesummary,"-",sizeusagesummary,"-")
        
            lstrow.append(rowdata)
        
        return lstrow
    
    except Exception,e:
        print "Error at func_topuserbymime %s" %str(e)
        return []
    

def func_topmime(objlist,objsum,countnbr,is_pdf_csv=None,typeofsum=0):
    
    try:
        lstrow = []
        # Top mime has no field duration
        (sumrequest,sumkbyte) = objsum[0]
        
        sumrequest = float(sumrequest)
        sumkbyte = float(sumkbyte)
        
        crtrequest = 0
        crtkbyte = 0 
        
        #sumdurationinsec = float(sumdurationinsec) 
              
        for j in range (0,len(objlist)):
            (ContentType,request,kbyte) = objlist[j]
            
            crtrequest =  crtrequest + request
            crtkbyte = crtkbyte + kbyte
            
            # Note for Top mime we don't use duration: 
            (requestpercent,durationpercent,trafficpercent)  = calpercentage(request,sumrequest,kbyte,sumkbyte,0,0)
            durationpercent = 0     
            #tt = changetotime(durationinsec)
            sizeusage = changetoMB_GB(kbyte)
            namecontenttype = changeformattext(ContentType)
        
            rowdata = rptTopMime(str(countnbr),str(namecontenttype),str(request),requestpercent, str(sizeusage), trafficpercent)
            countnbr = countnbr + 1 
            lstrow.append(rowdata) 
        
        # Add summary here 
        if (is_pdf_csv == None):
            #timesummary = changetotime(sumdurationinsec)  
            sizeusagesummary = changetoMB_GB(sumkbyte)
            rowdata = rptTopMime("-","Total",sumrequest,"-",sizeusagesummary,"-")
        
            lstrow.append(rowdata)
        
        if typeofsum == 1: 
            crtsizeusagesummary = changetoMB_GB(crtkbyte)
            rowdata1 = rptTopMime("-","Total",crtrequest,"-",crtsizeusagesummary,"-")
            lstrow.append(rowdata1)
            
        return lstrow
    
    except Exception,e:
        print "Error at func_topmime %s" %str(e)
        return []
    

def func_topdestinationbymime(objlist,objsum,countnbr,is_pdf_csv=None,typeofsum=0):
    
    try:
        lstrow = []
        (sumrequest,sumkbyte,sumdurationinsec) = objsum[0]
        
        sumrequest = float(sumrequest)
        sumkbyte = float(sumkbyte)
        sumdurationinsec = float(sumdurationinsec) 
              
        for j in range (0,len(objlist)):
            (destinationin,request,kbyte,durationinsec) = objlist[j]
            
            (requestpercent,durationpercent,trafficpercent)  = calpercentage(request,sumrequest,kbyte,sumkbyte,durationinsec,sumdurationinsec)
                
            tt = changetotime(durationinsec)
            sizeusage = changetoMB_GB(kbyte)
            namedest = changeformattext(destinationin)
            
            rowdata = rptTopDestinationbyMime(str(countnbr),str(namedest),str(request),requestpercent,str(tt), durationpercent, str(sizeusage), trafficpercent)
            countnbr = countnbr + 1 
            lstrow.append(rowdata) 
        
        # Add summary here 
        if (is_pdf_csv == None):
            timesummary = changetotime(sumdurationinsec)  
            sizeusagesummary = changetoMB_GB(sumkbyte)
            rowdata = rptTopDestinationbyMime("-","Total",sumrequest,"-",timesummary,"-",sizeusagesummary,"-")
        
            lstrow.append(rowdata)
        
        return lstrow
    
    except Exception,e:
        print "Error at func_topdestinationbymime %s" %str(e)
        return []
    
        
'''
Generate plaintext.
'''    
def func_topuser_plaintext(objlist,objsum,countnbr,topreport):
    
    try :
        s = ""
        (sumrequest,sumkbyte,sumdurationinsec) = objsum[0]
        
        sumrequest = float(sumrequest)
        sumkbyte = float(sumkbyte)
        sumdurationinsec = float(sumdurationinsec) 
        
        lstline = [] 
        
        # span field will store the default value     
        spanfield = {}
        spanfield["0"] = 4
        spanfield["1"] = 5
        spanfield["2"] = 8
        spanfield["3"] = 2
        spanfield["4"] = 9
        spanfield["5"] = 2
        spanfield["6"] = 8
        spanfield["7"] = 2
        
        for j in range (0,len(objlist)):
            # (Host,Request,KByte,DurationInsec,date)
            (Host,Request,KByte,DurationInsec) = objlist[j]
            
            (requestpercent,durationpercent,trafficpercent)  = calpercentage(Request,sumrequest,KByte,sumkbyte,DurationInsec,sumdurationinsec)
            
            tt = changetotime(DurationInsec)   
            sizeusage = changetoMB_GB(KByte)
            
            tupleval = (str(countnbr),str(Host),str(Request),str(requestpercent),str(tt),str(durationpercent),str(sizeusage),str(trafficpercent))
            countnbr = countnbr + 1 
            lstline.append(tupleval)
            
            for k in range(0,len(tupleval)):
                spanfield[str(k)] = max(spanfield[str(k)],len(tupleval[k])) 
        
            if j >= topreport -1:
                break
                
        # change format the time and capacity.     
        timesummary = changetotime(sumdurationinsec)  
        sizeusagesummary = changetoMB_GB(sumkbyte)
        
        # Get the length.
        spanfield["2"] = max(spanfield["2"],len(str(sumrequest))) 
        spanfield["4"] = max(spanfield["4"],len(str(timesummary))) 
        spanfield["6"] = max(spanfield["6"],len(str(sizeusagesummary)))
        
        tuplesum = ("","Total",str(sumrequest),"",str(timesummary),"",str(sizeusagesummary),"")
        lstline.append(tuplesum) 
        
        # Create a dynamic template.
        template = "|{0:%s}|{1:<%s}|{2:>%s}|{3:>%s}|{4:>%s}|{5:>%s}|{6:>%s}|{7:>%s}|\n" %(str(spanfield["0"] + 1),str(spanfield["1"] + 1),str(spanfield["2"] + 1),str(spanfield["3"] +1),str(spanfield["4"] +1),str(spanfield["5"] +1),str(spanfield["6"] +1),str(spanfield["7"] +1))
        templateline = "+" + "-"*(spanfield["0"] + 2 +spanfield["1"] + 2 + spanfield["2"]+ 2 + spanfield["3"]+ 2 + spanfield["4"] + 2 + spanfield["5"] + 2 + spanfield["6"] + 2 + spanfield["7"] +1) + "+\n"
        temlateheader = template.format('Top','User','Request','%','Duration','%','traffic','%')
        
        s = s + templateline
        s = s + temlateheader
        s = s + templateline
        
        tpm = ""
         
        for m in range(0,len(lstline)):
            (varcountnbr,varHost,varRequest,varrequestpercent,vartt,vardurationpercent,varsizeusage,vartrafficpercent) = lstline[m]
            tpm = template.format(varcountnbr,varHost,varRequest,varrequestpercent,vartt,vardurationpercent,varsizeusage,vartrafficpercent)   
            s = s + tpm
            s = s + templateline
        
        return s 
    except Exception,e:
        print "Error at func_topuser_plaintext %s" %str(e)
        return ""       


def func_tophost_plaintext(objlist,objsum,countnbr,topreport):
    try:
        s = ""
        
        (sumrequest,sumkbyte,sumdurationinsec) = objsum[0]
        
        sumrequest = float(sumrequest)
        sumkbyte = float(sumkbyte)
        sumdurationinsec = float(sumdurationinsec) 
        
        lstline = []
        
        # span field will store the default value     
        spanfield = {}
        spanfield["0"] = 4
        spanfield["1"] = 5
        spanfield["2"] = 5
        spanfield["3"] = 8
        spanfield["4"] = 2
        spanfield["5"] = 9
        spanfield["6"] = 2
        spanfield["7"] = 8
        spanfield["8"] = 2
         
        for j in range (0,len(objlist)):
            (host,VisitedWebsites,request,kbyte,durationinsec) = objlist[j]
            
            (requestpercent,durationpercent,trafficpercent)  = calpercentage(request,sumrequest,kbyte,sumkbyte,durationinsec,sumdurationinsec)
            
            tt = changetotime(durationinsec)
            sizeusage = changetoMB_GB(kbyte)
            
            tupleval = (str(countnbr),str(VisitedWebsites),str(host),str(request),str(requestpercent),str(tt),str(durationpercent),str(sizeusage),str(trafficpercent))
            countnbr = countnbr + 1
            lstline.append(tupleval)
            
            for k in range(0,len(tupleval)):
                spanfield[str(k)] = max(spanfield[str(k)],len(tupleval[k]))
            
            if j >= topreport - 1:
                break
        
        # Add summary here 
        timesummary = changetotime(sumdurationinsec)  
        sizeusagesummary = changetoMB_GB(sumkbyte)
        
        spanfield["3"] = max(spanfield["3"],len(str(sumrequest)))
        spanfield["5"] = max(spanfield["5"],len(str(timesummary)))
        spanfield["7"] = max(spanfield["7"],len(str(sizeusagesummary)))
        
        tuplesum = ("","Total","",str(sumrequest),"",str(timesummary),"",str(sizeusagesummary),"")
        lstline.append(tuplesum)
        
        template = "|{0:%s}|{1:<%s}|{2:>%s}|{3:>%s}|{4:>%s}|{5:>%s}|{6:>%s}|{7:>%s}|{8:>%s}|\n" %(str(spanfield["0"] +1),str(spanfield["1"] +1),str(spanfield["2"] +1),str(spanfield["3"] +1),str(spanfield["4"] +1),str(spanfield["5"] +1),str(spanfield["6"] +1),str(spanfield["7"] +1),str(spanfield["8"] +1)) 
        templateline = "+" + "-"*(spanfield["0"] + 2 +spanfield["1"] + 2 + spanfield["2"]+ 2 + spanfield["3"]+ 2 + spanfield["4"] + 2 + spanfield["5"] + 2 + spanfield["6"] + 2 + spanfield["7"] + spanfield["8"] +3) + "+\n"
        temlateheader = template.format('Top','Site','User','Request','%','Duration','%','traffic','%')
        
        s = s + templateline
        s = s + temlateheader
        s = s + templateline
        
        tpm = ""
        
        for m in range(0,len(lstline)):
            (varcountnbr,varVisitedWebsites,varhost,varrequest,varrequestpercent,vartt,vardurationpercent,varsizeusage,vartrafficpercent) = lstline[m]
            tpm = template.format(varcountnbr,varVisitedWebsites,varhost,varrequest,varrequestpercent,vartt,vardurationpercent,varsizeusage,vartrafficpercent)
            s = s + tpm
            s = s + templateline
            
        return s 
    except Exception,e:
        print "Error at func_tophost %s" %str(e)
        return ""
    
def func_topmime_plaintext(objlist,objsum,countnbr,topreport):
    try:
        s = ""
        
        (sumrequest,sumkbyte) = objsum[0]
        
        sumrequest = float(sumrequest)
        sumkbyte = float(sumkbyte)
        
        lstline = []
        
        # span field will store the default value     
        spanfield = {}
        spanfield["0"] = 4
        spanfield["1"] = 12
        spanfield["2"] = 9
        spanfield["3"] = 2
        spanfield["4"] = 9
        spanfield["5"] = 2
         
        for j in range (0,len(objlist)):
            (contenttype,request,kbyte) = objlist[j]
            
            (requestpercent,durationpercent,trafficpercent)  = calpercentage(request,sumrequest,kbyte,sumkbyte,0,0)
            
            sizeusage = changetoMB_GB(kbyte)
            
            tupleval = (str(countnbr),str(contenttype),str(request),str(requestpercent),str(sizeusage),str(trafficpercent))
            countnbr = countnbr + 1
            lstline.append(tupleval)
            
            for k in range(0,len(tupleval)):
                spanfield[str(k)] = max(spanfield[str(k)],len(tupleval[k]))
            
            if j >= topreport - 1:
                break
        
        # Add summary here   
        sizeusagesummary = changetoMB_GB(sumkbyte)
        
        spanfield["2"] = max(spanfield["2"],len(str(sumrequest)))
        spanfield["4"] = max(spanfield["4"],len(str(sizeusagesummary)))
        
        tuplesum = ("","Total",str(sumrequest),"",str(sizeusagesummary),"")
        lstline.append(tuplesum)
        
        template = "|{0:%s}|{1:<%s}|{2:>%s}|{3:>%s}|{4:>%s}|{5:>%s}|\n" %(str(spanfield["0"] +1),str(spanfield["1"] +1),str(spanfield["2"] +1),str(spanfield["3"] +1),str(spanfield["4"] +1),str(spanfield["5"] +1)) 
        templateline = "+" + "-"*(spanfield["0"] + 2 +spanfield["1"] + 2 + spanfield["2"]+ 2 + spanfield["3"]+ 2 + spanfield["4"] + 2 + spanfield["5"] + 1 ) + "+\n"
        temlateheader = template.format('Top','Content Type','Request','%','traffic','%')
        
        s = s + templateline
        s = s + temlateheader
        s = s + templateline
        
        tpm = ""
        
        for m in range(0,len(lstline)):
            (varcountnbr,varcontenttype,varrequest,varrequestpercent,varsizeusage,vartrafficpercent) = lstline[m]
            tpm = template.format(varcountnbr,varcontenttype,varrequest,varrequestpercent,varsizeusage,vartrafficpercent)
            s = s + tpm
            s = s + templateline
            
        return s 
    except Exception,e:
        print "Error at func_topmime %s" %str(e)
        return ""


