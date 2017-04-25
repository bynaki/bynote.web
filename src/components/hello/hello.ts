import Vue from 'vue'
// import Component from 'vue-class-component'
import {
  Component,
  Prop,
} from 'vue-property-decorator'
import {
  DeclareLogger,
  Logger,
} from '../../utils'
import $ from 'jquery'


@Component({
  template: require('./hello.html'),
})
@DeclareLogger()
export class HelloComponent extends Vue {
  log: Logger

  @Prop
  response: (msg: string) => void

  mounted() {
    this.log.info('mounted')
    $('#helloModal').modal('show').on('hidden.bs.modal', e => {
      this.$router.back()
    })
  }

  onYes() {
    this.response('Yes')
  }
}
