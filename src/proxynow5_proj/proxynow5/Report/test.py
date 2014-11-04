
import os
import time
import random
import datetime

from pyrrd.util import epoch
from pyrrd.rrd import DataSource, RRD, RRA, DS


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

cpu = 'cpu'
usedram = 'usedram'
swapusage = 'swapusage'
hdusage = 'hdusage'
net_inbound = 'net_inbound'
net_outbound = 'net_outbound'

dscpu = DataSource(dsName=cpu, dsType='GAUGE', heartbeat=15,minval = 0,maxval = 100)

''' Datasouces of Ram '''
dsusedram = DataSource(dsName=usedram, dsType='GAUGE',heartbeat=15,minval = 0,maxval = 100)


''' Datasource of Hard Disk'''
dsswapusage = DataSource(dsName=swapusage,dsType='GAUGE',heartbeat=15,minval = 0,maxval = 100)
dshdusage = DataSource(dsName=hdusage, dsType='GAUGE', heartbeat=15,minval = 0,maxval = 100)


'''Datasource of netio '''
dsnetinbound = DataSource(dsName=net_inbound, dsType='GAUGE',heartbeat=15)
dsnetoutbound = DataSource(dsName=net_outbound, dsType='GAUGE',heartbeat=15)

def create_timescale_and_archives_hardware():
    roundRobinArchives = []
    
    '''
    1 day  : -> 5 seconds = 1PDP .
    
    1 min = 12 ( 12 times of 5 seconds)
    1 hour = 12 * 60
    1 day = 12 * 60 * 24
    
    number of rows = 17280
    '''
    roundRobinArchives.append(RRA(cf = 'AVERAGE',xff = 0.5,steps = 1,rows = 17280))
        
    '''
    1 week    30 seconds = 1PDP -> step = 6
    
    1 min = 2
    1 hour = 2 * 60
    1 day = 2 * 60 * 24 
    1 week = 2 * 60 * 24 * 7
    
    number of rows = 20160
    '''
    roundRobinArchives.append(RRA(cf='AVERAGE',xff = 0.5,steps = 6,rows = 20165))
        
    '''
    1 month  : 1 mins = 1PDP -> step = 12
    
    1 min = 1 PDP
    1 hour = 60
    1 day = 60 * 24
    1 month = 60 * 24 * 31
     
    number of rows = 44640
    '''
    roundRobinArchives.append(RRA(cf ='AVERAGE',xff = 0.5,steps = 12,rows = 44640))  
        
    '''
    1 year :  5 mins = 1PDP -> step = 60
    
    1 hour = 12
    1 day = 12* 24
    1 year = 12 * 24 * 365
      
    number of rows = 105120
    '''
    roundRobinArchives.append(RRA(cf='AVERAGE',xff = 0.5,steps = 60,rows = 105120))  
    
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
        
        myRRD = RRD(filename=namerrd,ds=dataSources, rra=roundRobinArchives, start=starttime,step=5)
        myRRD.create()
    
        return (True,'ok')
    
    except Exception,e:
        print "Error Created %s" %(str(e))
        return (False,str(e))
    
def update(namerrd,vals,updatedtime):
    try:
        myRRD = RRD(namerrd)
        countitem = len(vals)
        #myRRD.update(debug=False)
        if (countitem == 1):
            var1 = vals[0]   
            print myRRD.bufferValue(updatedtime ,int(var1))
            print myRRD.update() 
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
             
        return (True,'ok')
    
    except Exception,e: 
        return (False,str(e))    
    

def ram():
    i = 0; 
    endtimet = datetime.datetime.now()
    starttimet =  endtimet - datetime.timedelta(hours=1)

    endtime = epoch(endtimet)
    starttime = epoch(starttimet)
    
    print starttime
    Loop = True
    count = 0 
    
    while(Loop==True):
        count = count +1
        if starttime < endtime:
            namerrd = "ram.rrd"
            #pathfile =  os.path.join(folder,namerrd)
            a = random.randint(0,100)
            if not os.path.exists(namerrd):
                print create(namerrd,[usedram],starttime,'hardware')
            else:
                starttime = starttime + 5
                print a
                update(namerrd,[a],starttime)
        else:
            Loop = False
        
        if count == 120:
            Loop = False 
            
    print starttime

    

def cpu():
    i = 0; 
    endtimet = datetime.datetime.now()
    starttimet =  endtimet - datetime.timedelta(days=1)

    endtime = epoch(endtimet)
    starttime = epoch(starttimet)

    print starttime
    Loop = True

    while(Loop==True):
        if starttime < endtime:
            namerrd = "cpu.rrd"
            #pathfile =  os.path.join(folder,namerrd)
            a = random.randint(0,100)
            if not os.path.exists(namerrd):
                print create(namerrd,[cpu],starttime,'hardware')
            else:
                starttime = starttime + 5
                print starttime
                print update(namerrd,[a],starttime)
        else:
            Loop = False
            
def hd():
    i = 0; 
    endtimet = datetime.datetime.now()
    starttimet =  endtimet - datetime.timedelta(days=1)

    endtime = epoch(endtimet)
    starttime = epoch(starttimet)

    print starttime
    Loop = True

    while(Loop==True):
        if starttime < endtime:
            namerrd = "hd.rrd"
            #pathfile =  os.path.join(folder,namerrd)
            a = random.randint(0,100)
            b = random.randint(0,100)

            if not os.path.exists(namerrd):
                print create(namerrd,[swapusage,hdusage],starttime,'hardware')
            else:
                starttime = starttime + 5
                print starttime
                print update(namerrd,[a,b],starttime)
        else:
            Loop = False
    
ram()