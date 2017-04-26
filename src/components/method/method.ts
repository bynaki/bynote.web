import Vue from 'vue'
import {
  Component,
  Prop,
  Watch,
} from 'vue-property-decorator'
import {MethodLump} from '../../queries/QueryBase'
import {
  DeclareLogger,
  Logger,
  KeyboardShortcut,
} from '../../utils'


@Component({
  template: require('./method.html')
})
@DeclareLogger()
export class MethodComponent extends Vue {
  log: Logger
  activeIndex: number = 0
  private _shortcut: KeyboardShortcut

  @Prop
  response: MethodLump[]

  @Watch('response')
  onChangeResponse(newRes: MethodLump[]) {
    this.activeIndex = 0
  }

  mounted() {
    this.log.info('mounted')
    const focus = (event: KeyboardEvent) => {
      const input = document.querySelector('#query-input') as HTMLInputElement
      input.blur()
      if(this.response.length !== 0 && this.activeIndex === -1) {
        this.activeIndex = 0
      }
      this._focusActiveElement()
      event.preventDefault()
    }
    KeyboardShortcut.globalShortcut.register('esc', focus)
    KeyboardShortcut.globalShortcut.register('down', event => {
      if(document.activeElement.id === 'query-input') {
        focus(event)
      }
    })
    KeyboardShortcut.globalShortcut.register('enter', event => {
      if(document.activeElement.id === 'query-input') {
        const href = $(this.$el.querySelector('.active')).attr('href')
        window.location.href = href
      }
    })
    this._shortcut = new KeyboardShortcut(this.$el)
    const down = (event: KeyboardEvent) => {
      if(this.activeIndex < this.response.length - 1) {
        this.activeIndex += 1
        this._focusActiveElement()
      }
    }
    this._shortcut.register('j', down)
    this._shortcut.register('down', down)
    const up = (event: KeyboardEvent) => {
      if(this.activeIndex > 0) {
        this.activeIndex -= 1
        this._focusActiveElement()
      }
    }
    this._shortcut.register('k', up)
    this._shortcut.register('up', up)
  }

  destroyed() {
    this.log.info('destroyed')
    this._shortcut.destroy()
    KeyboardShortcut.globalShortcut.remove('esc')
    KeyboardShortcut.globalShortcut.remove('down')
    KeyboardShortcut.globalShortcut.remove('enter')
  }

  realPath(uri: string): string {
    const path = (this.$route.path === '/')? '' : this.$route.path
    return `${path}/${encodeURIComponent(uri)}`
  }

  private _focusActiveElement() {
    try {
      const elem = this.$el.querySelectorAll('a.list-group-item')[this.activeIndex] as HTMLAnchorElement
      elem.focus()
    } catch(err) {
      this.log.error((err as Error).stack)
    }
  }
}