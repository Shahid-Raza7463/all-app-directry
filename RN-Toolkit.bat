@echo off
title React Native Toolkit
set PROJECT_PATH=C:\ReactNativeApp\FriendsList
set ADB_PATH=C:\Users\KGS-429\AppData\Local\Android\Sdk\platform-tools

:menu
cls
echo ==============================
echo      React Native Toolkit
echo ==============================
echo.
echo 1. Connect Phone
echo 2. Start Metro
echo 3. Install Debug APK
echo 4. Build Release APK
echo 5. Clean Project
echo 6. React Native Doctor
echo 7. Git Push
echo 8. Connect Phone + Start Metro
echo 9. Exit
echo.
set /p choice=Enter choice: 

if "%choice%"=="1" goto connect
if "%choice%"=="2" goto metro
if "%choice%"=="3" goto install
if "%choice%"=="4" goto release
if "%choice%"=="5" goto clean
if "%choice%"=="6" goto doctor
if "%choice%"=="7" goto gitpush
if "%choice%"=="8" goto startphone
if "%choice%"=="9" exit

goto menu

:connect
cd /d %ADB_PATH%
adb kill-server
adb start-server
adb devices
adb reverse tcp:8081 tcp:8081
pause
goto menu

:metro
cd /d %PROJECT_PATH%
npx react-native start
pause
goto menu

:install
cd /d %PROJECT_PATH%\android
gradlew.bat installDebug
pause
goto menu

:release
cd /d %PROJECT_PATH%\android
gradlew.bat assembleRelease
echo.
echo APK Location:
echo %PROJECT_PATH%\android\app\build\outputs\apk\release
pause
goto menu

:clean
cd /d %PROJECT_PATH%\android
gradlew.bat clean
pause
goto menu

:doctor
cd /d %PROJECT_PATH%
npx react-native doctor
pause
goto menu

:gitpush
cd /d %PROJECT_PATH%
git status
git add .
git commit -m "Latest Update"
git push
pause
goto menu

:startphone
cls
echo ==============================
echo Connecting Phone...
echo ==============================
cd /d %PROJECT_PATH%
adb reverse tcp:8081 tcp:8081
pause
goto menu