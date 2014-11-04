import os
import sys

os.environ['DJANGO_SETTINGS_MODULE'] = "proxynow5_proj.settings"
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + '/..')

import reportsendmail
# days ,weeks ,months, years
# reportsendmail.sendmail('days')

reportsendmail.sendmail('months')