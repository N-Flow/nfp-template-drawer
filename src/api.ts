import {
  NfpApi,
  SpaceServiceApi,
  AntCheckboxProps,
  AntColorProps,
  AntNumberProps,
  AntSelectProps,
  AntSwitchProps,
  RsdButtonProps,
  RsdCheckboxProps,
  RsdColorProps,
  RsdSelectProps,
  RsdFileSelectProps,
  RsdInputProps,
  RsdMentionsProps,
  RsdNoneProps,
  RsdNumberProps,
  RsdNumberListProps,
  RsdSwitchProps,
  RsdTitleProps,
  RsdCheckableButtonProps,
  SpanProps,
  AnchorProps,
  FileProgressBarProps,
  ProgressBarProps,
  UploadButtonAndListProps,
  ScrollBarProps,
  StatusServiceApi,
  LocalDataServiceApi,
  InternationalizationServiceApi,
  MeetingServiceApi,
  PluginServiceApi,
  UserServiceApi,
  ThemeProviderProps,
  ModulePreloaderApi,
  SyncServiceApi,
  RvGlobalServiceApi,
  HistoryServiceApi,
  MessageServiceApi,
  OssUploadServiceApi,
  ResourceServiceApi,
  DialogServiceApi,
  RvStepServiceApi,
  RvFileServiceApi,
  TStepServiceApi,
  UseTStep,
  UseTAttributes,
  UseStepOptions,
  DialogProps,
  AntEmptyProps,
  MaterialSymbolProps,
  MainPortalProps,
  FlexGrowProps,
  FirstLoadServiceApi,
  NativeEventServiceApi,
  RvResourceServiceApi,
  TAttributesServiceApi,
  RsSelectionServiceApi,
  RvLocationAttributeApi,
  RvAttributesServiceApi,
  RvLabelAttributeApi,
  RvLoopAttributeApi,
  FirstLoadModelServiceApi,
  CameraConfigurationAnimationApi,
  CameraLocationAnimationApi,
  FogAnimationApi,
  GroundAnimationApi,
  LightAnimationApi,
  ShadowAnimationApi,
  SkyboxAnimationApi,
  RsNodeServiceApi,
  RsModelServiceApi,
  RsEnvironmentServiceApi,
  UseBase,
  EasyPropertyAnimationApi,
  RsServiceApi,
  RvModelServiceApi,
  MaterialSymbolOptions,
  RvNativeAttributeApi,
  RvCodeAttributeApi,
  RvMaterialAttributeApi,
  ThemeServiceApi,
  ResourcePreviewProps,
  RsSeparateServiceApi,
  RsAudioServiceApi,
  RsTextureServiceApi,
  PluginContainerServiceApi,
  SceneServiceApi,
  RsLoopAnimationManagerApi,
  RsEnvironmentApi,
  RsTransformGroundApi,
  RsClickApi,
  RsLabelServiceApi,
  RsNodeMaterialManagerApi,
  RsMaterialServiceApi,
  RvNodeMaterialAnalyzerApi,
} from 'next-flow-interface'

import type { FunctionComponent } from 'react'

export let rvLocationAttribute: RvLocationAttributeApi
export let rvLabelAttribute: RvLabelAttributeApi
export let rvLoopAttribute: RvLoopAttributeApi
export let rvNativeAttribute: RvNativeAttributeApi
export let rvCodeAttribute: RvCodeAttributeApi
export let rvMaterialAttribute: RvMaterialAttributeApi

export let spaceService: SpaceServiceApi
export let statusService: StatusServiceApi
export let pluginService: PluginServiceApi
export let themeService: ThemeServiceApi

export let internationalizationService: InternationalizationServiceApi
export let userService: UserServiceApi
export let meetingService: MeetingServiceApi
export let modulePreloader: ModulePreloaderApi
export let messageService: MessageServiceApi
export let localDataService: LocalDataServiceApi
export let ossUploadService: OssUploadServiceApi
export let resourceService: ResourceServiceApi
export let firstLoadService: FirstLoadServiceApi
export let dialogService: DialogServiceApi
export let nativeEventService: NativeEventServiceApi
export let firstLoadModelService: FirstLoadModelServiceApi
export let pluginContainerService: PluginContainerServiceApi
export let sceneService: SceneServiceApi

