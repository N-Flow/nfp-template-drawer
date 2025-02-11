import {IconPluginPosition, PluginType, ThemeColor} from 'oflow-interface'
import {DrawerPlugin} from "oflow-interface";
import {loadApi} from "./api";
import React from 'react';
import Drawer from "./drawer/drawer";


export default class Plugin implements DrawerPlugin {

  id: string = ''
  name: string = ''
  version: string = '0.0.1'
  description = ''

  type: PluginType = PluginType.DRAWER
  theme: ThemeColor = ThemeColor.BLUE

  async onLoad() {
    loadApi()
  }
  async onActivate() {

  }
  async onDeactivate() {

  }
  async onDispose() {

  }

  weight = 50
  title = ''
  tip = ''
  position = IconPluginPosition.TOP_LEFT
  group = ''
  label = ''
  color = ThemeColor.BLUE
  enabled = false

  icon = () => {
    return <span className='material-symbols-rounded'>bug_report</span>
  }

  drawer = Drawer
}
