from django.conf import settings
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib 
import reportconnectsql
import reportrrd
# http://code.activestate.com/recipes/473810-send-an-html-email-with-embedded-image-and-plain-t/

def getinfosmtp():
    (con, cur) = reportrrd.GETDBConnection(settings.DBFILE)
    sqlcommand = "select * from ReportServerMail"
    
    emailfromaddress = ""
    smtphost = ""
    smtpport = ""
    smtpuser = ""
    smtppass = ""
    smtpsecure = ""
    
    id = ""
    status = "NO"
    lstobj = cur.execute(sqlcommand)
    
    for dtobj in lstobj:
        status = "OK"
        (id, emailfromaddress, smtphost, smtpport, smtpuser, smtppass, smtpsecure) = dtobj
        break
    
    reportrrd.CloseDBConnection(con, cur)
    return (status, emailfromaddress, smtphost, smtpport, smtpuser, smtppass, smtpsecure)
    
def send_report(html, plaintext, ls_img, ls_contentid, type, subjectemail):
    
    try:
        (status, emailfromaddress, smtphost, smtpport, smtpuser, smtppass, smtpsecure) = getinfosmtp()
        
        if status == "NO":
            print "System can't get the SMTP Server."
            return
        
        msgroot = MIMEMultipart('related')
        msgroot.preamble = 'This is a multi-part message in MIME format.'
        
        msgalt = MIMEMultipart('alternative')
        msgroot.attach(msgalt)
        
        bodyhtml = MIMEText(html, _subtype='html')
        bodyplain = MIMEText(plaintext, _subtype='plain')
        msgalt.attach(bodyplain)
        msgalt.attach(bodyhtml)
        
        imgcount = len(ls_img)
        for i in range(imgcount):
            data = read_file(ls_img[i])
            img = MIMEImage(data, 'png')
            c = '<%s>' % ls_contentid[i]
            img.add_header('Content-Id', c)
            msgroot.attach(img)
        
        #to_addrs = ['Nghia <tinh1@hello.com.vn>']
        to_addrs = [] 
        to_addrs = get_list_emailaddress(type)
        
        if len(to_addrs) == 0:
            print "No email address to send report."
            return 
        
        msgroot['Subject'] = subjectemail
        msgroot['From'] = emailfromaddress #settings.DEFAULT_FROM_EMAIL
        msgroot['To'] = ', '.join(to_addrs)
        
        content = msgroot.as_string()
        
#        smtp = SMTP() 
#        try:
#    #        smtp.connect(settings.EMAIL_HOST, settings.EMAIL_PORT)
#    #        smtp.sendmail(settings.DEFAULT_FROM_EMAIL, to_addrs, content)
#            print emailfromaddress,smtphost,smtpport,smtpuser,smtppass
#            
#            smtp.connect(smtphost, int(smtpport))
#            smtp.ehlo() 
#            smtp.starttls()
#            smtp.ehlo()
#            smtp.login(smtpuser, smtppass)
#            smtp.sendmail(emailfromaddress, to_addrs, content)
#            
#            print "Send OK"
#        finally:
#            smtp.quit()

        try:
            print emailfromaddress, smtphost, smtpport, smtpuser, smtppass, smtpsecure
            
            if (smtpsecure == "SSL"):
                mailserver = smtplib.SMTP_SSL(smtphost, int(smtpport))
                mailserver.login(smtpuser, smtppass)
                mailserver.sendmail(emailfromaddress, to_addrs, content)
                print "Send Mail Following the SSL : OK "
            
            if (smtpsecure == "TLS"):
                mailserver = smtplib.SMTP(smtphost, int(smtpport))
                mailserver.ehlo()
                mailserver.starttls()
                mailserver.ehlo()
                mailserver.login(smtpuser, smtppass)
                mailserver.sendmail(emailfromaddress, to_addrs, content)
                print "Send Mail Following the TLS : OK"
                
            if (smtpsecure == "normal"):
                print "Start From here."
                mailserver = smtplib.SMTP()
                try:
                    mailserver = smtplib.SMTP()
                    mailserver.connect(smtphost, int(smtpport))
                    mailserver.login(smtpuser, smtppass)
                except:
                    mailserver = smtplib.SMTP()
                    mailserver.connect(smtphost, int(smtpport))
                    pass
                
                mailserver.sendmail(emailfromaddress, to_addrs, content)
                print "Send Mail Following the normal :OK "
                
        finally:
            mailserver.quit()
            
    except Exception, e:
        print "Error Info at emailutils of send_report : %s" % (str(e))

def get_list_emailaddress(type):
    try: 
        print settings.DBFILE
        
        queryadapter = reportconnectsql.ProcessData()
        queryadapter.connectproxydb(settings.DBFILE)
        
        sqlcommand = "select lstemail.emailaddress as emailaddress"
        sqlcommand = sqlcommand + " from ReportByEmail email ,ReportListEmail lstemail"
        sqlcommand = sqlcommand + " where email.emailaddress = lstemail.id"
        sqlcommand = sqlcommand + " and email.type in (select id"
        sqlcommand = sqlcommand + " from ReportType"
        sqlcommand = sqlcommand + " where type = '%s'"
        sqlcommand = sqlcommand + " and active = 1)"
        
        sqlcommand = sqlcommand % (type)
        
        print sqlcommand
        
        lstfetch = queryadapter.getdatasqlite(sqlcommand)
        lstemail = []
        print lstfetch
        
        for i in range(0, len(lstfetch)):  
            stremail = lstfetch[i][0]
            lstemail.append(stremail)
        
        return lstemail
      
    except Exception, e:
        print "Erro info at emailutils get_list_emailaddress: %s" % str(e)
        
    return []

def read_file(filename):
    fp = open(filename, 'rb')
    data = None
    try:
        data = fp.read()
        
    finally:
        fp.close()
        
    return data