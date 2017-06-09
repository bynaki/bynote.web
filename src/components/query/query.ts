import './query.css'
import Vue from 'vue'
import {Component, Watch} from 'vue-property-decorator'
import {
  DeclareLogger,
  Logger,
  KeyboardShortcut,
  chopupPath,
} from '../../utils'


@Component({
  template: require('./query.html')
})
@DeclareLogger()
export class QueryComponent extends Vue {
  log: Logger
  queryText: string = ''
  chopedPaths: {name: string, path: string}[] = []
  private _shortDown: KeyboardShortcut
  private _shortUp: KeyboardShortcut

  mounted() {
    this.log.info('mounted')
    this.$router.afterEach(this._sync)
    this._sync()
    this._shortDown = new KeyboardShortcut(this.$el.querySelector('#query-input'))
    let remainText = ''
    this._shortDown.register('backspace', event => {
      if(!this.queryText && !remainText) {
        if(this.chopedPaths.length > 1) {
          const paths = this.chopedPaths.map(ele => ele.path)
          paths.pop()
          this.$router.push(paths.pop())
        }
        event.preventDefault()
        return
      }
      if(!remainText) {
        remainText = this.queryText
      }
    })
    this._shortUp = new KeyboardShortcut(this.$el.querySelector('#query-input'), 'keyup')
    this._shortUp.register('backspace', event => {
      remainText = this.queryText
    })
  }

  private _sync() {
    const query = this.$route.query.query
    this.queryText = (query)? query : ''
    this.chopedPaths = chopupPath(this.$route.path)
  }

  @Watch('queryText')
  onChangeQueryText(newText: string) {
    this.$router.replace({
      path: this.$route.path,
      query: {query: this.queryText}
    })
    this.log.info('onChangeQueryText > ', this.$route.fullPath)
  }
}
