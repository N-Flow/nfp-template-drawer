const path = require('path')
const fs = require('fs')


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

const pluginsPath = path.resolve(__dirname, '../../')
const currentPath = path.resolve(__dirname, '../')


const pluginsList = []

fs.readdirSync(pluginsPath).forEach(file => {
  const fullPath = path.join(pluginsPath, file)
  if (fs.statSync(fullPath).isDirectory() && file.startsWith('ofp-')) {
    pluginsList.push(fullPath)
  }
})

console.log('[INFO] Target Plugins:')
console.log(pluginsList)

console.log('\n[INFO] Starting file synchronization process...')
console.log(`[INFO] Source directory: ${currentPath}`)
console.log(`[INFO] Total files to sync: ${GENERAL_FILE_LIST.length}`)
console.log(`[INFO] Target plugins: ${pluginsList.length}\n`)

function copyFile(sourceFile, targetFile) {
  try {
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
  } catch (error) {
    console.error(`[ERROR] Failed to copy ${sourceFile} to ${targetFile}: ${error.message}`)
  }
}

let fileCounter = 0;
GENERAL_FILE_LIST.forEach(file => {
  fileCounter++;
  console.log(`\n[INFO] Processing file ${fileCounter}/${GENERAL_FILE_LIST.length}: ${file}`)
  const sourceFile = path.join(currentPath, file)

  if (!fs.existsSync(sourceFile)) {
    console.warn(`[WARNING] Source file does not exist: ${sourceFile}`)
    return
  }

  let pluginCounter = 0;
  pluginsList.forEach(pluginPath => {
    pluginCounter++;
    console.log(`[INFO] Syncing to plugin ${pluginCounter}/${pluginsList.length}: ${path.basename(pluginPath)}`)
    const targetFile = path.join(pluginPath, file)
    copyFile(sourceFile, targetFile)
  })
})

console.log('\n[INFO] File synchronization completed successfully!')

