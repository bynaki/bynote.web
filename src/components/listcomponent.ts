import Vue, {ComponentOptions} from 'vue'
import Component from 'vue-class-component'
import * as _ from 'lodash'
import {parse as parseUrl} from 'url'
import {
  join
} from 'path'
import {
  KeyboardShortcut,
  Workflow,
  GlobalData
} from '../utils'


export declare type VueClass = {
    new (): Vue
} & typeof Vue


function onResChanged(newRes: any) {
  this.log.info('onResChanged')
  this._path = this.$route.path
  this.$nextTick(() => {
    const list = new ItemList(this.$el)
    list.active(0)
  })
}


export function ListComponent<U extends Vue>(options: ComponentOptions<U>)
  : <V extends VueClass>(target: V) => V {
  return (target: VueClass) => {
    target.prototype._mounted = target.prototype.mounted
    target.prototype._destroyed = target.prototype.destroyed

    target.prototype.mounted = function() {
      const workflow = new Workflow(() => {
        return !GlobalData.debouncing
      })
      this._turnOn = debouncing => {
        console.log('this._turn > debouncing: ', debouncing)
        if(debouncing === false) {
          workflow.trunOn()
        }
      }
      GlobalData.on('debouncing', this._turnOn)

      const focus = workflow.push((event: KeyboardEvent) => {
        const list = new ItemList(this.$el)
        list.focus(list.activeIndex)
      })
      KeyboardShortcut.globalShortcut.register('esc', event => {
        event.preventDefault()
        focus(event)
      })
      KeyboardShortcut.globalShortcut.register('down', event => {
        event.preventDefault()
        if(document.activeElement.id === 'query-input') {
          focus(event)
        }
      })
      KeyboardShortcut.globalShortcut.register('enter', workflow.push(event => {
        if(document.activeElement.id === 'query-input') {
          const itemList = new ItemList(this.$el)
          if(itemList.activeIndex !== -1) {
            const idx = itemList.activeIndex
            const url = itemList.item(idx).getAttribute('href')
            const target = itemList.item(idx).getAttribute('target')
            if(target) {
              window.open(url, target)
            } else {
              window.location.href = url
            }
          }
        }
      }))
      this._shortcut = new KeyboardShortcut(this.$el)
      const down = workflow.push((event: KeyboardEvent) => {
        const list = new ItemList(this.$el)
        list.focus(list.activeIndex + 1)
      })
      this._shortcut.register('j', down)
      this._shortcut.register('down', down)
      const up = workflow.push((event: KeyboardEvent) => {
        const list = new ItemList(this.$el)
        list.focus(list.activeIndex - 1)
      })
      this._shortcut.register('k', up)
      this._shortcut.register('up', up)
      const list = new ItemList(this.$el)
      list.active(0)
      if(this._mounted) {
        this._mounted()
      }
    }

    target.prototype.destroyed = function() {
      this._shortcut.destroy()
      KeyboardShortcut.globalShortcut.remove('esc')
      KeyboardShortcut.globalShortcut.remove('down')
      KeyboardShortcut.globalShortcut.remove('enter')
      GlobalData.removeListener('debouncing', this._turnOn)
      if(this._destroyed) {
        this._destroyed()
      }
    }

    target.prototype.realPath = function(uri: string): string {
      if(!this._path) {
        this._path = this.$route.path
      }
      return join(this._path, encodeURIComponent(uri))
      // if(!this._path) {
      //   this._path = (this.$route.path === '/')? '' : this.$route.path
      // }
      // return `${this._path}/${encodeURIComponent(uri)}`
    }

    let cOpts = _.assign({}, options)
    // 사실을 버그를 유발할 수있다. options.watch에 response가 없다는 걸 단정하고 있다.
    cOpts.watch = _.assign(cOpts.watch, {response: onResChanged})
    return Component(cOpts)(target)
  }
}


class ItemList {
  private _itemList: HTMLAnchorElement[]

  constructor(private _el: HTMLElement) {
    this._itemList = this._toArray<HTMLAnchorElement>(_el.querySelectorAll('a.list-group-item'))
    this._itemList.forEach(item => {
      item.addEventListener('focus', event => {
        const target: HTMLAnchorElement = event.target as HTMLAnchorElement
        this._itemList.forEach(item => {
          item.classList.remove('active')
        })
        target.classList.add('active')
      })
      item.addEventListener('blur', event => {
        const target: HTMLAnchorElement = event.target as HTMLAnchorElement
        // target.classList.remove('active')
      })
    })
  }

  get activedItem(): HTMLAnchorElement {
    return this._el.querySelector('a.active') as HTMLAnchorElement
  }

  get activeIndex(): number {
    let activeIndex = this._itemList.findIndex(item => {
      const klasses = this._toArray<string>(item.classList)
      return klasses.findIndex(klass => klass === 'active') !== -1
    })
    return activeIndex
  }

  get length(): number {
    return this._itemList.length
  }

  item(index: number) {
    return this._itemList[index]
  }

  active(index: number) {
    if(this._itemList.length !== 0) {
      const idx = _.clamp(index, 0, this._itemList.length - 1)
      this._itemList.forEach(item => item.classList.remove('active')) 
      this._itemList[idx].classList.add('active')
    }
  }

  focus(index: number) {
    if(this._itemList.length !== 0) {
      const idx = _.clamp(index, 0, this._itemList.length - 1)
      // this._itemList.forEach(item => item.blur())
      // this.active(idx)
      this._itemList[idx].focus()
      // this._itemList[idx].addEventListener('blur', (event) => {
      //   console.log('blur')
      //   const target: HTMLAnchorElement = event.target as HTMLAnchorElement
      //   target.classList.remove('active')
      // })
    }
  }

  inactive() {
    this._itemList.forEach(item => item.classList.remove('active')) 
  }

  private _toArray<T>(nodeList) {
    const array: T[] = []
    for(let i = 0; i < nodeList.length; i++) {
      array.push(nodeList.item(i))
    }
    return array
  }
}