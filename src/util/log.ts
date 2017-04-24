export interface ILogger {
  info(msgs: any[])
  warn(msgs: any[])
  error(msgs: any[])
}

export class Logger implements ILogger {

  constructor(public scope: string = '') {
  }

  info(...msgs: any[]) {
    console.info(this.scope + ' > ', ...msgs)
  }

  warn(...msgs: any[]) {
    console.warn(this.scope + ' > ', ...msgs)
  }

  error(...msgs: any[]) {
    console.error(this.scope + ' > ', ...msgs)
  }
}
export default Logger


export function DeclareLogger() {
  return (target: any) => {
    Object.defineProperty(target.prototype, 'log', {get: function() {
      if(!this._log) {
        this._log = new Logger(target.name)
      }
      return this._log
    }})
  }
}