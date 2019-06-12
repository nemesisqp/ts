/// <reference types="node" />
import { IState } from "./IState";
export declare class LocalFileState implements IState {
    statePath: string;
    load(): Promise<Buffer | null>;
    save(data: Buffer): Promise<void>;
}
