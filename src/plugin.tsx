import {IconPluginPosition, PluginType, ThemeColor,DrawerPlugin} from 'next-flow-interface'
import { internationalizationService } from 'next-flow-interface/api'

import packageJson from '../package.json'

import Drawer from "./drawer/drawer";


export default class Plugin implements DrawerPlugin {

  id: string = packageJson.plugin.id
  version: string = packageJson.version
  namespace = packageJson.plugin.namespace

  intl = internationalizationService.createIntl(this.namespace)
  createIntl(namespace: string) {
    return internationalizationService.createIntl(this.namespace + '.' + namespace)
  }

  name: string = this.intl`name`
  description = this.intl`description`

  type: PluginType = packageJson.plugin.type as PluginType
  theme: ThemeColor = packageJson.plugin.theme as ThemeColor

  label = this.intl`label`
  title = this.intl`title`
  tip = this.intl`tip`
  weight = 50
  position = IconPluginPosition.TOP_LEFT
  group = ''
  color = packageJson.plugin.theme as ThemeColor
  open = false

  icon = '<span class="material-symbols-rounded">bug_report</span>'

  drawer = Drawer
}
