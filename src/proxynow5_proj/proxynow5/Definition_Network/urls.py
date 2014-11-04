from django.conf.urls.defaults import *

urlpatterns = patterns('proxynow5_proj.proxynow5.Definition_Network.views',
                       (r'^$', 'defnet_page'),
                       (r'^save/$', 'defnet_save'),
                       (r'^delete/$', 'defnet_delete'),
                       (r'^list/$', 'defnet_list'),
                       (r'^list/panel/$', 'defnet_list_panel'),
                       (r'^list/select/$', 'defnet_list_select'),
                       (r'^list/panel/custom1/$', 'defnet_list_panel_custom1'),
                       (r'^list/select/custom1/$', 'defnet_list_select_custom1'),
                       (r'^list/panel/custom2/$', 'defnet_list_panel_custom2'),
                       (r'^list/select/custom2/$', 'defnet_list_select_custom2'),
                       (r'^list/panel/custom3/$', 'defnet_list_panel_custom3'),
                       (r'^list/select/custom3/$', 'defnet_list_select_custom3'),
                       (r'^save/temp/$', 'defnet_save_temp'),
                       (r'^list/panel/temp/$', 'defnet_list_panel_temp'),
                       (r'^list/select/temp/$', 'defnet_list_select_temp'),
                       (r'^info/$', 'defnet_info'),
                       
)