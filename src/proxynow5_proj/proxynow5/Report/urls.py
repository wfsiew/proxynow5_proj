from django.conf.urls.defaults import *

urlpatterns = patterns('proxynow5_proj.proxynow5.Report.views',
                       (r'^graphdata/$','graphdata'),
                       (r'^reporthardware/$','hardware_load'),  
                       (r'^reportnetworkusage/$','networkusage_load'), 
                       (r'^reportwebsecurity/$','websecurity_load'),
                       (r'^report_nav_list/$','rpt_get_list'),
                       (r'^rpt_get_back_cache/$','rpt_get_back_cache'),
                       (r'^report_update_list/$','report_update_list'), 
                       (r'^report_pdf/$','report_pdf'),
                       (r'^report_csv/$','report_csv'),
                       (r'^download_file/$','download_reportfile'),
                       (r'^report_loadsetting/$','reportloadsetting'),
                       (r'^report_loademailsettingreport/$','reportloademailsettingreport'),
                       (r'^report_toggle_status/$','report_toggle_status'),
                       (r'^report_save_mail/$','report_save_email'), 
                       (r'^report_save_host_mail/$','report_save_host_mail'),
                       (r'^report_delete_mail/$','report_delete_email'),
                       (r'^report_sendmail/$','sendmail'),
                       
)