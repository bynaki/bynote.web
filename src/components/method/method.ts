import Vue from 'vue'
import {
  Component,
  Prop,
  Watch,
} from 'vue-property-decorator'
import {MethodLump} from '../../queries/QueryBase'
import {DeclareListKeyboard} from '../listkeyboard'
import {
  DeclareLogger,
  Logger,
  KeyboardShortcut,
} from '../../utils'


@Component({
  template: require('./method.html')
})
@DeclareListKeyboard()
@DeclareLogger()
export class MethodComponent extends Vue {
  log: Logger

  @Prop
  response: MethodLump[]

  mounted() {
    this.log.info('mounted')
  }

  destroyed() {
    this.log.info('destroyed')
  }
}
