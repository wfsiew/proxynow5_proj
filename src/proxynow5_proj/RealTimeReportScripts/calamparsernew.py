import sqlite3
import datetime
import sys
import os
##################################################
# This program parses the unformatted report of 
# Calamaris into sqlite database
# Currently we dont use all the reports so they are commented out.
# v1.0
##################################################
# Summary                                         #Not Implemented yet
# Incoming requests by method
# Incoming UDP-requests by status
# Incoming TCP-requests by status
# Outgoing requests by status                       
# Outgoing requests by destination
# Request-destinations by 2nd-level-domain
# Request-destinations by toplevel-domain
# TCP-Request-protocol
# Requested content-type
# Requested extensions
# Incoming UDP-requests by host
# Incoming TCP-requests by host
# Size Distribution Diagram
# UDP-Request duration distribution in msec      
# TCP-Request duration distribution in msec
# UDP Response code distribution
# TCP Response code distribution

if not len(sys.argv) == 3:
    print 'This program takes exactly two parameters which are:'
    print '1-The output of Calamaris which is named by default calamaris.txt'
    print '2-The sqlite databse file which is going to store the parsed data'
    sys.exit(0)
calamarisOutput=sys.argv[1]
databasefile=sys.argv[2]

reportfile=open(calamarisOutput,'r')
foundflag=False
firstlineFlag=True
conn = sqlite3.connect(databasefile)
conn.row_factory = sqlite3.Row
curs = conn.cursor()
tName=''
host=''


#this method will correct parsing of values
def do_correction(idleListLenght,inputList):
    firstElement=inputList[0:len(inputList)-idleListLenght+1]
    rest=inputList[len(inputList)-idleListLenght+1:]
    rest.insert(0,' '.join(firstElement))
    return rest

