import packageJson from '../package.json'
import {IconPluginPosition, PluginType, ThemeColor} from 'oflow-interface'
import {DrawerPlugin} from "oflow-interface";
import {loadApi} from "./api";
import React from 'react';
import Drawer from "./drawer/drawer";


export default class Plugin implements DrawerPlugin {

  id: string = packageJson.plugin.id
  name: string = packageJson.name
  version: string = packageJson.version
  description = packageJson.description

  type: PluginType = packageJson.plugin.type as PluginType
  theme: ThemeColor = packageJson.plugin.theme as ThemeColor

  loadApi = loadApi

  weight = 50
  title = ''
  tip = ''
  position = IconPluginPosition.TOP_LEFT
  group = ''
  label = ''
  color = packageJson.plugin.theme as ThemeColor
  open = false

  icon = () => {
    return <span className='material-symbols-rounded'>bug_report</span>
  }

  drawer = Drawer
}
