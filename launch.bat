@echo off
echo.
echo  ===================================
echo   DeenHub PWA - Starting Server...
echo  ===================================
echo.
echo  Opening DeenHub in your browser...
echo  Press Ctrl+C to stop the server.
echo.
start http://localhost:8000
python -m http.server 8000
