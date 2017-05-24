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
import DocsetList from './DocsetList'
import OfficialDocsetList from './OfficialDocsetList'


@DeclareQuery({
  component: MethodComponent,
  methods: [
    new DocsetList(),
    new OfficialDocsetList(),
  ],
})
export default class DocsetRoot extends QueryBase {
  constructor() {
    super({
      name: 'Docset',
      description: 'Docset root',
    })
  }
}
