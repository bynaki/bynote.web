import {EventEmitter} from 'events'


export class Data extends EventEmitter {
  private _debouncing = false

  constructor() {
    super()
  }

  get debouncing() {
    return this._debouncing
  }

  set debouncing(val: boolean) {
    if(this._debouncing !== val) {
      this._debouncing = val
      this.emit('debouncing', this._debouncing)
    }
  }
}

export const GlobalData = new Data()
