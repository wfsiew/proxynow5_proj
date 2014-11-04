from django.db import models
from django.utils.translation import ugettext as _
from proxynow5_proj.proxynow5.Network.models import NetInt
from proxynow5_proj.proxynow5.Definition_Services.models import DefServices
from proxynow5_proj.proxynow5.Definition_Network.models import DefNet

NAT_DNAT_SNAT_MODES = (
                       (1, _(u'DNAT')),
                       (2, _(u'SNAT')),
                       (3, _(u'Both'))
)

class NAT_PF(models.Model):
    interface = models.ForeignKey(NetInt, db_column='interface',
                                  verbose_name=_(u'Interface'))
    originalPort = models.ForeignKey(DefServices, related_name='natpforiginalports', db_column='originalPort',
                                     verbose_name=_(u'Port'))
    host = models.ForeignKey(DefNet, related_name='natpfhosts', db_column='host',
                             verbose_name=_(u'Host'))
    newService = models.ForeignKey(DefServices, related_name='natpfnewservices', db_column='newService',
                                   verbose_name=_(u'Port'))
    comment = models.TextField(max_length=10240, blank=True, 
                               verbose_name=_(u'Comment'))
    
    class Meta:
        db_table = 'NAT_PF'
        
class NAT_MASQ(models.Model):
    network = models.ForeignKey(DefNet, db_column='network',
                                verbose_name=_(u'Network'))
    interface = models.ForeignKey(NetInt, related_name='natmasqinterfaces', db_column='interface',
                                  verbose_name=_(u'Interface'))
    location = models.PositiveIntegerField(verbose_name=_(u'Location'))
    comment = models.TextField(max_length=10240, blank=True, 
                               verbose_name=_(u'Comment'))
    
    class Meta:
        db_table = 'NAT_MASQ'
        ordering = ['location']
        
class NAT_DNAT_SNAT(models.Model):
    originalSource = models.ForeignKey(DefNet, db_column='originalSource',
                                       verbose_name=_(u'Original source'))
    originalPort = models.ForeignKey(DefServices, related_name='natdnatsnatoriginalports', db_column='originalPort',
                                     verbose_name=_(u'Original port'))
    originalDestination = models.ForeignKey(DefNet, related_name='natdnatsnatoriginaldestinations', db_column='originalDestination',
                                            verbose_name=_(u'Original destination'))
    mode = models.PositiveSmallIntegerField(verbose_name=_(u'NAT mode'))
    newDestinationHost = models.ForeignKey(DefNet, related_name='natdnatsnatnewdestinationhosts', db_column='newDestinationHost', null=True,
                                           verbose_name=_(u'New destination'))
    newDestinationPort = models.ForeignKey(DefServices, related_name='natdnatsnatnewdestinationports', db_column='newDestinationPort', null=True,
                                           verbose_name=_(u'New destination port'))
    newSourceAddress = models.ForeignKey(DefNet, related_name='natdnatsnatnewsourceaddresses', db_column='newSourceAddress', null=True,
                                         verbose_name=_(u'New source'))
    newSourcePort = models.ForeignKey(DefServices, related_name='natdnatsnatnewsourceports', db_column='newSourcePort', null=True,
                                      verbose_name=_(u'New source port'))
    autoCreatePFRule = models.PositiveSmallIntegerField(default=1, verbose_name=_(u'Automatically open on packet filter'))
    comment = models.TextField(max_length=10240, blank=True, 
                               verbose_name=_(u'Comment'))
    
    def get_mode_name(self):
        if self.mode >= 1 <= 3:
            return NAT_DNAT_SNAT_MODES[self.mode - 1][1]
        
        return ''
    
    class Meta:
        db_table = 'NAT_DNAT_SNAT'