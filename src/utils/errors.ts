import {
  AxiosError,
  AxiosResponse,
} from 'axios'


export class MyAxiosError extends Error {
  constructor(public response: AxiosResponse, message?: string) {
    super(message)
  }
}

