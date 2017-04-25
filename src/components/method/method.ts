import Vue from 'vue'
import {
  Component,
  Prop,
} from 'vue-property-decorator'
import {MethodLump} from '../../queries/QueryBase'
import {
  DeclareLogger,
  Logger,
} from '../../utils'


@Component({
  template: require('./method.html')
})
@DeclareLogger()
export class MethodComponent extends Vue {
  log: Logger

  @Prop
  response: MethodLump[]

  mounted() {
    this.log.info('mounted')
  }

  realPath(uri: string): string {
    const path = (this.$route.path === '/')? '' : this.$route.path
    return `/#${path}/${encodeURIComponent(uri)}`
  }
}