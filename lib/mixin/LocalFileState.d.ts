/// <reference types="node" />
import { IState } from "./IState";
export declare class LocalFileState implements IState {
    statePath: string;
    load(): Promise<Buffer>;
    save(data: Buffer): Promise<void>;
}
