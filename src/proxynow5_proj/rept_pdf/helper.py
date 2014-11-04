import socket
import fcntl
import struct
import array
import nowlog
import psutil
import sys
import os
import time
import sqlite3
import sys
import os
import datetime
import rrd_info
os.environ['DJANGO_SETTINGS_MODULE'] = "proxynow5_proj.settings"
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + '/..')
from proxynow5 import resourceutils 

#from proxynow5_proj.proxynow5.report.reportrrd import created_or_update,\
#    net_inbound, net_outbound, cpu, swapusage, hdusage
#from proxynow5_proj.proxynow5.report import reportrrd

_Logger = None

## Init ##
global prevTime
def Init():
    global _Logger
    _Logger = nowlog.SetLogConfig("/var/log/log-pn-helper")

## Util ##

def _StartWith(fullstr, find):
    if str(fullstr).lower()[:len(find)] == str(find).lower():
        return True
    else:
        return False
    
## Network ##

def GetNICNameList():
    global _Logger
    aTmpNIC = []
    aNIC = []
    try:
        aTmpNIC = os.listdir('/sys/class/net')
    except IOError as (errno, strerror):
        _Logger.error('HelperNetwork(GetNICNameList): Error - List Directory - %d %s' % (errno, strerror))
    except:
        _Logger.error('HelperNetwork(GetNICNameList): Error - Unknown error %s' % sys.exc_info()[0])
    for ethx in aTmpNIC:
        if ethx[:3] == 'sit':
            None
        elif ethx[:2] == 'lo':
            None
        else:
            aNIC.append(ethx)
    return aNIC


# Return the incoming and outgoing bandwidth as tuple, in bps
# Not thread safe
# First result is not accurate, use subsequent call result
_ethInstance = {}
tmpValue = {}
def GetInOutBW(ethx): 
    #Sleep for 2 seconds to ensure that the number of bytes in /proc/net/dev have been updated
    time.sleep(2)
    line = " " 
    found = False 
    global _ethInstance
    global _timeDiff
    
    
    
    if ethx in _ethInstance:
        pass
    else:
        
        tmpValue['lastCheckTime'] = datetime.datetime.now()
        print 'debug:In Else'
        print tmpValue['lastCheckTime']
        tmpValue['readBytes'] = 0
        tmpValue['lastReadBytes'] = 0
        tmpValue['writeBytes'] = 0
        tmpValue['lastWriteBytes'] = 0
        _ethInstance[ethx] = (tmpValue)
    
    try:
        _netFile = open("/proc/net/dev",'r') 
        # read all the lines till the right one is found 
        while not line == None and not found: 
            line = _netFile.readline() 
            # find only the line with this name 
            if line.find(ethx) > 0: 
                found = True 
        _netFile.close()
    except IOError as (errno, strerror):
        _Logger.error('HelperNetwork(GetInOutBW): Error - %d %s' % (errno, strerror))
    except:
        _Logger.error('HelperNetwork(GetInOutBW): Error - Unknown error %s' % sys.exc_info()[0])
    if(found): 
        tempSplit = line.split(" ")          
        netSplit = [] 
        for item in tempSplit: 
            if len(item) >0: 
                netSplit.append(item) 
        # update times

        prevTime = _ethInstance[ethx]['lastCheckTime']
        currTime = datetime.datetime.now()

        print "PrevTime=%s, CurrTime=%s" % (prevTime, currTime)
        _timeDiff = currTime - prevTime 
        
        #_ethInstance[ethx]['lastCheckTime'] = currTime 
        
        if _timeDiff.microseconds > 0: 
            try:
                # update last read/write bytes 
                _ethInstance[ethx]['lastReadBytes'] = _ethInstance[ethx]['readBytes']
                _ethInstance[ethx]['lastWriteBytes'] = _ethInstance[ethx]['writeBytes']
                if len(netSplit) == 17:
                    _ethInstance[ethx]['readBytes'] = int(netSplit[1])
                    _ethInstance[ethx]['writeBytes'] = int(netSplit[9])
                elif len(netSplit) == 16:
                    tmpStr = netSplit[0].lstrip()
                    tmpStr = tmpStr[len(ethx + ":"):]
                    _ethInstance[ethx]['readBytes'] = int(tmpStr) 
                    _ethInstance[ethx]['writeBytes'] = int(netSplit[8]) 
                else:
                    _Logger.error('HelperNetwork(GetInOutBW): Wrong number of items in netSplit %d' % len(netSplit))
                    _readBytes = 0
                    _writeBytes = 0
                # Kbs calcs
                print _timeDiff.seconds
                print _timeDiff.microseconds
                _timeDiffInSeconds = _timeDiff.seconds + (float(_timeDiff.microseconds) / 1000000)
                print 'lastRead: %s, currRead: %s' % (_ethInstance[ethx]['lastReadBytes'], _ethInstance[ethx]['readBytes'])
                print 'timediff %f, diffbyte %d' % (_timeDiffInSeconds,_ethInstance[ethx]['readBytes'] - _ethInstance[ethx]['lastReadBytes']) 
                _readBps = ((_ethInstance[ethx]['readBytes'] - _ethInstance[ethx]['lastReadBytes']) / _timeDiffInSeconds) 
                _writeBps = ((_ethInstance[ethx]['writeBytes'] - _ethInstance[ethx]['lastWriteBytes']) / _timeDiffInSeconds) 
                print 'read speed %s' % _readBps
                return (_readBps, _writeBps)
            except ValueError:
                _Logger.error('HelperNetwork(GetInOutBW): Invalid value error')
    #Bad interface name     
    else: 
        return (0, 0)

