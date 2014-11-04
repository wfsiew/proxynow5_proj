from django import forms
from django.utils.translation import ugettext as _
from models import *
from proxynow5_proj.proxynow5.forms import BaseSearchForm , BaseFilterForm
import datetime

ADD_FORM_TITLE = _(u'Create new schedule')
EDIT_FORM_TITLE = _(u'Edit schedule')

SEARCH_CHOICES = (
                  (0, _(u'All')),
                  (2, _(u'Recurring')),
)

def get_defschd_hours():
    return tuple([(i, '%0*d' % (2, i)) for i in range(0, 24)])
def get_defschd_minutes():
  
    return tuple([(i, '%0*d' % (2, i)) for i in range(0, 60)])

def get_defschd_year():
    
    return tuple([(i, '%0*d' % (2, i)) for i in range(2010, 2021)])  

def get_defschd_month():
    
    return tuple([(i, '%0*d' % (2, i)) for i in range(1, 13)])
    
def get_defschde_day():
    return tuple ([(i, '%0*d' % (2, i)) for i in range(1, 32)])
    
    
class ScheduleNameForm(forms.Form):
    id = forms.CharField(required=False, widget=forms.HiddenInput(attrs={'size': 20}))
    comment = forms.CharField(max_length=1024, label=_(u'Comment:'),
                              widget=forms.TextInput(attrs={'class': 'text'}), required=False)
    type = forms.ChoiceField(choices=DEFSCHD_TYPES, label=_(u'Type:'),
                             widget=forms.Select(attrs={'class': 'select'}))
    action = forms.CharField(widget=forms.HiddenInput, required=False)
    nameexisted = forms.CharField(max_length=1024,
                                  widget=forms.HiddenInput, required=False)
    name = forms.CharField(max_length=1024, label=_(u'Name:'),
                           widget=forms.TextInput(attrs={'class': 'text'}))
    
    def clean_name(self):
        nameVar = self.cleaned_data['name']
        nameexistedVar = self.cleaned_data['nameexisted']
        
        if nameVar == "":
            raise forms.ValidationError("Please enter the name") 
        
        if nameVar == nameexistedVar: 
            return self.cleaned_data['name']
        
        else:
            try:
                DefSchd.objects.get(name=nameVar)
                raise forms.ValidationError("The same name") 
             
            except DefSchd.DoesNotExist:
                return self.cleaned_data['name']
          
            except:
                raise forms.ValidationError("Name has exited")
            
class ScheduleRecuringForm(forms.Form):
    
    start_time_min_recuring = forms.ChoiceField(choices=get_defschd_minutes(), label=_(u'Start Time:'),
                                                required=False)
    end_time_hour_recuring = forms.ChoiceField(choices=get_defschd_hours(), label=_(u'End Time:'),
                                               required=False)
    end_time_min_recuring = forms.ChoiceField(choices=get_defschd_minutes(), label=_(u'End Time:'),
                                              required=False)
    start_time_hour_recuring = forms.ChoiceField(choices=get_defschd_hours(), label=_(u'Start Time:'),
                                                 required=False)
    
    checkbox_temp = forms.CharField(widget=forms.HiddenInput, required=False)
    checkbox_day = forms.MultipleChoiceField(choices=DEFSCHD_DAYOFWEEK, label=_(u'Week days:'),
                                             widget=forms.CheckboxSelectMultiple(), required=False)
    
    def check_checkbox_day(self):
        if self.cleaned_data['checkbox_temp'] == "00000000":
            raise forms.ValidationError("Please Select at least one")
        
        return self.cleaned_data['checkbox_temp']
    
    def check_start_time_hour_recuring(self):
        
        timestart = datetime.time(int(self.cleaned_data["start_time_hour_recuring"]), int(self.cleaned_data['start_time_min_recuring']))
        timeend = datetime.time(int(self.cleaned_data['end_time_hour_recuring']), int(self.cleaned_data['end_time_min_recuring'])) 
        
        if timestart > timeend :
            raise forms.ValidationError("Ending Time must greater Starting Time")
        
        return self.cleaned_data["start_time_hour_recuring"] 
    
