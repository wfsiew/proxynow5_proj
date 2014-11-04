from django.utils.translation import ugettext as _
from proxynow5_proj.proxynow5.Definition_Schedule.models import DefSchd
from proxynow5_proj.proxynow5.WebProxy.models import WPProfileExcept, WPProfile
from proxynow5_proj.proxynow5.WebProxy_Filter.models import WPCat, WPCatValue, \
    WPWhiteList, WPWhiteListValue, WPBlackList, WPBlackListValue, WPExt, WPExtValue, \
    WPContent, WPContentValue, WPMIME, WPMIMEValue
from proxynow5_proj.proxynow5.utils import get_obj_id
import datetime
from proxynow5_proj.proxynow5.Definition_Network.models import DefNet

LIST_GROUP_POLICY = [_(u'Unrestricted'),
                     _(u'Unrestricted But Block Unsafe Site'),
                     _(u'Strict During Office Hour'),
                     _(u'Strict After Office Hour'),
                     _(u'Allow Financial Site'),
                     _(u'Allow Job Sites'),
                     _(u'Less Strict After Office Hour'),
                     _(u'Less Strict During Office Hour'),
                     ]

'''
    Define Schedule.
'''
# type = 1 : Single.
# type = 2 : Recurring.

schd001 = DefSchd()

schd001.id = 1
schd001time1 = datetime.datetime(1, 1, 1, int('09'), int('00'))
schd001time2 = datetime.datetime(1, 1, 1, int('17'), int('00'))
schd001.comment = "Office Hour"
schd001.name = "Office Hour"
schd001.type = 2
schd001.start = schd001time1
schd001.end = schd001time2
''' all days in week'''
schd001.weekdays = 124

schd002 = DefSchd()

schd002.id =2
schd002time1 = datetime.datetime(1, 1, 1, int('17'), int('00'))
schd002time2 = datetime.datetime(1, 1, 1, int('23'), int('59'))
schd002.comment = "After Office Hour"
schd002.name = "After Office Hour"
schd002.type = 2
schd002.start = schd002time1
schd002.end = schd002time2
''' all days in week'''
schd002.weekdays = 124

schd003 = DefSchd()

schd003.id =3
schd003time1 = datetime.datetime(1, 1, 1, int('00'), int('00'))
schd003time2 = datetime.datetime(1, 1, 1, int('09'), int('00'))
schd003.comment = "After Office Hour 2"
schd003.name = "After Office Hour 2"
schd003.type = 2
schd003.start = schd003time1
schd003.end = schd003time2
''' all days in week'''
schd003.weekdays = 124

'''
    Define Cat
'''

# 
cat1 = WPCat()
#cat1.id = get_obj_id(cat1)
cat1.id = 1
cat1.name = "Categories"
cat1.type = 2
cat1.comment = "comment"

cat1_items_1 = WPCatValue()
cat1_items_1.id = get_obj_id(cat1_items_1)
cat1_items_1.uid = cat1
cat1_items_1.url = "internetnow.com.my"

cat1_items_2 = WPCatValue()
cat1_items_2.id = get_obj_id(cat1_items_2)
cat1_items_2.uid = cat1
cat1_items_2.url = "facebook.com.my"


'''
    Define Whitelist
'''

whitelist1 = WPWhiteList()
#whitelist1.id = get_obj_id(whitelist1)
whitelist1.id = 1
whitelist1.name = "Whitelist 1."
whitelist1.comment = "Whitelist comment."

whitelist_items_1_1 = WPWhiteListValue()
whitelist_items_1_1.id = get_obj_id(whitelist_items_1_1) 
whitelist_items_1_1.uid = whitelist1
whitelist_items_1_1.url = "yahoo.com.my"

whitelist_items_1_2 = WPWhiteListValue()
whitelist_items_1_2.id = get_obj_id(whitelist_items_1_2)
whitelist_items_1_2.uid = whitelist1
whitelist_items_1_2.url = "google.com.my"


'''
    Define Blacklist
'''
blacklist1 = WPBlackList()
blacklist1.id = 1
blacklist1.comment = "blacklist"
blacklist1.name = "black list"

blacklist_items_1_1 = WPBlackListValue()
blacklist_items_1_1.id = get_obj_id(blacklist_items_1_1)
blacklist_items_1_1.uid = blacklist1
blacklist_items_1_1.url = "yahoo.com.vn"

