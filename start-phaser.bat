@echo off
cd /d "%~dp0"
echo 岭行 Phaser: http://127.0.0.1:8766/game/
echo 放置沙盒:    http://127.0.0.1:8766/web/
python -m http.server 8766
pause
