from django.conf.urls.defaults import *

urlpatterns = patterns('proxynow5_proj.proxynow5.License.views',
                       (r'^$', 'lic_page'),
                       (r'^activate/$', 'lic_activate'),
                       (r'^deactivate/$', 'lic_deactivate'),
)