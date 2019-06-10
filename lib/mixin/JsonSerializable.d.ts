/// <reference types="node" />
import { ISerializable } from "./ISerializable";
export declare class JsonSerializable implements ISerializable {
    beautify: boolean;
    [key: string]: any;
    deserialize(data: Buffer): void;
    serialize(): Buffer;
}
