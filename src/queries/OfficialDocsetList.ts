import * as fuzzy from 'fuzzy'
import axios, {AxiosError} from 'axios'
import {basename} from 'path'
import {
  QueryBase,
  QueryDescription,
  DeclareQuery,
} from './querybase'
import {
  OfficialDocListComponent,
} from '../components/officialdoclist'
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
import OfficialDocset from './OfficialDocset'


@DeclareLogger()
@DeclareQuery({
  component: OfficialDocListComponent,
})
export default class OfficialDocsetList extends QueryBase {
  log: Logger
  private _officialList: OfficialDocset[]

  constructor() {
    super({
      name: 'Official Docset List',
      description: 'Official docset list',
    })
  }

  async $query(pattern: string = ''): Promise<OfficialDocset[]> {
    if(!this._officialList) {
      try {
        const res = await axios.post(apiHost('graphql'), {
          query: `
          {
            docset {
              officialFeedUrlList
              localList: list(scope: ${DocsetScope.OfficialDocset}) {
                name
                feed {
                  feed_url
                }
              }
            }
          }
          `,
        })
        const officialFeedUrlList: string[] = res.data.data.docset.officialFeedUrlList
        if(!officialFeedUrlList) {
          this._officialList = []
        } else {
          const localList: {
            name: string
            feed: {
              feed_url: string
            }
          }[] = res.data.data.docset.localList
          this._officialList = officialFeedUrlList.map(feedUrl => {
            const args = {
              name: decodeURIComponent(basename(feedUrl, '.xml')),
              feedUrl,
              localName: '',
            }
            const matched = localList.find(local => local.feed.feed_url === feedUrl)
            if(matched) {
              args.localName = matched.name
            } 
            return new OfficialDocset(args)
          })
        }
      } catch(err) {
        const error = err as AxiosError
        this.log.error(error)
        if(error.response.data.errors) {
          this.log.error(error.response.data.errors[0].message)
        }
      }
    }
    this.log.info(this._officialList)
    return this._officialList
  }

  async $next(name: string): Promise<OfficialDocset> {
    const docset = this._officialList.find(doc => doc.$name === name)
    if(docset) {
      return docset
    } else {
      return (await this.$query(name))[0]
    }
  }
}