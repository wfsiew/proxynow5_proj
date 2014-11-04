from django.conf.urls.defaults import *

urlpatterns = patterns('proxynow5_proj.proxynow5.Patch.views',
                       (r'^$', 'patch_page'),
                       (r'^upgrade/list/$', 'upgrade_list'),
                       (r'^upgrade/details/$', 'upgrade_details'),
                       (r'^upgrade/confirm/$', 'upgrade_confirm'),
                       (r'^upgrade/begin/$', 'upgrade_begin'),
                       (r'^upgrade/log/init/$', 'upgrade_log_init'),
                       (r'^upgrade/log/run/$', 'upgrade_log_run'),
                       (r'^restartserver/$', 'restart_server'),
)