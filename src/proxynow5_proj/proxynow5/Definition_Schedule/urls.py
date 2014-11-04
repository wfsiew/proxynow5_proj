from django.conf.urls.defaults import *

urlpatterns = patterns('proxynow5_proj.proxynow5.Definition_Schedule.views',
                       (r'^schedule_add/$','AddScheduleView'),
                       (r'^schedule/save/temp/$','AddScheduleView_temp'),
                       (r'^schedule_refresh/$','RefreshScheduleView'),
                       (r'^schedule_list/$','ShowMainPage'),
                       (r'^schedule_delete/(\w+)/$','DeleteScheduleView'),
                       (r'^schedule_edit/(\w+)/$','EditScheduleView'),
                       (r'^schedule_edit_temp/(\w+)/$','EditScheduleView_temp'),
                       (r'^schedule_clone/(\w+)/$','CloneSchedule'),
                       (r'^schedule/list/$','defschedule_list'),
                       (r'^schedule/list/panel/$','defschedule_list_panel'),  
                       (r'^schedule/list/panel/temp/$','defschedule_list_panel_temp'),  
                       (r'^schedule/list/panel_search/$','defschedule_list_panel_search'),
                       (r'^schedule/list/panel_search/temp/$','defschedule_list_panel_search_temp'),
                           
                       
)