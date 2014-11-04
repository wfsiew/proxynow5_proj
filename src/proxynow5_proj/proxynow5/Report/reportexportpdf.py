from django.utils.termcolors import background
from geraldo import *
from geraldo.generators import PDFGenerator, HTMLGenerator
from geraldo.graphics import RoundRect, Line
from geraldo.widgets import SystemField, Label
from proxynow5_proj.settings import REPORT_PATH_IMG
from reportlab.graphics.charts.linecharts import HorizontalLineChart, LineChart
from reportlab.graphics.charts.lineplots import LinePlot
from reportlab.graphics.widgets.markers import makeMarker
from reportlab.lib.colors import yellow, navy, red, green, black, blue, white
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas
import os
from reportlab.lib import colors


filenamepic = os.path.join(REPORT_PATH_IMG,'ProxyNow5_logo_pdf.png')

'''
#---------------------------------------------------------------------------------------------------------#
'''
class ReportTopUser(Report):
    
    title = ''
    
    
    def __init__(self, queryset=None,titilein=''):
        
        self.title = titilein
        Report.__init__(self, queryset)
    
    class band_page_header(ReportBand):
        height = 3.3*cm
        elements = [
            SystemField(expression='%(report_title)s',
                          left=0, top=0.8*cm, width=10*cm, height=3*cm,
                          style={'wordWrap': True, 'borderWidth': 1,
                                 'borderColor': black, 'borderPadding': 4,
                                 'borderRadius': 2, 'alignment': TA_JUSTIFY}),
                    
            Image(filename = filenamepic, left=12*cm, top=0.8*cm,height=3*cm,width=10*cm),  
                  
            Label(text="Top", top=2.85*cm, left=0, width=1*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Users", top=2.85*cm, left=1*cm,width=7*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Request", top=2.85*cm, left=8*cm,width=2*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=10*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Duration", top=2.85*cm, left=11.5*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=13*cm,width=2*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Traffic ", top=2.85*cm, left=15*cm,width=2.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=17.5*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
        ]
        
        borders = {'bottom': Line(stroke_color=navy)}
        

    class band_page_footer(ReportBand):
        height = 0.5*cm
        elements = [
            Label(text='--- InternetNow ---', top=0.1*cm,
                right=0),
            SystemField(expression='Printed in %(now:%Y, %b %d)s at %(now:%H:%M)s', top=0.1*cm,
                width=BAND_WIDTH, style={'alignment': TA_RIGHT}),
                 
            SystemField(expression='Page %(page_number)d of %(page_count)d', top=0.1*cm,
                width=BAND_WIDTH, style={'alignment': TA_CENTER}),   
        ]
        borders = {'top': Line(stroke_color=red, stroke_width=0.1)}
        
        
    class band_detail(ReportBand):
        height = 0.425*cm
        elements = [
            ObjectValue(attribute_name='usernbr',top=0*cm, left=0,width=1*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True}),
            ObjectValue(attribute_name='users', top=0*cm, left=1*cm,width=7*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True}),
            ObjectValue(attribute_name='request', top=0*cm, left=8*cm,width=2*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='requestpercentage', top=0*cm,left=10*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='duration', top=0*cm, left=11.5*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='durationpercentage', top=0*cm,width=2*cm, left=13*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='traffic', top=0*cm, width=2.5*cm ,left=15*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),      
            ObjectValue(attribute_name='trafficpercentage', top=0*cm, left=17.5*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
        ] 
        
        
        
    
