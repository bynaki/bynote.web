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


@DeclareQuery({
  component: MethodComponent,
  methods: [
    new DocsetList(),
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
