export function notImplemented(method: string): never {
    throw new Error('Not implemented: ' + method)
}

export class RecordingObject {
    readonly ops
    readonly varName

    constructor(ops: string[], varName: string) {
        this.ops = ops
        this.varName = varName
    }
}

export function stringArg(arg: string) {
    return `'${arg.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}'`
}
