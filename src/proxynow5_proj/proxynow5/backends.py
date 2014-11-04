from django.contrib.auth.models import User, check_password
from Definition_User.models import DefUser, DefUserName
import utils

class AuthBackend:
    def authenticate(self, username=None, password=None):
        u, authenticated = self.get_from_defuser(username, password)
        if u is None:
            try:
                # check whether is super user
                superadmin = User.objects.get(username=username, is_superuser=1)
                pwd_valid = check_password(password, superadmin.password)
                if pwd_valid:
                    AuthBackend.insert_superuser(username=username, password=password)
                    return superadmin
                
            except User.DoesNotExist:
                return None
            
        else:
            if authenticated:
                o = AuthBackend.insert_user(username)
                return o
            
        return None
    
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        
        except User.DoesNotExist:
            return None
        
        return None
                
    def get_from_defuser(self, username, password):
        try:
            o = DefUser.objects.get(name=username)
            m = o.defusername_set.get(id=o)
            if m is None:
                return None, False
            
            if utils.verify_password(password, m.password):
                return o, True
            
            else:
                return o, False
            
        except DefUser.DoesNotExist:
            return None, False
        
        return None, False
    
    @staticmethod
    def insert_superuser(username, password):
        name = username
        type = 1
        accesstype = 2
        comment = ''
        encrypted_password = utils.encrypt_password(password)
        print 'enc : %s' % encrypted_password
        try:
            defuser = DefUser.objects.get(name__iexact=name)
            return
        
        except DefUser.DoesNotExist:
            pass
        
        try:
            defuser = DefUser.objects.create(name=name, type=type, accesstype=accesstype, comment=comment)
            o = DefUserName.objects.create(id=defuser, displayname=name, password=encrypted_password)
            
        except:
            pass
    
    @staticmethod
    def insert_user(username):
        try:
            u = User.objects.get(username=username)
            return u
            
        except User.DoesNotExist:
            u = User(username=username, password='na')
            u.is_staff = True
            u.is_superuser = False
            u.save()
            return u
        
        return None
    
    @staticmethod
    def update_user(old_username, new_username):
        try:
            u = User.objects.get(username=old_username)
            u.username = new_username
            u.save()
            
        except User.DoesNotExist:
            pass
        
        except Exception:
            pass
        
    @staticmethod
    def delete_user(username):
        try:
            u = User.objects.get(username=username)
            u.delete()
            
        except User.DoesNotExist:
            pass
        
        except Exception:
            pass