class ScheduleSingleForm(forms.Form):
    
    start_day_month_single = forms.ChoiceField(choices=get_defschd_month(), label=_(u'End Date:'),
                                               required=False)
    start_day_day_single = forms.ChoiceField(choices=get_defschde_day(), label=_(u'Start Date:'),
                                             required=False)
    end_day_year_single = forms.ChoiceField(choices=get_defschd_year(), label=_(u'End Date:'),
                                            required=False)
    end_day_month_single = forms.ChoiceField(choices=get_defschd_month(), label=_(u'End Date:'),
                                             required=False)
    end_day_day_single = forms.ChoiceField(choices=get_defschde_day(), label=_(u'End Date:'),
                                           required=False) 
    start_time_hour_single = forms.ChoiceField(choices=get_defschd_hours(), label=_(u'Start Time:'),
                                               required=False)
    start_time_min_single = forms.ChoiceField(choices=get_defschd_minutes(), label=_(u'Start Time:'),
                                              required=False)
    end_time_hour_single = forms.ChoiceField(choices=get_defschd_hours(), label=_(u'End Time:'),
                                             required=False)
    end_time_min_single = forms.ChoiceField(choices=get_defschd_minutes(), label=_(u'End Time:'),
                                            required=False)
    start_day_year_single = forms.ChoiceField(choices=get_defschd_year(), label=_(u'Start Date:'),
                                              required=False)
    
    def check_start_day_year_single(self):
        try:
        
            datetimestart = datetime.datetime(int(self.cleaned_data['start_day_year_single']), int(self.cleaned_data['start_day_month_single']), int(self.cleaned_data['start_day_day_single']), int(self.cleaned_data['start_time_hour_single']), int(self.cleaned_data['start_time_min_single']))
            datetimeend = datetime.datetime(int(self.cleaned_data['end_day_year_single']), int(self.cleaned_data['end_day_month_single']), int(self.cleaned_data['end_day_day_single']), int(self.cleaned_data['end_time_hour_single']), int(self.cleaned_data['end_time_min_single']))

            if (datetimestart > datetimeend):
                raise forms.ValidationError("Ending Time must greater Starting Time")
        
            return self.cleaned_data['start_day_year_single']
        
        except:
            
            raise forms.ValidationError("format time is not correct")
    
class ScheduleForm(ScheduleNameForm, ScheduleSingleForm, ScheduleRecuringForm):
    
    '''Note : When user Post to server system will assign to this parameter *args
       This variale is dictionary.
    ''' 
                
    def clean_checkbox_day(self):
        typeVar = self.cleaned_data['type']
        
        if typeVar == '2':
            super(ScheduleForm, self).check_checkbox_day()
        
        return self.cleaned_data['checkbox_day']
        
    def clean_start_time_hour_recuring(self):
        typeVar = self.cleaned_data['type']
        
        if typeVar == '2':
            super(ScheduleForm, self).check_start_time_hour_recuring()
            #super(ScheduleForm,self).check_checkbox_day();
            
        return self.cleaned_data['start_time_hour_recuring']
     
     
    def clean_start_day_year_single(self):
        typeVar = self.cleaned_data['type']
         
        if typeVar == '1' :
            super(ScheduleForm, self).check_start_day_year_single()
        
        return self.cleaned_data['start_day_year_single']
        
   
class SearchForm(BaseSearchForm):
    selection = forms.ChoiceField(choices=SEARCH_CHOICES,
                                  widget=forms.Select(attrs={'class': 'search_option'}))       
    
class FilterForm(BaseFilterForm):
    filters = forms.ChoiceField(choices=SEARCH_CHOICES,
                                widget=forms.Select(attrs={'class': 'filter_option'}))    
    
    
