from django.db import models
from django.template.loader import get_template
from django.template.context import Context
from django.utils.translation import ugettext as _

class ADUser(models.Model):
    name = models.CharField(max_length=1024, unique=True,
                            verbose_name=_('Name'))
    displayname = models.CharField(max_length=1024, blank=True, verbose_name=_(u'Display name'))
    
    def __unicode__(self):
        return u'%s' % self.name
    
    def get_html_repr(self):
        t = get_template('aduser/aduser_list_select_repr.html')
        c = Context({'o': self})
        r = t.render(c)
        return r
    
    class Meta:
        db_table = 'ADUser'
        ordering = ['name']