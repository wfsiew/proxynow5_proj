from django.db import models
from django.utils.translation import ugettext as _

class Admin(models.Model):
    datetime = models.DateTimeField(verbose_name=_(u'Appliance date time'))
    timezone = models.CharField(max_length=100, verbose_name=_(u'Appliance timezone'))
    
    class Meta:
        db_table = 'Admin'
        
class ADInfo(models.Model):
    adserver = models.CharField(max_length=100, verbose_name=_(u'Active Directory server address'))
    addomain = models.CharField(max_length=100, verbose_name=_(u'Active Directory domain'))
    adusername = models.CharField(max_length=100, verbose_name=_(u'Active Directory Administrator username'))
    adpassword = models.CharField(max_length=1024, verbose_name=_(u'Active Directory Administrator password'))
    
    class Meta:
        db_table = 'ADInfo'