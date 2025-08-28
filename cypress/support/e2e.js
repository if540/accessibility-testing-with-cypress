// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')
import 'cypress-axe'

// Cypress.on('fail', (error, runnable) => {
//     console.log('error.message',error)
//     throw new Error(error.message.split('\n')[0]);
// });

import 'cypress-mochawesome-reporter/register'

// 自動擷取失敗測試的截圖
Cypress.on('test:after:run', (test, runnable) => {
  if (test.state === 'failed') {
    const screenshot = `${runnable.parent.title} -- ${test.title} (failed).png`
    cy.addTestContext(`截圖: ${screenshot}`)
  }
})