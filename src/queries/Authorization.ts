import {alert} from 'notie'
import {
  QueryBase,
} from './querybase'


export default class Authorization extends QueryBase {
  constructor(private _url: string) {
    super({
      name: 'Authorization',
      description: '인 증',
    })
  }

  async $query(pattern: string = '') {
  }

  async $next(name: string) {
  }

  get url() {
    return this._url
  }
}
