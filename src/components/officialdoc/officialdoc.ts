import Vue from 'vue'
import {
  Component,
  Prop,
} from 'vue-property-decorator'
import {alert} from 'notie'
import {
  DeclareLogger,
  Logger,
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
  private _myPath: string

  @Prop
  response: OfficialDocset

  mounted() {
    this.log.info('mounted')
    this._ok = false
    this._myPath = this.$route.path
    $('#official-doc-modal').modal('show')
      .on('hidden.bs.modal', e => {
        if(!this._ok) {
          this._backParent()
        }
      })
  }

  onOK() {
    let text = this.response.$name + ' > '
    text += (this.response.keyword)? 'Deleting' : 'Downloading'
    alert({
      type: 'info',
      text,
      position: 'bottom',
    })
    this._ok = true
    this._toggle()
    .then(() => {
      let text = this.response.$name + ' > '
      text += (this.response.keyword)? 'Deleting Success!!' : 'Downloading Success!!'
      alert({
        type: 'success',
        text,
        position: 'bottom',
      })
      this.response.$removeAtHistory()
      OfficialDocsetList.reset()
      // 원래 path와 지금 path가 같다면
      // 즉, 다운로드 하는 중 path가 변하지 않았다면 
      if(this._myPath === this.$route.path) {
        this._backParent()
      }
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
