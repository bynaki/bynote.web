import Vue from 'vue'
import VueRouter, {Route} from 'vue-router'
import Component from 'vue-class-component'
import * as debounce from 'debounce-promise'
import {QueryComponent} from '../query'
import Root from '../../queries/Root'
import {
  Logger,
  DeclareLogger,
  KeyboardShortcut,
  Workflow,
  GlobalData,
  processError,
} from '../../utils'
import router from '../../router'


@Component({
  template: require('./root.html'),
  components: {
    'query': QueryComponent,
  },
})
@DeclareLogger()
export class RootComponent extends Vue {
  log: Logger
  view: typeof Vue = null
  response: any = null
  private _input: HTMLInputElement
  private _sync: (route: Route) => void 

  mounted() {
    this.log.info('mounted')
    this._input = this.$el.querySelector('#query-input') as HTMLInputElement
    const debounceFunc = debounce(async (route: Route) => {
      const query = await Root.history(route.path)
      try {
        this.response = await query.$query(route.query.query)
      } catch(err) {
        processError(err, this)
      }
      this.view = query.$options.component
      this._input.focus()
      return this.response
    }, 500)
    this._sync = async (route: Route) => {
      const components = this.$router.getMatchedComponents(route.path)
      if(components.length !== 0 && components[0] !== RootComponent) {
        return
      }
      GlobalData.debouncing = true
      await debounceFunc(route)
      GlobalData.debouncing = false
    }
    this.$router.afterEach(this._sync)
    this._sync(this.$route)
    this._input.focus()
    KeyboardShortcut.globalShortcut.register('/', event => {
      if(document.activeElement.id !== 'query-input') {
        this._input.focus()
        event.preventDefault()
      }
    })
  }
}
export default RootComponent
