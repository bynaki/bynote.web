export * from './log'
export * from './KeyboardShortcut'
export * from './Workflow'
export * from './global'
export * from './errors'
import Vue from 'vue'
import {
  AxiosError,
  AxiosResponse,
} from 'axios'
import {
  alert,
} from 'notie'
import {
  MyErrorFormat,
} from './errors'


export function chopupPath(fullPath: string): {name: string, path: string}[] {
  const splited = fullPath.split('/')
  const trans: {name: string, path: string}[] = []
  splited.reduce((pre, name, idx) => {
    const path = pre + name
    trans.push({name, path})
    return path + '/'
  }, '')
  trans[0].name = 'Root'
  trans[0].path = '/'
  if(trans[trans.length - 1].name === '') {
    trans.pop()
  }
  return trans
}

export function includeToken() {
  const token = localStorage.getItem('token')
  if(token) {
    return {
      headers: {
        'x-access-token': localStorage.getItem('token')
      },
    }
  }
}

export function processError<V extends Vue>(error: AxiosError, component: V) {
  let text = error.message
  if(error.response) {
    if(error.response.data && error.response.data.errors) {
      const err = error.response.data.errors[0] as MyErrorFormat
      text += (text)? (' > ' + err.message) : err.message
      if(error.response.status === 401) {
        component.$router.replace('/author/' + encodeURIComponent(component.$route.fullPath))
      }
    }
  }
  (component as any).log.error(text)
  alert({
    type: 'error',
    text,
    position: 'bottom',
    time: 5,
  })
}
