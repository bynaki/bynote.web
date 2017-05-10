declare module 'notie' {
  export function alert(arg: {
    type?: number | string
    text: string
    stay?: boolean
    time?: number
    position?: string
  }): void
}
