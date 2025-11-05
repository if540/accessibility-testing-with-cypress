/// <reference types="cypress" />
/* eslint-env cypress/globals */
/* eslint-disable jest/valid-expect, no-unused-expressions */

// baseurl 設定在 cypress.config.js 中
const pages = ["/", "/最新消息?code=TenderNotice"];

describe("API 操作各式範例", () => {

  describe("Axe: 自訂手動用 cypress API 操作, afterRequest 會等待頁面 ajax 載入完成", () => {
    pages.forEach((page, index) => {
      it(`Axe: page-has-heading-one - 頁面 ${index + 1}: ${decodeURI(page)}`, () => {
        cy.request({url: page, failOnStatusCode: false, timeout: 10000}).as('req');
        return cy.get('@req').then((response) => {
          // Command AfterRequest 有封裝 injectAxe and axe.configure 初始設定(configureAxeZh)
          cy.afterRequest(page, response, () => {
            cy.get('h1').should(($el) => {
              expect($el.length, '找不到 h1').to.be.greaterThan(0);
              expect($el.length, 'h1 數量超過 1').to.eq(1);
            });
          });
        });
      });
    });
  });

  it('自訂手動用 cypress API 操作', () => {
    pages.forEach((page) => {
      cy.visit(encodeURI(page));
      cy.get('h1').should(($el) => {
        expect($el.length, '找不到 h1').to.be.greaterThan(0);
        expect($el.length, 'h1 數量超過 1').to.eq(1);
      });
    })
  });

});
