from django.db import models
from django.utils.translation import ugettext as _
import datetime
from proxynow5_proj.proxynow5.exceptions import UIException

DEFSCHD_TYPES = (
                 (1, _(u'Single')),
                 (2, _(u'Recurring'))
)

DEFSCHD_DAYOFWEEK = (
                     (1, _(u'Monday')),
                     (2, _(u'Tuesday')),
                     (3, _(u'Wednesday')),
                     (4, _(u'Thursday')),
                     (5, _(u'Friday')),
                     (6, _(u'Saturday')),
                     (7, _(u'Sunday'))
)

class DefSchd(models.Model):
    name = models.CharField(max_length=1024, unique=True,
                            verbose_name=_(u'Name'))
    comment = models.TextField(max_length=10240, blank=True, 
                               verbose_name=_(u'Comment'))
    type = models.PositiveSmallIntegerField(choices=DEFSCHD_DAYOFWEEK,
                                            default=1,
                                            verbose_name=_(u'Type'))
    start = models.DateTimeField(verbose_name=_(u'Start Time'))
    end = models.DateTimeField(verbose_name=_(u'End Time'))
    weekdays = models.PositiveSmallIntegerField(choices=DEFSCHD_TYPES,
                                                verbose_name=_(u'Week days'))
    
    def get_data(self):
        if self.type == 1:
            return self.get_defschedule_gettime_single()
        
        elif self.type == 2:
            return self.get_defschedule_starttime_recuring()
        
        return ''
    
    class Meta:
        db_table = 'DefSchd'
        
    def get_defschedule_gettime_single(self):
        try:
            start = self.start
            end = self.end
            
            starttime = '%0*d' % (2, start.month) + "/" + '%0*d' % (2, start.day) + "/" + '%0*d' % (4, start.year) + "  " + '%0*d' % (2, start.hour) + ":" + '%0*d' % (2, start.minute)
            endtime = '%0*d' % (2, end.month) + "/" + '%0*d' % (2, end.day) + "/" + '%0*d' % (4, end.year) + "  " + '%0*d' % (2, end.hour) + ":" + '%0*d' % (2, end.minute)
            
            s = "From  " + starttime + " until  " + endtime
            
            return s
        
        except UIException,e:
            print "Error info : at model(schedule) of method get_defschedule_gettime_single  %s" %str(e)
            return ''
    
    def get_defschedule_starttime_recuring(self):
        try:
            Array = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            lst = []
            lstday = []
            s = ""
            st = ""
            
            start = self.start
            end = self.end
            weekdays = self.weekdays
            lst = convert2binary(weekdays)
            
            for i in range(0, len(lst)):
                lstday.append(Array[lst[i]])
            
            s = ' ,'.join(lstday)
            
            starttime = '%0*d' % (2, start.hour) + ":" + '%0*d' % (2, start.minute) 
            endtime = '%0*d' % (2, end.hour) + ":" + '%0*d' % (2, end.minute)
            
            st = "From " + starttime + " until " + endtime + " on " + s 
            
            return st
        
        except UIException,e:
            print "Error info : at model(schedule) of method get_defschedule_starttime_recuring  %s" %str(e)
            return ''
        
    
    def __unicode__(self):
        return u'%s' % self.name
        
def convert2binary(n):
    '''convert denary integer n to binary string bStr'''
    lst = []
    bStr = ''
    if n < 0:  raise ValueError, "must be a positive integer"
    if n == 0: return '0'
    while n > 0:
        bStr = str(n % 2) + bStr
        n = n >> 1
        
    if (8 - len(bStr) <= 0):
        return '00000000'
    
    s = ""
    count = 8 - len(bStr) 
    for i in range(0, count):
        s = s + "0";
    
    bStr = s + bStr;
    
    #Check the number is ok or not
    for i in range(0, 8): 
        if bStr[i] == '1':
            lst.append(i)
    
    return lst