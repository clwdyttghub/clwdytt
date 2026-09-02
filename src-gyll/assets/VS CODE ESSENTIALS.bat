@echo off
title [2/2] VS Code Extensions and Settings Installer
echo ===================================================
echo   INSTALLING ESSENTIAL VS CODE EXTENSIONS...
echo ===================================================
echo.

:: Install essential extensions one by one
cmd /c code --install-extension esbenp.prettier-vscode
cmd /c code --install-extension PKief.material-icon-theme
cmd /c code --install-extension christian-kohler.npm-intellisense
cmd /c code --install-extension ritwickdey.LiveServer
cmd /c code --install-extension oderwat.indent-rainbow
cmd /c code --install-extension dbaeumer.vscode-eslint
cmd /c code --install-extension bradlc.vscode-tailwindcss
cmd /c code --install-extension formulahendry.auto-rename-tag
cmd /c code --install-extension eamodio.gitlens
cmd /c code --install-extension Google.geminicodeassist
cmd /c code --install-extension RobbOwen.synthwave-vscode

echo.
echo ===================================================
echo   APPLYING YOUR CUSTOM CONFIGURATION...
echo ===================================================
if not exist "%APPDATA%\Code\User" mkdir "%APPDATA%\Code\User"

:: The theme name is case-sensitive, requiring a capital W for SynthWave
(
echo {
echo   "workbench.colorTheme": "SynthWave '84",
echo   "workbench.iconTheme": "material-icon-theme",
echo   "editor.defaultFormatter": "esbenp.prettier-vscode",
echo   "editor.formatOnSave": true
echo }
) > "%APPDATA%\Code\User\settings.json"

echo.
echo ===================================================
echo  DONE! All Essential Extensions and Settings have been applied.
echo  - Theme: SynthWave '84
echo  - Formatter: Set to Prettier and will format on save.
echo ===================================================
pause