'''
#---------------------------------------------------------------------------------------------------------#
report for domain
'''
class ReportTopSite(Report):        
    title = ''
    
    def __init__(self, queryset=None,titilein=''):
        
        self.title = titilein
        Report.__init__(self, queryset)
            
    class band_page_header(ReportBand):
        height = 3.3*cm
        elements = [
            SystemField(expression='%(report_title)s',
                          left=0, top=0.8*cm, width=10*cm,height=3*cm,
                          style={'wordWrap': True, 'borderWidth': 1,
                                 'borderColor': black, 'borderPadding': 4,
                                 'borderRadius': 2, 'alignment': TA_JUSTIFY}),
                    
            Image(filename = filenamepic, left=12*cm, top=0.8*cm,height=3*cm,width=10*cm),
            
            Label(text="Top", top=2.85*cm, left=0,width=1*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Site", top=2.85*cm, left=1*cm,width=6.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="User", top=2.85*cm, left=7.5*cm,width=1*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Request ", top=2.85*cm, left=8.5*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=10*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Duration", top=2.85*cm, left=11.5*cm,width=2*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=13.5*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Traffic ", top=2.85*cm, left=15*cm,width=2.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=17.5*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
        ]
        
        borders = {'bottom': Line(stroke_color=navy)}
     
    class band_detail(ReportBand):
        height = 0.425*cm
        elements = [
            ObjectValue(attribute_name='tophost', top=0*cm, left=0,width=1*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True}),
            ObjectValue(attribute_name='visitedwebsite', top=0*cm, left=1*cm,width=6.5*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True}),
            ObjectValue(attribute_name='host', top=0*cm, left=7.5*cm,width=1*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='request', top=0*cm, left=8.5*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='requestpercentage', top=0*cm, left=10*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='duration', top=0*cm, left=11.5*cm,width=2*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='durationpercentage', top=0*cm, left=13.5*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='traffic', top=0*cm, left=15*cm,width=2.5*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),      
            ObjectValue(attribute_name='trafficpercentage', top=0*cm, left=17.5*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
        ] 
        
    class band_page_footer(ReportBand):
        height = 0.4*cm
        elements = [
            Label(text='--- InternetNow ---', top=0.1*cm,
                right=0),
            SystemField(expression='Printed in %(now:%Y, %b %d)s at %(now:%H:%M)s', top=0.1*cm,
                width=BAND_WIDTH, style={'alignment': TA_RIGHT}),
                    
            SystemField(expression='Page %(page_number)d of %(page_count)d', top=0.1*cm,
                width=BAND_WIDTH, style={'alignment': TA_CENTER}),   
        ]
        borders = {'top': Line(stroke_color=red, stroke_width=0.1)}

'''
#---------------------------------------------------------------------------------------------------------#
report for domain
'''
class ReportTopUserByHost(Report):
    title = ''
    
    
    def __init__(self, queryset=None,titilein=''):
        
        self.title = titilein
        Report.__init__(self, queryset)
              
    class band_page_header(ReportBand):
        height = 3.3*cm
        elements = [  
            
             SystemField(expression='%(report_title)s',
                          left=0, top=0.8*cm, width=10*cm,height=3*cm,
                          style={'wordWrap': True, 'borderWidth': 1,
                                 'borderColor': black, 'borderPadding': 4,
                                 'borderRadius': 2, 'alignment': TA_JUSTIFY}),
                    
            Image(filename = filenamepic, left=12*cm, top=0.8*cm,height=3*cm,width=10*cm),  
                                 
            Label(text="Top", top=2.85*cm, left=0, width=1*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Users", top=2.85*cm, left=1*cm,width=7*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Request", top=2.85*cm, left=8*cm,width=2*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=10*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Duration", top=2.85*cm, left=11.5*cm,width=2*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=13.5*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Traffic ", top=2.85*cm, left=15*cm,width=2.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=17.5*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
        ]
        
        borders = {'bottom': Line(stroke_color=navy)}

    class band_page_footer(ReportBand):
        height = 0.5*cm
        elements = [
            Label(text='--- InternetNow ---', top=0.1*cm,
                right=0),
            SystemField(expression='Printed in %(now:%Y, %b %d)s at %(now:%H:%M)s', top=0.1*cm,
                width=BAND_WIDTH, style={'alignment': TA_RIGHT}),
                    
            SystemField(expression='Page %(page_number)d of %(page_count)d', top=0.1*cm,
                width=BAND_WIDTH, style={'alignment': TA_CENTER}),   
        ]
        borders = {'top': Line(stroke_color=red, stroke_width=0.1)}
        
        
    class band_detail(ReportBand):
        height = 0.425*cm
        elements = [
            ObjectValue(attribute_name='top',top=0*cm, left=0,width=1*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True}),
            ObjectValue(attribute_name='user', top=0*cm, left=1*cm,width=7*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True}),
            ObjectValue(attribute_name='request', top=0*cm, left=8*cm,width=2*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='requestpercentage', top=0*cm,left=10*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='duration', top=0*cm, left=11.5*cm,width=2*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='durationpercentage', top=0*cm,width=1.5*cm, left=13.5*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='traffic', top=0*cm, width=2.5*cm ,left=15*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),      
            ObjectValue(attribute_name='trafficpercentage', top=0*cm, left=17.5*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
        ] 

