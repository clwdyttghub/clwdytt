@echo off
title [1/2] Core Software Installer
echo ===================================================
echo   NAG-I-INSTALL NG MGA CORE SOFTWARE AT RUNTIMES...
echo ===================================================
echo.

echo [1/5] Nag-i-install ng VS Code (Visual Studio Code)...
winget install Microsoft.VisualStudioCode --silent --accept-source-agreements --accept-package-agreements

echo [2/5] Nag-i-install ng Node.js (JavaScript Runtime)...
winget install OpenJS.NodeJS --silent --accept-source-agreements --accept-package-agreements

echo [3/5] Nag-i-install ng Python 3...
winget install Python.Python.3 --silent --accept-source-agreements --accept-package-agreements

echo [4/5] Nag-i-install ng Oracle JDK 21 (Java SDK)...
winget install Oracle.JDK.21 --silent --accept-source-agreements --accept-package-agreements

echo [5/5] Nag-i-install ng Git (Version Control)...
winget install Git.Git --silent --accept-source-agreements --accept-package-agreements

echo.
echo ===================================================
echo  TAPOS NA ANG PAG-INSTALL NG SOFTWARE!
echo  
echo  PAALALA: Dahil bago ang VS Code, kailangan mo munang 
echo  I-RESTART ang iyong PC bago patakbuhin ang Extensions Script
echo  para mabasa ng system ang 'code' command.
echo ===================================================
pause