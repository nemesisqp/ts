/// <reference types="node" />
declare type Constructor<T> = new (...args: any[]) => T;
export declare function JsonSerializable<T extends Constructor<{}>>(Base: T): {
    new (...args: any[]): {
        [key: string]: any;
        beautify: false;
        deserialize(data: Buffer): void;
        serialize(): Buffer;
    };
} & T;
export {};
