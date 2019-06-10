import {ISerializable} from "./ISerializable";

export class JsonSerializable implements ISerializable {
    beautify = false;
    [key: string]: any;

    deserialize(data: Buffer) {
        const instanceData = JSON.parse(data.toString('utf8'));
        const keys = Object.keys(this);
        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    }

    serialize(): Buffer {
        const json = this.beautify ? JSON.stringify(this, null, 4) : JSON.stringify(this);
        return Buffer.from(json);
    }
}
