from django import forms
from django.utils.translation import ugettext as _

REFRESH_CHOICES = (
                   (0, _(u'Never')),
                   (5, _(u'Every 5 seconds')),
                   (10, _(u'Every 10 seconds')),
                   (30, _(u'Every 30 seconds')),
                   (60, _(u'Every 60 seconds')),
)

class RefreshForm(forms.Form):
    refresh = forms.ChoiceField(choices=REFRESH_CHOICES, initial=5,
                                widget=forms.Select(attrs={'class': 'select'}))