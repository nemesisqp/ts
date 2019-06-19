@echo off
set "TYPESCRIPT_LOOKUP_PATH=%APPDATA%\npm\node_modules\"
ncc build index.ts --minify --external @types/args -o %~dp0..\..\lib\args
