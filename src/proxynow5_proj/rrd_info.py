from pyrrd.graph import ColorAttributes, DEF, CDEF, VDEF, LINE, AREA, GPRINT, \
    Graph
from pyrrd.rrd import DataSource, RRD, RRA, DS
from pyrrd.util import epoch
import datetime
import os
import random
from settings import REPORT_PATH_DATA

config_info = {
               'hardware' :{
                            'type' : ['cpu','ram','hd'],   
                            'func': 'create_timescale_and_archives_hardware',
                            'step': 5, #second the time step for rrd tool
                            'days' :  5, #resolution
                            'weeks': 30,
                            '_months' : 60,
                            '_years' : 300,
                            },
              
              'netusage' : {   
                            'type' : ['net'],
                            'func' : 'create_timescale_and_archives_hardware',
                            'step' :5,
                            'days' :  5,
                            'weeks': 30,
                            '_months' : 60,
                            '_years' : 300,
                            },
             }


''' Heart Beat for RRA.'''
hearbeat = 15

cpu = 'cpu'
usedram = 'usedram'
swapusage = 'swapusage'
hdusage = 'hdusage'
net_inbound = 'net_inbound'
net_outbound = 'net_outbound'

''' Datasouce of CPU '''
dscpu = DataSource(dsName=cpu, dsType='GAUGE', heartbeat=hearbeat,minval = 0,maxval = 100)

''' Datasouces of Ram '''
dsusedram = DataSource(dsName=usedram, dsType='GAUGE',heartbeat=hearbeat,minval = 0,maxval = 100)


''' Datasource of Hard Disk'''
dsswapusage = DataSource(dsName=swapusage,dsType='GAUGE',heartbeat=hearbeat,minval = 0,maxval = 100)
dshdusage = DataSource(dsName=hdusage, dsType='GAUGE', heartbeat=hearbeat,minval = 0,maxval = 100)


'''Datasource of netio '''
dsnetinbound = DataSource(dsName=net_inbound, dsType='GAUGE',heartbeat=hearbeat)
dsnetoutbound = DataSource(dsName=net_outbound, dsType='GAUGE',heartbeat=hearbeat)


''' 
Create round robin archives 
interval will be 5 seconds , 
this timescale is supported for Ram,HD,CPU,Net  
'''
def create_timescale_and_archives_hardware():
    roundRobinArchives = []
    
    '''
    1 day  : -> 5 seconds = 1PDP .
    
    1 min = 12 ( 12 times of 5 seconds)
    1 hour = 12 * 60
    1 day = 12 * 60 * 24
    
    number of rows = 17280
    '''
    roundRobinArchives.append(RRA(cf = 'MAX',xff = 0.5,steps = 1,rows = 17280))
        
    '''
    1 week    30 seconds = 1PDP -> step = 6
    
    1 min = 2
    1 hour = 2 * 60
    1 day = 2 * 60 * 24 
    1 week = 2 * 60 * 24 * 7
    
    number of rows = 20160
    '''
    roundRobinArchives.append(RRA(cf='MAX',xff = 0.5,steps = 6,rows = 20160))
        
    '''
    1 month  : 1 mins = 1PDP -> step = 12
    
    1 min = 1 PDP
    1 hour = 60
    1 day = 60 * 24
    1 month = 60 * 24 * 31
     
    number of rows = 44640
    '''
    roundRobinArchives.append(RRA(cf ='MAX',xff = 0.5,steps = 12,rows = 44640))  
        
    '''
    1 year :  5 mins = 1PDP -> step = 60
    
    1 hour = 12
    1 day = 12* 24
    1 year = 12 * 24 * 365
      
    number of rows = 105408
    '''
    roundRobinArchives.append(RRA(cf='MAX',xff = 0.5,steps = 60,rows = 105408))  
    
    return roundRobinArchives


def get_ds(nameds):
    lsds = []
    
    for eachds in nameds : 
        if eachds == cpu:
            lsds.append(dscpu)
        elif eachds == usedram:
            lsds.append(dsusedram) 
        elif eachds == swapusage:
            lsds.append(dsswapusage)
        elif eachds == hdusage:
            lsds.append(dshdusage)
        elif eachds == net_inbound:
            lsds.append(dsnetinbound)  
        elif eachds == net_outbound:
            lsds.append(dsnetoutbound)
    
    return lsds  


         
'''
  namerrd : name of file rrd (ex: cpu.rrd , ram.rrd) is string type
  fieldname : name of the field is list type
  val : var will be update
  typeofinfo : hardware or netusage 
  Because : hardware the time(interval will be 15 second)
          : netusage the time(interval will be 1 s)
'''
def create(namerrd,fieldname,starttime,typeofinfo):
    try:
        dataSources = []
        roundRobinArchives = [] 
        dataSources = get_ds(fieldname)
    
        if typeofinfo == 'hardware' :
            dict = {}
            dict = config_info['hardware']
            s = dict['func']
            step = dict['step']
            funcProfile = globals()[s]
            roundRobinArchives = funcProfile()
        
        elif typeofinfo == 'netusage':
            dict = {}
            dict = config_info['netusage']
            s = dict['func']
            step = int(dict['step'])
            funcProfile = globals()[s]
            roundRobinArchives = funcProfile()  
        
        myRRD = RRD(filename=namerrd,ds=dataSources, rra=roundRobinArchives, start=starttime,step=step)
        myRRD.create()
    
        return (True,'Create is successfull.')
    
    except Exception,e:
        
        return (False,str(e))
    
def update(namerrd,vals,updatedtime):
    try:
        myRRD = RRD(namerrd)
        countitem = len(vals)
        #myRRD.update(debug=False)
        if (countitem == 1):
            var1 = vals[0]   
            myRRD.bufferValue(updatedtime ,var1)
            myRRD.update() 
        elif (countitem == 2):
            var1 = vals[0]
            var2 = vals[1]
            myRRD.bufferValue(updatedtime,var1,var2)
            myRRD.update()  
        elif (countitem == 3):
            var1 = vals[0]
            var2 = vals[1]
            var3 = vals[2]
            myRRD.bufferValue(updatedtime,var1,var2,var3)
            myRRD.update()   
             
        return (True,'Update is successfull. ')
    
    except Exception,e: 
        return (False,str(e))

def created_or_update(namerrd, fieldname, vals, typeofinfo):
    
    try: 
        namerrd = '%s.rrd' %namerrd 
        
        filename = os.path.join(REPORT_PATH_DATA,namerrd)
        
        starttime = epoch(datetime.datetime.now())
    
        if (os.path.exists(filename)):
            return update(filename,vals,starttime)
    
        else:
            # Note we can't update the time when we try created
            (result,error) = create(filename, fieldname, starttime,typeofinfo)
            return (result,error)
        
    except Exception,ex: 
        print "Error Info :reportrrd at method created_or_update : %s " %(ex)
        return (False,str(ex))


''' 
    get file name rrd 
    type var is : ram,hd,cpu,net0,net1
'''    
def get_filename(type):
    filename = ''
    rrdname = type + ".rrd" 
    filename = os.path.join(REPORT_PATH_DATA,rrdname) 
    return filename 

