import {
  QueryBase,
  DeclareQuery,
} from './querybase'
import {
  OfficialDocComponent,
} from '../components/officialdoc'


@DeclareQuery({
  component: OfficialDocComponent,
})
export default class OfficialDocset extends QueryBase {
  private _feedUrl: string
  private _localName: string

  constructor({
    name,
    feedUrl,
    localName,
  }: {
    name: string
    feedUrl: string
    localName?: string
  }) {
    super({name})
    this._feedUrl = feedUrl
    this._localName = localName
  }

  get feedUrl() {
    return this._feedUrl
  }

  get localName() {
    return this._localName
  }

  download() {
  }

  delete() {
  }

  async $query(pattern: string = '') {
    return this
  }

  async $next(name: string) {
  }
}
