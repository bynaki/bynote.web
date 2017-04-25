import Vue from 'vue'
import {
  Component,
  Prop,
} from 'vue-property-decorator'
import {
  DeclareLogger,
  Logger,
} from '../../utils'
// import {
//   DocsetInfo
// } from '../../interface'
import Docset from '../../queries/Docset'


@Component({
  template: require('./docsetlist.html')
})
@DeclareLogger()
export class DocsetListComponent extends Vue {
  log: Logger

  @Prop
  response: Docset[]

  mounted() {
    this.log.info('mounted')
  }

  realPath(uri: string): string {
    const path = (this.$route.path === '/')? '' : this.$route.path
    return `/#${path}/${encodeURIComponent(uri)}`
  }
}
