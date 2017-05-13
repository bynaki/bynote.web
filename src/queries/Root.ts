import Vue from 'vue'
import * as _ from 'lodash'
import {alert} from 'notie'
import axios, {AxiosError} from 'axios'
import * as fuzzy from 'fuzzy'
import {
  QueryBase,
  DeclareMethod,
  DeclareClass,
} from './QueryBase'
import {
  DeclareLogger,
  Logger,
} from '../utils'
import {HelloComponent} from '../components/hello'
import {
  DocsetListComponent,
} from '../components/docsetlist'
import {
  DocsetScope,
  DocsetInfo,
} from '../interface'
import Docset from './Docset'


@DeclareLogger()
@DeclareClass()
export default class Root extends QueryBase {
  log: Logger

  constructor() {
    super('Root')
  }

  @DeclareMethod({
    name: 'Docsets',
    description: 'Docset list',
    component: DocsetListComponent,
  })
  async docsets(pattern: string): Promise<Docset[]> {
    try {
      const res = await axios.post('http://localhost:3000/graphql', {
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
      console.log('docsets: ', docsets.map(doc => doc.info))
      if(!pattern) {
        return docsets
      }
      return fuzzy.filter<Docset>(pattern, docsets, {
        extract: el => el.name
      }).map(el => el.original)
    } catch(err) {
      const error = err as AxiosError
      this.log.error(error)
      if(error.response.data.errors) {
        this.log.error(error.response.data.errors[0].message)
      }
    }
  }

  @DeclareMethod({
    name: 'Hello',
    description: 'Hello World!!',
    component: HelloComponent,
  })
  async hello(): Promise<(msg: string) => void> {
    return (msg: string) => {
      alert({
        type: 'info',
        text: msg,
        position: 'bottom',
      })
    }
  }
}
