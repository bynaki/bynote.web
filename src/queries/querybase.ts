/**
 * query base
 */

import Vue from 'vue'
import {
  clone,
} from 'lodash'
import * as fuzzy from 'fuzzy'
import Root from './Root'


export interface QueryDescription {
  name: string
  description?: string
}

export class QueryBase {
  private _name: string
  private _description: string
  private _uri: string

  constructor(description: QueryDescription) {
    this._name = description.name
    this._description = description.description
  }

  get $name() {
    return this._name
  }

  get $description() {
    return this._description
  }

  get $options(): QueryOptions {
    return Object.getPrototypeOf(this).constructor.options
  }

  async $query(pattern: string = ''): Promise<any> {
    if(pattern === '') {
      return this.$options.methods
    }
    return fuzzy.filter(pattern, this.$options.methods, {
      extract: el => el.$name,
    }).map(el => el.original)
  }

  async $next(name: string): Promise<any> {
    return this.$options.methods.find(el => el.$name === name)
  }

  $setUri(uri: string) {
    this._uri = uri
  }

  $removeAtHistory() {
    if(this._uri) {
      Root.removeAtHistory(this._uri)
    }
  }
}

export interface QueryOptions {
  component: typeof Vue
  methods?: QueryBase[]
}

export function DeclareQuery(options: QueryOptions) {
  return (target: any) => {
    target.options = clone(options)
  }
}
