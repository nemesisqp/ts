/// <reference types="node" />
declare type Constructor<T> = new (...args: any[]) => T;
export declare function LocalFileState<T extends Constructor<{}>>(Base: T): {
    new (...args: any[]): {
        statePath: "";
        load(): Promise<Buffer>;
        save(data: Buffer): Promise<void>;
    };
} & T;
export {};
