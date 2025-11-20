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
          const dbJsonPath = path.join(process.cwd(), 'public/data/db.json');
          
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
            
            // 確保目錄存在
            const dir = path.dirname(fullPath);
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            
            // 寫入合併後的資料到目標檔案
            fs.writeFileSync(fullPath, JSON.stringify(existingData, null, 2), 'utf8');
            
            // 統計 impact 數量
            const impactCounts = {
              critical: 0,
              serious: 0,
              moderate: 0,
              minor: 0
            };
            
            // 遍歷所有頁面的 violations
            Object.keys(existingData).forEach(pageKey => {
              const violations = existingData[pageKey];
              if (Array.isArray(violations)) {
                violations.forEach(violation => {
                  if (violation.impact) {
                    const impact = violation.impact.toLowerCase();
                    if (impactCounts.hasOwnProperty(impact)) {
                      impactCounts[impact]++;
                    }
                  }
                });
              }
            });
            
            // 更新 db.json
            let dbData = [];
            if (fs.existsSync(dbJsonPath)) {
              try {
                dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
              } catch (error) {
                console.error('讀取 db.json 失敗:', error);
                dbData = [];
              }
            }
            
            // 從 filePath 提取域名和時間戳
            const baseUrl = process.env.CYPRESS_BASE_URL || defaultBaseUrl;
            const hostname = new URL(baseUrl).hostname;
            const domainName = hostname;
            
            // 產生時間戳 (台北時間 UTC+8)
            const date = new Date();
            const formatter = new Intl.DateTimeFormat('en-US', {
              timeZone: 'Asia/Taipei',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
            const parts = formatter.formatToParts(date);
            const year = parts.find(p => p.type === 'year').value;
            const month = parts.find(p => p.type === 'month').value;
            const day = parts.find(p => p.type === 'day').value;
            const hour = parts.find(p => p.type === 'hour').value;
            const minute = parts.find(p => p.type === 'minute').value;
            const timestamp = `${year}-${month}-${day}_${hour}-${minute}`;
            const lastRun = `${year}-${month}-${day} ${hour}:${minute}:00`;
            
            // 從 filePath 提取報告路徑（相對於 cypress/reports）
            const reportRelativePath = filePath.replace(/^cypress\/reports\//, '');
            const reportUrl = `/${reportRelativePath}`;
            
            // 查找或創建對應的域名記錄
            let domainEntry = dbData.find(entry => entry.domainName === domainName);
            if (!domainEntry) {
              domainEntry = {
                domainName: domainName,
                lastRun: lastRun,
                critical: 0,
                serious: 0,
                moderate: 0,
                reportsUrl: []
              };
              dbData.push(domainEntry);
            } else {
              domainEntry.lastRun = lastRun;
            }
            
            // 更新 impact 統計數量
            domainEntry.critical = impactCounts.critical;
            domainEntry.serious = impactCounts.serious;
            domainEntry.moderate = impactCounts.moderate;
            
            // 添加報告 URL（如果不存在）
            if (!domainEntry.reportsUrl.includes(reportUrl)) {
              domainEntry.reportsUrl.push(reportUrl);
            }
            
            // 寫入更新後的 db.json
            fs.writeFileSync(dbJsonPath, JSON.stringify(dbData, null, 4), 'utf8');
            
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