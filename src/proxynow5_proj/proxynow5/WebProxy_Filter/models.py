from django.db import models
from django.utils.translation import ugettext as _

WPCAT_TYPES = (
               (1, _(u'prebuild')),
               (2, _(u'custom'))
)

class WPCat(models.Model):
    name = models.CharField(max_length=1024, unique=True, 
                            verbose_name=_(u'Name'))
    type = models.PositiveSmallIntegerField(choices=WPCAT_TYPES,
                                            default=1,
                                            verbose_name=_(u'Type'))
    comment = models.TextField(max_length=10240, blank=True, 
                               verbose_name=_(u'Comment'))
    
    def __unicode__(self):
        if self.type >= 1 <= 2:
            return u'%s (%s)' % (self.name, WPCAT_TYPES[self.type - 1][1])
        
        else:
            return u'%s' % self.name
        
    def get_data(self):
        x = self.wpcatvalue_set.get(id=self)
        return x.url
    
    def get_type_name(self):
        if self.type >= 1 <= 2:
            return WPCAT_TYPES[self.type - 1][1]
        
        return ''
        
    class Meta:
        db_table = 'WPCat'
        ordering = ['name', 'type']
        
class WPCatValue(models.Model):
    uid = models.ForeignKey(WPCat, db_column='uid',
                           verbose_name=_(u'Id'))
    url = models.URLField(max_length=2083, verbose_name=_(u'Url'))
    
    class Meta:
        db_table = 'WPCatValue'
        
class WPWhiteList(models.Model):
    name = models.CharField(max_length=1024, unique=True, 
                            verbose_name=_(u'Name'))
    comment = models.TextField(max_length=10240, blank=True, 
                               verbose_name=_(u'Comment'))
    
    def __unicode__(self):
        return u'%s' % self.name
    
    def get_data(self):
        x = self.wpwhitelistvalue_set.get(id=self)
        return x.url
    
    class Meta:
        db_table = 'WPWhiteList'
        ordering = ['name']
        
class WPWhiteListValue(models.Model):
    uid = models.ForeignKey(WPWhiteList, db_column='uid',
                           verbose_name=_(u'Id'))
    url = models.CharField(max_length=2083, verbose_name=_(u'Url'))
    
    class Meta:
        db_table = 'WPWhiteListValue'
    
class WPBlackList(models.Model):
    name = models.CharField(max_length=1024, unique=True,
                            verbose_name=_(u'Name'))
    comment = models.TextField(max_length=10240, blank=True, 
                               verbose_name=_(u'Comment'))
    
    def __unicode__(self):
        return u'%s' % self.name
    
    def get_data(self):
        x = self.wpblacklistvalue_set.get(id=self)
        return x.url
    
    class Meta:
        db_table = 'WPBlackList'
        ordering = ['name']
        
class WPBlackListValue(models.Model):
    uid = models.ForeignKey(WPBlackList, db_column='uid',
                           verbose_name=_(u'Id'))
    url = models.CharField(max_length=2083, verbose_name=_(u'Url'))
    
    class Meta:
        db_table = 'WPBlackListValue'
        
class WPExt(models.Model):
    name = models.CharField(max_length=1024, unique=True,
                            verbose_name=_(u'Name'))
    comment = models.TextField(max_length=10240, blank=True, 
                               verbose_name=_(u'Comment'))
    
    def __unicode__(self):
        return u'%s' % self.name
    
    def get_data(self):
        x = self.wpextvalue_set.get(id=self)
        return x.extension
    
    class Meta:
        db_table = 'WPExt'
        ordering = ['name']
        
class WPExtValue(models.Model):
    uid = models.ForeignKey(WPExt, db_column='uid',
                           verbose_name=_(u'Id'))
    extension = models.CharField(max_length=10, verbose_name=_(u'Extension'))
    
    class Meta:
        db_table = 'WPExtValue'
        
class WPContent(models.Model):
    name = models.CharField(max_length=1024, unique=True,
                            verbose_name=_(u'Name'))
    comment = models.TextField(max_length=10240, blank=True, 
                               verbose_name=_(u'Comment'))
    
    def __unicode__(self):
        return u'%s' % self.name
    
    def get_keyword(self):
        x = self.wpcontentvalue_set.get(id=self)
        return x.keyword
    
    def get_score(self):
        x = self.wpcontentvalue_set.get(id=self)
        return x.score
    
    class Meta:
        db_table = 'WPContent'
        ordering = ['name']
        
class WPContentValue(models.Model):
    uid = models.ForeignKey(WPContent, db_column='uid',
                           verbose_name=_(u'Id'))
    keyword = models.CharField(max_length=1024, verbose_name=_(u'Keyword'))
    score = models.PositiveIntegerField(verbose_name=_(u'Score'))
    
    class Meta:
        db_table = 'WPContentValue'
        
class WPMIME(models.Model):
    name = models.CharField(max_length=1024, unique=True,
                            verbose_name=_(u'Name'))
    comment = models.TextField(max_length=10240, blank=True, 
                               verbose_name=_(u'Comment'))
    
    def __unicode__(self):
        return u'%s' % self.name
    
    def get_data(self):
        x = self.wpmimevalue_set.get(id=self)
        return x.mime
    
    class Meta:
        db_table = 'WPMIME'
        ordering = ['name']
        
class WPMIMEValue(models.Model):
    uid = models.ForeignKey(WPMIME, db_column='uid',
                           verbose_name=_(u'Id'))
    mime = models.CharField(max_length=255, verbose_name=_(u'Mime'))
    
    class Meta:
        db_table = 'WPMIMEValue'