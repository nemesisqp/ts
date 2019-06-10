import * as Fs from "fs";
import {IState} from "./IState";

export class LocalFileState implements IState {
    statePath = 'state.json';

    async load(): Promise<Buffer> {
        return Fs.promises.readFile(this.statePath);
    }

    async save(data: Buffer): Promise<void> {
        await Fs.promises.writeFile(this.statePath, data);
    }
}
