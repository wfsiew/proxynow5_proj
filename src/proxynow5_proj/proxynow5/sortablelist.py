def get_location_insert(klass, arg):
    if arg == 'top':
        return 1
    
    elif arg == 'bottom':
        n = klass.objects.count()
        o = klass.objects.order_by('location')[n - 1]
        return o.location + 1
    
    loc = int(arg)
    return loc

def update_locations_after_insert(loc, argls):
    i = loc - 1
    ls = argls[i:]
    for o in ls:
        i += 1
        o.location = i + 1
        o.save()
        
def get_location_update(klass, arg):
    if arg == 'top':
        return 1
    
    elif arg == 'bottom':
        n = klass.objects.count()
        o = klass.objects.order_by('location')[n - 1]
        return o.location
    
    loc = int(arg)
    return loc

def update_locations_after_update(old_loc, new_loc, argls):
    move = get_move(old_loc, new_loc)
    if move == '':
        return
    
    elif move == 'down':
        i = old_loc - 1
        ls = argls[old_loc:new_loc]
        for o in ls:
            i += 1
            o.location = i
            o.save()
            
    elif move == 'up':
        i = new_loc - 1
        ls = argls[new_loc - 1:old_loc - 1]
        for o in ls:
            i += 1
            o.location = i + 1
            o.save()
            
def update_locations_after_delete(loc, argls):
    i = loc
    ls = argls[i:]
    for o in ls:
        o.location = i
        o.save()
        i += 1
        
def get_move(old_loc, new_loc):
    if old_loc == new_loc:
        return ''
    
    elif old_loc < new_loc:
        return 'down'
    
    else:
        return 'up'