import './query.css'
import Vue from 'vue'
import {Component, Watch} from 'vue-property-decorator'
import {DeclareLogger, Logger} from '../../util/log'


@Component({
  template: require('./query.html')
})
@DeclareLogger()
export class QueryComponent extends Vue {
  log: Logger
  queryText: string = ''
  urlEles: {name: string, url: string}[] = []

  mounted() {
    this.log.info('mounted')
    this.$router.afterEach(this._sync)
    this._sync()
    const input = this.$el.querySelector('.query-input') as HTMLInputElement
    input.focus()
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
    }, '/#')
    trans[0].name = 'Root'
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
