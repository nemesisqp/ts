@echo off
call ncc build index.ts --minify --external @types/request -o %~dp0..\..\lib\request
