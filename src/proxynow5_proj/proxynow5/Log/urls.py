from django.conf.urls.defaults import *

urlpatterns = patterns('proxynow5_proj.proxynow5.Log.views',
                       (r'^$', 'log_page'),
                       (r'^init/$', 'log_init'),
                       (r'^run/$', 'log_run'),
                       (r'^files/$', 'log_files'),
)