export let cameraConfigurationAnimation: CameraConfigurationAnimationApi
export let cameraLocationAnimation: CameraLocationAnimationApi
export let fogAnimation: FogAnimationApi
export let groundAnimation: GroundAnimationApi
export let lightAnimation: LightAnimationApi
export let shadowAnimation: ShadowAnimationApi
export let skyboxAnimation: SkyboxAnimationApi

export let easyPropertyAnimation: EasyPropertyAnimationApi
export let rsLoopAnimationManager: RsLoopAnimationManagerApi

export let rsAudioService: RsAudioServiceApi

export let rsSelectionService: RsSelectionServiceApi

export let rsNodeService: RsNodeServiceApi
export let rsModelService: RsModelServiceApi
export let rsEnvironment: RsEnvironmentApi
export let rsEnvironmentService: RsEnvironmentServiceApi
export let rsTextureService: RsTextureServiceApi
export let rsTransformGround: RsTransformGroundApi
export let rsClick: RsClickApi
export let rsLabelService: RsLabelServiceApi
export let rsNodeMaterialManager: RsNodeMaterialManagerApi
export let rsMaterialService: RsMaterialServiceApi
export let rsSeparateService: RsSeparateServiceApi

export let rsService: RsServiceApi

export let syncService: SyncServiceApi
export let historyService: HistoryServiceApi

export let rvGlobalService: RvGlobalServiceApi
export let rvStepService: RvStepServiceApi
export let rvFileService: RvFileServiceApi
export let rvResourceService: RvResourceServiceApi
export let rvModelService: RvModelServiceApi
export let rvAttributesService: RvAttributesServiceApi
export let rvNodeMaterialAnalyzer: RvNodeMaterialAnalyzerApi

export let tStepService: TStepServiceApi
export let tAttributesService: TAttributesServiceApi

export let useBase: UseBase
export let useTStep: UseTStep
export let useTAttributes: UseTAttributes
export let useStepOptions: UseStepOptions

export let ThemeProvider: FunctionComponent<ThemeProviderProps>
export let AntCheckbox: FunctionComponent<AntCheckboxProps>
export let AntColor: FunctionComponent<AntColorProps>
export let AntNumber: FunctionComponent<AntNumberProps>
export let AntSelect: FunctionComponent<AntSelectProps<unknown>>
export let AntSwitch: FunctionComponent<AntSwitchProps>
export let AntEmpty: FunctionComponent<AntEmptyProps>

export let Anchor: FunctionComponent<AnchorProps>
export let DrawerLoading: FunctionComponent<SpanProps>
export let FileProgressBar: FunctionComponent<FileProgressBarProps>
export let ProgressBar: FunctionComponent<ProgressBarProps>
export let UploadButtonAndList: FunctionComponent<UploadButtonAndListProps>
export let ScrollBar: FunctionComponent<ScrollBarProps>
export let Dialog: FunctionComponent<DialogProps>
export let MaterialSymbol: FunctionComponent<MaterialSymbolProps>
export let ResourcePreview: FunctionComponent<ResourcePreviewProps>

export let RsdButton: FunctionComponent<RsdButtonProps>
export let RsdCheckableButton: FunctionComponent<RsdCheckableButtonProps>
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

export let FlexGrow: FunctionComponent<FlexGrowProps>
export let MainPortal: FunctionComponent<MainPortalProps>

export let rss: Record<string, string>

export let materialSymbol: (icon: string, options?: MaterialSymbolOptions) => FunctionComponent<any>
export let sleep: (time: number) => Promise<void>

