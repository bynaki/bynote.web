import * as fuzzy from 'fuzzy'
import * as _ from 'lodash'
import Vue from 'vue'
import {MethodComponent} from '../components/method'


@DeclareClass()
export class QueryBase {
  _frozenLumpList: Map<string, {methodName: string, lump: MethodLump}>
  _lumpList: Map<string, {methodName: string, lump: MethodLump}>
  
  constructor(public name: string) {
  }

  async methodLumpList(pattern: string): Promise<MethodLump[]> {
    console.log(Object.getPrototypeOf(this).constructor.name)
    const list = Array.from(this._frozenLumpList.values()).map(item => item.lump)
    return fuzzy.filter<MethodLump>(pattern, list, {
      extract: el => el.name
    }).map(el => el.original)
  }

  selfMethod(name: string): SelfMethod {
    if(name === 'MethodLumpList') {
      const method = (pattern: string) => this.methodLumpList(pattern)
      method['getLump'] = (): MethodLump => ({
        name: 'MethodLumpList',
        description: 'Method lump list',
        component: MethodComponent,
      })
      return method as SelfMethod
    } else {
      const lumpWithMethodName = this._frozenLumpList.get(name)
      const method = (...args) => this[lumpWithMethodName.methodName](...args)
      method['getLump'] = (): MethodLump => _.clone<MethodLump>(lumpWithMethodName.lump)
      return method as SelfMethod
    }
  }
}
export default QueryBase


export function DeclareMethod(lump: MethodLump) {
  return (target: {_lumpList: Map<string, {methodName: string, lump: MethodLump}>}
    , name: string, descriptor: PropertyDescriptor) => {
    const cLump = _.clone(lump)
    console.log('target.hello: ', target.constructor['name'])
    target._lumpList.set(cLump.name, {methodName: name, lump: cLump})
  }
}


// export function DeclareMethod(lump: MethodLump) {
//   return (target: any, name: string, descriptor: PropertyDescriptor) => {
//     const cLump = _.clone(lump)
//     DeclareMethod['']
//     console.log('target.hello: ', target.constructor['name'])
//     target._lumpList.set(cLump.name, {methodName: name, lump: cLump})
//   }
// }

export function DeclareClass() {
  return (target: any) => {
    target.prototype._frozenLumpList
      = new Map<string, {methodName: string, lump: MethodLump}>(
        target.prototype._lumpList
      )
    target.prototype._lumpList 
      = new Map<string, {methodName: string, lump: MethodLump}>()
  }
}


export interface MethodLump {
  name: string
  description: string
  component: any
}

export interface SelfMethod {
  (pattern?: string): Promise<any>
  getLump: () => MethodLump
}

