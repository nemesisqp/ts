import * as Fs from "fs";
import {IState} from "./IState";

type Constructor<T> = new(...args: any[]) => T;

export function LocalFileState<T extends Constructor<{}>>(Base: T) {
    return class extends Base implements IState {
        constructor(...args: any[]) {
            super(...args);
        }

        statePath: '';

        async load(): Promise<Buffer> {
            return Fs.promises.readFile(this.statePath);
        }

        async save(data: Buffer): Promise<void> {
            await Fs.promises.writeFile(this.statePath, data);
        }
    };
}
