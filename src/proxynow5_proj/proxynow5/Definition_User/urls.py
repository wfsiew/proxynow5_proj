from django.conf.urls.defaults import *

urlpatterns = patterns('proxynow5_proj.proxynow5.Definition_User.views',
                       (r'^$', 'defuser_page'),
                       (r'^save/$', 'defuser_save'),
                       (r'^delete/$', 'defuser_delete'),
                       (r'^list/$', 'defuser_list'),
                       (r'^list/panel/$', 'defuser_list_panel'),
                       (r'^list/panel/temp/$', 'defuser_list_panel_temp'),
                       (r'^list/select/$', 'defuser_list_select'),
                       (r'^list/select/temp/$', 'defuser_list_select_temp'),
                       (r'^save/pwd/$', 'defuser_changepwd'),
)