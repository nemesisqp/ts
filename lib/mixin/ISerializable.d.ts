/// <reference types="node" />
export interface ISerializable {
    serialize(): Buffer;
    deserialize(data: Buffer): void;
}
