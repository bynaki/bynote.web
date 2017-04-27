import './query.css'
import Vue from 'vue'
import {Component, Watch} from 'vue-property-decorator'
import {
  DeclareLogger,
  Logger,
  KeyboardShortcut,
} from '../../utils'


@Component({
  template: require('./query.html')
})
@DeclareLogger()
export class QueryComponent extends Vue {
  log: Logger
  queryText: string = ''
  urlEles: {name: string, url: string}[] = []
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
        if(this.urlEles.length > 1) {
          const urls = this.urlEles.map(ele => ele.url)
          urls.pop()
          this.$router.push(urls.pop())
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
    const splited = this.$route.path.split('/')
    let trans: {name: string, url: string}[] = []
    splited.reduce((pre, el, idx) => {
      const url = pre + el
      trans.push({name: el, url: url})
      return url + '/'
    }, '')
    trans[0].name = 'Root'
    trans[0].url = '/'
    if(trans.length === 2 && trans[1].name === '') {
      trans = trans.slice(0, 1)
    }
    this.urlEles = trans
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
