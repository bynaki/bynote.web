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
  private _keyword: string

  constructor({
    name,
    feedUrl,
    keyword,
  }: {
    name: string
    feedUrl: string
    keyword?: string
  }) {
    super({name})
    this._feedUrl = feedUrl
    this._keyword = keyword
  }

  get feedUrl() {
    return this._feedUrl
  }

  get keyword() {
    return this._keyword
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
    return res.data.data.docset.download
  }

  async delete() {
    const res = await axios.post(apiHost('graphql'), {
      query: `
      mutation {
        docset {
          delete(keyword: "${this.keyword}")
        }
      }
      `,
    }, includeToken())
    return res.data.data.docset.delete
  }

  async $query(pattern: string = '') {
    return this
  }

  async $next(name: string) {
  }
}
