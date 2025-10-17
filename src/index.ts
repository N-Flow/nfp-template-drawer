import Plugin from './plugin'
import messages from './messages/dev'
import packageJson from '../package.json'

window.nfpConnector.loadMessages({ [packageJson.plugin.namespace]: messages })
window.nfpConnector.install(new Plugin())

export { Plugin }
