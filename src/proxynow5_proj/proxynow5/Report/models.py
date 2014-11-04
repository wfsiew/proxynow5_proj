from django.db import models

class ReportType(models.Model):
    type  = models.CharField(max_length=1024, unique=True)
    active = models.PositiveSmallIntegerField() 
    
    class Meta:
        db_table = 'ReportType'
    
class ReportListEmail(models.Model):
    emailaddress = models.CharField(max_length=1024, unique=True)
    
    def __unicode__(self):
        return u'%s,%s' %(self.id,self.emailaddress)
    
    class Meta:
        db_table = 'ReportListEmail'
        
    def get_id(self):
        return u'%s' %(self.id)
    
class ReportByEmail(models.Model):
    emailaddress = models.ForeignKey(ReportListEmail, db_column='emailaddress')
    type = models.ForeignKey(ReportType, db_column='type')
    
    def __unicode__(self):
        return u'%s' % self.emailaddress
    
    class Meta:
        db_table = 'ReportByEmail'
        unique_together = ['emailaddress','type']
    
    def get_name(self):
        return u'%s' % self.emailaddress
        

class ReportServerMail(models.Model):
    emailfromaddress = models.CharField(max_length=1024)
    
    smtphost = models.CharField(max_length=1024)
    smtpport = models.CharField(max_length=50)  
    smtpuser = models.CharField(max_length=1024) 
    smtppass = models.CharField(max_length=1024) 
    smtpsecure = models.CharField(max_length=50)
    
    def __unicode__(self):
        return u'%s' %self.emailfromaddress
    
    class Meta:
        db_table = 'ReportServerMail'


   
        