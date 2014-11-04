from django.db import models
from proxynow5_proj.proxynow5.Definition_Network.models import DefNet
from proxynow5_proj.proxynow5.NIC.models import NIC
from django.utils.translation import ugettext as _

NETINT_TYPES = (
                (1, _(u'ethernet standard')),
)

DEFAULT_NETINT_MTU = 1500

class NetInt(models.Model):
    name = models.CharField(max_length=1024, unique=True,
                            verbose_name=_(u'Name'))
    type = models.PositiveSmallIntegerField(choices=NETINT_TYPES,
                                            verbose_name=_(u'Type'))
    hardware = models.ForeignKey(NIC, db_column='hardware', verbose_name=_(u'Hardware'))
    address = models.IPAddressField(verbose_name=_(u'IP address'))
    netmask = models.IPAddressField(verbose_name=_(u'Netmask'))
    gateway = models.IPAddressField(blank=True, verbose_name=_(u'Default GW'))
    mtu = models.PositiveIntegerField(default=DEFAULT_NETINT_MTU, verbose_name=_(u'MTU'))
    comment = models.TextField(max_length=10240, blank=True, 
                               verbose_name=_(u'Comment'))
    
    def __unicode__(self):
        if self.type == 1:
            return u'%s (%s)' % (self.name, NETINT_TYPES[self.type - 1][1])
        
        else:
            return u'%s' % self.name
        
    def get_type_name(self):
        if self.type == 1:
            return NETINT_TYPES[self.type - 1][1].capitalize()
        
        else:
            return ''
    
    class Meta:
        db_table = 'NetInt'
        ordering = ['name']
        
class NetLB(models.Model):
    id = models.ForeignKey(NetInt, primary_key=True, db_column='id', verbose_name=_(u'Interface'))
    
    class Meta:
        db_table = 'NetLB'
        
class NetDHCP(models.Model):
    netid = models.ForeignKey(NetInt, primary_key=True, db_column='netid', verbose_name=_(u'Interface'))
    start = models.IPAddressField(verbose_name=_(u'Range start'))
    end = models.IPAddressField(verbose_name=_(u'Range end'))
    dnsserver1 = models.IPAddressField(verbose_name=_(u'DNS Server 1'))
    dnsserver2 = models.IPAddressField(verbose_name=_(u'DNS Server 2'))
    gateway = models.IPAddressField(verbose_name=_(u'Default gateway'))
    domain = models.CharField(max_length=100, verbose_name=_(u'Domain'))
    leasetime = models.PositiveIntegerField(verbose_name=_(u'Lease Time (sec)'))
    
    class Meta:
        db_table = 'NetDHCP'
        
class NetRoute(models.Model):
    netid = models.ForeignKey(DefNet, db_column='netid', verbose_name=_(u'Destination'))
    gwid = models.ForeignKey(DefNet, db_column='gwid', related_name='netroutegateways', verbose_name=_(u'Gateway'))
    comment = models.TextField(max_length=10240, blank=True, 
                               verbose_name=_(u'Comment'))
    
    class Meta:
        db_table = 'NetRoute'
        
class NetDNSAllowNet(models.Model):
    id = models.ForeignKey(DefNet, primary_key=True, db_column='id', verbose_name=_(u'Id'))
    
    class Meta:
        db_table = 'NetDNSAllowNet'
        
class NetDNSRelay(models.Model):
    id = models.ForeignKey(DefNet, primary_key=True, db_column='id', verbose_name=_(u'Id'))
    
    class Meta:
        db_table = 'NetDNSRelay'