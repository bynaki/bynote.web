import {
  resolve,
} from 'url'

export function apiHost(path: string) {
  // return resolve('http://bynaki.iptime.org:1330', path)
  return resolve('http://localhost:3000', path)
} 