'''
#---------------------------------------------------------------------------------------------------------#
report for domain
'''  
        
class ReportTopSiteByUser(Report):
    
    title = ''
    
    def __init__(self, queryset=None,titilein=''):
        
        self.title = titilein
        Report.__init__(self, queryset)
     
    class band_page_header(ReportBand):
        height = 3.3*cm
        elements = [
                    
            SystemField(expression='%(report_title)s',
                          left=0, top=0.8*cm, width=10*cm,height=3*cm,
                          style={'wordWrap': True, 'borderWidth': 1,
                                 'borderColor': black, 'borderPadding': 4,
                                 'borderRadius': 2, 'alignment': TA_JUSTIFY}),
                    
            Image(filename = filenamepic, left=12*cm, top=0.8*cm,height=3*cm,width=10*cm),  
                    
            Label(text="Top", top=2.85*cm, left=0, width=1*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Site", top=2.85*cm, left=1*cm,width=7*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Request", top=2.85*cm, left=8*cm,width=2*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=10*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Duration", top=2.85*cm, left=11.5*cm,width=2*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=13.5*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Traffic ", top=2.85*cm, left=15*cm,width=2.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=17.5*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
        ]
        
        borders = {'bottom': Line(stroke_color=navy)}

    class band_page_footer(ReportBand):
        height = 0.4*cm
        elements = [
            Label(text='--- InternetNow ---', top=0.1*cm,
                right=0),
                    
            SystemField(expression='Printed in %(now:%Y, %b %d)s at %(now:%H:%M)s', top=0.1*cm,
                width=BAND_WIDTH, style={'alignment': TA_RIGHT}),
            
            SystemField(expression='Page %(page_number)d of %(page_count)d', top=0.1*cm,
                width=BAND_WIDTH, style={'alignment': TA_CENTER}),   
        ]
        borders = {'top': Line(stroke_color=red, stroke_width=0.1)}
        
        
    class band_detail(ReportBand):
        height = 0.425*cm
        elements = [
            ObjectValue(attribute_name='top',top=0, left=0,width=1*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True}),
            ObjectValue(attribute_name='host', top=0, left=1*cm,width=7*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True}),
            ObjectValue(attribute_name='request', top=0, left=8*cm,width=2*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='requestpercentage', top=0,left=10*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='duration', top=0, left=11.5*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='durationpercentage', top=0,width=2*cm, left=13*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='traffic', top=0, width=2.5*cm ,left=15*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),      
            ObjectValue(attribute_name='trafficpercentage', top=0, left=17.5*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
        ] 
        
class ReportTopMime(Report):
    title = ''
    
    def __init__(self, queryset=None,titilein=''):
        self.title = titilein
        Report.__init__(self, queryset)
        
        
    class band_page_header(ReportBand):
        height = 3.3*cm
        elements = [
            SystemField(expression='%(report_title)s',
                          left=0, top=0.8*cm, width=10*cm,height=3*cm,
                          style={'wordWrap': True, 'borderWidth': 1,
                                 'borderColor': black, 'borderPadding': 4,
                                 'borderRadius': 2, 'alignment': TA_JUSTIFY}),
                    
            Image(filename = filenamepic, left=12*cm, top=0.8*cm,height=3*cm,width=10*cm),
                    
            Label(text="Top", top=2.85*cm, left=0,width=1*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Content Type", top=2.85*cm, left=1*cm,width=10.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Request ", top=2.85*cm, left=11.5*cm,width=2*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=13.5*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Traffic ", top=2.85*cm, left=15*cm,width=2.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=17.5*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
        ]
        
        borders = {'bottom': Line(stroke_color=navy)}

    class band_page_footer(ReportBand):
        height = 0.4*cm
        elements = [
            Label(text='--- InternetNow ---', top=0.1*cm,
                right=0),
                    
            SystemField(expression='Printed in %(now:%Y, %b %d)s at %(now:%H:%M)s', top=0.1*cm,
                width=BAND_WIDTH, style={'alignment': TA_RIGHT}),
                    
            SystemField(expression='Page %(page_number)d of %(page_count)d', top=0.1*cm,
                width=BAND_WIDTH, style={'alignment': TA_CENTER}),   
        ]
        borders = {'top': Line(stroke_color=red, stroke_width=0.1)}
        
        
    class band_detail(ReportBand):
        height = 0.425*cm
        elements = [
            ObjectValue(attribute_name='top', top=0*cm, left=0,width=1*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True}),
            ObjectValue(attribute_name='contentype', top=0*cm, left=1*cm,width=10.5*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True}),
            ObjectValue(attribute_name='request', top=0*cm, left=11.5*cm,width=2*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='requestpercentage', top=0*cm, left=13.5*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='traffic', top=0*cm, left=15*cm,width=2.5*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),      
            ObjectValue(attribute_name='trafficpercentage', top=0*cm, left=17.5*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),         
        ] 
 
