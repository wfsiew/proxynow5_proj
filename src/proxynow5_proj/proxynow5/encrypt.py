#from django.contrib.auth import *
#from django.contrib.auth import authenticate
#from django.contrib.auth.models import User
#from django.conf import settings
import md5
import sha
from django.utils.encoding import smart_str
from django.utils.hashcompat import md5_constructor, sha_constructor

import blowfish
from base64 import *

# This key to use for encrypt and decrypt infor

key = 'internetnow.com.my'
cipher = blowfish.Blowfish(key)

SALT = '323fs@3#*&'

'''
def get_encrypt_info_MD5(username,password):
    objencode = md5.new()
    objencode.update(username)
    objencode.update(password)
    objencode.update(key)
    enco = objencode.hexdigest()
    return enco

# this case using SHA to encode
# it is the same with MD5 but difference is 164 bit  
def get_encrypt_info_SHA(username,password):
    objencode = sha.new()
    objencode.update(username)
    objencode.update(password)
    objencode.update(key)
    enco = objencode.hexdigest()
    return enco
'''

def get_hexdigest(algorithm, salt, raw_password):
    """
    Returns a string of the hexdigest of the given plaintext password and salt
    using the given algorithm ('md5', 'sha1' or 'crypt').
    """
    raw_password, salt = smart_str(raw_password), smart_str(salt)
    if algorithm == 'crypt':
        try:
            import crypt
            
        except ImportError:
            raise ValueError('"crypt" password algorithm not supported in this environment')
        
        return crypt.crypt(raw_password, salt)

    if algorithm == 'md5':
        return md5_constructor(salt + raw_password).hexdigest()
    
    elif algorithm == 'sha1':
        return sha_constructor(salt + raw_password).hexdigest()
    
    raise ValueError("Got unknown password algorithm type in password.")

def check_password(raw_password, enc_password, algo, salt):
    """
    Returns a boolean of whether the raw_password was correct. Handles
    encryption formats behind the scenes.
    """
    return enc_password == get_hexdigest(algo, salt, raw_password)

def set_password(raw_password):
    import random
    algo = 'sha1'
    salt = get_hexdigest(algo, str(random.random()), str(random.random()))[:5]
    hsh = get_hexdigest(algo, salt, raw_password)
    #self.password = '%s$%s$%s' % (algo, salt, hsh)
    return '%s$%s$%s' % (algo, salt, hsh)

def encrypt_info(raw_info):
    cipher.initCTR()
    crypted = cipher.encryptCTR(raw_info)
    
    #encode it before saving it to database
    base_encrypt = b64encode(crypted)
    return base_encrypt

def decrypt_info(raw_info):
    cipher.initCTR()
    
    #decode it before encrypt it
    base_encrypt = b64decode(raw_info)
    decrypted = cipher.decryptCTR(base_encrypt)
    return decrypted

def check_password_(raw_password, encrypted_password):
    encrypted_data = encrypt_info(raw_password);
    
    return encrypted_data == encrypted_password