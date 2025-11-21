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
  const timestamp = `${year}${month}${day}${hour}${minute}`;
  
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
          
          try {
            // 嘗試讀取現有檔案
            let existingData = {
              domainName: domainName,
              lastRun: lastRun,
              pages: {}
            };
            
            if (fs.existsSync(fullPath)) {
              const fileContent = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
              
              // 如果現有資料是陣列，轉換成按 page 分組的物件
              if (Array.isArray(fileContent)) {
                fileContent.forEach(item => {
                  const itemPage = item.page || '';
                  if (!existingData.pages[itemPage]) {
                    existingData.pages[itemPage] = [];
                  }
                  existingData.pages[itemPage].push(item);
                });
              } else if (typeof fileContent === 'object' && fileContent !== null) {
                // 如果已經是新格式（包含 domainName, lastRun, pages）
                if (fileContent.hasOwnProperty('pages')) {
                  // 保留 domainName 和 lastRun
                  if (fileContent.domainName) {
                    existingData.domainName = fileContent.domainName;
                  }
                  if (fileContent.lastRun) {
                    existingData.lastRun = fileContent.lastRun;
                  }
                  // 將 pages 內容合併
                  if (fileContent.pages && typeof fileContent.pages === 'object') {
                    existingData.pages = { ...fileContent.pages };
                  }
                  // 檢查是否有頁面鍵在根層級，需要移到 pages 中
                  Object.keys(fileContent).forEach(key => {
                    if (key !== 'domainName' && key !== 'lastRun' && key !== 'pages') {
                      // 這是一個頁面鍵，移到 pages 中
                      if (Array.isArray(fileContent[key])) {
                        existingData.pages[key] = fileContent[key];
                      }
                    }
                  });
                } else {
                  // 如果是舊格式（直接是頁面物件），轉換為新格式
                  existingData.pages = fileContent;
                }
              }
            }
            
            // 將新資料按照 page 分組
            if (Array.isArray(newData)) {
              if (newData.length > 0) {
                // 如果有 violations，合併到現有資料
                newData.forEach(item => {
                  const itemPage = item.page || '';
                  if (!existingData.pages[itemPage]) {
                    existingData.pages[itemPage] = [];
                  }
                  existingData.pages[itemPage].push(item);
                });
              } else {
                // 如果 newData 是空陣列，確保該頁面有記錄（空陣列）
                const itemPage = page || '';
                if (!existingData.pages.hasOwnProperty(itemPage)) {
                  existingData.pages[itemPage] = [];
                }
              }
            }
            
            // 確保目錄存在
            const dir = path.dirname(fullPath);
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }

            // 清理資料，確保只保留 domainName、lastRun 和 pages 三個屬性
            const cleanedData = {
              domainName: existingData.domainName || "",
              lastRun: existingData.lastRun || "",
              pages: existingData.pages || {}
            };
            
            // 寫入合併後的資料到目標檔案
            fs.writeFileSync(fullPath, JSON.stringify(cleanedData, null, 2), 'utf8');
            
            // 統計 impact 數量
            const impactCounts = {
              critical: 0,
              serious: 0,
              moderate: 0,
              minor: 0
            };
            
            // 遍歷所有頁面的 violations
            Object.keys(existingData.pages).forEach(pageKey => {
              const violations = existingData.pages[pageKey];
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
            
            // 從 filePath 提取報告路徑（相對於 cypress/reports）
            const reportRelativePath = filePath.replace(/^cypress\/reports\//, '');
            const reportUrl = `/${reportRelativePath}`;
            const reportId = reportUrl.replace(/^.*\//, '').replace(/\.json$/, '');
            
            // 查找或創建對應的域名記錄
            let domainEntry = dbData.find(entry => entry.domainName === domainName);
            if (!domainEntry) {
              domainEntry = {
                domainName: domainName,
                lastRun: lastRun,
                critical: 0,
                serious: 0,
                moderate: 0,
                minor: 0,
                reports: []
              };
              dbData.push(domainEntry);
            } else {
              domainEntry.lastRun = lastRun;
            }
            
            // 更新 impact 統計數量
            domainEntry.critical = impactCounts.critical;
            domainEntry.serious = impactCounts.serious;
            domainEntry.moderate = impactCounts.moderate;

            // 從報告檔案本身讀取統計，而不是使用累積的 impactCounts
            // 讀取報告檔案並統計該報告的 violations
            const reportCounts = {
              critical: 0,
              serious: 0,
              moderate: 0,
              minor: 0
            };
            
            if (fs.existsSync(fullPath)) {
              try {
                const reportData = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
                const reportPages = reportData.pages || (typeof reportData === 'object' && !Array.isArray(reportData) ? reportData : {});
                
                Object.keys(reportPages).forEach(pageKey => {
                  const violations = reportPages[pageKey];
                  if (Array.isArray(violations)) {
                    violations.forEach(violation => {
                      if (violation.impact) {
                        const impact = violation.impact.toLowerCase();
                        if (reportCounts.hasOwnProperty(impact)) {
                          reportCounts[impact]++;
                        }
                      }
                    });
                  }
                });
              } catch (error) {
                console.error('讀取報告檔案統計失敗:', error);
                // 如果讀取失敗，使用當前的 impactCounts 作為備用
                reportCounts.critical = impactCounts.critical;
                reportCounts.serious = impactCounts.serious;
                reportCounts.moderate = impactCounts.moderate;
                reportCounts.minor = impactCounts.minor;
              }
            }
            
            // 查找或更新報告記錄
            const existingReport = domainEntry.reports.find(report => report.filePath === reportUrl);
            if (existingReport) {
              // 如果報告已存在，更新統計數字
              existingReport.critical = reportCounts.critical;
              existingReport.serious = reportCounts.serious;
              existingReport.moderate = reportCounts.moderate;
              existingReport.minor = reportCounts.minor;
            } else {
              // 如果報告不存在，添加新記錄
              domainEntry.reports.push({
                id: reportId,
                critical: reportCounts.critical,
                serious: reportCounts.serious,
                moderate: reportCounts.moderate,
                minor: reportCounts.minor,
                filePath: reportUrl
              });
            }
            
            // 寫入更新後的 db.json
            fs.writeFileSync(dbJsonPath, JSON.stringify(dbData, null, 4), 'utf8');
            
            return existingData;
          } catch (error) {
            // 讀取失敗，將新資料轉換成新格式
            console.error('讀取檔案失敗:', error);
            
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
            const lastRun = `${year}-${month}-${day} ${hour}:${minute}:00`;
            
            const result = {
              domainName: domainName,
              lastRun: lastRun,
              pages: {}
            };
            
            if (Array.isArray(newData) && newData.length > 0) {
              newData.forEach(item => {
                const itemPage = item.page || '';
                if (!result.pages[itemPage]) {
                  result.pages[itemPage] = [];
                }
                result.pages[itemPage].push(item);
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