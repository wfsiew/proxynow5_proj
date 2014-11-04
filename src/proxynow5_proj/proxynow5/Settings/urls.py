from django.conf.urls.defaults import *

urlpatterns = patterns('proxynow5_proj.proxynow5.Settings.views',
                       (r'^$','setting_save'),
                       (r'^conf/$', 'conf_page'),
                       (r'^conf/import/$', 'conf_import'),
                       (r'^conf/export/$', 'conf_export'),
                       (r'^conf/uploadform/$', 'conf_upload'),
)