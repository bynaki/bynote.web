import Vue from 'vue'
// import Component from 'vue-class-component'
import {
  Component,
  Prop,
} from 'vue-property-decorator'
import {
  DeclareLogger,
  Logger,
  chopupPath,
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
      const chopedPaths = chopupPath(this.$route.path)
      if(chopedPaths.length > 1) {
        chopedPaths.pop()
        // 전 path로 
        this.$router.push(chopedPaths.pop().path)
      }
    })
  }

  onYes() {
    this.response('Yes')
  }
}
