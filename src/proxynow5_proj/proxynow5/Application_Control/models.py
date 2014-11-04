from django.db import models
from django.utils.translation import ugettext as _
from proxynow5_proj.proxynow5.Definition_Network.models import DefNet

ACTIONS = (
           (1, _(u'Allow')),
           (2, _(u'Block'))
)

class AppCtrlRule(models.Model):
    name = models.CharField(max_length=1024, unique=True, 
                            verbose_name=_(u'Name'))
    location = models.PositiveIntegerField(verbose_name=_(u'Location'))
    enable = models.PositiveSmallIntegerField(verbose_name=_(u'Enable'))
    action = models.PositiveSmallIntegerField(verbose_name=_(u'Action'))
    comment = models.TextField(max_length=10240, blank=True, 
                               verbose_name=_(u'Comment'))
    
    class Meta:
        db_table = 'AppCtrlRule'
        ordering = ['location']
        
    def get_data(self):
        if self.action >= 1 <= 2:
            return ACTIONS[self.action - 1][1]
        
        return ''
    
class AppCtrlSkipList(models.Model):
    aid = models.ForeignKey(AppCtrlRule, db_column='aid',
                           verbose_name=_(u'Id'))
    net = models.ForeignKey(DefNet, related_name='appctrlskiplistnets', db_column='net',
                            verbose_name=_(u'Net'))
    
    class Meta:
        db_table = 'AppCtrlSkipList'
        
class AppCtrlFor(models.Model):
    aid = models.ForeignKey(AppCtrlRule, db_column='aid',
                           verbose_name=_(u'Id'))
    net = models.ForeignKey(DefNet, related_name='appctrlfornets', db_column='net',
                            verbose_name=_(u'Net'))
    
    class Meta:
        db_table = 'AppCtrlFor'
        
class AppCtrlAppList(models.Model):
    name = models.CharField(max_length=1024, unique=True, 
                            verbose_name=_(u'Name'))
    category = models.CharField(max_length=1024, verbose_name=_(u'Category'))
    mark = models.IntegerField(verbose_name=_(u'Mark'))
    
    class Meta:
        db_table = 'AppCtrlAppList'
        
class AppCtrlWhichApp(models.Model):
    aid = models.ForeignKey(AppCtrlRule, db_column='aid',
                            verbose_name=_(u'Id'))
    app = models.ForeignKey(AppCtrlAppList, related_name='appctrlwhichapps', db_column='app',
                            verbose_name=_(u'App'))
    
    class Meta:
        db_table = 'AppCtrlWhichApp'