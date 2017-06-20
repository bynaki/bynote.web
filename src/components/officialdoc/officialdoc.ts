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
  processError,
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
    alert({
      type: 'info',
      text: (this.response.keyword)? 'Deleting' : 'Downloading',
      position: 'bottom',
    })
    this._ok = true
    this._toggle()
    .then(() => {
      alert({
        type: 'success',
        text: (this.response.keyword)? 'Deleting Success!!' : 'Downloading Success!!',
        position: 'bottom',
      })
      this.response.$removeAtHistory()
      OfficialDocsetList.reset()
      this._backParent()
    })
    .catch(err => {
      processError(err, this)
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

  private async _toggle() {
    if(this.response.keyword) {
      return this.response.delete()
    } else {
      return this.response.download()
    }
  }
}
