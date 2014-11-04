from django.db import models
from django.template.loader import get_template
from django.template.context import Context
from django.utils.translation import ugettext as _

DEFSERVICES_TYPES = (
                     (1, _(u'TCP')),
                     (2, _(u'UDP')),
                     (3, _(u'ICMP')),
                     (4, _(u'IP')),
                     (5, _(u'Service group'))
)

DEFAULT_DEFSERVICESTCP_SRCPORT = '1:65535'
DEFAULT_DEFSERVICESUDP_SRCPORT = '1:65535'

class DefServices(models.Model):
    name = models.CharField(max_length=1024, unique=True,
                            verbose_name=_(u'Name'))
    type = models.PositiveSmallIntegerField(choices=DEFSERVICES_TYPES,
                                             verbose_name=_(u'Type'))
    comment = models.TextField(max_length=10240, blank=True,
                               verbose_name=_(u'Comment'))
    
    def __unicode__(self):
        if self.type >= 1 <= 5:
            return u'%s (%s)' % (self.name, DEFSERVICES_TYPES[self.type - 1][1])
        
        else:
            return u'%s' % self.name
        
    def get_type_name(self):
        if self.type >= 1 <= 5:
            return DEFSERVICES_TYPES[self.type - 1][1]
        
        else:
            return ''
        
    def get_data(self):
        if self.type == 1:
            x = self.defservicestcp_set.get(id=self)
            return '%s&rarr;%s' % (x.srcport, x.dstport)
        
        elif self.type == 2:
            x = self.defservicesudp_set.get(id=self)
            return '%s&rarr;%s' % (x.srcport, x.dstport)
        
        elif self.type == 3:
            x = self.defservicesicmp_set.get(id=self)
            return '%s' % x.code
        
        elif self.type == 4:
            x = self.defservicesip_set.get(id=self)
            return '%s' % x.protocol
        
        return ''
    
    def get_html_repr(self):
        t = get_template('defservices/defservices_list_select_repr.html')
        c = Context({'o': self})
        r = t.render(c)
        return r
    
    class Meta:
        db_table = 'DefServices'
        ordering = ['name', 'type']
        
class DefServicesTCP(models.Model):
    id = models.ForeignKey(DefServices, primary_key=True, db_column='id',
                           verbose_name=_(u'Id'))
    dstport = models.CharField(max_length=20, verbose_name=_(u'Destination port'))
    srcport = models.CharField(max_length=20, default=DEFAULT_DEFSERVICESTCP_SRCPORT,
                               verbose_name=_(u'Source port'))
    
    class Meta:
        db_table = 'DefServicesTCP'
        
class DefServicesUDP(models.Model):
    id = models.ForeignKey(DefServices, primary_key=True, db_column='id',
                            verbose_name=_(u'Id'))
    dstport = models.CharField(max_length=20, verbose_name=_(u'Destination port'))
    srcport = models.CharField(max_length=20, default=DEFAULT_DEFSERVICESUDP_SRCPORT,
                               verbose_name=_(u'Source port'))
    
    class Meta:
        db_table = 'DefServicesUDP'
        
class DefServicesICMP(models.Model):
    id = models.ForeignKey(DefServices, primary_key=True, db_column='id',
                            verbose_name=_(u'Id'))
    type = models.PositiveSmallIntegerField(verbose_name=_(u'ICMP type'))
    code = models.PositiveSmallIntegerField(verbose_name=_(u'ICMP code'))
    
    def get_icmp_type_name(self):
        s = ''
        for c, d in ICMP_TYPES:
            if c == self.type:
                s = d
                break
            
        if s == '':
            return '%d' % self.type
        
        else:
            return '%d (%s)' % (self.type, s)
    
    def get_icmp_code_name(self):
        type = get_icmp_codes(self.type)
        s = get_icmp_code_name(type, self.code)
        if s == '':
            return '%d' % self.code
        
        else:
            return '%d (%s)' % (self.code, s)
    
    class Meta:
        db_table = 'DefServicesICMP'
        
class DefServicesIP(models.Model):
    id = models.ForeignKey(DefServices, primary_key=True, db_column='id',
                            verbose_name=_(u'Id'))
    protocol = models.PositiveSmallIntegerField(verbose_name=_(u'IP protocol no.'))
    
    class Meta:
        db_table = 'DefServicesIP'
        
class DefServicesGroup(models.Model):
    gid = models.ForeignKey(DefServices, db_column='gid',
                            verbose_name=_(u'Id'))
    member = models.ForeignKey(DefServices, related_name='defservicesgroups', db_column='member',
                               verbose_name=_(u'Member'))
    
    class Meta:
        db_table = 'DefServicesGroup'
        
