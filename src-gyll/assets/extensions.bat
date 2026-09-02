@echo off
title [2/2] VS Code Extensions and Settings Installer
echo ===================================================
echo   NAG-I-INSTALL NG MGA VS CODE EXTENSIONS...
echo ===================================================
echo.

:: Isa-isang i-install ang mga hiningi mong extensions
cmd /c code --install-extension Merenut.ridiculous-coding
cmd /c code --install-extension esbenp.prettier-vscode
cmd /c code --install-extension PKief.material-icon-theme
cmd /c code --install-extension christian-kohler.npm-intellisense
cmd /c code --install-extension ritwickdey.LiveServer
cmd /c code --install-extension oderwat.indent-rainbow
cmd /c code --install-extension bradlc.vscode-tailwindcss
cmd /c code --install-extension dbaeumer.vscode-eslint
cmd /c code --install-extension RobbOwen.synthwave-vscode
cmd /c code --install-extension adpyke.codesnap
cmd /c code --install-extension hediet.vscode-drawio
cmd /c code --install-extension hoovercj.vscode-power-mode
cmd /c code --install-extension Google.geminicodeassist
cmd /c code --install-extension WallabyJs.console-ninja
cmd /c code --install-extension formulahendry.auto-rename-tag
cmd /c code --install-extension damms005.devdb

echo.
echo ===================================================
echo   INILALAPAT ANG IYONG CUSTOM CONFIGURATION...
echo ===================================================
if not exist "%APPDATA%\Code\User" mkdir "%APPDATA%\Code\User"

(
echo {
echo   "workbench.colorTheme": "Synthwave '84",
echo   "workbench.iconTheme": "material-icon-theme",
echo   "editor.defaultFormatter": "esbenp.prettier-vscode",
echo   "editor.formatOnSave": true,
echo   "ridiculous-coding.shake.enabled": false,
echo   "ridiculous-coding.audio.enabled": false,
echo   "powermode.enabled": true,
echo   "powermode.shake.enabled": false,
echo   "powermode.audio.enabled": false,
echo   "powermode.chunks.enabled": true
echo }
) > "%APPDATA%\Code\User\settings.json"

echo.
echo ===================================================
echo  TAPOS NA! Lahat ng Extensions at Settings ay nailapat na.
echo  - Theme: Synthwave '84
echo  - Toggles: Walang Sound at Shake ang Code Effects.
echo ===================================================
pause