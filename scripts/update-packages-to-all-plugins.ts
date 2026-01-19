import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import readline from 'readline'

// 配置项
const COMMIT_MESSAGE = 'chore: update package version'
const PROJECT_PATH = process.cwd()
const PLUGINS_PATH = path.resolve(PROJECT_PATH, '../')
const PLUGIN_PROJECT_PREFIX = 'nfp-'

interface PackageJson {
  name: string
  version: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

interface PackageVersions {
  [packageName: string]: string
}

interface PackageInfo {
  version: string
  type: 'dependencies' | 'devDependencies'
}

// 创建readline接口用于用户输入
function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise(resolve =>
    rl.question(query, ans => {
      rl.close()
      resolve(ans)
    })
  )
}

// 读取当前项目的包版本（带依赖类型信息）
function readCurrentPackageInfo(packageNames: string[]): Record<string, PackageInfo> {
  const packageJsonPath = path.join(PROJECT_PATH, 'package.json')
  const packageJson: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  const packageInfos: Record<string, PackageInfo> = {}

  if (packageNames.length === 0) {
    // 读取所有包
    if (packageJson.dependencies) {
      Object.entries(packageJson.dependencies).forEach(([name, version]) => {
        packageInfos[name] = { version, type: 'dependencies' }
      })
    }
    if (packageJson.devDependencies) {
      Object.entries(packageJson.devDependencies).forEach(([name, version]) => {
        packageInfos[name] = { version, type: 'devDependencies' }
      })
    }
  } else {
    // 只读取指定的包
    packageNames.forEach(name => {
      if (packageJson.dependencies?.[name]) {
        packageInfos[name] = {
          version: packageJson.dependencies[name],
          type: 'dependencies',
        }
      } else if (packageJson.devDependencies?.[name]) {
        packageInfos[name] = {
          version: packageJson.devDependencies[name],
          type: 'devDependencies',
        }
      } else {
        console.warn(`[WARNING] Package "${name}" not found in current project`)
      }
    })
  }

  return packageInfos
}

// 读取当前项目的包版本
function readCurrentPackageVersions(packageNames: string[]): PackageVersions {
  const packageJsonPath = path.join(PROJECT_PATH, 'package.json')
  const packageJson: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  const versions: PackageVersions = {}

  if (packageNames.length === 0) {
    // 读取所有包
    if (packageJson.dependencies) {
      Object.entries(packageJson.dependencies).forEach(([name, version]) => {
        versions[name] = version
      })
    }
    if (packageJson.devDependencies) {
      Object.entries(packageJson.devDependencies).forEach(([name, version]) => {
        versions[name] = version
      })
    }
  } else {
    // 只读取指定的包
    packageNames.forEach(name => {
      const version =
        packageJson.dependencies?.[name] || packageJson.devDependencies?.[name]
      if (version) {
        versions[name] = version
      } else {
        console.warn(`[WARNING] Package "${name}" not found in current project`)
      }
    })
  }

  return versions
}

// 获取所有插件项目路径
function getPluginProjects(): string[] {
  const pluginsList: string[] = []

  fs.readdirSync(PLUGINS_PATH).forEach(file => {
    const fullPath = path.join(PLUGINS_PATH, file)
    if (
      fs.statSync(fullPath).isDirectory() &&
      file.startsWith(PLUGIN_PROJECT_PREFIX) &&
      fullPath !== PROJECT_PATH
    ) {
      pluginsList.push(fullPath)
    }
  })

  return pluginsList
}

