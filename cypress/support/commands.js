// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("getWithMessage", (selector, message, options = {}) => {
  return cy
    .get(selector, options)
    .should("exist")
    .then(($el) => {
      if ($el.length === 0) {
        throw new Error(message || `❌ 找不到元素: ${selector}`);
      }
      return $el;
    });
});

// 添加自定義命令來記錄訪問的 URL
Cypress.Commands.add('visitWithLogging', (url) => {
  cy.visit(url).then(() => {
    cy.url().then((currentUrl) => {
      cy.logPageUrl(`🌐 測試頁面: ${currentUrl}`);
      cy.log(`正在測試頁面: ${currentUrl}`);
    });
  });
});

// 記錄頁面 URL 的自定義命令
Cypress.Commands.add('logPageUrl', (message) => {
  // 在 Cypress 測試運行器中顯示
  cy.log(message);
  
  // 將訊息記錄到 console，這樣會出現在報告中
  cy.task('log', message);
});

/**
 * 自定義命令：等待 jQuery AJAX 載入完成
 * 
 * @param {Object} options - 配置選項
 * @param {number} options.timeout - 超時時間（毫秒），預設 10000
 * @param {number} options.interval - 檢查間隔（毫秒），預設 300
 * @param {string} options.errorMsg - 錯誤訊息，預設 'jQuery ajax 載入逾時'
 * 
 * @example
 * // 使用預設參數
 * cy.waitForJQueryAjax()
 * 
 * // 自訂參數
 * cy.waitForJQueryAjax({
 *   timeout: 15000,
 *   interval: 500,
 *   errorMsg: '自訂錯誤訊息'
 * })
 */
Cypress.Commands.add('waitForJQueryAjax', (options = {}) => {
  const defaultOptions = {
    timeout: 10000,
    interval: 300,
    errorMsg: 'jQuery ajax 載入逾時'
  }
  
  const config = { ...defaultOptions, ...options }
  
  cy.window().then((win) => {
    if (win.$ && win.$.active !== undefined) {
      cy.log('等待 jQuery ajax 載入完成')
      cy.waitUntil(
        () => cy.window().then(w => w.$.active === 0),
        {
          timeout: config.timeout,
          interval: config.interval,
          errorMsg: config.errorMsg
        }
      )
    } else {
      cy.log('此頁面沒有 jQuery 或沒有 $.active 屬性，跳過等待')
    }
  })
})

/**
 * 自定義命令：在請求完成後執行
 * 
 * @param {string} page - 頁面 URL
 * @param {Object} response - 響應物件
 * @param {Function} onSuccess - 成功時的回調函數
 * 
 * @example
 * cy.afterRequest(page, response, (page, response) => {
 *   // 成功時的處理
 * })
 */
Cypress.Commands.add('afterRequest', (page, response, onSuccess) => {
  cy.addTestContext(`🔢 HTTP 狀態碼: ${response.status}`);
  if (response.status >= 200 && response.status < 400) {
    cy.visit(page, { failOnStatusCode: false, timeout: 10000 });
    cy.title().then(title => { cy.addTestContext(`📝 頁面標題: ${title}`); });
    
    // 添加頁面資訊到上下文
    cy.url().then(url => { cy.addTestContext(`🌐 實際 URL: ${decodeURI(url)}`); });
    
    cy.injectAxe();
    cy.configureAxeZh();
    cy.waitForJQueryAjax();
    
    // 添加頁面載入完成的時間戳
    // cy.addTestContext(`⏰ 頁面載入完成時間: ${new Date().toISOString()}`);
    
    onSuccess && onSuccess(page, response);
  } else {
    cy.addTestContext(`❌ 頁面狀態: 無效網址 (HTTP ${response.status})`);
    if (response.statusText) {
      cy.addTestContext(`📄 狀態描述: ${response.statusText}`);
    }
    // 使用 this.skip() 跳過測試
    // 注意：必須用 function(){} 形式的 it 才能用 this.skip()
    // 這裡 Cypress 會自動綁定正確的 this
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    return cy.then(function() { this.skip(); });
  }
});

