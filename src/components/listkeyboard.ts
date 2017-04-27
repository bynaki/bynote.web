import * as _ from 'lodash'
import {KeyboardShortcut} from '../utils'


export function DeclareListKeyboard() {
  return (target: any) => {
    target.prototype._mounted = target.prototype.mounted
    target.prototype._destroyed = target.prototype.destroyed
    target.prototype.mounted = function() {
      this.$router.afterEach(to => {
        this.log.info('path: ', to.fullPath)
      })
      const focus = (event: KeyboardEvent) => {
        const list = new ItemList(this.$el)
        list.focus(list.activeIndex)
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
          const itemList = new ItemList(this.$el)
          if(itemList.length !== 0) {
            window.location.href = itemList.item(0).getAttribute('href')
          }
        }
      })
      this._shortcut = new KeyboardShortcut(this.$el)
      const down = (event: KeyboardEvent) => {
        const list = new ItemList(this.$el)
        list.focus(list.activeIndex + 1)
      }
      this._shortcut.register('j', down)
      this._shortcut.register('down', down)
      const up = (event: KeyboardEvent) => {
        const list = new ItemList(this.$el)
        list.focus(list.activeIndex - 1)
      }
      this._shortcut.register('k', up)
      this._shortcut.register('up', up)
      if(this._mounted) {
        this._mounted()
      }
    }

    target.prototype.destroyed = function() {
      this._shortcut.destroy()
      KeyboardShortcut.globalShortcut.remove('esc')
      KeyboardShortcut.globalShortcut.remove('down')
      KeyboardShortcut.globalShortcut.remove('enter')
      if(this._destroyed) {
        this._destroyed()
      }
    }

    target.prototype.realPath = function(uri: string): string {
      const path = (this.$route.path === '/')? '' : this.$route.path
      return `${path}/${encodeURIComponent(uri)}`
    }
  }
}


class ItemList {
  private _itemList: HTMLAnchorElement[]

  constructor(private _el: HTMLElement) {
    this._itemList = this._toArray<HTMLAnchorElement>(_el.querySelectorAll('a.list-group-item'))
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
      this._itemList.forEach(item => item.blur())
      this.active(idx)
      this._itemList[idx].focus()
      this._itemList[idx].addEventListener('blur', (event) => {
        console.log('blur')
        const target: HTMLAnchorElement = event.target as HTMLAnchorElement
        target.classList.remove('active')
      })
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