// 检查并更新插件的package.json
function checkAndUpdatePlugin(
  pluginPath: string,
  targetVersions: PackageVersions
): boolean {
  const packageJsonPath = path.join(pluginPath, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    console.warn(`[WARNING] package.json not found in ${pluginPath}`)
    return false
  }

  const packageJson: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  let hasChanges = false
  const updates: string[] = []

  // 检查dependencies
  if (packageJson.dependencies) {
    Object.keys(targetVersions).forEach(packageName => {
      if (
        packageJson.dependencies![packageName] &&
        packageJson.dependencies![packageName] !== targetVersions[packageName]
      ) {
        updates.push(
          `  ${packageName}: ${packageJson.dependencies![packageName]} -> ${targetVersions[packageName]}`
        )
        packageJson.dependencies![packageName] = targetVersions[packageName]
        hasChanges = true
      }
    })
  }

  // 检查devDependencies
  if (packageJson.devDependencies) {
    Object.keys(targetVersions).forEach(packageName => {
      if (
        packageJson.devDependencies![packageName] &&
        packageJson.devDependencies![packageName] !== targetVersions[packageName]
      ) {
        updates.push(
          `  ${packageName}: ${packageJson.devDependencies![packageName]} -> ${targetVersions[packageName]}`
        )
        packageJson.devDependencies![packageName] = targetVersions[packageName]
        hasChanges = true
      }
    })
  }

  if (hasChanges) {
    console.log(`[INFO] Updates for ${path.basename(pluginPath)}:`)
    updates.forEach(update => console.log(update))

    // 更新版本号
    const currentVersion = packageJson.version
    const newVersion = incrementVersion(currentVersion)
    packageJson.version = newVersion
    console.log(`[INFO] Version: ${currentVersion} -> ${newVersion}`)

    // 写入package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')

    return true
  }

  return false
}

// 检查并添加插件缺失的包
function checkAndAddPackages(
  pluginPath: string,
  targetPackages: Record<string, PackageInfo>
): boolean {
  const packageJsonPath = path.join(pluginPath, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    console.warn(`[WARNING] package.json not found in ${pluginPath}`)
    return false
  }

  const packageJson: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  let hasChanges = false
  const additions: string[] = []

  // 检查每个目标包
  Object.entries(targetPackages).forEach(([packageName, info]) => {
    const existsInDeps = packageJson.dependencies?.[packageName]
    const existsInDevDeps = packageJson.devDependencies?.[packageName]

    // 如果包不存在于目标项目中，则添加到对应的依赖类型
    if (!existsInDeps && !existsInDevDeps) {
      if (info.type === 'dependencies') {
        if (!packageJson.dependencies) {
          packageJson.dependencies = {}
        }
        packageJson.dependencies[packageName] = info.version
        additions.push(`  ${packageName}: ${info.version} (to dependencies)`)
      } else {
        if (!packageJson.devDependencies) {
          packageJson.devDependencies = {}
        }
        packageJson.devDependencies[packageName] = info.version
        additions.push(`  ${packageName}: ${info.version} (to devDependencies)`)
      }
      hasChanges = true
    }
  })

  if (hasChanges) {
    console.log(`[INFO] Additions for ${path.basename(pluginPath)}:`)
    additions.forEach(addition => console.log(addition))

    // 更新版本号
    const currentVersion = packageJson.version
    const newVersion = incrementVersion(currentVersion)
    packageJson.version = newVersion
    console.log(`[INFO] Version: ${currentVersion} -> ${newVersion}`)

    // 写入package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')

    return true
  }

  return false
}

// 检查并删除插件的指定包
function checkAndRemovePackages(pluginPath: string, packageNames: string[]): boolean {
  const packageJsonPath = path.join(pluginPath, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    console.warn(`[WARNING] package.json not found in ${pluginPath}`)
    return false
  }

  const packageJson: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  let hasChanges = false
  const removals: string[] = []

  // 检查并删除dependencies中的包
  if (packageJson.dependencies) {
    packageNames.forEach(packageName => {
      if (packageJson.dependencies![packageName]) {
        removals.push(`  ${packageName} (from dependencies)`)
        delete packageJson.dependencies![packageName]
        hasChanges = true
      }
    })
  }

  // 检查并删除devDependencies中的包
  if (packageJson.devDependencies) {
    packageNames.forEach(packageName => {
      if (packageJson.devDependencies![packageName]) {
        removals.push(`  ${packageName} (from devDependencies)`)
        delete packageJson.devDependencies![packageName]
        hasChanges = true
      }
    })
  }

  if (hasChanges) {
    console.log(`[INFO] Removals for ${path.basename(pluginPath)}:`)
    removals.forEach(removal => console.log(removal))

    // 更新版本号
    const currentVersion = packageJson.version
    const newVersion = incrementVersion(currentVersion)
    packageJson.version = newVersion
    console.log(`[INFO] Version: ${currentVersion} -> ${newVersion}`)

    // 写入package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')

    return true
  }

  return false
}

