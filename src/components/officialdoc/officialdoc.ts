import Vue from 'vue'
import {
  Component,
  Prop,
} from 'vue-property-decorator'
import {alert} from 'notie'
import {
  DeclareLogger,
  Logger,
  MyAxiosError,
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
    if(this.response.localName) {
      this.response.delete()
    } else {
      this.response.download()
      .then(() => {
        alert({
          type: 'success',
          text: 'Download Success!!',
          position: 'bottom',
        })
      })
      .catch(err => {
        const error = err as MyAxiosError
        let text = ''
        if(error.message) {
          text = error.message + (error.response.data && error.response.data.errors)? '/n' : ''
        }
        if(error.response.data && error.response.data.errors) {
          text += error.response.data.errors[0].message
        }
        alert({
          type: 'error',
          text,
          position: 'bottom',
          time: 5,
        })
      })
    }
    alert({
      type: 'info',
      text: (this.response.localName)? 'Deleting' : 'Downloading',
      position: 'bottom',
    })
  }
}
