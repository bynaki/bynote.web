import * as keycode from 'keycode'
import {
  DeclareLogger,
  Logger,
} from './log'


@DeclareLogger()
export class KeyboardShortcut {
  private log: Logger
  private _keys = {}
  private _binded: (event: KeyboardEvent) => void
  private static _globalShortcut: KeyboardShortcut

  static get globalShortcut() {
    if(!KeyboardShortcut._globalShortcut) {
      KeyboardShortcut._globalShortcut = new KeyboardShortcut(document)
    }
    return KeyboardShortcut._globalShortcut
  }

  constructor(private _target: Document | Element | HTMLElement
    , private _type: string = 'keydown') {
    this.log.info('constructor()')
    this._binded = this._onKeydown.bind(this)
    this._target.addEventListener(_type, this._binded)
  }

  destroy() {
    this._target.removeEventListener(this._type, this._binded)
  }

  register(key: string, listener: (event: KeyboardEvent) => void) {
    this._keys[this._normalizeKey(key)] = listener
  }

  remove(key: string) {
    delete this._keys[this._normalizeKey(key)]
  }

  private _normalizeKey(key: string): string {
    try {
      let splited = key.toLowerCase().split('+')
      splited = splited.map(key => key.trim())
      splited.forEach((key, idx) => {
        if(idx === splited.length - 1) {
          if(key === 'ctrl' || key === 'shift' || 
            key === 'alt' || key === 'meta') {
              throw new Error()
            }
        } else {
          if(!(key === 'ctrl' || key === 'shift' || 
            key === 'alt' || key === 'meta')) {
              throw new Error()
            }
        }
      })
      splited.sort((a, b) => {
        const order = {
          'ctrl': 1,
          'shift': 2,
          'alt': 3,
          'meta': 4,
        }
        if(!(a === 'ctrl' || a === 'shift' || 
          a === 'alt' || a === 'meta')) {
            return 1
          } else {
            return order[a] - order[b]
          }
      })
      return splited.join('+')
    } catch(err) {
      throw new Error('유효하지 않은 key를 등록시키려 한다.')
    }
  }

  private _onKeydown(event: KeyboardEvent) {
    // ctrl+shift+alt+meta
    const key: string[] = []
    if(event.ctrlKey) {
      key.push('ctrl')
    }
    if(event.shiftKey) {
      key.push('shift')
    }
    if(event.altKey) {
      key.push('alt')
    }
    if(event.metaKey) {
      key.push('meta')
    }
    const code = keycode(event)
    if(code !== 'ctrl' && code !== 'shift' && code !== 'alt'
      && code !== 'right command' && code !== 'left command') {
      key.push(code)
      this.log.info(key.join('+'))
      if(this._keys[key.join('+')]) {
        this._keys[key.join('+')](event)
      }
    }
  }
}