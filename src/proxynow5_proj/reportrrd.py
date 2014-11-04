from pyrrd.graph import ColorAttributes, DEF, CDEF, VDEF, LINE, AREA, GPRINT, \
    Graph
from pyrrd.rrd import DataSource, RRD, RRA, DS
from pyrrd.util import epoch
from subprocess import call, Popen, PIPE
import datetime
import random
import rrd_info
from settings import REPORT_PATH_DATA,REPORT_PATH_IMAGE,DBFILE,DIRNAME
import sqlite3
import os
from proxynow5 import utils

''' '''

#REPORT_PATH_DATA = os.path.join(folderrrd,"%s.rrd")

#resolution
#WEEK:4:MONTH:1:MONTH:1:%M
x_axis = {
          'days' : "MINUTE:30:HOUR:2:HOUR:2:0:%H:%M",
          'weeks' : "HOUR:6:DAY:1:DAY:1:86400:%A",
          '_months' : "DAY:1:DAY:1:DAY:1:86400:%d",
          '_years' : "" 
          }


''' key : type of chart , value : name of function'''
func = {
         'hardware' : 'generate_graph_hardware',
         'netusage' : 'generate_graph_netusage',
        }

''' To show the title. '''
graph_info = { 'days' : "\" Report %s Daily\"", 
               'weeks': "\" Report %s Weekly\"",
               '_months' : "\" Report %s Monthly \"",
               '_years' : "\" Report %s Yearly \"" }

''' URl of picture'''
url_pic = '/rept_image/'


def get_x_axis(typetime):
    x = ""
    
    if x_axis.has_key(typetime):
        x = x_axis[typetime]
       
    return x

def get_starttime(typetime,endtime):
    start =datetime.datetime.now()
    
    if typetime ==  "days":
        start = endtime - datetime.timedelta(days=1)
        
    if typetime == "weeks":
        start = endtime - datetime.timedelta(weeks=1)
        
    if typetime == "_months":
        start = endtime - datetime.timedelta(days=31)
        
    if typetime == "_years":
        start = endtime - datetime.timedelta(days=365)
        
    return start


def get_header_detail(types):
    
    if types == "cpu":
        return "CPU Utilization (%s)" 
    elif types == "ram":
        return  "RAM Utilization (%s)"
    elif types == "hd":
        return  "Hard Disk Utilization (%s)" 
    else:
        return "Network Traffic Utilization (%s) (%s)"
    

# Parameters : 
# types  :cpu,ram,hd, eth0
# typetime :  
def get_header(types,typetime,starttime,endtime):
    
    try :
        print "Get Header :Types %s and typetime %s" %(types,typetime)
        
        detailtitle = get_header_detail(types)
        str = ""
        if types in ["cpu","ram","hd"]:
            if typetime == "days":
                s = endtime.strftime("%d %B %Y")
                str = detailtitle%s
                
            if typetime in ["weeks","_months","_years"]:
                s1 = starttime.strftime("%Y/%m/%d") 
                s2 = endtime.strftime("%Y/%m/%d") 
                str1 = "%s - %s" %(s1,s2)
                str = detailtitle%str1
        else:
            if typetime == "days":
                s = endtime.strftime("%d %B %Y") 
                str = detailtitle % (types,s)
                
            if typetime in ["weeks","_months","_years"]:
                s1 = starttime.strftime("%Y/%m/%d") 
                s2 = endtime.strftime("%Y/%m/%d") 
                str1 = "%s - %s" %(s1,s2)
                str = detailtitle % (types,str1)
                
        return "\"" + str + "\""
          
    except Exception,e:
        print "Error Info %s " %(e)
        return "report"
#    if graph_info.has_key(typetime):
#        dictheader_ = graph_info[typetime]
#        return  dictheader_ %types
    
   

def set_color():
    ca = ColorAttributes()
    ca.back = '#333333'
    ca.canvas = '#333333'
    ca.shadea = '#000000'
    ca.shadeb = '#111111'
    ca.mgrid = '#CCCCCC'
    ca.axis = '#FFFFFF'
    ca.frame = '#AAAAAA'
    ca.font = '#FFFFFF'
    ca.arrow = '#FFFFFF'
    return ca
    
