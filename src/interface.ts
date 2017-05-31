
interface DocItem {
  name: string
  type: string
  path: string
}

interface FindResult extends DocItem {
  id: string
}

export interface ExtendedFindResult extends FindResult {
  keyword: string
  scope: string
}   

export class DocsetScope {
  static get OfficialDocset(): string {
    return 'OfficialDocset'
  }
  static get PublicNote(): string {
    return 'PublicNote'
  }
  static get PrivateNote(): string {
    return 'PrivateNote'
  }
}

export interface DocsetInfoPlist {
  CFBundleIdentifier: string
  CFBundleName: string
  DocSetPlatformFamily: string
  isDashDocset?: boolean
  DashDocSetKeyword?: string
}

export interface DocsetFeed {
  version: string
  ios_version: string
  urls: string[]
  other_versions: string[]
}

export interface DocsetFeedWithUrl extends DocsetFeed {
  feed_url: string
}

export interface DocsetInfo {
  name: string
  keyword: string
  scope: string
  info?: DocsetInfoPlist
  feed?: DocsetFeedWithUrl
}


export interface GraphQLError {
  message: string,
  locations: {
    line: number,
    column: number,
  }[],
  path: string[],
}