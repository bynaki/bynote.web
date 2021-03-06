import * as fuzzy from 'fuzzy'
import axios, {AxiosError} from 'axios'
import {
  QueryBase,
  QueryDescription,
  DeclareQuery,
} from './querybase'
import {
  DocsetListComponent,
} from '../components/docsetlist'
import {
  apiHost,
} from '../config'
import {
  DocsetScope,
  DocsetInfo,
} from '../interface'
import {
  DeclareLogger,
  Logger,
} from '../utils'
import Docset from './Docset'


@DeclareLogger()
@DeclareQuery({
  component: DocsetListComponent,
})
export default class DocsetList extends QueryBase {
  log: Logger
  private _lastests: Docset[] = []

  constructor() {
    super({
      name: 'Docset List',
      description: 'Docset list',
    })
  }

  async $query(pattern: string = ''): Promise<Docset[]> {
    const res = await axios.post(apiHost('graphql'), {
      query: `
      {
        docset {
          results: list(
            scope: ${DocsetScope.OfficialDocset}
          ) {
            name
            keyword
            scope
          }
        }
      }
      `,
    })
    const results: DocsetInfo[] = res.data.data.docset.results
    const docsets = results.map(info => new Docset(info))
    if(!pattern) {
      return docsets
    }
    this._lastests = fuzzy.filter<Docset>(pattern, docsets, {
      extract: el => el.$name
    }).map(el => el.original)
    return this._lastests
  }

  async $next(name: string): Promise<Docset> {
    const docset = this._lastests.find(doc => doc.$name === name)
    if(docset) {
      return docset
    } else {
      return (await this.$query(name))[0]
    }
  }
}
