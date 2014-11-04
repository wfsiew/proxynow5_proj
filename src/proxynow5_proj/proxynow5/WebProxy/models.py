from proxynow5_proj.proxynow5.WebProxy_Filter.models import *
from django.db import models
from django.utils.translation import ugettext as _
from proxynow5_proj.proxynow5.Definition_Network.models import DefNet
from proxynow5_proj.proxynow5.Definition_User.models import DefUser
from proxynow5_proj.proxynow5.AD_User.models import ADUser
from proxynow5_proj.proxynow5.Definition_Schedule.models import DefSchd
from django.db.models import Q

WP_MODES = (
            (1, _(u'Standard')),
            (2, _(u'Transparent'))
)

WP_SAFESEARCH = (
                 (1, _(u'On')),
                 (2, _(u'Off'))
)

AUTHENTICATION_TYPES = (
                        (0, _(u'Disable')),
                        (1, _(u'Active Directory SSO')),
                        (2, _(u'Basic authentication'))
)

CATDEF_TYPES = (
                (1, _(u'Allow matched categories')),
                (2, _(u'Block matched categories'))
)

class WP(models.Model):
    av = models.PositiveSmallIntegerField(verbose_name=_(u'Enable antivirus'))
    avscansize = models.PositiveIntegerField(default=2048,
                                             verbose_name=_(u'Maximum file size to be scanned'))
    mode = models.PositiveSmallIntegerField(choices=WP_MODES,
                                            default=1,
                                            verbose_name=_(u'Mode'))
    authentication = models.PositiveSmallIntegerField(choices=AUTHENTICATION_TYPES,
                                                      default=2,
                                                      verbose_name=_(u'Authentication method'))
    safesearchon = models.PositiveSmallIntegerField(choices=WP_SAFESEARCH,
                                                    default=2,
                                                    verbose_name=_(u'Safe search'))
    
    class Meta:
        db_table = 'WP'
        
class WPProfile(models.Model):
    name = models.CharField(max_length=1024, unique=True,
                            verbose_name=_(u'Name'))
    location = models.PositiveIntegerField(verbose_name=_(u'Location'))
    enable = models.PositiveSmallIntegerField(verbose_name=_(u'Enable'))
    timequota = models.PositiveIntegerField(verbose_name=_(u'Daily time quota'))
    sizequota = models.PositiveIntegerField(verbose_name=_(u'Daily size quota'))
    catdef = models.PositiveSmallIntegerField(choices=CATDEF_TYPES,
                                              default=1,
                                              verbose_name=_(u'Action'))
    safesearchon = models.PositiveSmallIntegerField(choices=WP_SAFESEARCH,
                                                    default=2,
                                                    verbose_name=_(u'Safe search'))
    
    def __unicode__(self):
        return u'%s' % self.name
    
    class Meta:
        db_table = 'WPProfile'
        ordering = ['location']
        
class WPNet(models.Model):
    profileid = models.ForeignKey(WPProfile, db_column='profileid',
                                  verbose_name=_(u'Profile Id'))
    netid = models.ForeignKey(DefNet, related_name='wpnets', db_column='netid',
                              verbose_name=_(u'Net Id'))
    
    class Meta:
        db_table = 'WPNet'
        
class WPProfileUserInternal(models.Model):
    profileid = models.ForeignKey(WPProfile, db_column='profileid',
                                  verbose_name=_(u'Profile Id'))
    userinternal = models.ForeignKey(DefUser, related_name='wpprofileinternalusers', db_column='userinternal',
                                     verbose_name=_(u'Internal user'))
    
    class Meta:
        db_table = 'WPProfileUserInternal'
        
class WPProfileUserExternal(models.Model):
    profileid = models.ForeignKey(WPProfile, db_column='profileid',
                                  verbose_name=_(u'Profile Id'))
    userexternal = models.ForeignKey(ADUser, related_name='wpprofileexternalusers', db_column='userexternal',
                                     verbose_name=_(u'External user'))
    
    class Meta:
        db_table = 'WPProfileUserExternal'
        
