import sys
import os
import datetime

#########################################################
#This Program outputs the changes since last change
#v1.0
#########################################################
if not len(sys.argv) == 2:
    print 'this program takes only one argument which is path to access.log'
    sys.exit(0)
    
#accessLogFile='/var/log/squid/access.log'
accessLogFile=sys.argv[1]
counterPath=os.path.join(os.path.dirname(sys.argv[0]),'counter')
start=0
endbyte=os.path.getsize(accessLogFile)
currDate=datetime.datetime.now()

if os.path.exists(counterPath):
    
    cd=open(counterPath,'r')
    logDateStr=cd.readline()
    tmpOffset=cd.readline()
    cd.close()
    
    logDateStr=filter (lambda a: a != '\n', logDateStr)
    logDate=datetime.datetime.strptime(logDateStr,"%Y-%m-%d")
    if not (currDate-logDate).days == 0:
        start=0
        wd=open(counterPath,'w')
        wd.write(currDate.strftime("%Y-%m-%d"))
        wd.write('\n')
        wd.write(str(0))
        wd.close()
    else:
        start=int(tmpOffset)
else:
    start=0

wd=open(counterPath,'w')
wd.write(currDate.strftime("%Y-%m-%d"))
wd.write('\n')
wd.write(str(endbyte))
wd.close()
    
if start==endbyte:
    try:
        exit(0)
    except(Exception):
        pass

f=open(accessLogFile,'r')

if not start==0:
    f.seek(start+1)

sys.stdout.write(f.read(endbyte-start))

f.close()
