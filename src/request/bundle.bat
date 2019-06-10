@echo off
set "TYPESCRIPT_LOOKUP_PATH=%APPDATA%\npm\node_modules\"
ncc build index.ts --minify --external @types/request -o %~dp0..\..\lib\request
