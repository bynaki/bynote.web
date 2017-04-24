import VueRouter from 'vue-router'
import {
  dirname,
  basename,
} from 'path'
import {
  QueryBase,
  SelfMethod,
} from './queries/QueryBase'
import Root from './queries/Root'

// /method1/level2/method2/level3
export default class Processor {
  private static _onlyOne = new Processor()
  private _history = {}

  static get(): Processor {
    return Processor._onlyOne
  }

  constructor() {
    this._history['/'] = new Root()
  }

  async get(uri: string): Promise<SelfMethod> {
    const ps = uri.split('/').map(el => decodeURIComponent(el))
    let name = (ps.length % 2 === 0)? ps.pop() : 'MethodLumpList'
    if(ps.length === 1 && name === '') {
      name = 'MethodLumpList'
      ps.push('')
    }
    // 무조건 메서드가 아닌 객체이어야 한다.
    let idUri = ps.map(el => encodeURIComponent(el)).join('/')
    idUri = (idUri)? idUri : '/'
    if(!this._history[idUri]) {
      this._history[idUri] = (await (await this.get(dirname(idUri)))
        (decodeURIComponent(basename(idUri))))[0]
    }
    return this._history[idUri].selfMethod(name)
  }
}