import Vue from 'vue'
import Component from 'vue-class-component'
import {
  Logger,
  DeclareLogger,
} from '../../utils'


@Component({
  template: require('./author.html'),
})
@DeclareLogger()
export class AuthorComponent extends Vue {
  log: Logger

  mounted() {
    this.log.info('mounted')
  }
}
export default AuthorComponent
