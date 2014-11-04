import traceback
import cStringIO
import logging, logging.handlers
import datetime
import time

#------------------------------------------------------------------------------------------------------------#

GlobalLoggerList = {}

#------------------------------------------------------------------------------------------------------------#

def SetLogConfig (namefile):
    
    if GlobalLoggerList.has_key(namefile) :
        return GlobalLoggerList[namefile]    
    
    logfile = logging.handlers.TimedRotatingFileHandler(namefile , 'midnight', 1, backupCount=91)
    logfile.setLevel(logging.INFO)    
    FORMAT = "%(asctime)-15s %(levelname)s:[%(thread)d]:%(message)s"           
    logfile.setFormatter(logging.Formatter(FORMAT))    
    
    Logger = logging.getLogger(namefile)
    Logger.addHandler(logfile)
    Logger.setLevel(logging.INFO)
    
    GlobalLoggerList[namefile] = Logger
    
    return Logger

#------------------------------------------------------------------------------------------------------------#

def LogExceptions (logger):
    
    f = cStringIO.StringIO()
    traceback.print_exc(file = f)
  
    m_Logger = logger
    lines = f.getvalue()    
    lines = [x.strip() for x in lines.splitlines()]
    sstr = lines[0] + "\n"
    
    if (len(lines) > 1):
        for x in range(1,len(lines)) :
            sstr = sstr + "\t" + lines[x] + "\n"
    
    m_Logger.error(sstr)
    print "=" * 30
    print sstr
    print "=" * 30
    
#------------------------------------------------------------------------------------------------------------#

if __name__ == "__main__" :
    
    logger = SetLogConfig("/var/log/log-test")        
    
    for x in range(1, 1000) :
        logger.info("hello")
        time.sleep(1)
    