def get_path_image(fullpathimage,namefile):
    if os.path.exists(fullpathimage):
        return url_pic + namefile
    else:
        print "Module reportrrd at method get_path_image : can't find this path : %s " %(fullpathimage) 
        return ""

def linecpu(filename,steps):
    
    lst = []
    
    def_cpu = DEF(rrdfile=filename, vname='cpuvar',dsName=rrd_info.dscpu.name,cdef='MAX')    
            
    cdef_cpu = CDEF(vname='mycpu', rpn='%s' % def_cpu.vname)
        
    area_cpu = AREA(defObj=def_cpu, color='#000099' , legend ='CPU Usage (%)')
    #linemax = LINE(value=100, color='#000099')
        
    vdeflast_cpu = VDEF(vname='mycpulast', rpn='%s,LAST' % cdef_cpu.vname)
    vdefmax_cpu = VDEF(vname='mycpumax', rpn='%s,MAXIMUM' % cdef_cpu.vname)
    vdefaver_cpu = VDEF(vname='myavg', rpn='%s,AVERAGE' % cdef_cpu.vname)
        
    #vdefmin = VDEF(vname='myavg', rpn='0')
    #linemin = LINE(value=10, color='#000099',stack=True)
    gprint_cpu_current = GPRINT(vdeflast_cpu, 'Current : %5.2lf \t')
    gprint_cpu_max = GPRINT(vdefmax_cpu, 'Maximum : %5.2lf \t')
    gprint_cpu_average = GPRINT(vdefaver_cpu, 'Average : %5.2lf')
        
    return [def_cpu,cdef_cpu,area_cpu,vdeflast_cpu,vdefmax_cpu,vdefaver_cpu,gprint_cpu_current,gprint_cpu_max,gprint_cpu_average]
    
    
def lineusedram(filename,steps):
     
    lst = []
        
    def_usedram = DEF(rrdfile=filename, vname='vusedram',dsName=rrd_info.dsusedram.name,cdef='MAX')
    cdef_usedram = CDEF(vname='myusedram', rpn='%s' % def_usedram.vname) 
     
    vdefmax_usedram = VDEF(vname='myusedrammax', rpn='%s,MAXIMUM' % def_usedram.vname)
    vdeflast_usedram = VDEF(vname='myusedramlast', rpn='%s,LAST' % def_usedram.vname)
    vdefaver_usedram = VDEF(vname='myusedramavg', rpn='%s,AVERAGE' % def_usedram.vname)
        
    gprint_cur_usedram = GPRINT(vdeflast_usedram, 'Current %5.2lf \t')
    gprint_max_usedram = GPRINT(vdefmax_usedram, 'Maximum: %5.2lf \t')
    gprint_avr_usedram = GPRINT(vdefaver_usedram, 'Average %5.2lf \\n')
        
    line_usedram = AREA(defObj = cdef_usedram,color = '#000099',legend = 'Memory usage (%)')
    
    return [def_usedram,cdef_usedram,line_usedram,vdefmax_usedram,vdeflast_usedram,vdefaver_usedram,gprint_cur_usedram,gprint_max_usedram,gprint_avr_usedram]


def lineswapused(filename,steps):     
    lst = []
        
    def_swapusage = DEF(rrdfile=filename, vname='vswapusage',dsName=rrd_info.dsswapusage.name,cdef='MAX')
    
    cdef_swapusage = CDEF(vname='myswapusage', rpn='%s' % def_swapusage.vname) 
    
    vdefmax_swapusage = VDEF(vname='myswapusagemax', rpn='%s,MAXIMUM' % def_swapusage.vname)
    vdeflast_swapusage = VDEF(vname='myswapusagelast', rpn='%s,LAST' % def_swapusage.vname)
    vdefaver_swapusage = VDEF(vname='myswapusageavg', rpn='%s,AVERAGE' % def_swapusage.vname)
       
    gprint_cur_swapusage = GPRINT(vdeflast_swapusage, 'Current %5.2lf \t')
    gprint_max_swapusage = GPRINT(vdefmax_swapusage, 'Maximum: %5.2lf \t')
    gprint_avr_swapusage = GPRINT(vdefaver_swapusage, 'Average %5.2lf \\n')
    
    area_swapusage = AREA(defObj = cdef_swapusage,color = '#000099',legend = 'Swap  usage (%)')
   
    return [def_swapusage,cdef_swapusage,area_swapusage,vdefmax_swapusage,vdeflast_swapusage,vdefaver_swapusage,gprint_cur_swapusage,gprint_max_swapusage,gprint_avr_swapusage]
        

