'''
    Avoid the case unpack , 
    when we delete the session and then it will return this case
    {} not [,[]]
'''
def init_get_data(keyword,request):
    try:
        dict_schedule = {}
        dict_keymap = {}
        
        if keyword in request.session:
            [dict_schedule,dict_keymap] = request.session[keyword]
        
        return [dict_schedule,dict_keymap]
    except:
        return [dict_schedule,dict_keymap]