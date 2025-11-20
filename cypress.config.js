const { defineConfig } = require('cypress')

const defaultBaseUrl = 'http://localhost:3000';

function generateReportFilename() {
  const baseUrl = process.env.CYPRESS_BASE_URL || defaultBaseUrl
  
  // 提取主機名
  const hostname = new URL(baseUrl).hostname
  
  // 將點號替換為短橫線
  const safeHostname = hostname.replace(/\./g, '-')
  
  // 產生台北時間的時間戳記 (UTC+8)
  const date = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find(p => p.type === 'year').value;
  const month = parts.find(p => p.type === 'month').value;
  const day = parts.find(p => p.type === 'day').value;
  const hour = parts.find(p => p.type === 'hour').value;
  const minute = parts.find(p => p.type === 'minute').value;
  // const second = parts.find(p => p.type === 'second').value;
  const timestamp = `${year}-${month}-${day}_${hour}-${minute}`;
  
  return `accessibility-report-${safeHostname}-${timestamp}`
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

      // cy.task() 後端命令
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        // 讀取並合併 JSON 檔案
        readAndMergeJson({ page = '', filePath, newData }) {
          const fs = require('fs');
          const path = require('path');
          
          const fullPath = path.join(process.cwd(), filePath);
          
          try {
            // 嘗試讀取現有檔案
            let existingData = {};
            
            if (fs.existsSync(fullPath)) {
              const fileContent = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
              
              // 如果現有資料是陣列，轉換成按 page 分組的物件
              if (Array.isArray(fileContent)) {
                fileContent.forEach(item => {
                  const itemPage = item.page || '';
                  if (!existingData[itemPage]) {
                    existingData[itemPage] = [];
                  }
                  existingData[itemPage].push(item);
                });
              } else if (typeof fileContent === 'object' && fileContent !== null) {
                // 如果已經是物件格式，直接使用
                existingData = fileContent;
              }
            }
            
            // 將新資料按照 page 分組
            if (Array.isArray(newData) && newData.length > 0) {
              newData.forEach(item => {
                const itemPage = item.page || '';
                if (!existingData[itemPage]) {
                  existingData[itemPage] = [];
                }
                existingData[itemPage].push(item);
              });
            }
            
            return existingData;
          } catch (error) {
            // 讀取失敗，將新資料轉換成按 page 分組的物件
            console.error('讀取檔案失敗:', error);
            
            const result = {};
            if (Array.isArray(newData) && newData.length > 0) {
              newData.forEach(item => {
                const itemPage = item.page || '';
                if (!result[itemPage]) {
                  result[itemPage] = [];
                }
                result[itemPage].push(item);
              });
            }
            
            return result;
          }
        }
      })
    },
    video: false,
    // experimentalPromptCommand: true
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
    json: true,
    reportFilename: generateReportFilename(),
    showPassed: true,
    showSkipped: true,
    showFailed: true,
    code: false,
    addContext: true,
    saveJson: true,
    saveHtml: true,
    includeAssets: true,
    debug: true,
    timestamp: false
  },
})