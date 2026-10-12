@echo off
cd /d "%~dp0web"
echo 岭行修仙: http://127.0.0.1:8765/
echo 浏览器打开上述地址。关闭本窗口即停止服务。
python -m http.server 8765
pause
