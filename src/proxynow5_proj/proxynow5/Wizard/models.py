from proxynow5_proj.proxynow5.WebProxy_Filter.models import *
from django.utils.translation import ugettext as _

class WizardSetup(models.Model):
    
    iswizard = models.PositiveSmallIntegerField(verbose_name=_(u'Enable Wizard'))
     
    class Meta:
        db_table = 'WizardSetup'
    
    
    