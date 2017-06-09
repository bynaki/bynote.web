export * from './log'
export * from './KeyboardShortcut'
export * from './Workflow'
export * from './global'
export * from './errors'


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
