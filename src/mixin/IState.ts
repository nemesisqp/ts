export interface IState {
    save(data: Buffer): Promise<void>

    load(): Promise<Buffer | null>
}
