import Vue from 'vue'
import {
  Prop,
} from 'vue-property-decorator'
import {ListComponent} from '../listcomponent'
import {
  DeclareLogger,
  Logger,
} from '../../utils'
import Docset from '../../queries/Docset'


@DeclareLogger()
@ListComponent({
  template: require('./docsetlist.html')
})
export class DocsetListComponent extends Vue {
  log: Logger

  @Prop
  response: Docset[]

  mounted() {
    this.log.info('mounted')
  }

  destroyed() {
    this.log.info('destroy')
  }
}