class WPProfileExcept(models.Model):
    profileid = models.ForeignKey(WPProfile, db_column='profileid',
                                  verbose_name=_(u'Profile Id'))
    skipauth = models.PositiveSmallIntegerField(verbose_name=_(u'Skip authentication'))
    skipcache = models.PositiveSmallIntegerField(verbose_name=_(u'Skip cache'))
    skipav = models.PositiveSmallIntegerField(verbose_name=_(u'Skip AV'))
    skipext = models.PositiveSmallIntegerField(verbose_name=_(u'Skip extension filter'))
    skipmime = models.PositiveSmallIntegerField(verbose_name=_(u'Skip mime filter'))
    skipurl = models.PositiveSmallIntegerField(verbose_name=_(u'Skip URL filter'))
    skipcontentfilter = models.PositiveSmallIntegerField(verbose_name=_(u'Skip content filter'))
    
    class Meta:
        db_table = 'WPProfileExcept'
        
class WPProfileExceptNet(models.Model):
    exceptid = models.ForeignKey(WPProfileExcept, db_column='exceptid',
                            verbose_name=_(u'Except Id'))
    netid = models.ForeignKey(DefNet, related_name='wpprofileexceptnets', db_column='netid',
                              verbose_name=_(u'Except network'))
    
    class Meta:
        db_table = 'WPProfileExceptNet'
        
class WPProfileExceptURL(models.Model):
    exceptid = models.ForeignKey(WPProfileExcept, db_column='exceptid',
                                 verbose_name=_(u'Except Id'))
    url = url = models.URLField(max_length=2083, verbose_name=_(u'Url'))
    
    class Meta:
        db_table = 'WPProfileExceptURL'
        
class WPProfileExceptUserInternal(models.Model):
    exceptid = models.ForeignKey(WPProfileExcept, db_column='exceptid',
                                 verbose_name=_(u'Except Id'))
    userinternal = models.ForeignKey(DefUser, related_name='wpprofileexceptinternalusers', db_column='userinternal',
                                     verbose_name=_(u'Internal user'))
    
    class Meta:
        db_table = 'WPProfileExceptUserInternal'
        
class WPProfileExceptUserExternal(models.Model):
    exceptid = models.ForeignKey(WPProfileExcept, db_column='exceptid',
                                 verbose_name=_(u'Except Id'))
    userexternal = models.ForeignKey(ADUser, related_name='wpprofileexceptexternalusers', db_column='userexternal',
                                     verbose_name=_(u'External user'))
    
    class Meta:
        db_table = 'WPProfileExceptUserExternal'
    
class WPProfileSchd(models.Model):
    profileid = models.ForeignKey(WPProfile, db_column='profileid',
                                  verbose_name=_(u'Profile Id'))
    schedule = models.ForeignKey(DefSchd, related_name='wpprofileschedules', db_column='schedule',
                                 verbose_name=_(u'Schedule'))
    
    class Meta:
        db_table = 'WPProfileSchd'
        
class WPProfileAllowExt(models.Model):
    profileid = models.ForeignKey(WPProfile, db_column='profileid',
                                  verbose_name=_(u'Profile Id'))
    allowext = models.ForeignKey(WPExt, related_name='wpprofileallowexts', db_column='allowext',
                                 verbose_name=_(u'Allowed extension'))
    
    class Meta:
        db_table = 'WPProfileAllowExt'
        
class WPProfileBlockExt(models.Model):
    profileid = models.ForeignKey(WPProfile, db_column='profileid',
                                  verbose_name=_(u'Profile Id'))
    blockext = models.ForeignKey(WPExt, related_name='wpprofileblockexts', db_column='blockext',
                                 verbose_name=_(u'Blocked extension'))
    
    class Meta:
        db_table = 'WPProfileBlockExt'
        
