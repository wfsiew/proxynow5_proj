from django import forms
from django.utils.translation import ugettext as _
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import auth
from Definition_User.models import DefUser, DEFUSER_ACCESS_TYPES

DISPLAY_CHOICES = (
                   (0, _(u'All')),
                   (10, '10'),
                   (25, '25'),
                   (50, '50'),
                   (100, '100'),
                   (250, '250'),
                   (500, '500')
)

USER_SEARCH_CHOICES = (
                       (0, _(u'All')),
                       (1, _(u'Internal user')),
                       (2, _(u'External user'))
)

class BaseSaveForm(forms.Form):
    def save(self, request):
        save_type = request.POST['save_type']
        if save_type == '':
            return self.insert(request)
        
        elif save_type == 'update':
            return self.update(request)
        
        elif save_type == 'inserttemp':
            return self.insert_temp(request)
        
        elif save_type == 'updatetemp':
            return self.update_temp(request)
        
        return None

class BaseSearchForm(forms.Form):
    query = forms.CharField(widget=forms.TextInput(attrs={'size': 27}))
    
class NavigateForm(forms.Form):
    display = forms.ChoiceField(choices=DISPLAY_CHOICES, initial=100, label=_(u'Display'),
                                widget=forms.Select(attrs={'class': 'display_options'}))
    
class BaseFilterForm(forms.Form):
    filter_text = forms.CharField(widget=forms.TextInput(attrs={'size': 12}))
    
class UserFilterForm(BaseFilterForm):
    filters = forms.ChoiceField(choices=USER_SEARCH_CHOICES,
                                widget=forms.Select(attrs={'class': 'filter_option'}))
    
class AuthForm(forms.Form):
    username = forms.CharField(max_length=1024, label=_(u'Username'),
                               widget=forms.TextInput(attrs={'class': 'login_text'}))
    password = forms.CharField(max_length=100, label=_(u'Password'),
                               widget=forms.PasswordInput(attrs={'class': 'login_text'}))
    
    def authenticate(self, request):
        username = self.cleaned_data['username']
        password = self.cleaned_data['password']
        user = None
        
        if username and password:
            user = auth.authenticate(username=username, password=password)
            if user is None:
                raise Exception(_('Incorrect username or password. Note that both fields are case-sensitive.'))
            
        #self.check_for_test_cookie(request)
        self.set_access_type(request, user)
                
        return user
    
    def set_access_type(self, request, user):
        if user is None:
            return
        
        if user.is_superuser == 1:
            request.session['access_type'] = DEFUSER_ACCESS_TYPES[1][0]
            
        else:
            try:
                o = DefUser.objects.get(name=user.username)
                if o.accesstype == DEFUSER_ACCESS_TYPES[0][0]:
                    request.session['access_type'] = DEFUSER_ACCESS_TYPES[0][0]
                    request.session['user_id'] = o.id
                    
                else:
                    request.session['access_type'] = DEFUSER_ACCESS_TYPES[1][0]
                    
            except:
                pass
        
    def check_for_test_cookie(self, request):
        if request:
            if not request.session.test_cookie_worked():
                raise Exception(
                    _("Your Web browser doesn't appear to have cookies enabled. "
                      "Cookies are required for logging in."))