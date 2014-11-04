# Django settings for proxynow5_proj project.
import os

DEBUG = True
RELEASE = False
TEMPLATE_DEBUG = DEBUG
DIRNAME = os.path.abspath(os.path.dirname(__file__))

DBFILE = os.path.join(os.path.join(DIRNAME, 'proxynow5'), 'proxynow5.db')

DIRFILES = os.path.join(DIRNAME, 'files')
REPORT_PATH_DATA = os.path.join(DIRNAME, 'data')

REPORT_PATH = os.path.join(DIRNAME,"Report")
REPORT_PATH_IMAGE = os.path.join(REPORT_PATH, 'rept_image')
REPORT_PATH_PDF = os.path.join(REPORT_PATH, 'rept_pdf')
REPORT_PATH_CSV = os.path.join(REPORT_PATH,'rept_csv')

REPORT_PATH_MEDIA = os.path.join(DIRNAME,'media')
REPORT_PATH_CSS = os.path.join(REPORT_PATH_MEDIA,'css')
REPORT_PATH_IMG = os.path.join(REPORT_PATH_CSS,'img')

REPORT_PATH_SQL = os.path.join(DIRNAME, 'RealTimeReportScripts')

DEFAULT_FROM_EMAIL = 'ProxyNow! 5 <proxynow5@dev.com>'
SERVER_EMAIL = 'ProxyNow! 5 <proxynow5@dev.com>'
EMAIL_HOST = '10.8.0.21'
EMAIL_PORT = 25
EMAIL_HOST_USER = ''
EMAIL_HOST_PASSWORD = ''

ADMINS = (
#          ('wfsiew', 'wfsiew@localhost'),
    # ('Your Name', 'your_email@example.com'),
    ('Mohammad Mahboubian', 'mohammad@internetnow.com.my'),
    ('nghia', 'nghia@internetnow.com.my'),
)

MANAGERS = ADMINS

AUTHENTICATION_BACKENDS = ('proxynow5_proj.proxynow5.backends.AuthBackend',)

LOCALE_PATHS = (
                os.path.join(DIRNAME, 'locale'),
)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': DBFILE,                  # Or path to database file if using sqlite3.
        'USER': '',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'Asia/Kuala_Lumpur'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale
USE_L10N = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
MEDIA_ROOT = ''

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = ''

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"
STATIC_ROOT = ''

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = '/static/'

# URL prefix for admin static files -- CSS, JavaScript and images.
# Make sure to use a trailing slash.
# Examples: "http://foo.com/static/admin/", "/static/admin/".
ADMIN_MEDIA_PREFIX = '/static/admin/'

# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = '%*jvcnmj^5vr7l(hoy39h&n)2gef$&n3hca(&)%f1cwi^lrcr2'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.transaction.TransactionMiddleware',
    'proxynow5_proj.proxynow5.middleware.UIExceptionMiddleware',
)

ROOT_URLCONF = 'proxynow5_proj.urls'

TEMPLATE_DIRS = (
                 os.path.join(DIRNAME, 'templates'),
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'proxynow5_proj.proxynow5',
    'proxynow5_proj.proxynow5.AD_User',
    'proxynow5_proj.proxynow5.NIC',
    'proxynow5_proj.proxynow5.Definition_Network',
    'proxynow5_proj.proxynow5.Definition_Services',
    'proxynow5_proj.proxynow5.Definition_Schedule',
    'proxynow5_proj.proxynow5.Definition_User',
    'proxynow5_proj.proxynow5.Administration',
    'proxynow5_proj.proxynow5.Network',
    'proxynow5_proj.proxynow5.Application_Control',
    'proxynow5_proj.proxynow5.WebProxy',
	'proxynow5_proj.proxynow5.WebProxy_Filter',
    'proxynow5_proj.proxynow5.Settings',
    'proxynow5_proj.proxynow5.Dashboard',
    'proxynow5_proj.proxynow5.NAT',
    'proxynow5_proj.proxynow5.License',
    'proxynow5_proj.proxynow5.Report',
	'proxynow5_proj.proxynow5.Wizard'
    # Uncomment the next line to enable the admin:
    # 'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
)

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}

LOGIN_URL = '/'
LOGOUT_URL = '/logout/'
