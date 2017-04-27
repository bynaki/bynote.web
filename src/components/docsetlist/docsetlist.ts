import Vue from 'vue'
import {
  Component,
  Prop,
} from 'vue-property-decorator'
import {DeclareListKeyboard} from '../listkeyboard'
import {
  DeclareLogger,
  Logger,
} from '../../utils'
import Docset from '../../queries/Docset'


@Component({
  template: require('./docsetlist.html')
})
@DeclareListKeyboard()
@DeclareLogger()
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