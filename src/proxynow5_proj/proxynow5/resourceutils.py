import time
import sqlite3
import sys
import os
os.environ['DJANGO_SETTINGS_MODULE'] = "proxynow5_proj.settings"
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + '/..')
import rrd_info 
import commands
import nowlog

_Logger = None

def Init():
    global _Logger
    _Logger = nowlog.SetLogConfig("/var/log/log-pn-resourceutils")

#This method returns a list -first value is total HD size in byte,
#second value is the Hard Disk Usage in percentage(without %)
#If any exception happens it returns a list in which both values are zero
def GetHD():
    result = []
    try:
        out=commands.getoutput("df").split('\n')
        for line in out:
            parts=line.split(' ')
            if len(parts)>1 and parts[-1]=='/':
                parts=filter (lambda a: a != '', parts)
                totalHD=parts[0]
                usedHDPercent=parts[3].replace('%','')
                result.append(float(totalHD)*1024)
                result.append(float(usedHDPercent))
                break
    except:
        result=[0,0]
        return result
    
    return result

        
#This method returns a list -first value is total physical Memory size in byte,
#second value is used memory in percentage(without %)  
#If any exception happens it returns a list in which both values are zero
def GetPhysicalMem():
    result = []
    try:
        out=commands.getoutput("free").split('\n')
        for line in out:
            parts=line.split(' ')
            if len(parts)>1 and parts[0]=='Mem:':
                parts=filter (lambda a: a != '', parts)
                totalMem=parts[1]
                usedMem=parts[2]
                usedMemPercent=int((float(usedMem)/float(totalMem))*100)
                result.insert(0,float(totalMem)*1024)
                result.insert(1,usedMemPercent)
    except:
        result=[0,0]
        return result
    
    return result

#This method returns a list -first value is total Swap memory size in byte,
#second value is used swap memory in percentage(without %)  
#If any exception happens it returns a list in which both values are zero
def GetSwapMem():
    result = []
    try:
        out=commands.getoutput("free").split('\n')
        for line in out:
            parts=line.split(' ')
            if len(parts)>1 and parts[0]=='Swap:':
                parts=filter (lambda a: a != '', parts)
                totalMem=parts[1]
                usedMem=parts[2]
                usedMemPercent=int((float(usedMem)/float(totalMem))*100)
                result.insert(0,float(totalMem)*1024)
                result.insert(1,usedMemPercent)
    except:
        result=[0,0]
        return result
    
    return result    
        

#This method returns the CPU usage in percentage(without %) in float data type
#If any exception happens it returns -1
def GetCPU(value=True):
    result = -1
    try:
        if value:
            out=commands.getoutput("top -n 2 -b").split('\n')
            for line in out:
                parts=line.split(' ')
                if len(parts)>1 and parts[0]=='Cpu(s):':
                    parts=filter (lambda a: a != '', parts)
                    tmp1=parts[1]
                    tmp2=parts[2]
                    tmp3=parts[3]
                    tmp1=tmp1.split('%')
                    tmp2=tmp2.split('%')
                    tmp3=tmp3.split('%')
                    tmp4=min(float(tmp1[0])+float(tmp2[0])+float(tmp3[0]),100)
                    result=round(tmp4,2)
        else:
            result=0
    except:
        return result
  
    
    return result


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
    

#This method returns a list which contains outgoing and incoming Network bandwidths in unit of kbps
#returns [incoming_bandwidth,outgoing_bandwidth]
# If any exception happens it returns [0,0]
def GetInOutBW(interface):
    ls = []
    try:
        net_in,net_out=internalmethod_getnetworkusage(interface)
        ls.insert(0,float(net_in))
        ls.insert(1,float(net_out))
        return ls
    except:
        ls=[0,0]
        return ls


#Internal Helper methods   
def internalmethod_getnetworkusage(interface):
    duration=2
    rx_bytes0, tx_bytes0 = internalmethod_getnetworkbytes(interface)
    time.sleep(duration)
    rx_bytes1, tx_bytes1 = internalmethod_getnetworkbytes(interface)
    
    inbound=float((int(rx_bytes1)*8-int(rx_bytes0)*8)/duration)
    inbound=inbound/1000
    
    outbound=float((int(tx_bytes1)*8-int(tx_bytes0)*8)/duration) 
    outbound=outbound/1000
    
    return(inbound,outbound)

