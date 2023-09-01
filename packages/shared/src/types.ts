export interface ComponentRelationship {
  id: string
  deps: string[]
  virtual?: boolean
}

export interface ModuleInfo {
  id: string
  plugins: Array<{ name: string, transform?: number, resolveId?: number }>
  deps: string[]
  virtual: boolean
}

export type AssetType = 'image' | 'font' | 'video' | 'audio' | 'text' | 'json' | 'other'

export interface ExecNpmScriptOptions {
  isDev?: boolean
  cwd?: string
  type?: 'install' | 'uninstall'
  callback?: (type: string, data: string) => void
}

export interface AssetInfo {
  path: string
  type: AssetType
  publicPath: string
  filePath: string
  size: number
  mtime: number
}
export interface ImageMeta {
  width: number
  height: number
  orientation?: number
  type?: string
  mimeType?: string
}

export interface RPCFunctions {
  componentGraph(): Promise<ModuleInfo[]>
  inspectClientUrl(): Promise<string>
  staticAssets(): Promise<AssetInfo[]>
  getImageMeta(path: string): Promise<ImageMeta>
  getTextAssetContent(path: string): Promise<string>
  getPackages(): Promise<Record<string, string>>
  getSvelteSFCList(): Promise<string[]>
  getComponentInfo(filename: string): Promise<Record<string, unknown>>
  onTerminalData(_: { id?: string, data: string }): void
  onTerminalExit(_: { id?: string, data?: string }): void
  installPackage(packages: string[], options?: ExecNpmScriptOptions): Promise<void>
  uninstallPackage(packages: string[], options?: ExecNpmScriptOptions): Promise<void>
  getRoutesInfo(): routeInfo[]
  getAllowList(): string[]
  root(): Promise<string>
}

export interface ModulesList {
  root: string
  modules: ModuleInfo[]
  ssrModules: ModuleInfo[]
}

export interface SvelteDevtoolsHostClientHook {
  events: Map<string, () => void>
  emit: (event: string, ...payload: any[]) => void
  on: (event: string, fn: (...payload: any[]) => void) => void
}
export interface SvelteDevtoolsHostClient {
  markClientLoaded: () => void
  inspector?: {
    disable: () => void,
    enable: () =>void
    openInEditor: (baseUrl:string, file:string, line:number, column:number) =>void
  }
  panel?: {
    toggleViewMode: (mode?: 'xs' | 'default') => void
    togglePosition: (position: string) => void
    toggle: () => void
  }
  hook: SvelteDevtoolsHostClientHook
  hookBuffer: Array<[string, Record<string, any>]>
  categorizedHookBuffer: Record<string, Array<[string, Record<string, any>]>>
}

export interface BuiltinTab {
  path?: string
  title: string
  icon: string
  hide: boolean
  disable: boolean
  category?: string
  evt ? : (hook: SvelteDevtoolsHostClientHook) => void
}

export interface routeParams {
  optional: boolean
  reset: boolean
  name: string
  matcher?: string
}
export interface routeInfo {
  filePath: string
  routePath: string
  params?: routeParams[]
  active?: boolean
  next?: boolean
}

export interface PackageMeta {
  type: string
  version: string
  name: string
}

export interface PackageInfo {
  name: string
  version: string
  descriptions: string
  owner: {
    name: string
    link: string
  }
  repository: {
    url: string
  }
  humanDownloadsLast30Days: string
  versions: string[]
  author: string
  downloads: string
  versionIndex: number
  activeVersion: string
  repoLink: string
  authorLink: string
}
