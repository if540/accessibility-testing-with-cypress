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