# Provide name, and return tuple (NIC state Up/Down, incoming bandwidth, outgoing bandwidth)
def GetEthInfo(ethx):
    # NIC state is store at this file /sys/class/net/ethx/operstate
    sStateFile = '/sys/class/net/%s/operstate' % ethx
    sState = 'Up'
    try:
        f = open(sStateFile, 'r')
        for line in f:
            if _StartWith(line, 'down'):
                sState = 'Down'
        f.close()
    except IOError as (errno, strerror):
        _Logger.error('HelperNetwork(GetEthInfo): Error - Read operstate - %d %s' % (errno, strerror))
    except:
        _Logger.error('HelperNetwork(GetEthInfo): Error - Read operstate - unknown error %s' % sys.exc_info()[0])

    #First call just to reempt the wrong result. GetInOutBW's first call will always be wrong
    GetInOutBW(ethx)    
    
    (inBW, outBW) = GetInOutBW(ethx) 
    return (sState, inBW, outBW)

## System ##
# Return tuple (CPU, Mem, Swap, HD)
def GetSystemUsage():
    iCPU = 0
    try:
        iCPU = int(resourceutils.GetCPU())
        #iCPU = int(psutil.cpu_percent(interval=0.1))
    except psutil.AccessDenied:
        _Logger.error('HelperNetwork(GetSystemUsage): Error - CPU percent acess denied')
    except psutil.TimeoutExpired:
        _Logger.error('HelperNetwork(GetSystemUsage): Error - CPU percent timeout')
    except:
        _Logger.error('HelperNetwork(GetSystemUsage): Error - CPU percent - unknown error %s' % sys.exc_info()[0])
    iMem = 0
    try:
        tmpMem=resourceutils.GetPhysicalMem()
        iMem = int(tmpMem[1])
        #iMem = int(psutil.phymem_usage().percent)
    except psutil.AccessDenied:
        _Logger.error('HelperNetwork(GetSystemUsage): Error - Memory percent acess denied')
    except psutil.TimeoutExpired:
        _Logger.error('HelperNetwork(GetSystemUsage): Error - Memory percent timeout')
    except:
        _Logger.error('HelperNetwork(GetSystemUsage): Error - Memory percent - unknown error %s' % sys.exc_info()[0])
    
    # Get swap usage
    iSwapTotal = 0
    iSwapFree = 0
    iSwap = 0
    try:
        f = open('/proc/meminfo', 'r')
        for line in f:
            if line.startwith('SwapTotal:'):
                iSwapTotal = int(line.split()[1])
            elif line.startwith('SwapFree:'):
                iSwapFree = int(line.split()[1])
        f.close()
    except IOError as (errno, strerror):
        _Logger.error('HelperNetwork(GetSystemUsage): Error - Swap percent - %d %s' % (errno, strerror))
    except:
        _Logger.error('HelperNetwork(GetSystemUsage): Error - Swap percent - unknown error %s' % sys.exc_info()[0])

    if iSwapTotal > 0:
        iSwap = int(100 - ((iSwapFree / iSwapTotal) * 100))
        
    #iHD = int(psutil.disk_usage('/').percent)
    tmpHD=resourceutils.GetHD()
    iHD = int(tmpHD[1])
    return (iCPU, iMem, iSwap, iHD)

def GETDBConnection(dbfile):
    conn = sqlite3.connect(dbfile)
    cur = conn.cursor()
    return conn, cur

def CloseDBConnection(conn, cur):
    if not cur is None:
        cur.close()
        
    if not conn is None:
        conn.close()
    
def InsertIntoDashboard(conn, cur, tResource):
   
    iCPU = tResource[0]
    iMem = tResource[1]
    iSwap = tResource[2]
    iHD = tResource[3]

    cur.execute('delete from Dashboard')
    conn.commit()
    cur.execute('insert into Dashboard(cpu, ram, swap, hd, version, avpattern, request, block, malware) values (?, ?, ?, ?, ?, ? , ?, ?, ?)',(iCPU, iMem, iSwap, iHD, '5.0', '', 0, 0, 0))
    conn.commit()
    print rrd_info.created_or_update('cpu', [rrd_info.cpu], [iCPU],'hardware')
    print rrd_info.created_or_update('ram', [rrd_info.usedram], [iMem],'hardware')
    print rrd_info.created_or_update('hd', [rrd_info.swapusage,rrd_info.hdusage], [iSwap,iHD],'hardware')
        
        