Cypress.Commands.add('configureAxeZh', () => {
  cy.window({ log: false }).then((win) => {
    win.axe.configure({
      rules: [
        {
          id: 'no-generic-alt',
          selector: 'img',
          any: ['check-generic-alt'],
          enabled: true,
          metadata: {
            description: '圖片應具有有意義的替代文字，避免使用過於通用的詞彙如「圖」、「照片」、「image」等。替代文字應描述圖片的內容或功能，幫助視障使用者理解圖片的目的。',
            help: '為圖片提供有意義的替代文字',
            helpUrl: 'https://dequeuniversity.com/rules/axe/4.8/image-redundant-alt'
          }
        },
      ],
      checks: [
        {
          id: 'check-generic-alt',
          evaluate: function(node, options, virtualNode, context) {
            const alt = node.getAttribute('alt')?.trim();
            if (!alt) return true;
            // 更完整的通用 alt 文字清單，包含中英文及常見變體
            const disallowed = [
              'image', 'photo', 'picture', 'img', 'graphic', 'icon', 'logo',
              '圖', '圖片', '照片', '相片', '圖像', '圖標', '圖示', '圖案', '影像', '標誌', '標記', '圖形',
              'Image', 'Photo', 'Picture', 'Img', 'Graphic', 'Icon', 'Logo',
              '示意圖', '插圖', 'avatar', '頭像', 'profile', 'profile image', 'profile picture',
              '預設圖', '預設圖片', '預設照片', '預設相片', 'default', 'default image', 'default photo', 'default picture',
              'banner', '橫幅', '背景', 'background', 'cover', '封面', 'cover image', 'cover photo',
              'test', '測試', '範例', 'example', '範例圖', '範例圖片', '範例照片', '範例相片'
            ];
            const isGeneric = disallowed.includes(alt);
            
            if (isGeneric) {
              // 設定訊息數據，讓 fail 訊息可以使用
              this.data({ alt: alt });
            }
            return !isGeneric;
          },
          metadata: {
            impact: 'minor',
            messages: {
              pass: 'alt text is meaningful',
              // eslint-disable-next-line no-template-curly-in-string
              fail: 'alt text 過於通用: "${data.alt}"'
            },
          },
        },
      ],
    });
  });
});

/**
 * 自定義命令：顯示無障礙問題詳細資訊
 * @param {Array} violations - 無障礙問題陣列
 * @example
 * cy.checkA11yViolationsDetails(violations);
 */
Cypress.Commands.add('checkA11yViolationsDetails', (violations, testName) => {
  if (violations.length > 0) {

    cy.addTestContext(`🚨 發現 ${violations.length} 個${testName}問題:`);
    violations.forEach((violation, idx) => {
      cy.addTestContext(`${idx + 1}. ${violation.description}`);
      cy.addTestContext(`   影響等級: ${violation.impact}`);
      cy.addTestContext(`   標準: ${violation.tags.join(', ')}`);
      cy.addTestContext(`   幫助資訊: ${violation.helpUrl}`);
      violation.nodes.forEach((node, nodeIdx) => {
        cy.addTestContext(`   問題元素 ${nodeIdx + 1}: ${node.target.join(', ')}`);
        if (node.failureSummary) {
          cy.addTestContext(`   具體問題: ${node.failureSummary}`);
        }
        if (node.any && node.any.length > 0) {
          node.any.forEach((check) => {
            if (check.data) {
              cy.addTestContext(`   檢測結果: ${JSON.stringify(check.data)}`);
            }
          });
        }
      });
      cy.addTestContext(''); // 空行分隔
    });
  }
});

/**
 * 自定義命令：增強的錯誤捕獲和報告
 */
// Cypress.Commands.add('captureFailureDetails', (testName, error) => {
//   cy.addTestContext(`❌ 測試失敗: ${testName}`);
//   cy.addTestContext(`🐛 錯誤訊息: ${error.message}`);
  
//   if (error.stack) {
//     cy.addTestContext(`📊 堆疊追蹤:`);
//     const stackLines = error.stack.split('\n').slice(0, 5); // 只顯示前5行
//     stackLines.forEach(line => {
//       cy.addTestContext(`   ${line.trim()}`);
//     });
//   }
  
//   // 截圖
//   cy.screenshot(`failure-${testName}-${Date.now()}`, { 
//     capture: 'fullPage',
//     overwrite: true 
//   });
  
//   // 收集頁面資訊
//   cy.url().then(url => { cy.addTestContext(`🌐 失敗時的 URL: ${decodeURI(url)}`); });
//   cy.title().then(title => { cy.addTestContext(`📝 失敗時的頁面標題: ${title}`); });
  
//   // 收集瀏覽器控制台錯誤
//   cy.window().then(win => {
//     if (win.console && win.console.error) {
//       cy.addTestContext(`🖥️ 瀏覽器控制台可能有錯誤，請檢查開發者工具`);
//     }
//   });
// });