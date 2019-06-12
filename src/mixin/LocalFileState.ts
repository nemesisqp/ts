import * as Fs from "fs";
import {IState} from "./IState";

export class LocalFileState implements IState {
    statePath = 'state.json';

    async load(): Promise<Buffer | null> {
        try {
            return Fs.promises.readFile(this.statePath);
        } catch (err) {
            if (err.code === 'ENOENT') return null;
            throw err;
        }
    }

    async save(data: Buffer): Promise<void> {
        await Fs.promises.writeFile(this.statePath, data);
    }
}
