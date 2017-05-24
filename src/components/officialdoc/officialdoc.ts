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
  template: require('./officialdoc.html'),
})
@DeclareLogger()
export class OfficialDocComponent extends Vue {
  log: Logger

  @Prop
  response: () => void

  mounted() {
    this.log.info('mounted')
    $('#OfficialDocModal').modal('show').on('hidden.bs.modal', e => {
      this.$router.back()
    })
  }

  onOK() {
    this.response()
  }
}
