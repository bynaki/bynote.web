import Vue from 'vue'
import * as _ from 'lodash'
import axios, {AxiosError} from 'axios'
import {
  QueryBase,
  DeclareQuery,
} from './querybase'
import {
  DeclareLogger,
  Logger,
} from '../utils'
import {
  DocsetInfo,
  ExtendedFindResult,
} from '../interface'
import {
  DocFindComponent
} from '../components/docfind'
import {
  apiHost,
} from '../config'


@DeclareLogger()
@DeclareQuery({
  component: DocFindComponent,
})
export default class Docset extends QueryBase {
  log: Logger
  private _info: DocsetInfo
  
  constructor(info: DocsetInfo) {
    super({name: info.name})
    this._info = _.clone<DocsetInfo>(info)
  }

  async $query(pattern: string = ''): Promise<ExtendedFindResult[]> {
    if(!pattern) {
      return []
    }
    const res = await axios.post(apiHost('graphql'), {
      query: `
      {
        docset {
          results: find(
            name: "${pattern}"
            option: {
              fuzzy: true
              limit: 30
              keyword: "${this._info.keyword}"
              scope: "${this._info.scope}"
            }
          ) {
            id
            name
            type
            path
            keyword
            scope
          }
        }
      }
      `,
    })
    return res.data.data.docset.results
  }

  async $next(name: string): Promise<void> {
  }

  get info(): DocsetInfo {
    return _.clone(this._info)
  }
}