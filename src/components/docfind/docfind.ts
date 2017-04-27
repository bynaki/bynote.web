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
import {
  ExtendedFindResult
} from '../../interface'


@Component({
  template: require('./docfind.html')
})
@DeclareListKeyboard()
@DeclareLogger()
export class DocFindComponent extends Vue {
  log: Logger

  @Prop
  response: ExtendedFindResult[]

  mounted() {
    this.log.info('mounted')
  }

  destroyed() {
    this.log.info('destroyed')
  }
}
