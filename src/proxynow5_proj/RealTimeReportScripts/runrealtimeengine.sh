#!/bin/sh

x=/var/www/proxynow5_proj/RealTimeReportScripts/readfile.pyc      #Path to readfile.py file
y=/opt/squid/var/logs/access.log        	   #Path to squid access.log
z=/opt/squid/var/logs/                             #Path to Calamaris output directory
a=$z/calamaris.txt                  #Path to calamaris.txt file which is output of Calamaris program(unformatted)
b=/var/www/proxynow5_proj/RealTimeReportScripts/realtime-calamparser.pyc #Path to calamaris parser python code
db=/var/www/proxynow5_proj/RealTimeReportScripts/realtimelogdb.db

#Previously it was like this but this generates 'other' records so we deleted -a option
#/usr/local/python2.7/bin/python $x $y |/usr/local/calamaris/calamaris --output-path $z -a -t -1 -R -1 -F unformatted -U K 
/usr/local/python2.7/bin/python $x $y |/usr/local/calamaris/calamaris --output-path $z -t -1 -R -1 -F unformatted -U K 

if [ -f $a ];
then
/usr/local/python2.7/bin/python $b $a $db
# to make sure that we dont read one report more than one time we have to delete the old report first
rm -f $a
fi