#Internal Helper methods
def internalmethod_getnetworkbytes(interface):
    for line in open('/proc/net/dev', 'r'):
        if interface in line:
            data = line.split('%s:' % interface)[1].split()
            rx_bytes, tx_bytes = (data[0], data[8])
            return (rx_bytes, tx_bytes)


def _StartWith(fullstr, find):
    if str(fullstr).lower()[:len(find)] == str(find).lower():
        return True
    else:
        return False

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
    v = GetVersion()
    
    cur.execute('delete from Dashboard')
    conn.commit()
    cur.execute('insert into Dashboard(cpu, ram, swap, hd, version, avpattern, request, block, malware) values (?, ?, ?, ?, ?, ? , ?, ?, ?)',(iCPU, iMem, iSwap, iHD, v, '', 0, 0, 0))
    conn.commit()
    print rrd_info.created_or_update('cpu', [rrd_info.cpu], [iCPU],'hardware')
    print rrd_info.created_or_update('ram', [rrd_info.usedram], [iMem],'hardware')
    print rrd_info.created_or_update('hd', [rrd_info.swapusage,rrd_info.hdusage], [iSwap,iHD],'hardware')
    


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

     
    inBW, outBW = GetInOutBW(ethx) 
    return (sState, inBW, outBW)


# Return tuple (CPU, Mem, Swap, HD)
def GetSystemUsage():
    iCPU = 0
    try:
        #iCPU = int(psutil.cpu_percent(interval=0.1))
        iCPU=int(GetCPU())
    except:
        _Logger.error('HelperNetwork(GetSystemUsage): Error - CPU percent - unknown error %s' % sys.exc_info()[0])
    
    iMem = 0
    try:
        #iMem = int(psutil.phymem_usage().percent)
        MemStat=GetPhysicalMem()
        iMem=int(MemStat[1])
    except:
        _Logger.error('HelperNetwork(GetSystemUsage): Error - Memory percent - unknown error %s' % sys.exc_info()[0])
    
    # Get swap usage
    iSwap = 0
    try:
        SwapStat=GetSwapMem()
        iSwap=int(SwapStat[1])
    except IOError as (errno, strerror):
        _Logger.error('HelperNetwork(GetSystemUsage): Error - Swap percent - %d %s' % (errno, strerror))
    except:
        _Logger.error('HelperNetwork(GetSystemUsage): Error - Swap percent - unknown error %s' % sys.exc_info()[0])
                
    #iHD = int(psutil.disk_usage('/').percent)
    try:
        HDstat=GetHD()
        iHD = int(HDstat[1])
    except IOError as (errno, strerror):
        _Logger.error('HelperNetwork(GetSystemUsage): Error - HD percent - %d %s' % (errno, strerror))
    except:
        _Logger.error('HelperNetwork(GetSystemUsage): Error - HD percent - unknown error %s' % sys.exc_info()[0])
        
    return (iCPU, iMem, iSwap, iHD)





def GETDBConnection(dbfile):
    conn = sqlite3.connect(dbfile)
    cur = conn.cursor()
    return conn, cur



def InsertIntoNIC(conn, cur, argdict):
    try:
        cur.execute('insert into NIC(name) values (?)', (argdict['name'],))
        conn.commit()
        
    except:
        pass
    
    

def InsertIntoDashboardNIC(conn, cur, argdict):
    try:
        unitmega = 1
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
        unitmega = 1
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

def GetVersion():
    v="5.0.0"
    try:
        if os.path.exists('/proxynowBackups/current/details.txt'):
            v=commands.getoutput("cat /proxynowBackups/current/details.txt | grep -i 'Version number:' | cut -f2 -d ':' | tr -d ' '")
        if v == None :
            v="5.0.0"
  
    except:
        pass

    return v.strip()
    


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
        print 'Status = %s, Incoming Bandwidth = %d Kbps, Outgoing Bandwidth = %d Kbps)' % (status, round(float(inBW), 2), round(float(outBW), 2))
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