export function loadApi() {
  const api = (window as any).nfpConnector.getNfpApi() as NfpApi

  rvLocationAttribute = api.services.attributes.rvLocationAttribute
  rvLabelAttribute = api.services.attributes.rvLabelAttribute
  rvLoopAttribute = api.services.attributes.rvLoopAttribute
  rvNativeAttribute = api.services.attributes.rvNativeAttribute
  rvCodeAttribute = api.services.attributes.rvCodeAttribute
  rvMaterialAttribute = api.services.attributes.rvMaterialAttribute

  spaceService = api.services.main.spaceService
  statusService = api.services.main.statusService
  pluginService = api.services.main.pluginService
  themeService = api.services.main.themeService

  internationalizationService = api.services.main.internationalizationService
  meetingService = api.services.main.meetingService
  userService = api.services.main.userService
  modulePreloader = api.services.main.modulePreloader
  messageService = api.services.main.messageService
  localDataService = api.services.main.localDataService
  ossUploadService = api.services.main.ossUploadService
  resourceService = api.services.main.resourceService
  firstLoadService = api.services.main.firstLoadService
  dialogService = api.services.main.dialogService
  nativeEventService = api.services.main.nativeEventService
  firstLoadModelService = api.services.main.firstLoadModelService
  pluginContainerService = api.services.main.pluginContainerService
  sceneService = api.services.main.sceneService

  cameraConfigurationAnimation = api.services.engine.animation.cameraConfigurationAnimation
  cameraLocationAnimation = api.services.engine.animation.cameraLocationAnimation
  fogAnimation = api.services.engine.animation.fogAnimation
  groundAnimation = api.services.engine.animation.groundAnimation
  lightAnimation = api.services.engine.animation.lightAnimation
  shadowAnimation = api.services.engine.animation.shadowAnimation
  skyboxAnimation = api.services.engine.animation.skyboxAnimation

  easyPropertyAnimation = api.services.engine.animation.easyPropertyAnimation
  rsLoopAnimationManager = api.services.engine.animation.rsLoopAnimationManager

  rsSelectionService = api.services.engine.operate.rsSelectionService

  rsAudioService = api.services.engine.audio.rsAudioService

  rsSelectionService = api.services.engine.operate.rsSelectionService

  rsNodeService = api.services.engine.render.rsNodeService
  rsModelService = api.services.engine.render.rsModelService
  rsEnvironment = api.services.engine.render.rsEnvironment
  rsEnvironmentService = api.services.engine.render.rsEnvironmentService
  rsTextureService = api.services.engine.render.rsTextureService
  rsTransformGround = api.services.engine.render.rsTransformGround
  rsClick = api.services.engine.render.rsClick
  rsLabelService = api.services.engine.render.rsLabelService
  rsNodeMaterialManager = api.services.engine.render.rsNodeMaterialManager
  rsMaterialService = api.services.engine.render.rsMaterialService
  rsSeparateService = api.services.engine.render.rsSeparateService

  rsService = api.services.engine.rsService

  syncService = api.services.sync.syncService
  historyService = api.services.sync.historyService
  rvGlobalService = api.services.sync.rvGlobalService
  rvStepService = api.services.sync.rvStepService
  rvFileService = api.services.sync.rvFileService
  rvResourceService = api.services.sync.rvResourceService
  rvModelService = api.services.sync.rvModelService
  rvAttributesService = api.services.sync.rvAttributesService
  rvNodeMaterialAnalyzer = api.services.sync.rvNodeMaterialAnalyzer

  tStepService = api.services.target.tStepService
  tAttributesService = api.services.target.tAttributesService

  useBase = api.hooks.useBase
  useTStep = api.hooks.useTStep
  useTAttributes = api.hooks.useTAttributes
  useStepOptions = api.hooks.useStepOptions

  ThemeProvider = api.components.ant.ThemeProvider
  AntCheckbox = api.components.ant.AntCheckbox
  AntNumber = api.components.ant.AntNumber
  AntColor = api.components.ant.AntColor
  AntSelect = api.components.ant.AntSelect
  AntSwitch = api.components.ant.AntSwitch
  AntEmpty = api.components.ant.AntEmpty

  Anchor = api.components.normal.Anchor
  DrawerLoading = api.components.normal.DrawerLoading
  FileProgressBar = api.components.normal.FileProgressBar
  ProgressBar = api.components.normal.ProgressBar
  UploadButtonAndList = api.components.normal.UploadButtonAndList
  ScrollBar = api.components.normal.ScrollBar
  Dialog = api.components.normal.Dialog
  MaterialSymbol = api.components.normal.MaterialSymbol
  ResourcePreview = api.components.normal.ResourcePreview

  RsdButton = api.components.rsd.RsdButton
  RsdCheckableButton = api.components.rsd.RsdCheckableButton
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

  FlexGrow = api.components.dev.FlexGrow
  MainPortal = api.components.dev.MainPortal

  rss = api.styles.rss

  materialSymbol = api.utils.materialSymbol
  sleep = api.utils.sleep
}
