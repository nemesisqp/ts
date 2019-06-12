"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Fs = require("fs");
class LocalFileState {
    constructor() {
        this.statePath = 'state.json';
    }
    async load() {
        try {
            return Fs.promises.readFile(this.statePath);
        }
        catch (err) {
            if (err.code === 'ENOENT')
                return null;
            throw err;
        }
    }
    async save(data) {
        await Fs.promises.writeFile(this.statePath, data);
    }
}
exports.LocalFileState = LocalFileState;
//# sourceMappingURL=LocalFileState.js.map