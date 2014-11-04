from django.conf.urls.defaults import *

urlpatterns = patterns('proxynow5_proj.proxynow5.Administration.views',
                       (r'^administration/save/$', 'admin_save'),
                       (r'^adinfo/save/$', 'adinfo_save'),
)