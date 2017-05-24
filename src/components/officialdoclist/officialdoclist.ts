import './officialdoclist.css'
import Vue from 'vue'
import {
  Prop,
} from 'vue-property-decorator'
import {ListComponent} from '../listcomponent'
import {
  DeclareLogger,
  Logger,
} from '../../utils'
import OfficialDocset from '../../queries/OfficialDocset'

@DeclareLogger()
@ListComponent({
  template: require('./officialdoclist.html')
})
export class OfficialDocListComponent extends Vue {
  log: Logger

  @Prop
  response: OfficialDocset[]

  mounted() {
    this.log.info('mounted')
  }

  destroyed() {
    this.log.info('destroy')
  }
}