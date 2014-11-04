'''
Created on Nov 8, 2011

@author: user
'''
import sqlite3
import os
from settings import REPORT_PATH_SQL


namefile = os.path.join(REPORT_PATH_SQL,'historicallogdb.db') 

nameotherdata = "\'" + os.path.join(REPORT_PATH_SQL,'realtimelogdb.db')  + "\'"
'''
    This class will connect to DB
'''    
class ProcessData():
    
    def __init__(self,):
        self.con = sqlite3.connect
        self.cur = sqlite3.Cursor
        
    def connectsqlite(self):
        self.con = sqlite3.connect(namefile)
        self.cur = self.con.cursor()
    
    def connectproxydb(self,filedb):
        self.con = sqlite3.connect(filedb)
        self.cur = self.con.cursor()
    
    def attachotherdb(self):
        try:
            attachcommand = " ATTACH DATABASE " + nameotherdata + " As 'realtime' " 
            print " attachcommand %s " %attachcommand 
            self.cur.execute(attachcommand)
            return True
            
        except Exception,e:
            print "Error command at reportconnectsql.py method attachotherdb  : %s" %(str(e)) 
            return False
        
    def getdatasqlite(self,sqlcommand):
        
        try:
            
            self.cur.execute(sqlcommand)
            
            fetall = self.cur.fetchall()
         
            return fetall
        
        except Exception,e:
            
            print "Error command at reportconnectsql.py method getdatasqlite  : %s" %(str(e)) 
            return

    def closeconnection(self):
        
        self.cur.close()
        self.con.close()
        
        
        
        