def linehdusage(filename,steps):
    lst = []
        
    def_hdusage = DEF(rrdfile=filename, vname='vhdusage',dsName=rrd_info.dshdusage.name,cdef='MAX')
    cdef_hdusage = CDEF(vname='myhdusage', rpn='%s' % def_hdusage.vname) 
     
    vdefmax_hdusage = VDEF(vname='myhdusagemax', rpn='%s,MAXIMUM' % cdef_hdusage.vname)
    vdeflast_hdusage = VDEF(vname='myhdusagelast', rpn='%s,LAST' % cdef_hdusage.vname)
    vdefaver_hdusage = VDEF(vname='myhdusageavg', rpn='%s,AVERAGE' % cdef_hdusage.vname)
        
    gprint_cur_hdusage = GPRINT(vdeflast_hdusage, 'Current %5.2lf \t')
    gprint_max_hdusage = GPRINT(vdefmax_hdusage, 'Maximum: %5.2lf \t')
    gprint_avr_hdusage = GPRINT(vdefaver_hdusage, 'Average %5.2lf \\n')
        
    line_hdusage = AREA(defObj = cdef_hdusage,color = '#00FF00',legend = 'HD    usage (%)')
   
    return [def_hdusage,cdef_hdusage,line_hdusage,vdefmax_hdusage,vdeflast_hdusage,vdefaver_hdusage,gprint_cur_hdusage,gprint_max_hdusage,gprint_avr_hdusage]

def linenet_inbound(filename,steps):
    
    lst = []  
    def_inbound = DEF(rrdfile=filename, vname='vnet_inbound',dsName=rrd_info.dsnetinbound.name,cdef='MAX')
    
    cdef_inboundnor = CDEF(vname='mynet_inboundnor', rpn='%s,1,*' % def_inbound.vname) 
    cdef_inbound = CDEF(vname='mynet_inbound', rpn='%s,1000,*' % def_inbound.vname) 
     
    vdefmax_inbound = VDEF(vname='mynet_inboundmax', rpn='%s,MAXIMUM' % cdef_inboundnor.vname)
    vdeflast_inbound = VDEF(vname='mynet_inboundlast', rpn='%s,LAST' % cdef_inboundnor.vname)
    vdefaver_inbound = VDEF(vname='mynet_inboundavg', rpn='%s,AVERAGE' % cdef_inboundnor.vname)
        
    gprint_cur_inbound = GPRINT(vdeflast_inbound, 'Current: %5.2lf kbps\t')
    gprint_max_inbound = GPRINT(vdefmax_inbound, 'Maximum: %5.2lf kbps\t')
    gprint_avr_inbound = GPRINT(vdefaver_inbound, 'Average: %5.2lf kbps\\n')
        
    Line_inbound = AREA(defObj = cdef_inbound,color = '#00FF00',legend = 'Inbound ')
    
    return [def_inbound,cdef_inboundnor,cdef_inbound,vdefmax_inbound,vdeflast_inbound,vdefaver_inbound,Line_inbound,gprint_cur_inbound,gprint_max_inbound,gprint_avr_inbound]

