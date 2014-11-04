from django.db import models
from django.utils.translation import ugettext as _

class License(models.Model):
    activationkey = models.CharField(max_length=50, unique=True)
    identitytoken = models.CharField(max_length=50, unique=True)
    pn_expirydate = models.DateTimeField()
    pn_webproxy_expirydate = models.DateTimeField()
    pn_numofusers = models.PositiveIntegerField()
    pn_reserved1_expirydate = models.DateTimeField(null=True)
    pn_reserved2_expirydate = models.DateTimeField(null=True)
    pn_reserved3_expirydate = models.DateTimeField(null=True)
    pn_reserved4_expirydate = models.DateTimeField(null=True)
    pn_reserved5_expirydate = models.DateTimeField(null=True)                                                                                                                                                                                                                                                    
    
    class Meta:
        db_table = 'License'