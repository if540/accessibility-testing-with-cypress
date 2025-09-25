const { defineConfig } = require('cypress')

const defaultBaseUrl = 'http://localhost:3000';

function generateReportFilename() {
  const baseUrl = process.env.CYPRESS_BASE_URL || defaultBaseUrl
  
  // 提取主機名
  const hostname = new URL(baseUrl).hostname
  
  // 將點號替換為短橫線
  const safeHostname = hostname.replace(/\./g, '-')
  
  // 加入時間戳記
  // const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  
  return `accessibility-report-${safeHostname}`
}

function generateScreenshotsDir() {
  const baseUrl = process.env.CYPRESS_BASE_URL || defaultBaseUrl
  
  // 提取主機名
  const hostname = new URL(baseUrl).hostname
  
  // 將點號替換為短橫線
  const safeHostname = hostname.replace(/\./g, '-')
  
  // screenshots 只用來暫存用，並非報告依存
  // 報告裡會直接採用 base64 格式嵌入
  return `cypress/screenshots/${safeHostname}`
}

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || defaultBaseUrl,
    screenshotsFolder: generateScreenshotsDir(),
    setupNodeEvents(on, config) {
      // 只在需要時載入 mochawesome 報告器
      if (config.reporter === 'cypress-mochawesome-reporter') {
        require('cypress-mochawesome-reporter/plugin')(on);
      }

      on('task', {
        log(message) {
          console.log(message)
          return null
        }
      })
    },
    video: false,
  },
  // 條件式報告器設定
  reporter: process.env.CYPRESS_REPORTER || 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Accessibility Testing Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: true,
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: false,
    reportFilename: generateReportFilename(),
    showPassed: true,
    showSkipped: true,
    showFailed: true,
    code: false,
    addContext: true,
    saveJson: false,
    saveHtml: true,
    includeAssets: true,
    debug: true,
    timestamp: 'yyyy-mm-dd_HH-MM-ss'
  },
})