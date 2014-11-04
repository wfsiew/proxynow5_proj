from django.conf.urls.defaults import *

urlpatterns = patterns('proxynow5_proj.proxynow5.views',
                       (r'^$', 'main'),
                       (r'^login/$', 'login'),
                       (r'^logout/$', 'logout'),
                       (r'^menu/$', 'menu'),
                       (r'^blocked/$', 'blocked'),
                       (r'^checkserver/$', 'checkserver'),
                       (r'^user/list/panel/$', 'user_list_panel'),
                       (r'^user/list/select/$', 'user_list_select'),
)