// 版本号递增
function incrementVersion(version: string): string {
  const parts = version.split('.')
  const patch = parseInt(parts[2], 10) + 1
  return `${parts[0]}.${parts[1]}.${patch}`
}

// 删除bun.lock
function cleanupDependencies(pluginPath: string): void {
  const bunLockPath = path.join(pluginPath, 'bun.lock')
  const bunLockbPath = path.join(pluginPath, 'bun.lockb')

  if (fs.existsSync(bunLockPath)) {
    console.log(`[INFO] Removing bun.lock...`)
    fs.unlinkSync(bunLockPath)
  }

  if (fs.existsSync(bunLockbPath)) {
    console.log(`[INFO] Removing bun.lockb...`)
    fs.unlinkSync(bunLockbPath)
  }
}

// 执行bun install
function runBunInstall(pluginPath: string): void {
  try {
    console.log(`[INFO] Running bun install...`)
    execSync('bun install', { cwd: pluginPath, stdio: 'inherit' })
  } catch (error) {
    console.error(`[ERROR] Failed to run bun install in ${pluginPath}`)
    throw error
  }
}

// 创建Git tag
function createGitTag(pluginPath: string, version: string): void {
  try {
    console.log(`[INFO] Creating git tag v${version}...`)
    execSync(`git tag v${version}`, { cwd: pluginPath, stdio: 'inherit' })
  } catch (error) {
    console.error(`[ERROR] Failed to create git tag in ${pluginPath}`)
    throw error
  }
}

// Git提交和创建tag
function gitCommitAndTag(pluginPath: string, commitMessage: string, version: string): void {
  try {
    console.log(`[INFO] Git add...`)
    execSync('git add .', { cwd: pluginPath, stdio: 'inherit' })

    console.log(`[INFO] Git commit...`)
    execSync(`git commit -m "${commitMessage}"`, { cwd: pluginPath, stdio: 'inherit' })

    console.log(`[INFO] Creating tag...`)
    createGitTag(pluginPath, version)
  } catch (error) {
    console.error(`[ERROR] Git operations failed in ${pluginPath}`)
    throw error
  }
}

// Git推送
function gitPush(pluginPath: string): void {
  try {
    console.log(`[INFO] Git push...`)
    execSync('git push --follow-tags', { cwd: pluginPath, stdio: 'inherit' })
  } catch (error) {
    console.warn(`[WARNING] Git push failed for ${path.basename(pluginPath)}, skipping...`)
    if (error instanceof Error) {
      console.warn(error.message)
    }
  }
}

