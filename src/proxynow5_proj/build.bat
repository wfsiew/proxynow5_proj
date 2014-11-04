c:\python27\python.exe -m compileall .
if %ERRORLEVEL% NEQ 0 goto failed1


call compress
if %ERRORLEVEL% NEQ 0 goto failed2

goto end

:failed1 
RMDIR berror
MKdir berror
goto end

:failed2 
RMDIR cerror
MKdir cerror

:end   
endlocal  
