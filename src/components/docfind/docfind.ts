import Vue from 'vue'
import {
  Prop,
} from 'vue-property-decorator'
import {ListComponent} from '../listcomponent'
import {
  DeclareLogger,
  Logger,
} from '../../utils'
import {
  ExtendedFindResult
} from '../../interface'


@DeclareLogger()
@ListComponent({
  template: require('./docfind.html')
})
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