from django.db import models
from django.utils.translation import ugettext as _
from proxynow5_proj.proxynow5.NIC.models import NIC

class Dashboard(models.Model):
    cpu = models.PositiveSmallIntegerField()
    ram = models.PositiveSmallIntegerField()
    swap = models.PositiveSmallIntegerField()
    hd = models.PositiveSmallIntegerField()
    version = models.CharField(max_length=255, unique=True)
    avpattern = models.CharField(max_length=255)
    request = models.PositiveIntegerField()
    block = models.PositiveIntegerField()
    malware = models.PositiveIntegerField()
    
    class Meta:
        db_table = 'Dashboard'
    
class DashboardNIC(models.Model):
    name = models.CharField(max_length=1024, unique=True)
    status = models.CharField(max_length=4)
    inbw = models.DecimalField(max_digits=12, decimal_places=2)
    outbw = models.DecimalField(max_digits=12, decimal_places=2)
    
    def get_nic_by_name(self):
        o = NIC.objects.get(name__iexact=self.name)
        return o
    
    def get_netint_name(self):
        o = self.get_nic_by_name()
        x = o.netint_set.get(hardware=o)
        return x.name
    
    def get_netint_type(self):
        o = self.get_nic_by_name()
        x = o.netint_set.get(hardware=o)
        return x.get_type_name()
    
    class Meta:
        db_table = 'DashboardNIC'
        ordering = ['name']