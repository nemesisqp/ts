// source from npm node-machine-id
/* @flow */
import {exec, execSync} from 'child_process';
import {createHash} from 'crypto';

const platform = process.platform;

const win32RegBinPath: { [key: string]: string } = {
    native: '%windir%\\System32',
    mixed:  '%windir%\\sysnative\\cmd.exe /c %windir%\\System32'
};

const guid: { [key: string]: string } = {
    darwin:  'ioreg -rd1 -c IOPlatformExpertDevice',
    win32:   `${win32RegBinPath[isWindowsProcessMixedOrNativeArchitecture()]}\\REG ` +
                 'QUERY HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography ' +
                 '/v MachineGuid',
    linux:   '( cat /var/lib/dbus/machine-id /etc/machine-id 2> /dev/null || hostname ) | head -n 1 || :',
    freebsd: 'kenv -q smbios.system.uuid'
};

function isWindowsProcessMixedOrNativeArchitecture(): string {
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

function hash(guid: string): string {
    return createHash('sha256').update(guid).digest('hex');
}

function expose(result: string): string {
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
            throw new Error(`Unsupported platform: ${process.platform}`);
    }
}

let cachedMachineId: string = '';
let cachedHashedMachineId: string = '';

export function machineIdSync(original: boolean): string {
    if (cachedMachineId) return original ? cachedMachineId : cachedHashedMachineId;
    cachedMachineId = expose(execSync(guid[platform]).toString());
    cachedHashedMachineId = hash(cachedMachineId);
    return original ? cachedMachineId : cachedHashedMachineId;
}

export function machineId(original: boolean): Promise<string> {
    return new Promise((resolve: Function, reject: Function): Object => {
        if (cachedMachineId) resolve(original ? cachedMachineId : cachedHashedMachineId);
        return exec(guid[platform], {}, (err: any, stdout: any, stderr: any) => {
            if (err) {
                return reject(
                    new Error(`Error while obtaining machine id: ${err.stack}`)
                );
            }
            cachedMachineId = expose(stdout.toString());
            cachedHashedMachineId = hash(cachedMachineId);
            resolve(original ? cachedMachineId : cachedHashedMachineId);
        });
    });
}
