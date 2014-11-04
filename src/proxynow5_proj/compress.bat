@echo -- combining js files --
c:\python27\python.exe merge.py

@echo -- compressing js --
@java -jar yuicompressor-2.4.6.jar --type js -o media/js/all.min.js media/js/combined.js
@java -jar yuicompressor-2.4.6.jar --type js -o media/js/blocked.min.js media/js/combined.blocked.js
@echo -- compressing css --
@java -jar yuicompressor-2.4.6.jar --type css -o media/css/all.min.css media/css/combined.css
@java -jar yuicompressor-2.4.6.jar --type css -o media/css/blocked.min.css media/css/blocked.css