def insertIntoTable(tablename,record):
    global host
    #if(tablename=='Incoming_requests_by_method'):
        #record=filter (lambda a: a != '\n', record)
        #record=filter (lambda a: a != '', record)
        #record.insert(0,datetime.datetime.now())
        #curs.execute('insert into Incoming_requests_by_method values (?,?,?,?,?,?,?,?)', record)
        #conn.commit()
        
    #elif(tablename=='Incoming_UDP_requests_by_status'):
        #record=filter (lambda a: a != '\n', record)
        #record=filter (lambda a: a != '', record)
        #record.insert(0,datetime.datetime.now())
        #curs.execute('insert into Incoming_UDP_requests_by_status values (?,?,?,?,?,?,?,?)', record)
        #conn.commit()
        
    #elif(tablename=='Incoming_TCP_requests_by_status'):
        #record=filter (lambda a: a != '\n', record)
        #record=filter (lambda a: a != '', record)
        #record.insert(0,datetime.datetime.now())
        #curs.execute('insert into Incoming_TCP_requests_by_status values (?,?,?,?,?,?,?,?)', record)
        #conn.commit()
    
    #elif(tablename=='Outgoing_requests_by_status'):
        #record=filter (lambda a: a != '\n', record)
        #record=filter (lambda a: a != '', record)
        #record=do_correction(7,record)
        #record.insert(0,datetime.datetime.now())
        #curs.execute('insert into Outgoing_requests_by_status values (?,?,?,?,?,?,?,?)', record)
        #conn.commit()
        
    if(tablename=='Outgoing_requests_by_destination'):
        record=filter (lambda a: a != '\n', record)
        record=filter (lambda a: a != '', record)
        record.insert(0,datetime.datetime.now())
        curs.execute('insert into Outgoing_requests_by_destination values (?,?,?,?,?,?,?,?)', record)
        conn.commit()
    
    elif(tablename=='Request_destinations_by_2nd_level_domain'):
        record=filter (lambda a: a != '\n', record)
        record=filter (lambda a: a != '', record)
        record=do_correction(7,record)
        record.insert(0,datetime.datetime.now())
        curs.execute('insert into Request_destinations_by_2nd_level_domain values (?,?,?,?,?,?,?,?)', record)
        conn.commit() 
    
    elif(tablename=='Request_destinations_by_toplevel_domain'):
        record=filter (lambda a: a != '\n', record)
        record=filter (lambda a: a != '', record)
        record.insert(0,datetime.datetime.now())
        curs.execute('insert into Request_destinations_by_toplevel_domain values (?,?,?,?,?,?,?,?)', record)
        conn.commit() 
    
    elif(tablename=='TCP_Request_protocol'):
        record=filter (lambda a: a != '\n', record)
        record=filter (lambda a: a != '', record)
        record.insert(0,datetime.datetime.now())
        curs.execute('insert into TCP_Request_protocol values (?,?,?,?,?,?,?,?)', record)
        conn.commit() 
        
    elif(tablename=='Requested_content_type'):
        record=filter (lambda a: a != '\n', record)
        record=filter (lambda a: a != '', record)
        record=do_correction(7,record)
        record.insert(0,datetime.datetime.now())
        curs.execute('insert into Requested_content_type values (?,?,?,?,?,?,?,?)', record)
        conn.commit() 
    
    elif(tablename=='Requested_extensions'):
        record=filter (lambda a: a != '\n', record)
        record=filter (lambda a: a != '', record)
        record=do_correction(7,record)
        record.insert(0,datetime.datetime.now())
        curs.execute('insert into Requested_extensions values (?,?,?,?,?,?,?,?)', record)
        conn.commit()
    
    elif(tablename=='Incoming_UDP_requests_by_host'):
        
        record=filter (lambda a: a != '\n', record)
        if not record[0]=='':
            host=record[0]
            record=filter (lambda a: a != '', record)
            record=do_correction(7,record)
            record.insert(0,datetime.datetime.now())
            curs.execute('insert into Incoming_UDP_requests_by_host_Summary values (?,?,?,?,?,?,?,?)', record)
            conn.commit()
            return
        
        record=filter (lambda a: a != '', record)
        record=do_correction(7,record)
        record.insert(0,datetime.datetime.now())
        record.insert(1,host)
        curs.execute('insert into Incoming_UDP_requests_by_host values (?,?,?,?,?,?,?,?,?)', record)
        conn.commit()
        
    elif(tablename=='Incoming_TCP_requests_by_host'):
        
        record=filter (lambda a: a != '\n', record)
        if not record[0]=='':
            host=record[0]
            record=filter (lambda a: a != '', record)
            record=do_correction(7,record)
            record.insert(0,datetime.datetime.now())
            
            curs.execute('select * from Incoming_TCP_requests_by_host_Summary where host=?',[host,])
            retQ=curs.fetchone()
            if retQ is not None:
                try:
                    requests=retQ['Request']
                    Kbyte=retQ['KByte']
                    Duration=retQ['DurationInSec']
                    newrequest=int(requests)+ int(record[2])
                    newKByte=float(Kbyte)+float(record[5])
                    newDuration=float(Duration)+float(record[7])
                    curs.execute('update Incoming_TCP_requests_by_host_Summary set request=?,KByte=?,DurationInSec=? where host=?',[newrequest,newKByte,newDuration,record[1]])
                except(Exception):
                    pass
            else:
                curs.execute('insert into Incoming_TCP_requests_by_host_Summary values (?,?,?,?,?,?,?,?)', record)
            
            conn.commit()
            return
        
        record=filter (lambda a: a != '', record)
        record=do_correction(7,record)
        record.insert(0,datetime.datetime.now())
        record.insert(1,host)
        tmprec=record[1:3]
        curs.execute('select * from Incoming_TCP_requests_by_host where host=? and visitedwebsites=?',tmprec)
        returnedQ=curs.fetchone()
        
        if returnedQ is not None:
            try:
                requests=returnedQ['Request']
                Kbyte=returnedQ['KByte']
                Duration=returnedQ['DurationInSec']
                newrequest=int(requests)+ int(record[3])
                newKByte=float(Kbyte)+float(record[6])
                newDuration=float(Duration)+float(record[8])
                curs.execute('update Incoming_TCP_requests_by_host set request=?,KByte=?,DurationInSec=? where host=? and visitedwebsites=?',[newrequest,newKByte,newDuration,record[1],record[2]])
            except(Exception):
                pass
        else:
            curs.execute('insert into Incoming_TCP_requests_by_host values (?,?,?,?,?,?,?,?,?)', record)
        
        conn.commit()
    
    #elif(tablename=='Size_Distribution_Diagram'):
        #record=filter (lambda a: a != '\n', record)
        #record=filter (lambda a: a != '', record)
        #record.insert(0,datetime.datetime.now())
        #curs.execute('insert into Size_Distribution_Diagram values (?,?,?,?,?,?,?,?)', record)
        #conn.commit()
    
    #elif(tablename=='UDP_Request_duration_distribution_in_msec'):
        #record=filter (lambda a: a != '\n', record)
        #record=filter (lambda a: a != '', record)
        #record.insert(0,datetime.datetime.now())
        #curs.execute('insert into UDP_Request_duration_distribution_in_msec values (?,?,?,?,?,?,?,?,?,?)', record)
        #conn.commit()
 
    #elif(tablename=='TCP_Request_duration_distribution_in_msec'):
        #record=filter (lambda a: a != '\n', record)
        #record=filter (lambda a: a != '', record)
        #record.insert(0,datetime.datetime.now())
        #curs.execute('insert into TCP_Request_duration_distribution_in_msec values (?,?,?,?,?,?,?,?,?,?)', record)
        #conn.commit()
    
    #elif(tablename=='UDP_Response_code_distribution'):
        #record=filter (lambda a: a != '\n', record)
        #record=filter (lambda a: a != '', record)
        #record=do_correction(5,record)
        #record.insert(0,datetime.datetime.now())
        #curs.execute('insert into UDP_Response_code_distribution values (?,?,?,?,?,?)', record)
        #conn.commit()
        
    #elif(tablename=='TCP_Response_code_distribution'):
        #record=filter (lambda a: a != '\n', record)
        #record=filter (lambda a: a != '', record)
        #record=do_correction(5,record)
        #record.insert(0,datetime.datetime.now())
        #curs.execute('insert into TCP_Response_code_distribution values (?,?,?,?,?,?)', record)
        #conn.commit()