// 主函数
async function main() {
  console.log('[INFO] Package Management Tool for All Plugins\n')

  // 询问用户选择操作模式
  const mode = await askQuestion('Choose mode (update/add/remove): ')
  const modeType = mode.trim().toLowerCase()

  if (!['update', 'add', 'remove'].includes(modeType)) {
    console.error('[ERROR] Invalid mode. Please choose "update", "add", or "remove"')
    process.exit(1)
  }

  console.log(`\n[INFO] Mode: ${modeType.toUpperCase()}\n`)

  // 询问用户输入包名
  const input = await askQuestion(
    modeType === 'remove'
      ? 'Enter package names to remove (space-separated): '
      : modeType === 'add'
        ? 'Enter package names to add (space-separated, leave empty for all packages): '
        : 'Enter package names (space-separated, leave empty for all packages): '
  )
  const packageNames = input
    .trim()
    .split(/\s+/)
    .filter(name => name.length > 0)

  if (modeType === 'remove' && packageNames.length === 0) {
    console.error('[ERROR] Please specify at least one package name to remove')
    process.exit(1)
  }

  console.log(
    `\n[INFO] Target packages: ${packageNames.length === 0 ? 'ALL' : packageNames.join(', ')}\n`
  )

  let commitMessage = COMMIT_MESSAGE

  if (modeType === 'remove') {
    // 删除模式
    commitMessage = 'chore: remove packages'
    console.log('[INFO] Packages to remove:')
    packageNames.forEach(name => console.log(`  ${name}`))
    console.log('')
  } else if (modeType === 'add') {
    // 添加模式
    commitMessage = 'chore: add packages'
    const targetPackages = readCurrentPackageInfo(packageNames)

    if (Object.keys(targetPackages).length === 0) {
      console.error('[ERROR] No packages found to add')
      process.exit(1)
    }

    console.log('[INFO] Packages to add:')
    Object.entries(targetPackages).forEach(([name, info]) => {
      console.log(`  ${name}: ${info.version} (${info.type})`)
    })
    console.log('')
  } else {
    // 更新模式
    const targetVersions = readCurrentPackageVersions(packageNames)

    if (Object.keys(targetVersions).length === 0) {
      console.error('[ERROR] No packages found to update')
      process.exit(1)
    }

    console.log('[INFO] Target versions:')
    Object.entries(targetVersions).forEach(([name, version]) => {
      console.log(`  ${name}: ${version}`)
    })
    console.log('')
  }

  console.log(`[INFO] Commit message: ${commitMessage}\n`)

  // 获取所有插件项目
  const pluginsList = getPluginProjects()
  console.log(`[INFO] Found ${pluginsList.length} plugin projects\n`)

  const pluginsNeedUpdate: Array<{ path: string; version: string }> = []

  // 检查每个插件
  for (const pluginPath of pluginsList) {
    console.log(`\n[INFO] Checking ${path.basename(pluginPath)}...`)

    let needsUpdate = false

    if (modeType === 'remove') {
      needsUpdate = checkAndRemovePackages(pluginPath, packageNames)
    } else if (modeType === 'add') {
      const targetPackages = readCurrentPackageInfo(packageNames)
      needsUpdate = checkAndAddPackages(pluginPath, targetPackages)
    } else {
      const targetVersions = readCurrentPackageVersions(packageNames)
      needsUpdate = checkAndUpdatePlugin(pluginPath, targetVersions)
    }

    if (needsUpdate) {
      // 读取更新后的版本
      const packageJsonPath = path.join(pluginPath, 'package.json')
      const packageJson: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
      pluginsNeedUpdate.push({ path: pluginPath, version: packageJson.version })
      console.log(`[SUCCESS] ${path.basename(pluginPath)} marked for ${modeType === 'remove' ? 'removal' : modeType === 'add' ? 'addition' : 'update'}`)
    } else {
      console.log(`[INFO] ${path.basename(pluginPath)} ${modeType === 'remove' ? 'does not have these packages' : modeType === 'add' ? 'already has these packages' : 'is up to date'}`)
    }
  }

  if (pluginsNeedUpdate.length === 0) {
    console.log(`\n[INFO] No plugins need ${modeType === 'remove' ? 'package removal' : modeType === 'add' ? 'package addition' : 'updates'}.`)
    return
  }

  console.log(`\n[INFO] ${pluginsNeedUpdate.length} plugins need ${modeType === 'remove' ? 'package removal' : modeType === 'add' ? 'package addition' : 'updates'}\n`)

  const pluginsReadyToPush: string[] = []

  // 第一阶段：处理所有插件（更新、安装、提交）
  for (const { path: pluginPath, version } of pluginsNeedUpdate) {
    console.log(`\n[INFO] Processing ${path.basename(pluginPath)}...`)

    try {
      // 1. 删除bun.lock
      cleanupDependencies(pluginPath)

      // 2. 执行bun install
      runBunInstall(pluginPath)

      // 3. Git提交和创建tag
      gitCommitAndTag(pluginPath, commitMessage, version)

      pluginsReadyToPush.push(pluginPath)
      console.log(`[SUCCESS] ${path.basename(pluginPath)} prepared successfully`)
    } catch (error) {
      console.error(`[ERROR] Failed to process ${path.basename(pluginPath)}`)
      console.error(error)
      // 不退出，继续处理下一个插件
      console.log(`[INFO] Continuing with next plugin...\n`)
    }
  }

  // 第二阶段：推送所有准备好的插件
  if (pluginsReadyToPush.length > 0) {
    console.log(`\n[INFO] Starting push phase for ${pluginsReadyToPush.length} plugins...\n`)

    for (const pluginPath of pluginsReadyToPush) {
      console.log(`\n[INFO] Pushing ${path.basename(pluginPath)}...`)
      gitPush(pluginPath)
      console.log(`[SUCCESS] ${path.basename(pluginPath)} pushed successfully`)
    }
  }

  console.log('\n[SUCCESS] All plugins processed!')
}

main().catch(error => {
  console.error('[ERROR] Unexpected error:', error)
  process.exit(1)
})