blacklist_items_1_2 = WPBlackListValue()
blacklist_items_1_2.id = get_obj_id(blacklist_items_1_2)
blacklist_items_1_2.uid = blacklist1
blacklist_items_1_2.url = "yahoo.com.us"


'''
    Define Allowed and Blocked extension.
'''

allow_extension1 = WPExt()
#allow_extension1.id = get_obj_id(allow_extension1)
allow_extension1.id = 1
allow_extension1.name = "Allow Extension 1"
allow_extension1.comment = "Extension 1"

block_extension2 = WPExt()
#block_extension2.id = get_obj_id(block_extension2) 
block_extension2.id = 2
block_extension2.name = "Block Extension 2"
block_extension2.comment = "Block Extension 2"

extension_items_1_1 = WPExtValue() 
extension_items_1_1.id = get_obj_id(extension_items_1_1)
extension_items_1_1.extension = ".flv"
extension_items_1_1.uid = allow_extension1

extension_items_1_2 = WPExtValue() 
extension_items_1_2.id = get_obj_id(extension_items_1_2)
extension_items_1_2.extension = ".mp3"
extension_items_1_2.uid = allow_extension1

extension_items_2_1 = WPExtValue() 
extension_items_2_1.id = get_obj_id(extension_items_2_1)
extension_items_2_1.extension = ".exe"
extension_items_2_1.uid = block_extension2

extension_items_2_2 = WPExtValue() 
extension_items_2_2.id = get_obj_id(extension_items_2_2)
extension_items_2_2.extension = ".msi"
extension_items_2_2.uid = block_extension2

'''
    Define Content
'''

content1 = WPContent()
#content1.id = get_obj_id(content1)
content1.id = 1
content1.name = "Content 2"
content1.comment = "Comment 2"

content_items_1_1 = WPContentValue()
content_items_1_1.id = get_obj_id(content_items_1_1)
content_items_1_1.keyword = "Key Work"
content_items_1_1.score = 1
content_items_1_1.uid = content1

content_items_1_2 =  WPContentValue()
content_items_1_2.id = get_obj_id(content_items_1_2)
content_items_1_2.keyword = "Key Work 2"
content_items_1_2.score = 2
content_items_1_2.uid = content1


'''
    Define Mime.
'''
allowed_mime1 = WPMIME()
#allowed_mime1.id = get_obj_id(allowed_mime1)
allowed_mime1.id = 1
allowed_mime1.name = "MimeType 1"
allowed_mime1.comment = "Comment MimeType 1"

blocked_mime2 = WPMIME()
#blocked_mime2.id = get_obj_id(blocked_mime2)
blocked_mime2.id = 2
blocked_mime2.name = "Mime Type 2"
blocked_mime2.comment = "Comment Mime Type 2" 

allowed_mime_items_1_1 = WPMIMEValue()
allowed_mime_items_1_1.id = get_obj_id(allowed_mime_items_1_1) 
allowed_mime_items_1_1.mime = "Text/html"
allowed_mime_items_1_1.uid = allowed_mime1

blocked_mime_items_2_2 = WPMIMEValue()
blocked_mime_items_2_2.id = get_obj_id(blocked_mime_items_2_2)
blocked_mime_items_2_2.mime = "css/text"
blocked_mime_items_2_2.uid = blocked_mime2

'''
    Define NetWork
'''


'''
    Define Profile
'''
profile1 = WPProfile() 
profile1.id = 1
profile1.name = "Office Hours"
profile1.location = 1
profile1.enable = 0
profile1.timequota = 0
profile1.sizequota = 0
profile1.catdef = ""

exceptdetail = WPProfileExcept()
exceptdetail.profileid =profile1
exceptdetail.skipauth = 0
exceptdetail.skipcache = 0
exceptdetail.skipav = 0
exceptdetail.skipext = 0
exceptdetail.skipmime = 0
exceptdetail.skipurl = 1
exceptdetail.skipcontentfilter = 0
exceptdetail.id = get_obj_id(exceptdetail)  







 

#wp = WPProfileExcept()
#wp.profileid = 1
#wp.id = 1
#wp.skipauth = 0
#wp.skipcache = 0
#wp.skipav = 0
#wp.skipext = 0
#wp.skipmime = 0
#wp.skipurl = 0
#wp.skipcontentfilter = 0


 



 
























    

 
