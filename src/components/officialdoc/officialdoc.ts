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
  MyErrorFormat,
  chopupPath,
} from '../../utils'
import $ from 'jquery'
import OfficialDocset from '../../queries/OfficialDocset'
import OfficialDocsetList from '../../queries/OfficialDocsetList'


@Component({
  template: require('./officialdoc.html'),
})
@DeclareLogger()
export class OfficialDocComponent extends Vue {
  log: Logger
  private _ok: boolean

  @Prop
  response: OfficialDocset

  mounted() {
    this.log.info('mounted')
    this._ok = false
    $('#official-doc-modal').modal('show')
      .on('hidden.bs.modal', e => {
        if(!this._ok) {
          this._backParent()
        }
      })
  }

  onOK() {
    this._ok = true
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
        OfficialDocsetList.reset()
        this._backParent()
      })
      .catch(err => {
        const error = err as MyAxiosError
        let text = ''
        if(error.message) {
          text = error.message + ((error.response.data && error.response.data.errors)? ' > ' : '')
        }
        if(error.response.data && error.response.data.errors) {
          const err = error.response.data.errors[0] as MyErrorFormat
          text += err.message
          this.log.error(error.response.data.errors[0])
          if(err.statusCode && err.statusCode === 401) {
            this.$router.replace('/author/' + encodeURIComponent(this.$route.fullPath))
          }
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

  private _backParent() {
    const chopedPaths = chopupPath(this.$route.path)
    if(chopedPaths.length > 1) {
      chopedPaths.pop()
      // 전 path로 
      this.$router.push(chopedPaths.pop().path)
    }
  }
}