class ReportTopUserbyMime(Report):
    title = ''
    
    def __init__(self, queryset=None,titilein=''):
        self.title = titilein
        Report.__init__(self, queryset)
     
    class band_page_header(ReportBand):
        height = 3.3*cm
        elements = [
            SystemField(expression='%(report_title)s',
                          left=0, top=0.8*cm, width=10*cm, height=3*cm,
                          style={'wordWrap': True, 'borderWidth': 1,
                                 'borderColor': black, 'borderPadding': 4,
                                 'borderRadius': 2, 'alignment': TA_JUSTIFY}),
                    
            Image(filename = filenamepic, left=12*cm, top=0.8*cm,height=3*cm,width=10*cm),  
                  
            Label(text="Top", top=2.85*cm, left=0, width=1*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Users", top=2.85*cm, left=1*cm,width=7*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Request", top=2.85*cm, left=8*cm,width=2*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=10*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Duration", top=2.85*cm, left=11.5*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=13*cm,width=2*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Traffic ", top=2.85*cm, left=15*cm,width=2.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=17.5*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
        ]
        
        borders = {'bottom': Line(stroke_color=navy)}

    class band_page_footer(ReportBand):
        height = 0.5*cm
        elements = [
            Label(text='--- InternetNow ---', top=0.1*cm,
                right=0),
                    
            SystemField(expression='Printed in %(now:%Y, %b %d)s at %(now:%H:%M)s', top=0.1*cm,
                width=BAND_WIDTH, style={'alignment': TA_RIGHT}),
                    
            SystemField(expression='Page %(page_number)d of %(page_count)d', top=0.1*cm,
                width=BAND_WIDTH, style={'alignment': TA_CENTER}),   
        ]
        borders = {'top': Line(stroke_color=red, stroke_width=0.1)}
        
        
    class band_detail(ReportBand):
        height = 0.425*cm
        elements = [
            ObjectValue(attribute_name='top',top=0*cm, left=0,width=1*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True}),
            ObjectValue(attribute_name='host', top=0*cm, left=1*cm,width=7*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True}),
            ObjectValue(attribute_name='request', top=0*cm, left=8*cm,width=2*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='requestpercentage', top=0*cm,left=10*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='duration', top=0*cm, left=11.5*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='durationpercentage', top=0*cm,width=2*cm, left=13*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='traffic', top=0*cm, width=2.5*cm ,left=15*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),      
            ObjectValue(attribute_name='trafficpercentage', top=0*cm, left=17.5*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
        ] 
        