class WPProfileAllowMIME(models.Model):
    profileid = models.ForeignKey(WPProfile, db_column='profileid',
                                  verbose_name=_(u'Profile Id'))
    allowmime = models.ForeignKey(WPMIME, related_name='wpprofileallowmimes', db_column='allowmime',
                                  verbose_name=_(u'Allowed MIME type'))
    
    class Meta:
        db_table = 'WPProfileAllowMIME'
        
class WPProfileBlockMIME(models.Model):
    profileid = models.ForeignKey(WPProfile, db_column='profileid',
                                  verbose_name=_(u'Profile Id'))
    blockmime = models.ForeignKey(WPMIME, related_name='wpprofileblockmimes', db_column='blockmime',
                                  verbose_name=_(u'Blocked MIME type'))
    
    class Meta:
        db_table = 'WPProfileBlockMIME'
        
class WPSelectedCat(models.Model):
    profileid = models.ForeignKey(WPProfile, db_column='profileid',
                                  verbose_name=_(u'Profile Id'))
    catid = models.ForeignKey(WPCat, related_name='wpprofilecats', db_column='catid',
                              verbose_name=_(u'Category'))
    
    class Meta:
        db_table = 'WPSelectedCat'
        
class WPProfileWhiteList(models.Model):
    profileid = models.ForeignKey(WPProfile, db_column='profileid',
                                  verbose_name=_(u'Profile Id'))
    whitelist = models.ForeignKey(WPWhiteList, related_name='wpprofilewhitelists', db_column='whitelist',
                                  verbose_name=_(u'Whitelist'))
    
    class Meta:
        db_table = 'WPProfileWhiteList'
        
class WPProfileBlackList(models.Model):
    profileid = models.ForeignKey(WPProfile, db_column='profileid',
                                  verbose_name=_(u'Profile Id'))
    blacklist = models.ForeignKey(WPBlackList, related_name='wpprofileblacklists', db_column='blacklist',
                                  verbose_name=_(u'Blacklist'))
    
    class Meta:
        db_table = 'WPProfileBlackList'
        
class WPProfileContentFilter(models.Model):
    profileid = models.ForeignKey(WPProfile, db_column='profileid',
                                  verbose_name=_(u'Profile Id'))
    contentfilter = models.ForeignKey(WPContent, related_name='wpprofilecontentfilters', db_column='contentfilter',
                                      verbose_name=_(u'Content filter'))
    
    class Meta:
        db_table = 'WPProfileContentFilter'

class WPAdvance(models.Model):
    cache = models.PositiveSmallIntegerField(verbose_name=_(u'Enable caching'))
    parent = models.PositiveSmallIntegerField(verbose_name=_(u'Enable parent proxy'))
    parentip = models.ForeignKey(DefNet, db_column='parentip', null=True,
                                 verbose_name=_(u'Parent proxy'))
    parentport = models.PositiveIntegerField(null=True, verbose_name=_(u'Port'))
    parentusername = models.CharField(blank=True, max_length=1024, verbose_name=_(u'Username'))
    parentpassword = models.CharField(blank=True, max_length=1024, verbose_name=_(u'Password'))
    
    class Meta:
        db_table = 'WPAdvance'
        
class WPAdvanceSkip(models.Model):
    netid = models.ForeignKey(DefNet, primary_key=True, db_column='netid',
                              verbose_name=_(u'Net Id'))
    
    class Meta:
        db_table = 'WPAdvanceSkip'
    
class WPAdvanceAllow(models.Model):
    portid = models.PositiveIntegerField(primary_key=True, db_column='portid',
                                         verbose_name=_(u'Port Id'))
    
    class Meta:
        db_table = 'WPAdvanceAllow'
        
class NetTrusted(models.Model):
    netid = models.ForeignKey(DefNet, db_column='netid', verbose_name=_(u'NetId'))
    
    class Meta:
        db_table = 'NetTrusted'