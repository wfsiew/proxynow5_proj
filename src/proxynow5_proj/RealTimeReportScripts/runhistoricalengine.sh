#!/bin/sh
DATE=`/bin/date --date=yesterday +%d-%m-%y`

y=/opt/squid/var/logs/access.log-${DATE}      #Path to squid access.log
z=/opt/squid/var/logs/                        #Path to Calamaris output directory
a=hcalamaris.txt                              #Path to hcalamaris.txt file which is output of Calamaris program(unformatted)
b=/var/www/proxynow5_proj/RealTimeReportScripts/historical-calamparser.pyc  #Path to calamaris parser python code
db=/var/www/proxynow5_proj/RealTimeReportScripts/historicallogdb.db

#Previously it was like this but this generates 'other' records so we deleted -a option
#cat $y|/usr/local/calamaris/calamaris --output-path $z --output-file $a -a -t -1 -R -1 -F unformatted -U K
cat $y|/usr/local/calamaris/calamaris --output-path $z --output-file $a -t -1 -R -1 -F unformatted -U K 

if [ -f $z$a ];
then
/usr/local/python2.7/bin/python $b $z$a $db
# to make sure that we dont read one report more than one time we have to delete the old report first
rm -f $z$a
fi
