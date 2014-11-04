from django.db import models

class ChangedTable(models.Model):
    name = models.CharField(max_length=200, unique=True)
    
    def __unicode__(self):
        return self.name
    
    class Meta:
        db_table = 'ChangedTable'