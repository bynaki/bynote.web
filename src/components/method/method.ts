import Vue from 'vue'
import {
  Prop,
} from 'vue-property-decorator'
import {ListComponent} from '../listcomponent'
import {MethodLump} from '../../queries/QueryBase'
import {
  DeclareLogger,
  Logger,
} from '../../utils'


@ListComponent({
  template: require('./method.html'),
})
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
