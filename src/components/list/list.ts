import Vue from 'vue'
import {
  Component,
  Prop,
} from 'vue-property-decorator'
import {
  DeclareLogger,
  Logger,
} from '../../utils'

export interface ListItem {
  name: string
  description: string
  uri: string
}

@Component({
  template: require('./list.html')
})
@DeclareLogger()
export class ListComponent extends Vue {
  log: Logger

  @Prop
  response: ListItem[]

  mounted() {
    this.log.info('mounted')
  }

  realPath(uri: string): string {
    const path = (this.$route.path === '/')? '' : this.$route.path
    return `/#${path}/${encodeURIComponent(uri)}`
  }
}
