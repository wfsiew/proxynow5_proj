from django.db import models
from django.template.loader import get_template
from django.template.context import Context
from django.utils.translation import ugettext as _

DEFUSER_TYPES = (
                 (1, _(u'username')),
                 (2, _(u'user group'))
)

DEFUSER_ACCESS_TYPES = (
                        (1, _(u'Normal User')),
                        (2, _(u'Administrator'))
)

class DefUser(models.Model):
    name = models.CharField(max_length=1024, unique=True,
                            verbose_name=_(u'Name'))
    type = models.PositiveSmallIntegerField(choices=DEFUSER_TYPES,
                                             verbose_name=_(u'Type'))
    accesstype = models.PositiveSmallIntegerField(choices=DEFUSER_ACCESS_TYPES,
                                                  verbose_name=_(u'Access Type'))
    comment = models.TextField(max_length=10240, blank=True, 
                               verbose_name=_(u'Comment'))
    
    def __unicode__(self):
        if self.type >= 1 <= 2:
            return u'%s (%s)' % (self.name, DEFUSER_TYPES[self.type - 1][1])
        
        else:
            return u'%s' % self.name
        
    def get_data(self):
        if self.type == 1:
            x = self.defusername_set.get(id=self)
            return x.displayname
        
        return ''
    
    def get_html_repr(self):
        t = get_template('defuser/defuser_list_select_repr.html')
        c = Context({'o': self})
        r = t.render(c)
        return r
    
    class  Meta:
        db_table = 'DefUser'
        ordering = ['name']
        
class DefUserName(models.Model):
    id = models.ForeignKey(DefUser, primary_key=True, db_column='id',
                            verbose_name=_(u'Id'))
    displayname = models.CharField(max_length=100, blank=True,
                                   verbose_name=_(u'Display name'))
    password = models.CharField(max_length=1024, verbose_name=_(u'Password'))
    
    class Meta:
        db_table = 'DefUserName'
        
class DefUserGroup(models.Model):
    gid = models.ForeignKey(DefUser, db_column='gid',
                            verbose_name=_(u'Id'))
    member = models.ForeignKey(DefUser, related_name='defusergroups', db_column='member',
                               verbose_name=_(u'Member'))
    
    class Meta:
        db_table = 'DefUserGroup'