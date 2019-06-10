"use strict";
exports.__esModule = true;
// source from npm node-machine-id
/* @flow */
var child_process_1 = require("child_process");
var crypto_1 = require("crypto");
var platform = process.platform;
var win32RegBinPath = {
    native: '%windir%\\System32',
    mixed: '%windir%\\sysnative\\cmd.exe /c %windir%\\System32'
};
var guid = {
    darwin: 'ioreg -rd1 -c IOPlatformExpertDevice',
    win32: win32RegBinPath[isWindowsProcessMixedOrNativeArchitecture()] + "\\REG " +
        'QUERY HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography ' +
        '/v MachineGuid',
    linux: '( cat /var/lib/dbus/machine-id /etc/machine-id 2> /dev/null || hostname ) | head -n 1 || :',
    freebsd: 'kenv -q smbios.system.uuid'
};
function isWindowsProcessMixedOrNativeArchitecture() {
    // detect if the node binary is the same arch as the Windows OS.
    // or if this is 32 bit node on 64 bit windows.
    if (process.platform !== 'win32') {
        return '';
    }
    if (process.arch === 'ia32' && process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432')) {
        return 'mixed';
    }
    return 'native';
}
function hash(guid) {
    return crypto_1.createHash('sha256').update(guid).digest('hex');
}
function expose(result) {
    switch (platform) {
        case 'darwin':
            return result
                .split('IOPlatformUUID')[1]
                .split('\n')[0].replace(/\=|\s+|\"/ig, '')
                .toLowerCase();
        case 'win32':
            return result
                .toString()
                .split('REG_SZ')[1]
                .replace(/\r+|\n+|\s+/ig, '')
                .toLowerCase();
        case 'linux':
            return result
                .toString()
                .replace(/\r+|\n+|\s+/ig, '')
                .toLowerCase();
        case 'freebsd':
            return result
                .toString()
                .replace(/\r+|\n+|\s+/ig, '')
                .toLowerCase();
        default:
            throw new Error("Unsupported platform: " + process.platform);
    }
}
var cachedMachineId = '';
var cachedHashedMachineId = '';
function machineIdSync(original) {
    if (cachedMachineId)
        return original ? cachedMachineId : cachedHashedMachineId;
    cachedMachineId = expose(child_process_1.execSync(guid[platform]).toString());
    cachedHashedMachineId = hash(cachedMachineId);
    return original ? cachedMachineId : cachedHashedMachineId;
}
exports.machineIdSync = machineIdSync;
function machineId(original) {
    return new Promise(function (resolve, reject) {
        if (cachedMachineId)
            resolve(original ? cachedMachineId : cachedHashedMachineId);
        return child_process_1.exec(guid[platform], {}, function (err, stdout, stderr) {
            if (err) {
                return reject(new Error("Error while obtaining machine id: " + err.stack));
            }
            cachedMachineId = expose(stdout.toString());
            cachedHashedMachineId = hash(cachedMachineId);
            resolve(original ? cachedMachineId : cachedHashedMachineId);
        });
    });
}
exports.machineId = machineId;
