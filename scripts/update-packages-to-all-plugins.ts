import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置项
const COMMIT_MESSAGE = 'chore: update package version'
const pluginsPath = path.resolve(__dirname, '../../')
const pluginProjectPrefix = 'nfp-'
const currentPath = path.resolve(__dirname, '../')

interface PackageJson {
  name: string
  version: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

interface PackageVersions {
  [packageName: string]: string
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

// 读取当前项目的包版本
function readCurrentPackageVersions(packageNames: string[]): PackageVersions {
  const packageJsonPath = path.join(currentPath, 'package.json')
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

  fs.readdirSync(pluginsPath).forEach(file => {
    const fullPath = path.join(pluginsPath, file)
    if (
      fs.statSync(fullPath).isDirectory() &&
      file.startsWith(pluginProjectPrefix) &&
      fullPath !== currentPath
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
  console.log('[INFO] Package Update Tool for All Plugins\n')

  // 询问用户输入包名
  const input = await askQuestion(
    'Enter package names (space-separated, leave empty for all packages): '
  )
  const packageNames = input
    .trim()
    .split(/\s+/)
    .filter(name => name.length > 0)

  console.log(
    `\n[INFO] Target packages: ${packageNames.length === 0 ? 'ALL' : packageNames.join(', ')}\n`
  )

  // 读取目标版本
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

  console.log(`[INFO] Commit message: ${COMMIT_MESSAGE}\n`)

  // 获取所有插件项目
  const pluginsList = getPluginProjects()
  console.log(`[INFO] Found ${pluginsList.length} plugin projects\n`)

  const pluginsNeedUpdate: Array<{ path: string; version: string }> = []

  // 检查每个插件
  for (const pluginPath of pluginsList) {
    console.log(`\n[INFO] Checking ${path.basename(pluginPath)}...`)

    const needsUpdate = checkAndUpdatePlugin(pluginPath, targetVersions)

    if (needsUpdate) {
      // 读取更新后的版本
      const packageJsonPath = path.join(pluginPath, 'package.json')
      const packageJson: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
      pluginsNeedUpdate.push({ path: pluginPath, version: packageJson.version })
      console.log(`[SUCCESS] ${path.basename(pluginPath)} marked for update`)
    } else {
      console.log(`[INFO] ${path.basename(pluginPath)} is up to date`)
    }
  }

  if (pluginsNeedUpdate.length === 0) {
    console.log('\n[INFO] All plugins are up to date. No updates needed.')
    return
  }

  console.log(`\n[INFO] ${pluginsNeedUpdate.length} plugins need updates\n`)

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
      gitCommitAndTag(pluginPath, COMMIT_MESSAGE, version)

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