#===============================================================================
# ICMP Types
# http://www.iana.org/assignments/icmp-parameters/icmp-parameters.xml
#===============================================================================
ICMP_TYPES = (
              (0, _(u'Echo Reply')),
              (1, _(u'Unassigned')),
              (2, _(u'Unassigned')),
              (3, _(u'Destination Unreachable')),
              (4, _(u'Source Quench')),
              (5, _(u'Redirect')),
              (6, _(u'Alternate Host Address')),
              (7, _(u'Unassigned')),
              (8, _(u'Echo')),
              (9, _(u'Router Advertisement')),
              (10, _(u'Router Selection')),
              (11, _(u'Time Exceeded')),
              (12, _(u'Parameter Problem')),
              (13, _(u'Timestamp')),
              (14, _(u'Timestamp Reply')),
              (15, _(u'Information Request')),
              (16, _(u'Information Reply')),
              (17, _(u'Address Mask Request')),
              (18, _(u'Address Mask Reply')),
              (19, _(u'Reserved (for Security)')),
              (30, _(u'Traceroute')),
              (31, _(u'Datagram Conversion Error')),
              (32, _(u'Mobile Host Redirect')),
              (33, _(u'IPv6 Where-Are-You')),
              (34, _(u'IPv6 I-Am-Here')),
              (35, _(u'Mobile Registration Request')),
              (36, _(u'Mobile Registration Reply')),
              (39, _(u'SKIP')),
              (40, _(u'Photuris')),
)

#===============================================================================
# ICMP Codes
#===============================================================================
ICMP_TYPE0 = (
              (0, (_(u'No Code'))),
)

ICMP_TYPE3 = (
              (0, _(u'Unreachable')),
              (1, _(u'Host Unreachable')),
              (2, _(u'Protocol Unreachable')),
              (3, _(u'Port Unreachable')),
              (4, _(u'Fragmentation Needed and Don\'t Fragment was Set')),
              (5, _(u'Source Route Failed')),
              (6, _(u'Destination Network Unknown')),
              (7, _(u'Destination Host Unknown')),
              (8, _(u'Source Host Isolated')),
              (9, _(u'Communication with Destination Network is Administratively Prohibited')),
              (10, _(u'Communication with Destination Host is Administratively Prohibited')),
              (11, _(u'Destination Network Unreachable for Type of Service')),
              (12, _(u'Destination Host Unreachable for Type of Service')),
              (13, _(u'Communication Administratively Prohibited')),
              (14, _(u'Host Precedence Violation')),
              (15, _(u'Precedence cutoff in effect')),
)

ICMP_TYPE4 = (
              (0, _(u'No Code')),
)

ICMP_TYPE5 = (
              (0, _(u'Redirect Datagram for the Network (or subnet)')),
              (1, _(u'Redirect Datagram for the Host')),
              (2, _(u'Redirect Datagram for the Type of Service and Network')),
              (3, _(u'Redirect Datagram for the Type of Service and Host')),
)

ICMP_TYPE6 = (
              (0, _(u'Alternate Address for Host')),
)

ICMP_TYPE8 = (
              (0, _(u'No Code')),
)

ICMP_TYPE9 = (
              (0, _(u'Normal router advertisement')),
              (16, _(u'Does not route common traffic')),
)

ICMP_TYPE10 = (
               (0, _(u'No Code')),
)

ICMP_TYPE11 = (
               (0, _(u'Time to Live exceeded in Transit')),
               (1, _(u'Fragment Reassembly Time Exceeded')),
)

ICMP_TYPE12 = (
              (0, _(u'Pointer indicates the error')),
              (1, _(u'Missing a Required Option')),
              (2, _(u'Bad Length')),
)

ICMP_TYPE13 = (
               (0, _(u'No Code')),
)

ICMP_TYPE14 = (
               (0, _(u'No Code')),
)

ICMP_TYPE15 = (
               (0, _(u'No Code')),
)

ICMP_TYPE16 = (
               (0, _(u'No Code')),
)

ICMP_TYPE17 = (
               (0, _(u'No Code')),
)

ICMP_TYPE18 = (
               (0, _(u'No Code')),
)

ICMP_TYPE40 = (
               (0, _(u'Bad SPI')),
               (1, _(u'Authentication Failed')),
               (2, _(u'Decompression Failed')),
               (3, _(u'Decryption Failed')),
               (4, _(u'Need Authentication')),
               (5, _(u'Need Authorization')),           
)

def get_icmp_code_name(icmptype, icmpcode):
    s = ''
    if icmptype is None:
        return s
    
    for c, d in icmptype:
        if c == icmpcode:
            return d
    
    return s

def get_icmp_codes(_arg):
    arg = None
    try:
        arg = int(_arg)
        
    except:
        return None
    
    if arg == 0 or arg == 4 or arg == 8 or arg == 10 or \
        arg == 13 or arg == 14 or arg == 15 or arg == 16 or \
        arg == 17 or arg == 18:
        return ICMP_TYPE0
    
    elif arg == 3:
        return ICMP_TYPE3
    
    elif arg == 5:
        return ICMP_TYPE5
    
    elif arg == 6:
        return ICMP_TYPE6
    
    elif arg == 9:
        return ICMP_TYPE9
    
    elif arg == 11:
        return ICMP_TYPE11
    
    elif arg == 12:
        return ICMP_TYPE12
    
    elif arg == 40:
        return ICMP_TYPE40
    
    return None