def createTable(tablename):
    
    #if(tablename=='Incoming_requests_by_method'):
        #curs.execute('''create table if not exists Incoming_requests_by_method (date DATE ,Method TEXT,Request integer,RequestPercent REAL, SecPerReq REAL,Byte REAL,BytePercentage REAL,KBperSec REAL)''')
        
    #if(tablename=='Incoming_UDP_requests_by_status'):
        #curs.execute('''create table if not exists Incoming_UDP_requests_by_status (date DATE ,Status TEXT,Request integer,RequestPercent REAL, SecPerReq REAL,Byte REAL,BytePercentage REAL,KBperSec REAL)''')
    
    #elif(tablename=='Incoming_TCP_requests_by_status'):
        #curs.execute('''create table if not exists Incoming_TCP_requests_by_status (date DATE ,Status TEXT,Request integer,RequestPercent REAL, SecPerReq REAL,Byte REAL,BytePercentage REAL,KBperSec REAL)''')
        
    #elif(tablename=='Outgoing_requests_by_status'):
        #curs.execute('''create table if not exists Outgoing_requests_by_status (date DATE ,Status TEXT,Request integer,RequestPercent REAL, SecPerReq REAL,Byte REAL,BytePercentage REAL,KBperSec REAL)''')
    
    if(tablename=='Outgoing_requests_by_destination'):
        curs.execute('''create table if not exists Outgoing_requests_by_destination (date DATE ,NeighborType TEXT,Request integer,RequestPercent REAL, SecPerReq REAL,Byte REAL,BytePercentage REAL,KBperSec REAL)''')
         
    elif(tablename=='Request_destinations_by_2nd_level_domain'):
        curs.execute('''create table if not exists Request_destinations_by_2nd_level_domain (date DATE ,Destination TEXT,Request integer,RequestPercent REAL, HITPercent REAL,Byte REAL,BytePercentage REAL,HITPercentage REAL)''')
        
    elif(tablename=='Request_destinations_by_toplevel_domain'):
        curs.execute('''create table if not exists Request_destinations_by_toplevel_domain (date DATE ,Destination TEXT,Request integer,RequestPercent REAL, HITPercent REAL,Byte REAL,BytePercentage REAL,HITPercentage REAL)''')
    
    elif(tablename=='TCP_Request_protocol'):
        curs.execute('''create table if not exists TCP_Request_protocol (date DATE ,Protocol TEXT,Request integer,RequestPercent REAL, HITPercent REAL,Byte REAL,BytePercentage REAL,HITPercentage REAL)''')
    
    elif(tablename=='Requested_content_type'):
        curs.execute('''create table if not exists Requested_content_type (date DATE ,ContentType TEXT,Request integer,RequestPercent REAL, HITPercent REAL,Byte REAL,BytePercentage REAL,HITPercentage REAL)''')
    
    elif(tablename=='Requested_extensions'):
        curs.execute('''create table if not exists Requested_extensions (date DATE ,Extensions TEXT,Request integer,RequestPercent REAL, HITPercent REAL,Byte REAL,BytePercentage REAL,HITPercentage REAL)''')
    
    elif(tablename=='Incoming_UDP_requests_by_host'):
        curs.execute('''create table if not exists Incoming_UDP_requests_by_host_Summary (date DATE ,Host TEXT,Request integer, HITPercent REAL,SecPerReq REAL,KByte REAL,HITPercentage REAL,DurationInSec REAL)''')
        curs.execute('''create table if not exists Incoming_UDP_requests_by_host (date DATE ,Host TEXT,VisitedWebsites TEXT,Request integer, HITPercent REAL,SecPerReq REAL,Byte REAL,HITPercentage REAL,DurationInSec REAL)''')
    
    elif(tablename=='Incoming_TCP_requests_by_host'):
        curs.execute('''create table if not exists Incoming_TCP_requests_by_host_Summary (date DATE ,Host TEXT,Request integer, HITPercent REAL,SecPerReq REAL,KByte REAL,HITPercentage REAL,DurationInSec REAL)''')
        curs.execute('''create table if not exists Incoming_TCP_requests_by_host (date DATE ,Host TEXT,VisitedWebsites TEXT,Request integer, HITPercent REAL,SecPerReq REAL,KByte REAL,HITPercentage REAL,DurationInSec REAL)''')
    
    #elif(tablename=='Size_Distribution_Diagram'):
        #curs.execute('''create table if not exists Size_Distribution_Diagram (date DATE ,ObjectSizeByte TEXT,Request integer, HITPercent REAL,SecPerReq REAL,Byte REAL,HITPercentage REAL,KBPerSec REAL)''')
    
    #elif(tablename=='UDP_Request_duration_distribution_in_msec'):
        #curs.execute('''create table if not exists UDP_Request_duration_distribution_in_msec (date DATE ,TimeRange TEXT,Request integer,RequestPercent REAL, HITPercent REAL,SecPerReq REAL,Byte REAL,BytePercent REAL,HITPercentage REAL,KBPerSec REAL)''')
    
    #elif(tablename=='TCP_Request_duration_distribution_in_msec'):
        #curs.execute('''create table if not exists TCP_Request_duration_distribution_in_msec (date DATE ,TimeRange TEXT,Request integer,RequestPercent REAL, HITPercent REAL,SecPerReq REAL,Byte REAL,BytePercent REAL,HITPercentage REAL,KBPerSec REAL)''')
    
    #elif(tablename=='UDP_Response_code_distribution'):
        #curs.execute('''create table if not exists UDP_Response_code_distribution (date DATE ,StatusCode TEXT,Request integer, RequestPercent REAL,Byte REAL,BytePercent REAL)''')
        
    #elif(tablename=='TCP_Response_code_distribution'):
        #curs.execute('''create table if not exists TCP_Response_code_distribution (date DATE ,StatusCode TEXT,Request integer, RequestPercent REAL,Byte REAL,BytePercent REAL)''')

        
