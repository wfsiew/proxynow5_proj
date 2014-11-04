import sys
import csv

def export_tophost_csv(f,lstrow):
    try:
        fieldnames = ('Visitedwebsite', 'Request', 'Request_P','Duration','Duration_P','traffic','traffic_P')
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        headers = dict( (n,n) for n in fieldnames )
        writer.writerow(headers)
            
        for item in lstrow:
            datarow = {
                   'Visitedwebsite' :item.visitedwebsite,
                   'Request': item.request,
                   'Request_P' : item.requestpercentage,
                   'Duration': item.duration,
                   'Duration_P': item.durationpercentage,
                   'traffic' : item.traffic,
                   'traffic_P' :item.trafficpercentage
                           }
            
            writer.writerow(datarow)
        return (True,"")
    except Exception,e:
        print "At method export_tophost_csv %s" %(e)
        return (False,str(e))
    

def export_topuser_csv(f,lstrow):
    try:
        fieldnames = ('User', 'Request', 'Request_P','Duration','Duration_P','traffic','traffic_P')
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        headers = dict( (n,n) for n in fieldnames )
        writer.writerow(headers)
            
        for item in lstrow:
            datarow = {
                    'User' :item.users,
                    'Request': item.request,
                    'Request_P' : item.requestpercentage,
                    'Duration': item.duration,
                    'Duration_P': item.durationpercentage,
                    'traffic' : item.traffic,
                    'traffic_P' :item.trafficpercentage
                    }
            
            writer.writerow(datarow)
        return (True,"")
    except Exception,e:
        print "At method export_topuser_csv %s" %(e)
        return (False,str(e))
        
def export_topusersbyhost_csv(f,lstrow):
    try:
        fieldnames = ('User', 'Request', 'Request_P','Duration','Duration_P','traffic','traffic_P')
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        headers = dict( (n,n) for n in fieldnames )
        writer.writerow(headers)
            
        for item in lstrow:
            datarow = {
                    'User' :item.user,
                    'Request': item.request,
                    'Request_P' : item.requestpercentage,
                    'Duration': item.duration,
                    'Duration_P': item.durationpercentage,
                    'traffic' : item.traffic,
                    'traffic_P' :item.trafficpercentage
                    }
            
            writer.writerow(datarow)
        return (True,"")
    except Exception,e:
        print "At method export_topuserbyhost_csv %s" %(e)
        return (False,str(e))
        
    
def export_tophostbyuser_csv(f,lstrow):
    try:
        fieldnames = ('Site', 'Request', 'Request_P','Duration','Duration_P','traffic','traffic_P')
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        headers = dict( (n,n) for n in fieldnames )
        writer.writerow(headers)
            
        for item in lstrow:
            datarow = {
                    'Site' :item.host,
                    'Request': item.request,
                    'Request_P' : item.requestpercentage,
                    'Duration': item.duration,
                    'Duration_P': item.durationpercentage,
                    'traffic' : item.traffic,
                    'traffic_P' :item.trafficpercentage
                }
            
            writer.writerow(datarow)
        return (True,"")
    
    except Exception,e:
        print "At method export_tophostbyuser_csv %s" %(e)
        return (False,str(e))
    
def export_topmime_csv(f,lstrow):
    try:
        fieldnames = ('ContentType', 'Request', 'Request_P','traffic','traffic_P')
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        headers = dict( (n,n) for n in fieldnames )
        writer.writerow(headers)
            
        for item in lstrow:
            datarow = {
                    'ContentType' :item.contentype,
                    'Request': item.request,
                    'Request_P' : item.requestpercentage,
                    'traffic' : item.traffic,
                    'traffic_P' :item.trafficpercentage
                }
            
            writer.writerow(datarow)
        return (True,"")
    
    except Exception,e:
        print "At method export_topmime_csv %s" %(e)
        return (False,str(e))
    
        
def export_topuserbymime_csv(f,lstrow):
    
    try:
        fieldnames = ('User', 'Request', 'Request_P','Duration','Duration_P','traffic','traffic_P')
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        headers = dict( (n,n) for n in fieldnames )
        writer.writerow(headers)
            
        for item in lstrow:
            datarow = {
                    'User' :item.host,
                    'Request': item.request,
                    'Request_P' : item.requestpercentage,
                    'Duration': item.duration,
                    'Duration_P': item.durationpercentage,
                    'traffic' : item.traffic,
                    'traffic_P' :item.trafficpercentage
                    }
            
            writer.writerow(datarow)
        return (True,"")
    except Exception,e:
        print "At method export_topuserbymime_csv %s" %(e)
        return (False,str(e))

def export_topmimebyuser(f,lstrow):  
    
    try:
        fieldnames = ('ContentType', 'Request', 'Request_P','Duration','Duration_P','traffic','traffic_P')
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        headers = dict( (n,n) for n in fieldnames )
        writer.writerow(headers)
            
        for item in lstrow:
            datarow = {
                    'ContentType' :item.contenttype,
                    'Request': item.request,
                    'Request_P' : item.requestpercentage,
                    'Duration': item.duration,
                    'Duration_P': item.durationpercentage,
                    'traffic' : item.traffic,
                    'traffic_P' :item.trafficpercentage
                    }
            
            writer.writerow(datarow)
        return (True,"")
    except Exception,e:
        print "At method export_topmimebyuser_csv %s" %(e)
        return (False,str(e))

def export_topdestbymime(f,lstrow):
    
    try:
       fieldnames = ('Destination', 'Request', 'Request_P','Duration','Duration_P','traffic','traffic_P')
       writer = csv.DictWriter(f, fieldnames=fieldnames)
       headers = dict( (n,n) for n in fieldnames )
       writer.writerow(headers)
           
       for item in lstrow:
           datarow = {
                   'Destination' :item.destination,
                   'Request': item.request,
                   'Request_P' : item.requestpercentage,
                   'Duration': item.duration,
                   'Duration_P': item.durationpercentage,
                   'traffic' : item.traffic,
                   'traffic_P' :item.trafficpercentage
                   }
           
           writer.writerow(datarow)
       return (True,"")
    
    except Exception,e:
       print "At method export_topmimebyuser_csv %s" %(e)
       return (False,str(e))
     
    
    