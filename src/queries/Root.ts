import {
  basename,
  dirname,
} from 'path'
import * as fuzzy from 'fuzzy'
import {
  QueryBase,
  DeclareQuery,
} from './querybase'
import {
  MethodComponent,
} from '../components/method'
import DocsetRoot from './DocsetRoot'
import Hello from './Hello'
import Authorization from './Authorization'


@DeclareQuery({
  component: MethodComponent,
  methods: [
    new DocsetRoot(),
    new Hello(),
    new Authorization('/author/%2F'),
  ],
})
export default class Root extends QueryBase {
  constructor() {
    super({
      name: 'Root',
      description: 'Root',
    })
  }

  private static _history = {
    '/': new Root()
  }

  static async history(uri: string): Promise<QueryBase> {
    if(!this._history[uri]) {
      this._history[uri] = (await (await this.history(dirname(uri)))
        .$next(decodeURIComponent(basename(uri))))
      this._history[uri]._path = uri
    }
    return this._history[uri]
  }
}