def parseIntoTable(tablename,line):
    tablename=tablename.replace('\n','')
    #First Line is always column names
    global firstlineFlag
    isinstance(line,str)
    if(firstlineFlag):
        #colsList=line.split(' ')
        #colsList=filter (lambda a: a != '\n', colsList)
        #colsList=filter (lambda a: a != '', colsList)
        firstlineFlag=False
                
        #Creating the table if it is not exists.
        createTable(tablename)
    else:
        if(line.startswith('---')):
            pass
        else:
            #insert into Table
            line=line.replace('<= ','')
            dataList=line.split(' ')
            insertIntoTable(tablename,dataList)
    return

def StartEngine():
    global foundflag
    global reportfile
    global tName
    global firstlineFlag

    for line in reportfile:
        #process each line
        isinstance(line,str)
        #Parsing Sumary part
        
        #if(line.startswith('# Incoming requests by method')):
            ##Counstracting table name
            #line=line.lstrip('# ')
            #line=line.replace('-','_')
            #tName=line.replace(' ','_')
            #foundflag=True
            #continue
        
        #if(line.startswith('# Incoming TCP-requests by status')):
            ##Counstracting table name
            #line=line.lstrip('# ')
            #line=line.replace('-','_')
            #tName=line.replace(' ','_')
            #foundflag=True
            #continue
        
        #if(line.startswith('# Incoming UDP-requests by status')):
            ##Counstracting table name
            #line=line.lstrip('# ')
            #line=line.replace('-','_')
            #tName=line.replace(' ','_')
            #print tName
            #foundflag=True
            #continue
        
        #if(line.startswith('# Outgoing requests by status')):
            ##Counstracting table name
            #line=line.lstrip('# ')
            #line=line.replace('-','_')
            #tName=line.replace(' ','_')
            #print tName
            #foundflag=True
            #continue
        
        if(line.startswith('# Outgoing requests by destination')):
            #Counstracting table name
            line=line.lstrip('# ')
            line=line.replace('-','_')
            tName=line.replace(' ','_')
            foundflag=True
            continue
        
        if(line.startswith('# Request-destinations by 2nd-level-domain')):
            #Counstracting table name
            line=line.lstrip('# ')
            line=line.replace('-','_')
            tName=line.replace(' ','_')
            foundflag=True
            continue
        
        if(line.startswith('# Request-destinations by toplevel-domain')):
            #Counstracting table name
            line=line.lstrip('# ')
            line=line.replace('-','_')
            tName=line.replace(' ','_')
            foundflag=True
            continue
        
        if(line.startswith('# TCP-Request-protocol')):
            #Counstracting table name
            line=line.lstrip('# ')
            line=line.replace('-','_')
            tName=line.replace(' ','_')
            foundflag=True
            continue
        
        if(line.startswith('# Requested content-type')):
            #Counstracting table name
            line=line.lstrip('# ')
            line=line.replace('-','_')
            tName=line.replace(' ','_')
            foundflag=True
            continue
        
        if(line.startswith('# Requested extensions')):
            #Counstracting table name
            line=line.lstrip('# ')
            line=line.replace('-','_')
            tName=line.replace(' ','_')
            foundflag=True
            continue
        
        if(line.startswith('# Incoming UDP-requests by host')):
            #Counstracting table name
            line=line.lstrip('# ')
            line=line.replace('-','_')
            tName=line.replace(' ','_')
            foundflag=True
            continue
        
        if(line.startswith('# Incoming TCP-requests by host')):
            #Counstracting table name
            line=line.lstrip('# ')
            line=line.replace('-','_')
            tName=line.replace(' ','_')
            foundflag=True
            continue
        
        #if(line.startswith('# Size Distribution Diagram')):
            ##Counstracting table name
            #line=line.lstrip('# ')
            #line=line.replace('-','_')
            #tName=line.replace(' ','_')
            #print tName
            #foundflag=True
            #continue
        
        #if(line.startswith('# UDP-Request duration distribution in msec')):
            ##Counstracting table name
            #line=line.lstrip('# ')
            #line=line.replace('-','_')
            #tName=line.replace(' ','_')
            #print tName
            #foundflag=True
            #continue
        
        #if(line.startswith('# TCP-Request duration distribution in msec')):
            ##Counstracting table name
            #line=line.lstrip('# ')
            #line=line.replace('-','_')
            #tName=line.replace(' ','_')
            #print tName
            #foundflag=True
            #continue
        
        #if(line.startswith('# UDP Response code distribution')):
            ##Counstracting table name
            #line=line.lstrip('# ')
            #line=line.replace('-','_')
            #tName=line.replace(' ','_')
            #print tName
            #foundflag=True
            #continue
        
        #if(line.startswith('# TCP Response code distribution')):
            ##Counstracting table name
            #line=line.lstrip('# ')
            #line=line.replace('-','_')
            #tName=line.replace(' ','_')
            #print tName
            #foundflag=True
            #continue
        
        if(foundflag and line.startswith('Sum')):
            tName=''        
            foundflag=False        
            firstlineFlag=True
        else:
            if(not line.startswith('#') and foundflag):
                if(line.startswith('no matching requests')):
                    tName=''        
                    foundflag=False        
                    firstlineFlag=True
                    continue
                parseIntoTable(tName,line)
                #print line    

StartEngine()
conn.close()
