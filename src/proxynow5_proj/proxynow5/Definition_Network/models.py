from django.db import models
from django.template.loader import get_template
from django.template.context import Context
from django.utils.translation import ugettext as _

DEFNET_TYPES = (
                (1, _(u'Host')),
                (2, _(u'DNS host')),
                (3, _(u'Network')),
                (4, _(u'Network group'))
)

class DefNet(models.Model):
    name = models.CharField(max_length=1024, unique=True, 
                            verbose_name=_(u'Name'))
    type = models.PositiveSmallIntegerField(choices=DEFNET_TYPES,
                                            default=1,
                                            verbose_name=_(u'Type'))
    comment = models.TextField(max_length=10240, blank=True, 
                               verbose_name=_(u'Comment'))
    
    def __unicode__(self):
        if self.type >= 1 <= 4:
            return u'%s (%s)' % (self.name, DEFNET_TYPES[self.type - 1][1])
        
        else:
            return u'%s' % self.name
        
    def get_type_name(self):
        if self.type >= 1 <= 4:
            return DEFNET_TYPES[self.type - 1][1]
        
        else:
            return ''
        
    def get_data(self):
        if self.type == 1:
            x = self.defnethost_set.get(id=self)
            return x.host
        
        elif self.type == 2:
            x = self.defnetdnshost_set.get(id=self)
            return x.hostname
        
        elif self.type == 3:
            x = self.defnetnetwork_set.get(id=self)
            return x.ipaddress
        
        return ''
    
    def get_html_repr(self):
        t = get_template('defnet/defnet_list_select_repr.html')
        c = Context({'o': self})
        r = t.render(c)
        return r
    
    class Meta:
        db_table = 'DefNet'
        ordering = ['name', 'type']
        
class DefNetHost(models.Model):
    id = models.ForeignKey(DefNet, primary_key=True, db_column='id', 
                           verbose_name=_(u'Id'))
    host = models.IPAddressField(verbose_name=_(u'Host'))
    
    class Meta:
        db_table = 'DefNetHost'
        
class DefNetDNSHost(models.Model):
    id = models.ForeignKey(DefNet, primary_key=True, db_column='id', 
                           verbose_name=_(u'Id'))
    hostname = models.CharField(max_length=1023, 
                                verbose_name=_(u'Hostname'))
    
    class Meta:
        db_table = 'DefNetDNSHost'
        
class DefNetNetwork(models.Model):
    id = models.ForeignKey(DefNet, primary_key=True, db_column='id', 
                           verbose_name=_(u'Id'))
    ipaddress = models.IPAddressField(verbose_name=_(u'Address'))
    netmask = models.IPAddressField(default='255.255.255.0', 
                                    verbose_name=_(u'Netmask'))
    
    class Meta:
        db_table = 'DefNetNetwork'
        
class DefNetGroup(models.Model):
    gid = models.ForeignKey(DefNet, db_column='gid', 
                           verbose_name=_(u'Id'))
    member = models.ForeignKey(DefNet, related_name='defnetgroups', db_column='member', 
                               verbose_name=_(u'Member'))
    
    class Meta:
        db_table = 'DefNetGroup'