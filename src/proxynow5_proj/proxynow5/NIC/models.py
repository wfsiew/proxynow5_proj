from django.db import models
from django.utils.translation import ugettext as _

class NIC(models.Model):
    name = models.CharField(max_length=1024, unique=True,
                            verbose_name=_(u'Name'))
    
    def __unicode__(self):
        return u'%s' % self.name
    
    class Meta:
        db_table = 'NIC'
        ordering = ['name']