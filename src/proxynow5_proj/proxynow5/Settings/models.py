from django.db import models

class ProxynowSettings(models.Model):
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=100)
    
    class Meta:
        db_table = 'ProxynowSettings'