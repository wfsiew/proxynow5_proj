from django.shortcuts import *
from django.db import models
from django.db.models.signals import post_delete,post_save
from django.dispatch import receiver
from models import ChangedTable


@receiver(post_save)
@receiver(post_delete)
def handler(sender,**kwargs):
    print "A record added or deleted or updated in following table:"
    tmpStr = str(sender)
    tmpArray = tmpStr.split('.')
    tmpStr2 = str(tmpArray[-1])
    tmpStr2=tmpStr2.rstrip('\'>')
    print tmpStr2
    #This line is very important specially for ChangedTable which is basically the table which external process will read from.
    #IF we dont use this protection we will be trapped in a infinite loop
    if('LogEntry'==tmpStr2 or 'ChangedTable'==tmpStr2 or 'Session'==tmpStr2 or 'User'==tmpStr2): 
        return
    else:  
        try:
            ChangedTable.objects.filter(name=tmpStr2).delete()
        except:
            pass
        p = ChangedTable.objects.create(name=tmpStr2)


