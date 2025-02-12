import {
  OfpApi, SpaceServiceApi,
  AntCheckboxProps, AntColorProps, AntNumberProps, AntSelectProps, AntSwitchProps,
  RsdButtonProps, RsdCheckboxProps, RsdColorProps, RsdSelectProps, RsdFileSelectProps, RsdInputProps, RsdMentionsProps, RsdNoneProps, RsdNumberProps, RsdNumberListProps, RsdSwitchProps, RsdTitleProps,RsdSelectableButtonProps,
  SpanProps,
  AnchorProps, FileProgressBarProps, ProgressBarProps, UploadButtonAndListProps,ScrollBarProps,
  StatusServiceApi, LocalFileServiceApi, InternationalizationServiceApi, MeetingServiceApi, PluginServiceApi, UserServiceApi,
  ThemeProviderProps,
  ModulePreloaderApi,
  SyncServiceApi,
  RvGlobalServiceApi,
  HistoryManagerApi,
  DialogApi
} from "oflow-interface";
import type { FunctionComponent } from "react";

export let spaceService: SpaceServiceApi
export let statusService: StatusServiceApi
export let pluginService: PluginServiceApi
export let internationalizationService: InternationalizationServiceApi
export let userService: UserServiceApi
export let localFileService: LocalFileServiceApi
export let meetingService: MeetingServiceApi
export let modulePreloader: ModulePreloaderApi

export let Dialog: DialogApi

export let syncService: SyncServiceApi
export let historyManager: HistoryManagerApi
export let rvGlobalService: RvGlobalServiceApi

export let Anchor: FunctionComponent<AnchorProps>
export let DrawerLoading: FunctionComponent<SpanProps>
export let FileProgressBar: FunctionComponent<FileProgressBarProps>
export let FlexGrow: FunctionComponent<{value?: number}>
export let ProgressBar: FunctionComponent<ProgressBarProps>
export let UploadButtonAndList: FunctionComponent<UploadButtonAndListProps>
export let ScrollBar: FunctionComponent<ScrollBarProps>

export let AntCheckbox: FunctionComponent<AntCheckboxProps>
export let ThemeProvider: FunctionComponent<ThemeProviderProps>
export let AntColor: FunctionComponent<AntColorProps>
export let AntNumber: FunctionComponent<AntNumberProps>
export let AntSelect: FunctionComponent<AntSelectProps>
export let AntSwitch: FunctionComponent<AntSwitchProps>

export let RsdButton: FunctionComponent<RsdButtonProps>
export let RsdSelectableButton: FunctionComponent<RsdSelectableButtonProps>
export let RsdCheckbox: FunctionComponent<RsdCheckboxProps>
export let RsdColor: FunctionComponent<RsdColorProps>
export let RsdSelect: FunctionComponent<RsdSelectProps>
export let RsdFileSelect: FunctionComponent<RsdFileSelectProps>
export let RsdFileSelectButton: FunctionComponent<RsdFileSelectProps>
export let RsdInput: FunctionComponent<RsdInputProps>
export let RsdMentions: FunctionComponent<RsdMentionsProps>
export let RsdNone: FunctionComponent<RsdNoneProps>
export let RsdNumber: FunctionComponent<RsdNumberProps>
export let RsdNumberList: FunctionComponent<RsdNumberListProps>
export let RsdSwitch: FunctionComponent<RsdSwitchProps>
export let RsdTextarea: FunctionComponent<RsdInputProps>
export let RsdTitle: FunctionComponent<RsdTitleProps>

export let rss: { [key: string]: string }
export let rsbStyles: { [key: string]: string }


export function loadApi() {
  const api = (window as any).ofpConnector.getOfpApi() as OfpApi

  spaceService = api.services.main.spaceService
  statusService = api.services.main.statusService
  localFileService = api.services.main.localFileService
  internationalizationService = api.services.main.internationalizationService
  meetingService = api.services.main.meetingService
  pluginService = api.services.main.pluginService
  userService = api.services.main.userService
  modulePreloader = api.services.main.modulePreloader

  Dialog = api.services.view.Dialog

  syncService = api.services.sync.syncService
  historyManager = api.services.sync.historyManager
  rvGlobalService = api.services.sync.rvGlobalService

  rss = api.styles.rss
  rsbStyles = api.styles.rsbStyles

  Anchor = api.components.normal.Anchor
  DrawerLoading = api.components.normal.DrawerLoading
  FileProgressBar = api.components.normal.FileProgressBar
  FlexGrow = api.components.normal.FlexGrow
  ProgressBar = api.components.normal.ProgressBar
  UploadButtonAndList = api.components.normal.UploadButtonAndList
  ScrollBar = api.components.normal.ScrollBar

  ThemeProvider = api.components.ant.ThemeProvider
  AntCheckbox = api.components.ant.AntCheckbox
  AntNumber = api.components.ant.AntNumber
  AntColor = api.components.ant.AntColor
  AntSelect = api.components.ant.AntSelect
  AntSwitch = api.components.ant.AntSwitch

  RsdButton = api.components.rsd.RsdButton
  RsdSelectableButton = api.components.rsd.RsdSelectableButton
  RsdCheckbox = api.components.rsd.RsdCheckbox
  RsdColor = api.components.rsd.RsdColor
  RsdSelect = api.components.rsd.RsdSelect
  RsdFileSelect = api.components.rsd.RsdFileSelect
  RsdFileSelectButton = api.components.rsd.RsdFileSelectButton
  RsdInput = api.components.rsd.RsdInput
  RsdMentions = api.components.rsd.RsdMentions
  RsdNone = api.components.rsd.RsdNone
  RsdNumber = api.components.rsd.RsdNumber
  RsdNumberList = api.components.rsd.RsdNumberList
  RsdSwitch = api.components.rsd.RsdSwitch
  RsdTextarea = api.components.rsd.RsdTextarea
  RsdTitle = api.components.rsd.RsdTitle
}
