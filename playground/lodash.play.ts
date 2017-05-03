import * as _ from 'lodash'
console.log(_.assign(undefined, {response: 'aaa'}))

let a = {}
_.assign(a, {aaa: 'aaa'})
let b: any = _.assign({}, a)
b.bbb = 'bbb'
console.log(a)
console.log(b)