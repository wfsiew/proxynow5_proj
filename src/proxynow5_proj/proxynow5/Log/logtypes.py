from django.utils.translation import ugettext as _

LOG_TYPES = (
             {'name': _(u'Apache'),
              'path': '/var/log/httpd',
              'oneormany': 0,
              'commonname': 'access,error'},
             
             {'name': _(u'Middleware'),
              'path': '/var/log',
              'oneormany': 0,
              'commonname': 'log-pn'},
             
             {'name': _(u'Proxy'),
              'path': '/opt/squid/var/logs',
              'oneormany': 0,
              'commonname': 'access,cache'}
)