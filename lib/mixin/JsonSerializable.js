"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JsonSerializable {
    constructor() {
        this.beautify = false;
    }
    deserialize(data) {
        if (!data)
            return;
        const instanceData = JSON.parse(data.toString('utf8'));
        const keys = Object.keys(this);
        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    }
    serialize() {
        const json = this.beautify ? JSON.stringify(this, null, 4) : JSON.stringify(this);
        return Buffer.from(json);
    }
}
exports.JsonSerializable = JsonSerializable;
//# sourceMappingURL=JsonSerializable.js.map