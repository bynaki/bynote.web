import {alert} from 'notie'
import {
  QueryBase,
  DeclareQuery,
} from './querybase'
import {
  HelloComponent,
} from '../components/hello'


@DeclareQuery({
  component: HelloComponent,
})
export default class Hello extends QueryBase {
  constructor() {
    super({
      name: 'Hello World',
      description: 'Alert "Yes"'
    })
  }

  async $query(pattern: string = '') {
    return (msg: string) => {
      alert({
        type: 'info',
        text: msg,
        position: 'bottom',
      })
    }
  }

  async $next(name: string) {
  }
}
