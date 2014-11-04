from proxynow5_proj.proxynow5.Dashboard.models import Dashboard
from proxynow5_proj.proxynow5.getversions import getAvailableVersions
from datetime import datetime

UPGRADE_FAILED_TOKEN = 'Upgrade Failed'
UPGRADE_SUCCESS_TOKEN = 'Update has been applied successfully'

class Upgrade(object):
    def __init__(self, s):
        o = s.split('|')
        self.version = o[0]
        self.releaseDate = get_fmt_date(o[1])
        self.link = o[2]
        
    def is_beta(self):
        try:
            o = self.version.find('beta')
            if o >= 0:
                return True
            
            else:
                return False
            
        except:
            return False
        
    def get_beta_class(self):
        if self.is_beta():
            return 'row_beta'
        
        else:
            return 'row_stable'

def get_version():
    dashboard = None
    dashboardcount = 0
    version = ''
    try:
        dashboardcount = Dashboard.objects.count()
        
    except:
        pass
    
    if dashboardcount > 0:
        dashboard = Dashboard.objects.all()[0]
        version = dashboard.version
        
    return version

def get_upgrade_list(showbeta=True):
    version = get_version()
    lm = []
    if version == '':
        return lm
    
    ls = getAvailableVersions(version, showbeta)
    for s in ls:
        o = Upgrade(s)
        lm.append(o)
    
    return lm
    
def get_datetime_from_str(s):
    try:
        o = datetime.strptime(s, '%d/%m/%Y')
        return o
    
    except:
        return datetime.min
    
def get_fmt_date(s):
    try:
        o = get_datetime_from_str(s)
        return o.strftime('%d %b %Y')
    
    except:
        pass
    
    return ''