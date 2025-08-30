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
    cy.injectAxe();
    cy.waitForJQueryAjax();
    onSuccess && onSuccess(page, response);
  } else {
    cy.addTestContext(`❌ 頁面狀態: 無效網址 (HTTP ${response.status})`);
    // 使用 this.skip() 跳過測試
    // 注意：必須用 function(){} 形式的 it 才能用 this.skip()
    // 這裡 Cypress 會自動綁定正確的 this
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    return cy.then(function() { this.skip(); });
  }
});