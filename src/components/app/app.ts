import './app.css'
import Vue from 'vue'
import VueRouter, {Route} from 'vue-router'
import Component from 'vue-class-component'
import * as debounce from 'debounce-promise'
import {QueryComponent} from '../query'
import Processor from '../../Processor'
import {
  Logger,
  DeclareLogger,
  KeyboardShortcut,
  Workflow,
  GlobalData,
} from '../../utils'


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
  private _input: HTMLInputElement
  private _sync: (route: Route) => void 

  mounted() {
    this.log.info('mounted')
    this._input = this.$el.querySelector('#query-input') as HTMLInputElement
    const debounceFunc = debounce(async (route: Route) => {
      const method = await this.processor.get(route.path)
      this.response = await method((route.query.query)? route.query.query : '')
      this.view = method.getLump().component
      this._input.focus()
      return this.response
    }, 500)
    this._sync = async (route: Route) => {
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
export default AppComponent
