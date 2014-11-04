import os

jsskiplist = ['ejs.min.js', 'combined.js', 'all.min.js']
jsblockedlist = ['utils.js', 'base.js']
combined_blocked_js = 'combined.blocked.js'

def merge_custom_js(lsjs, combinedfile):
    jspath = os.path.join('media', 'js')
    n = 0
    mfile = os.path.join(jspath, combinedfile)
    m = open(mfile, 'w')
    try:
        for f in lsjs:
            if f=='.svn':continue
            o = os.path.join(jspath, f)
            n += 1
            k = open(o, 'r')
            try:
                for line in k:
                    m.write(line)
                    
                m.write(os.linesep)
                
            finally:
                k.close()
                
    finally:
        m.close()
        
    print 'combined %s file(s)' % n 

def merge_js():
    jspath = os.path.join('media', 'js')
    ls = os.listdir(jspath)
    
    n = 0
    mfile = os.path.join(jspath, 'combined.js')
    m = open(mfile, 'w')
    try:
        for f in ls:
            if f=='.svn':continue
            o = os.path.join(jspath, f)
            if f.startswith('jquery') or (f in jsskiplist):
                continue
            
            print '%s. %s' % (n + 1, f)
            n += 1
            k = open(o, 'r')
            try:
                for line in k:
                    m.write(line)
                    
                m.write(os.linesep)
                
            finally:
                k.close()
                
    finally:
        m.close()
        
    print 'combined %s file(s)' % n
    
def merge_css():
    csspath = os.path.join('media', 'css')
    ls = ['base.css']
    
    n = 0
    mfile = os.path.join(csspath, 'combined.css')
    m = open(mfile, 'w')
    try:
        for f in ls:
            if f=='.svn':continue
            o = os.path.join(csspath, f)
            print '%s. %s' % (n + 1, f)
            n += 1
            k = open(o, 'r')
            try:
                for line in k:
                    m.write(line)
                    
                m.write(os.linesep)
                
            finally:
                k.close()
                
    finally:
        m.close()
        
    print 'combined %s file(s)' % n
    
if __name__ == '__main__':
    merge_custom_js(jsblockedlist, combined_blocked_js)
    merge_js()
    merge_css()