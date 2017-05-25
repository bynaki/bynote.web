import Vue from 'vue'
import {
  Component,
  Prop,
} from 'vue-property-decorator'
import {alert} from 'notie'
import {
  DeclareLogger,
  Logger,
} from '../../utils'
import $ from 'jquery'
import OfficialDocset from '../../queries/OfficialDocset'


@Component({
  template: require('./officialdoc.html'),
})
@DeclareLogger()
export class OfficialDocComponent extends Vue {
  log: Logger

  @Prop
  response: OfficialDocset

  mounted() {
    this.log.info('mounted')
    $('#official-doc-modal').modal('show').on('hidden.bs.modal', e => {
      this.$router.back()
    })
  }

  onOK() {
    (this.response.localName)? this.response.delete() : this.response.download()
    alert({
      type: 'info',
      text: (this.response.localName)? 'Deleting' : 'Downloading',
      position: 'bottom',
    })
  }
}