def linenet_outbound(filename,steps):
    
    lst = []     
    def_outbound = DEF(rrdfile=filename, vname='vnet_outbound',dsName=rrd_info.dsnetoutbound.name,cdef='MAX')
    
    cdef_outboundnor = CDEF(vname='mynet_outboundnor', rpn='%s,1,*' % def_outbound.vname)
    cdef_outbound = CDEF(vname='mynet_outbound', rpn='%s,1000,*' % def_outbound.vname) 
     
    vdefmax_outbound = VDEF(vname='mynet_outboundmax', rpn='%s,MAXIMUM' % cdef_outboundnor.vname)
    vdeflast_outbound = VDEF(vname='mynet_outboundlast', rpn='%s,LAST' % cdef_outboundnor.vname)
    vdefaver_outbound = VDEF(vname='mynet_outboundavg', rpn='%s,AVERAGE' % cdef_outboundnor.vname)
        
    gprint_cur_outbound = GPRINT(vdeflast_outbound, 'Current: %5.2lf kbps\t')
    gprint_max_outbound = GPRINT(vdefmax_outbound, 'Maximum: %5.2lf kbps\t')
    gprint_avr_outbound = GPRINT(vdefaver_outbound, 'Average: %5.2lf kbps\\n')
        
    #line_outbound = AREA(defObj = cdef_outbound,color = '#0000FF',legend = 'Outbound ')
    line_outbound = LINE(defObj = cdef_outbound,color = '#0000FF',legend = 'Outbound')
    
    return [def_outbound,cdef_outboundnor,cdef_outbound,line_outbound,vdefmax_outbound,vdeflast_outbound,vdefaver_outbound,gprint_cur_outbound,gprint_max_outbound,gprint_avr_outbound]

        
''' Generate Graph get_filename(kind) '''
def generate_graph_hardware(filename,starttime,endtime,steps, xaxis,header,ca,lstline):
   
    try:
        
        #name file of  rrdfile.
        rrdfile = rrd_info.get_filename(filename)
        
        namefile = "%s_%s_%s.png" %(filename,starttime,endtime) 
        lst = []
        
        (resultcreate,errorcreate) = utils.create_folder(REPORT_PATH_IMAGE)
        
        if resultcreate == False:
            raise utils.UIException(str(errorcreate))
        
        # name file of picture
        REPORT_PATH_IMAGEname = os.path.join(REPORT_PATH_IMAGE ,namefile)
        
        g = Graph(REPORT_PATH_IMAGEname, start=starttime, end=endtime,vertical_label="Percentage",lower_limit='0',upper_limit='100',title=header,x_grid=xaxis,y_grid='1:20',width=560,height=110,color=ca)
        if filename == 'ram':
            cflineram = []
            cflineram = lineusedram(rrdfile,0)
            g.data.extend(cflineram)
            
        if filename == 'cpu':
            cflinecpu = []
            cflinecpu = linecpu(rrdfile,0)
            g.data.extend(cflinecpu)
            
        if filename =="hd":
            cflineswap = []
            cflineusage = []
            c = []
            
            cflineswap = lineswapused(rrdfile,0)   
            cflineusage = linehdusage(rrdfile,0)
            c.extend(cflineswap)
            c.extend(cflineusage)
            g.data.extend(c)
                
        g.write()
        
        return get_path_image(REPORT_PATH_IMAGEname, namefile)
                
    except utils.UIException ,e:
        print "Error Info at generate_graph_hardware : %s" %e
        return ""
         

def generate_graph_netusage(filename,starttime,endtime,steps, xaxis,header,ca,lstline):
    try:
        # for net work usage i add more
        rrdfile = rrd_info.get_filename(filename)
        
        print "RRD file name %s Network." %(rrdfile)

        namefile = "%s_%s_%s.png" %(filename,starttime,endtime) 
        
        (resultcreate,errorcreate) = utils.create_folder(REPORT_PATH_IMAGE)
        
        if resultcreate == False:
            raise utils.UIException(str(errorcreate))
        
        # REPORT_PATH_IMAGE the place to store pic.
        REPORT_PATH_IMAGEname = os.path.join(REPORT_PATH_IMAGE,namefile)
        
        lst = []
        
        g = Graph(REPORT_PATH_IMAGEname, start=starttime, end=endtime,vertical_label="\"Bit Per Second\"",color=ca,lower_limit='0',title=header)
        g.x_grid = xaxis
        #g.y_grid = '1:20'
        g.width = 560
        
        for each_lstline in lstline:
            cfline = []
            if each_lstline == rrd_info.net_inbound:   
                cfline = linenet_inbound(rrdfile,steps)
            elif each_lstline == rrd_info.net_outbound:
                cfline = linenet_outbound(rrdfile, steps)
            
            if len(cfline) > 0:
                lst.extend(cfline)
                
        g.data.extend(lst)  
        g.write()
        
        return get_path_image(REPORT_PATH_IMAGEname, namefile)
        
    except utils.UIException ,e:
        print "Error Info At reportrrd.py method generate_graph_netusage : %s" %e
        return ""

