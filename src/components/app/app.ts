import './app.css'
import Vue from 'vue'
import VueRouter, {Route} from 'vue-router'
import Component from 'vue-class-component'
import {QueryComponent} from '../query'
import Processor from '../../Processor'
import {Logger, DeclareLogger} from '../../utils'


@Component({
  template: require('./app.html'),
  components: {
    'query': QueryComponent,
  },
})
@DeclareLogger()
export class AppComponent extends Vue {
  log: Logger
  view: any = null
  response: any = null
  processor: Processor = Processor.get()

  mounted() {
    this.log.info('mounted')
    this.$router.afterEach(this._sync)
    this._sync(this.$route)
  }

  private async _sync(route: Route) {
    this.log.info(route.fullPath)
    const method = await this.processor.get(route.path)
    this.response = await method((route.query.query)? route.query.query : '')
    this.view = method.getLump().component
    return this.response
  }
}
export default AppComponent
