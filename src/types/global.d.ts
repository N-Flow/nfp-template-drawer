declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

declare module '*.module.scss' {
  const classes: Record<string, string>
  export default classes
}

declare module '*.module.sass' {
  const classes: Record<string, string>
  export default classes
}

declare interface Window {
  nfpConnector: {
    loadMessages: (messages: any) => void
    install: (plugin: any) => void
    api: any
  }
  locale: string
}
