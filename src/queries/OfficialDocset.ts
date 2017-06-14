import axios, {AxiosError} from 'axios'
import {
  QueryBase,
  DeclareQuery,
} from './querybase'
import {
  OfficialDocComponent,
} from '../components/officialdoc'
import {
  apiHost,
} from '../config'
import {
  MyAxiosError,
  includeToken,
} from '../utils'



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

  async download() {
    const res = await axios.post(apiHost('graphql'), {
      query: `
      mutation {
        docset {
          download(feed_url: "${this._feedUrl}")
        }
      }
      `,
    }, includeToken())
    if(!res.data.data.docset.download) {
      throw new MyAxiosError(res)
    }
    return res.data.data.docset.download
  }

  delete() {
  }

  async $query(pattern: string = '') {
    return this
  }

  async $next(name: string) {
  }
}
