import {
  DeclareLogger,
  Logger,
} from './log'


export class Workflow {
  private _works: {work: (...args: any[]) => void, args: any[]}[] = []
  private _turn: () => boolean

  constructor(turn: () => boolean) {
    this._turn = turn
  }

  push(work: (...args: any[]) => void): (...args: any[]) => void {
    return (...args: any[]): void => {
      if(this._turn()) {
        work(...args)
      } else {
        this._works.push({work, args})
      }
    }
  }

  trunOn() {
    while(this._works.length !== 0) {
      const work = this._works.shift()
      work.work(...work.args)
    }
  }
}