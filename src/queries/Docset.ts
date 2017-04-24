import Vue from 'vue'
import * as _ from 'lodash'
import axios, {AxiosError} from 'axios'
import {
  QueryBase,
  DeclareMethod,
  DeclareClass,
} from './QueryBase'
import {
  DeclareLogger,
  Logger,
} from '../util/log'
import {
  DocsetInfo,
  ExtendedFindResult,
} from '../interface'
import {
  ListComponent
} from '../components/list'


@DeclareLogger()
@DeclareClass()
export default class Docset extends QueryBase {
  log: Logger
  private _info: DocsetInfo
  
  constructor(info: DocsetInfo) {
    super(info.name)
    this._info = _.clone<DocsetInfo>(info)
  }

  @DeclareMethod({
    name: 'Find',
    description: 'Find Document',
    component: ListComponent,
  })
  async find(pattern: string): Promise<ExtendedFindResult[]> {
    if(!pattern) {
      return []
    }
    try {
      const res = await axios.post('http://localhost:3000/graphql', {
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
      const results = res.data.data.docset.results
      return results
    } catch(err) {
      const error = err as AxiosError
      this.log.error(error)
      if(error.response.data.errors) {
        this.log.error(error.response.data.errors[0].message)
      }
    }
  }

  get info(): DocsetInfo {
    return _.clone(this._info)
  }
}
