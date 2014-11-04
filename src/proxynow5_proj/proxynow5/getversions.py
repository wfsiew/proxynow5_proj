import os
import urllib
import urllib2
import re



httpURL='http://www.internetnow.com.my/download/ProxyNow5/Updates'
AllVersionsInfoDict={}
allDirs=[]

def getCurrentIndex(cVersion):
    versionsList=sorted(AllVersionsInfoDict.keys())
    cmd='echo -e \"%s\" | sort -t \".\" -g | grep -n -x \"%s\"| cut -f 1 -d \":\"' % ('\n'.join(versionsList),cVersion)
    cIndex= os.popen(cmd)
    output=cIndex.readline()
    cIndex.close()
    if output=='':
        output=0
    
    return output


def Get_ReleaseDate(ky):
    releasdate=''
    try:
        detailsUrl=AllVersionsInfoDict[ky]
        refurl=urllib.urlopen(detailsUrl)
        allcontent=refurl.readlines()
        for line in allcontent:
            isinstance(line,str)
            if 'release date' in line.lower():
                releasdate=line.split(':')[1]
                break
    except Exception:
        return releasdate
    
    return releasdate.strip()


def getAvailableVersions(cVersion,showBeta=True):
    connect(showBeta)
    
    availableVersions=[]
    cIndex=getCurrentIndex(cVersion)
   
    if cIndex=='':
        return availableVersions
    
    isinstance(AllVersionsInfoDict,str)
    versionsList=sorted(AllVersionsInfoDict.keys())
    totalversions=len(versionsList)
    correction=0
    isBeta=False
    if not 'beta' in cVersion:
        for v in versionsList:
            if '%s-beta' % cVersion in v:
                correction=correction + 1
                break
    else:
        isBeta=True
               

    tailNO=totalversions-int(cIndex)-correction
    cmd="echo -e \"%s\" | sort -t \".\" -g |tail -n %s" % ('\n'.join(versionsList),tailNO) 
    tmpOutput=os.popen(cmd)
    output=tmpOutput.readlines()
    
    if isBeta:
        removedBetaVersion=cVersion.replace('-beta','')
        if AllVersionsInfoDict.has_key(removedBetaVersion):
            output.append(removedBetaVersion)
    output=sorted(output)
    
    for ky in output:
        ky=ky.replace('\n','')
        if not showBeta:
            if 'beta' in ky:
                continue
        rdate=Get_ReleaseDate(ky)
        availableVersions.append("%s|%s|%s" % (ky,rdate,AllVersionsInfoDict[ky]))
    
    return availableVersions

def urlExists(url):
    req = urllib2.Request(url)
    try: 
        reponse = urllib2.urlopen(req)
        return True
    except:
        return False
    
    

def generateDict(dirlist):
    global AllVersionsInfoDict
    for d in dirlist:
        #We assumed that all folders in remote server are in the form of 
        #version numbers and without any space example : 5.0.1-beta
        tmpLink="%s/%s/details.txt" % (httpURL,d)
        AllVersionsInfoDict[d]=tmpLink
    
def connect(showBeta):
    global allDirs
    f = urllib.urlopen(httpURL)
    s = f.read()
    f.close()
    #r'\>\w+</A>'
    #r'\>[\w.-]+\/</a>'
    matches = re.finditer(r'\>[\w.-]+</A>', s)
    
    for match in matches:
        if match != None:
            tmp=match.group(0)
            if tmp !=None:
                tmp = tmp.replace("</A>","").replace("/\">","").replace(">","")
                tmpLink="%s/%s/details.txt" % (httpURL,tmp)
                if urlExists(tmpLink):
                    allDirs.append(tmp)
                
                
                    
    generateDict(allDirs)

               




