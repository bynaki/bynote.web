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

  className() {
    return Object.getPrototypeOf(this).constructor.name
  }

  async methodLumpList(pattern: string): Promise<MethodLump[]> {
    if(!QueryBase._lumpList.get(this.className())) {
      QueryBase._lumpList.set(this.className(), new Map())
    }
    const list = Array.from(
      QueryBase._lumpList.get(
        this.className()).values()).map(item => item.lump)
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
      const lumpWithMethodName = QueryBase._lumpList.get(this.className()).get(name)
      const method = (...args) => this[lumpWithMethodName.methodName](...args)
      method['getLump'] = (): MethodLump => _.clone<MethodLump>(lumpWithMethodName.lump)
      return method as SelfMethod
    }
  }

  static _lumpList: Map<string, Map<string, {methodName: string, lump: MethodLump}>> = new Map()
}
export default QueryBase


export function DeclareMethod(lump: MethodLump) {
  return (target: {_lumpList: Map<string, {methodName: string, lump: MethodLump}>}
    , name: string, descriptor: PropertyDescriptor) => {
    const cLump = _.clone(lump)

    const className = target.constructor.name
    if(!QueryBase._lumpList.get(className)) {
      QueryBase._lumpList.set(className
        , new Map<string, {methodName: string, lump: MethodLump}>())
    }
    QueryBase._lumpList.get(className)
      .set(cLump.name, {methodName: name, lump: cLump})
  }
}


export function DeclareClass() {
  return (target: any) => {
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