def InsertIntoNIC(conn, cur, argdict):
    try:
        cur.execute('insert into NIC(name) values (?)', (argdict['name'],))
        conn.commit()
        
    except:
        pass
    
def InsertIntoDashboardNIC(conn, cur, argdict):
    try:
        unitmega = 1024
        cur.execute('insert into DashboardNIC(name, status, inbw, outbw) values (?, ?, ?, ?)',
                    (argdict['name'], argdict['status'],round( argdict['inbw']/unitmega, 2), round( argdict['outbw']/unitmega, 2)))
        conn.commit()
        name = argdict['name']
        
        print rrd_info.created_or_update(name, [rrd_info.net_inbound, rrd_info.net_outbound], [argdict['inbw'], argdict['outbw']],'netusage')
        
    except:
        pass
    
def NICExist(conn, cur, name):
    try:
        cur.execute('select name from NIC where name = ?', (name,))
        o = cur.fetchone()
        if not o is None:
            return False
        
        return True
    
    except:
        pass
    
    return False

def UpdateDashboardNIC(conn, cur, argdict):
    try:
        unitmega = 1024
        cur.execute('update DashboardNIC set status = ?, inbw = ?, outbw = ? where name = ?',
                    (argdict['status'], round(argdict['inbw']/unitmega, 2), round(argdict['outbw']/unitmega, 2), argdict['name']))
        conn.commit()
        name = argdict['name']
        
        print rrd_info.created_or_update(name, [rrd_info.net_inbound, rrd_info.net_outbound], [argdict['inbw'], argdict['outbw']],'netusage')

    except:
        pass
    
def DeleteOldNIC(conn, cur, niclist, allnic):
    try:
        if allnic == []:
            return
        
        for nic in allnic:
            if nic in niclist:
                continue
            
            else:
                cur.execute('delete from NIC where name = ?', (nic,))
                conn.commit()
                
    except:
        pass
    
def DeleteOldDashboardNIC(conn, cur, niclist, allnic):
    try:
        if allnic == []:
            return
        
        for nic in allnic:
            if nic in niclist:
                continue
            
            else:
                cur.execute('delete from DashboardNIC where name = ?', (nic,))
                conn.commit()
                
    except:
        pass
    
def GetAllNIC(conn, cur):
    ls = []
    try:
        cur.execute('select name from NIC')
        all = cur.fetchall()
        for o in all:
            ls.append(o[0])
            
    except:
        pass
    
    return ls

def GetAllDashboardNIC(conn, cur):
    ls = []
    try:
        cur.execute('select name from DashboardNIC')
        all = cur.fetchall()
        for o in all:
            ls.append(o[0])
            
    except:
        pass
    
    return ls

    
## Main ##
if __name__  == "__main__" :
    Init()
    aNIC = GetNICNameList()
    print "NIC list"
    print aNIC
    
    DBFILE = None
    conn = None
    cur = None
    if len(sys.argv) < 2:
        print 'DB file not specified'
        
    else:
        DBFILE = sys.argv[1]
        if not os.path.exists(DBFILE):
            DBFILE = None
            print 'DB file does not exist'
    
    tResource = GetSystemUsage()
    print "Resources(CPU, Mem, Swap, HD)"
    print tResource
    if not DBFILE is None:
        conn, cur = GETDBConnection(DBFILE)
        
    InsertIntoDashboard(conn, cur, tResource)
    alldashboardnic = GetAllDashboardNIC(conn, cur)
    allnic = GetAllNIC(conn, cur)
    DeleteOldDashboardNIC(conn, cur, aNIC, alldashboardnic)
    DeleteOldNIC(conn, cur, aNIC, allnic)
    
    for nic in aNIC:
        print nic + " information"
        (status, inBW, outBW) = GetEthInfo(nic)
        print 'Status = %s, Incoming Bandwidth = %d Kbps, Outgoing Bandwidth = %d Kbps)' % (status, round(float(inBW)/1024, 0), round(float(outBW)/1024, 0))
        argls = [nic, status, inBW, outBW]
        argdict = {'name': nic,
                   'status': status,
                   'inbw': inBW,
                   'outbw': outBW}
        if nic in alldashboardnic:
            UpdateDashboardNIC(conn, cur, argdict)
            
        else:
            InsertIntoDashboardNIC(conn, cur, argdict)
            
        if not nic in allnic:
            InsertIntoNIC(conn, cur, argdict)
        
    CloseDBConnection(conn, cur)
