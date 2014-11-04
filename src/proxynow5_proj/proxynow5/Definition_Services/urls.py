from django.conf.urls.defaults import *

urlpatterns = patterns('proxynow5_proj.proxynow5.Definition_Services.views',
                       (r'^$', 'defservices_page'),
                       (r'^save/$', 'defservices_save'),
                       (r'^delete/$', 'defservices_delete'),
                       (r'^list/$', 'defservices_list'),
                       (r'^list/panel/$', 'defservices_list_panel'),
                       (r'^list/select/$', 'defservices_list_select'),
                       (r'^list/panel/custom1/$', 'defservices_list_panel_custom1'),
                       (r'^list/select/custom1/$', 'defservices_list_select_custom1'),
                       (r'^icmp/types/$', 'defservices_icmp_types'),
                       (r'^icmp/codes/$', 'defservices_icmp_codes'),
                       (r'^info/$', 'defservices_info'),
)