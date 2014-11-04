from django.conf.urls.defaults import *

urlpatterns = patterns('proxynow5_proj.proxynow5.Dashboard.views',
                       (r'^$', 'dashboard_page'),
                       (r'^data/$', 'dashboard_data'),
)