'''
types : the list of elements that you want to make report
format:
name of rrd|field in data | type of info 
['hd|swapusage_hdusage|network',.......]

typetime : year,day,month......
EX : 
'''     
def create_graph(types,typetime):
    
    try:
        typofinfo = "hardware"
        #_months
        #types = ['cpu*cpu','ram']
        #typetime = 'weeks'
        ''' list of path of image '''
        lst = []
        
        ca = set_color()
        # For Testing i disable end time and us
        end = datetime.datetime.now()
        start = get_starttime(typetime,end)
         
        '''
        
        '''
        xaxis = get_x_axis(typetime)
        starttime = epoch(start)
        endtime = epoch(end)
        
        print "type time %s" %str(typetime)        
        print "start time %s " %(starttime)
        print "end time %s " %(endtime)
        print "types %s" %(types) 
        
        # end temp here
        for kind in types:
            lstinfo =  kind.split('|') 
            
            # file name of rrd.
            filename = rrd_info.get_filename(lstinfo[0])
            
            print "File name rrd %s " %(filename)
             
            ''' 
            Get resolution for daily,month,year,week
            '''
            dict = {}
            if rrd_info.config_info.has_key(lstinfo[2]):
                dict = rrd_info.config_info[lstinfo[2]]
        
            steps = dict[typetime] 

            # Check the file rrd is existed or not.
            if os.path.exists(filename) :
                
                if  func.has_key(lstinfo[2]):
                    s = func[lstinfo[2]]
                    funcProfile = globals()[s]
                    
                    header = get_header(lstinfo[0], typetime,start,end)
                    
                    namepic = funcProfile(lstinfo[0],starttime,endtime,steps,xaxis,header,ca,lstinfo[1].split('*'))
                    
                    if namepic != "" :
                        if namepic.startswith(url_pic): 
                            lst.append(namepic)
            else :
                print "File %s is not existed." %(filename) 
                
        return lst
    
    except utils.UIException,e:
        print "Error Info : At method create_graph %s " %str(e)
        return "Error Info : %s" %e
     

def GETDBConnection(dbfile):
    conn = sqlite3.connect(dbfile)
    cur = conn.cursor()
    return conn, cur

def CloseDBConnection(conn, cur):
    try:
    
        if not cur is None:
            cur.close()
            
        if not conn is None:
            conn.close()
    except :
        pass
    
def generategraph(ispage,types,typetime):
    
    try:
        if ispage == 'hardware':
            lsttypes = types.split(',')
            s = create_graph(lsttypes,typetime)
            
        '''
        Todo : check exception here.
        '''
        str  = ""
        detailgraph = ""
        if ispage == 'netusage':
            
            if not DBFILE is None:
                conn, cur = GETDBConnection(DBFILE)
            
            # Select the list of Net interface.
            strcommand = "select tbnic.name,tbnetit.type from NetInt tbnetit,NIC tbnic where tbnetit.hardware = tbnic.id"
            lstobj = cur.execute(strcommand)
            
            #CloseDBConnection(conn, cur)
    #        lstobj = NetInt.objects.all()
    #        str1 = ""
            lsttypes =[]
    #            
            for netobj in lstobj:
                (name,typeinfo) = netobj
                hardware = name.replace(" ","_")
    #                
                str1 = "%s|%s*%s|%s" %(hardware,rrd_info.net_inbound,rrd_info.net_outbound,'netusage') 
                print "string %s" %str1 
                lsttypes.append(str1)
    #                
            print "run create graph "            
            s = create_graph(lsttypes,typetime)   
            CloseDBConnection(conn, cur)
        return s
    
    except Exception,e:
        print "Error Info at reportrrd of method generategraph : %s " %str(e)
        return ""


