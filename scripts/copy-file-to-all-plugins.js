const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')


const GENERAL_FILE_LIST = [
  '.github/workflows/deploy.yml',
  'scripts/commit.js',
  'src/types/global.d.ts',
  'src/api.ts',
  'src/index.ts',
  '.gitignore',
  'LICENSE',
  'tsconfig.json',
  'tsconfig.production.json',
  'webpack.config.js',
  'webpack.production.config.js',
]

const COMMIT_MESSAGE = 'chore: sync files from nfp-template'


const pluginsPath = path.resolve(__dirname, '../../')
const currentPath = path.resolve(__dirname, '../')


const pluginsList = []
// 记录需要更新的插件
const pluginsNeedUpdate = []

fs.readdirSync(pluginsPath).forEach(file => {
  const fullPath = path.join(pluginsPath, file)
  if (fs.statSync(fullPath).isDirectory() && file.startsWith('nfp-') && fullPath !== currentPath) {
    pluginsList.push(fullPath)
  }
})

console.log('[INFO] Target Plugins:')
console.log(pluginsList)

console.log('\n[INFO] Starting file synchronization process...')
console.log(`[INFO] Source directory: ${currentPath}`)
console.log(`[INFO] Total files to sync: ${GENERAL_FILE_LIST.length}`)
console.log(`[INFO] Target plugins: ${pluginsList.length}\n`)

// 检查文件是否相同
function areFilesIdentical(sourceFile, targetFile) {
  if (!fs.existsSync(targetFile)) {
    return false
  }
  
  try {
    const sourceContent = fs.readFileSync(sourceFile)
    const targetContent = fs.readFileSync(targetFile)
    return Buffer.compare(sourceContent, targetContent) === 0
  } catch (error) {
    console.error(`[ERROR] Error comparing files ${sourceFile} and ${targetFile}: ${error.message}`)
    return false
  }
}

function copyFile(sourceFile, targetFile) {
  try {
    // 先检查文件是否相同
    if (areFilesIdentical(sourceFile, targetFile)) {
      console.log(`[INFO] Skipped: ${path.basename(sourceFile)} (identical)`)
      return false // 返回false表示未复制（文件相同）
    }
    
    const targetDir = path.dirname(targetFile)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
      console.log(`[INFO] Created directory structure: ${targetDir}`)
    }

    // Get file size for logging
    const stats = fs.statSync(sourceFile)
    const fileSizeKB = (stats.size / 1024).toFixed(2)

    fs.copyFileSync(sourceFile, targetFile)
    console.log(`[SUCCESS] Copied: ${path.basename(sourceFile)} (${fileSizeKB} KB) to ${targetFile}`)
    return true // 返回true表示已复制（文件不同）
  } catch (error) {
    console.error(`[ERROR] Failed to copy ${sourceFile} to ${targetFile}: ${error.message}`)
    return true // 出错时默认需要更新
  }
}

let pluginCounter = 0;
pluginsList.forEach(pluginPath => {
  pluginCounter++;
  console.log(`\n[INFO] Processing plugin ${pluginCounter}/${pluginsList.length}: ${path.basename(pluginPath)}`)
  
  let fileCounter = 0;
  let needUpdate = false;
  
  GENERAL_FILE_LIST.forEach(file => {
    fileCounter++;
    const sourceFile = path.join(currentPath, file)

    if (!fs.existsSync(sourceFile)) {
      console.warn(`[WARNING] Source file does not exist: ${sourceFile}`)
      return
    }

    console.log(`[INFO] Syncing file ${fileCounter}/${GENERAL_FILE_LIST.length}: ${file}`)
    const targetFile = path.join(pluginPath, file)
    const fileCopied = copyFile(sourceFile, targetFile)
    if (fileCopied) {
      needUpdate = true;
    }
  })
  
  if (needUpdate) {
    pluginsNeedUpdate.push(pluginPath);
    console.log(`[INFO] Plugin ${path.basename(pluginPath)} marked for update`);
  } else {
    console.log(`[INFO] Plugin ${path.basename(pluginPath)} has identical files, will be skipped for update`);
  }
})

console.log('\n[INFO] File synchronization completed successfully!')
console.log(`[INFO] Plugins requiring updates: ${pluginsNeedUpdate.length}/${pluginsList.length}`)


function getCurrentVersion(projectPath) {
  const packageJson = require(path.join(projectPath, 'package.json'))
  return packageJson.version
}

function incrementVersion(version) {
  const parts = version.split('.')
  const patch = parseInt(parts[2], 10) + 1
  return `${parts[0]}.${parts[1]}.${patch}`
}

function updateVersion(projectPath, newVersion) {
  const packageJsonPath = path.join(projectPath, 'package.json')
  const packageLockPath = path.join(projectPath, 'package-lock.json')

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  packageJson.version = newVersion
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

  if (fs.existsSync(packageLockPath)) {
    const packageLockJson = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'))
    packageLockJson.version = newVersion
    fs.writeFileSync(packageLockPath, JSON.stringify(packageLockJson, null, 2))
  }
}

function executeGitCommit(projectPath, commitMessage) {
  try {
    execSync('git add .', { cwd: projectPath, stdio: 'inherit' })
    execSync(`git commit -m "${commitMessage}"`, { cwd: projectPath, stdio: 'inherit' })
  } catch (error) {
    console.error(`Error executing commit command in ${projectPath}`)
    console.error(error)
    process.exit(1)
  }
}

function createGitTag(projectPath, version) {
  try {
    execSync(`git tag v${version}`, { cwd: projectPath, stdio: 'inherit' })
  } catch (error) {
    console.error(`Error creating git tag in ${projectPath}`)
    console.error(error)
    process.exit(1)
  }
}

function executeGitPush(projectPath) {
  try {
    execSync('git push --follow-tags', { cwd: projectPath, stdio: 'inherit' })
  } catch (error) {
    console.error(`Error executing push command in ${projectPath}`)
    console.error(error)
    process.exit(1)
  }
}

// 取消注释版本更新、提交和推送代码
if (pluginsNeedUpdate.length > 0) {
  pluginsNeedUpdate.forEach(pluginPath => {
    const currentVersion = getCurrentVersion(pluginPath)
    const newVersion = incrementVersion(currentVersion)
  
    console.log('\n\n[INFO] Committing:', path.basename(pluginPath))
    console.log(`[INFO] Incremented version: ${currentVersion} -> ${newVersion}`)
  
    updateVersion(pluginPath, newVersion)
  
    console.log('')
    executeGitCommit(pluginPath, COMMIT_MESSAGE)
    createGitTag(pluginPath, newVersion)
  })
  
  console.log('\n\n[SUCCESS] All updated plugins have been committed and tagged.')
  
  pluginsNeedUpdate.forEach(pluginPath => {
    console.log('\n\n[INFO] Pushing:', path.basename(pluginPath))
    executeGitPush(pluginPath)
  })
  
  console.log('\n\n[SUCCESS] All updated plugins have been pushed to the remote repository.')
} else {
  console.log('\n\n[INFO] No plugins need updates, skipping version increment and commit process.')
}


