from django.conf.urls.defaults import *
from django.contrib import admin
from django.conf import settings
import os

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()
admin.autodiscover()
site_media = os.path.join(settings.DIRNAME, 'media')
site_rept_image = settings.REPORT_PATH_IMAGE

urlpatterns = patterns('',
                       url(r'^admin/', include(admin.site.urls)),
                       (r'^media/(?P<path>.*)$', 'django.views.static.serve',
                        {'document_root': site_media}),
                       (r'^rept_image/(?P<path>.*)$', 'django.views.static.serve',
                        {'document_root': site_rept_image}),
    # Examples:
    # url(r'^$', 'proxynow5_proj.views.home', name='home'),
    # url(r'^proxynow5_proj/', include('proxynow5_proj.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)

urlpatterns += patterns('',
                        (r'', include('proxynow5_proj.proxynow5.urls')),
                        (r'^setting/', include('proxynow5_proj.proxynow5.Settings.urls')),
                        (r'^dashboard/', include('proxynow5_proj.proxynow5.Dashboard.urls')),
                        (r'^defnet/', include('proxynow5_proj.proxynow5.Definition_Network.urls')),
                        (r'^defuser/', include('proxynow5_proj.proxynow5.Definition_User.urls')),
                        (r'^defservices/', include('proxynow5_proj.proxynow5.Definition_Services.urls')),
                        (r'', include('proxynow5_proj.proxynow5.Administration.urls')),
                        (r'', include('proxynow5_proj.proxynow5.Network.urls')),
                        (r'', include('proxynow5_proj.proxynow5.Definition_Schedule.urls')),
                        (r'', include('proxynow5_proj.proxynow5.Application_Control.urls')),
                        (r'', include('proxynow5_proj.proxynow5.WebProxy.urls')),
                        (r'', include('proxynow5_proj.proxynow5.WebProxy_Filter.urls')),
                        (r'^nat/', include('proxynow5_proj.proxynow5.NAT.urls')),
                        (r'^lic/', include('proxynow5_proj.proxynow5.License.urls')),
                        (r'^log/', include('proxynow5_proj.proxynow5.Log.urls')),
                        (r'^patch/', include('proxynow5_proj.proxynow5.Patch.urls')),
                        (r'', include('proxynow5_proj.proxynow5.Report.urls')),
                        (r'', include('proxynow5_proj.proxynow5.Wizard.urls')),
)