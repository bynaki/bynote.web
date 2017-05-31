import './author.css'
import Vue from 'vue'
import Component from 'vue-class-component'
import axios, {AxiosError} from 'axios'
import {
  alert,
} from 'notie'
import {
  parse as parseUrl,
} from 'url'
import {
  Logger,
  DeclareLogger,
} from '../../utils'
import {
  apiHost,
} from '../../config'
import {
  GraphQLError,
} from '../../interface'


@Component({
  template: require('./author.html'),
})
@DeclareLogger()
export class AuthorComponent extends Vue {
  log: Logger
  password: string = ''
  hash: string = localStorage.getItem('hash')
  expiresIn: string = localStorage.getItem('expiresIn')

  mounted() {
    this.log.info('mounted')
  }

  async onSubmit(event) {
    if(!this.password) {
      $('#password-form-group').addClass('has-error')
      this.log.info('!this.password')
      return
    }
    this.hash = (this.hash)? this.hash : 'default'
    this.expiresIn = (this.expiresIn)? this.expiresIn : '2h'
    localStorage.setItem('hash', this.hash)
    localStorage.setItem('expiresIn', this.expiresIn)
    try {
      const res = await axios.post(apiHost('graphql'), {
        query: `
        mutation {
          token: createToken(
            hash: "${this.hash}"
            password: "${this.password}"
            expiresIn: "${this.expiresIn}"
          )
        }
        `,
      })
      const token = res.data.data.token
      this.log.info('token: ', token)
      if(!token) {
        let message
        if(res.data.errors[0]) {
          const error: GraphQLError = res.data.errors[0]
          this.log.error(error)
          message = error.message
        } else {
          message = 'authentication failed'
          this.log.error(message)
        }
        alert({
          type: 'error',
          text: message,
          position: 'bottom',
        })
      } else if(token) {
        this.token = token
        if(this.$route.params.redirect) {
          const url = parseUrl(decodeURIComponent(this.$route.params.redirect))
          if(url.protocol === 'http:' || url.protocol === 'https:') {
            location.href = url.href
          } else {
            this.$router.push(url.href)
          }
        }
      }
    } catch(err) {
      const error = err as AxiosError
      this.log.error(error)
      // if(error.response.data.errors) {
      //   this.log.error(error.response.data.errors[0].message)
      // }
    }
  }

  get token() {
    return localStorage.getItem('token')
  }

  set token(val: string) {
    localStorage.setItem('token', val)
  }
}
export default AuthorComponent
