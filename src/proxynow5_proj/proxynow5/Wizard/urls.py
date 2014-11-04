from django.conf.urls.defaults import *

urlpatterns = patterns('proxynow5_proj.proxynow5.Wizard.views',
                    (r'^wizard/$','loadmainwizard'),
                    (r'^wizardReRun/$','loadmainwizardReRun'),
                    (r'^wizard_setup_next/$','wizard_setup_next'), 
                    (r'^wizard_setup_back/$','wizard_setup_back'), 
                    (r'^wizard_skip/$','wizard_skip'), 
                    (r'^wizard_import_settings/$','wizard_import_settings'),
                    (r'^wizard_import_test/$','wizard_import_test'), 
                    (r'^wizard_check_IPRange/$','wizard_check_IPRange'), 
                    (r'^wizard_open_add_group/$','wizard_open_add_group'), 
                    (r'^wizard_save_group/$','wizard_save_group'), 
                    (r'^wizard_save_user/$','wizard_save_user'),
                    (r'^wizard_open_edit_group/$','wizard_open_edit_group'), 
                    (r'^wizard_delete_tempuser/$','wizard_delete_tempuser'), 
                    (r'^wizard_getlistuser/$','wizard_getlistuser'),
                    (r'^wizard_open_dialog_policy/$','wizard_open_dialog_policy'),
                    (r'^wizard_save_policy/$','wizard_save_policy'), 
                    
                    (r'^wizard_save_wizard/$','save_wizard'), 
                    
                    (r'^wizard_load_wpprofile/$','wizard_load_wpprofile'),
                    (r'^wizard_open_profile/$','wizard_open_profile'),
                    
                    (r'^wizard_save_schedule/$','wizard_save_schedule'), 
                    (r'^wizard_search_profile/$','wizard_search_profile'), 
                    (r'^wizard_save_defnet/$','wizard_save_defnet'), 
                    (r'^wizard_show_defnet_level2/$','wizard_show_defnet_level2'),
                    
                    (r'^wizard_profile_switch/$','wizard_profile_switch'),
                    
                    (r'^wizard_profile_save/$','wizard_wpprofile_save'), 
)

#wizard_open_dialog_policy