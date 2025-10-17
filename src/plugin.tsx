import {IconPluginPosition, PluginType, ThemeColor,DrawerPlugin} from 'next-flow-interface'
import { internationalizationService } from 'next-flow-interface/api'

import packageJson from '../package.json'

import Drawer from "./drawer/drawer";


export default class Plugin implements DrawerPlugin {

  id: string = packageJson.plugin.id
  version: string = packageJson.version
  namespace = packageJson.plugin.namespace

  intl = internationalizationService.createTranslator(this.namespace)

  name: string = this.intl`name`
  description = this.intl`description`

  type: PluginType = packageJson.plugin.type as PluginType
  theme: ThemeColor = packageJson.plugin.theme as ThemeColor

  weight = 50
  title = ''
  tip = ''
  position = IconPluginPosition.TOP_LEFT
  group = ''
  label = ''
  color = packageJson.plugin.theme as ThemeColor
  open = false

  icon = '<span class="material-symbols-rounded">bug_report</span>'

  drawer = Drawer
}