class ReportTopDestbyMime(Report):
    title = ''
    
    def __init__(self, queryset=None,titilein=''):
        self.title = titilein
        Report.__init__(self, queryset)
     
    class band_page_header(ReportBand):
        height = 3.3*cm
        elements = [
            SystemField(expression='%(report_title)s',
                          left=0, top=0.8*cm, width=10*cm,height=3*cm,
                          style={'wordWrap': True, 'borderWidth': 1,
                                 'borderColor': black, 'borderPadding': 4,
                                 'borderRadius': 2, 'alignment': TA_JUSTIFY}),
                    
            Image(filename = filenamepic, left=12*cm, top=0.8*cm,height=3*cm,width=10*cm),
            
            Label(text="Top", top=2.85*cm, left=0,width=1*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Site", top=2.85*cm, left=1*cm,width=7.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Request ", top=2.85*cm, left=8.5*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=10*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Duration", top=2.85*cm, left=11.5*cm,width=2*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=13.5*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Traffic ", top=2.85*cm, left=15*cm,width=2.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=17.5*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
        ]
        
        borders = {'bottom': Line(stroke_color=navy)}

    class band_page_footer(ReportBand):
        height = 0.4*cm
        elements = [
            Label(text='--- InternetNow ---', top=0.1*cm,
                right=0),
                    
            SystemField(expression='Printed in %(now:%Y, %b %d)s at %(now:%H:%M)s', top=0.1*cm,
                width=BAND_WIDTH, style={'alignment': TA_RIGHT}),
                    
            SystemField(expression='Page %(page_number)d of %(page_count)d', top=0.1*cm,
                width=BAND_WIDTH, style={'alignment': TA_CENTER}),   
        ]
        borders = {'top': Line(stroke_color=red, stroke_width=0.1)}
        
        
    class band_detail(ReportBand):
        height = 0.425*cm
        elements = [
            ObjectValue(attribute_name='top', top=0*cm, left=0,width=1*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True}),
            ObjectValue(attribute_name='destination', top=0*cm, left=1*cm,width=7.5*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True}),
            ObjectValue(attribute_name='request', top=0*cm, left=8.5*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='requestpercentage', top=0*cm, left=10*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='duration', top=0*cm, left=11.5*cm,width=2*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='durationpercentage', top=0*cm, left=13.5*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='traffic', top=0*cm, left=15*cm,width=2.5*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),      
            ObjectValue(attribute_name='trafficpercentage', top=0*cm, left=17.5*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.2,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
        ] 
            

class ReportTopMimebyUser(Report):
    title = ''
    
    def __init__(self, queryset=None,titilein=''):
        self.title = titilein
        Report.__init__(self, queryset)
         
    class band_page_header(ReportBand):
        height = 3.3*cm
        elements = [
            SystemField(expression='%(report_title)s',
                          left=0, top=0.8*cm, width=10*cm,height=3*cm,
                          style={'wordWrap': True, 'borderWidth': 1,
                                 'borderColor': black, 'borderPadding': 4,
                                 'borderRadius': 2, 'alignment': TA_JUSTIFY}),
                    
            Image(filename = filenamepic, left=12*cm, top=0.8*cm,height=3*cm,width=10*cm),
                    
            Label(text="Top", top=2.85*cm, left=0, width=1*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Site", top=2.85*cm, left=1*cm,width=7*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Request", top=2.85*cm, left=8*cm,width=2*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=10*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Duration", top=2.85*cm, left=11.5*cm,width=2*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=13.5*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="Traffic ", top=2.85*cm, left=15*cm,width=2.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
            Label(text="%", top=2.85*cm, left=17.5*cm,width=1.5*cm,style= {'alignment': TA_CENTER,'backColor':colors.HexColor('#00B0F0'),'textColor':white}),
        ]
        
        borders = {'bottom': Line(stroke_color=navy)}
    
    class band_page_footer(ReportBand):
        height = 0.4*cm
        elements = [
            Label(text='--- InternetNow ---', top=0.1*cm,
                right=0),
            SystemField(expression='Printed in %(now:%Y, %b %d)s at %(now:%H:%M)s', top=0.1*cm,
                width=BAND_WIDTH, style={'alignment': TA_RIGHT}),
                    
            SystemField(expression='Page %(page_number)d of %(page_count)d', top=0.1*cm,
                width=BAND_WIDTH, style={'alignment': TA_CENTER}),   
        ]
        borders = {'top': Line(stroke_color=red, stroke_width=0.1)}
        
        
    class band_detail(ReportBand):
        height = 0.425*cm
        elements = [
            ObjectValue(attribute_name='tophost',top=0, left=0,width=1*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True}),
            ObjectValue(attribute_name='contenttype', top=0, left=1*cm,width=7*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True}),
            ObjectValue(attribute_name='request', top=0, left=8*cm,width=2*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='requestpercentage', top=0,left=10*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='duration', top=0, left=11.5*cm,width=2*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='durationpercentage', top=0,width=1.5*cm, left=13.5*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
            ObjectValue(attribute_name='traffic', top=0, width=2.5*cm ,left=15*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),      
            ObjectValue(attribute_name='trafficpercentage', top=0, left=17.5*cm,width=1.5*cm,style = {'fontSize':7,'borderWidth': 0.3,'borderColor': black,'wordWrap': True,'alignment': TA_RIGHT}),
        ] 
    