/// <reference types="cypress" />
/* eslint-env cypress/globals */
/* eslint-disable jest/valid-expect, no-unused-expressions */

// baseurl 設定在 cypress.config.js 中
const pages = ["/", "/最新消息?code=TenderNotice"];

describe("Axe API 操作各式範例", () => {

  describe("Axe: 自訂手動用 cypress API 操作, afterRequest 會等待頁面 ajax 載入完成", () => {
    pages.forEach((page, index) => {
      it(`Axe: page-has-heading-one - 頁面 ${index + 1}: ${decodeURI(page)}`, () => {
        cy.request({url: page, failOnStatusCode: false, timeout: 10000}).as('req');
        return cy.get('@req').then((response) => {
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

  it('Axe: 自訂手動用 cypress API 操作', () => {
    pages.forEach((page) => {
      cy.visit(encodeURI(page));
      cy.get('h1').should(($el) => {
        expect($el.length, '找不到 h1').to.be.greaterThan(0);
        expect($el.length, 'h1 數量超過 1').to.eq(1);
      });
    })
  });

  it('Axe: rule disabled config', () => {
    pages.forEach((page) => {
      cy.visit(encodeURI(page));
      cy.injectAxe();
      cy.checkA11y(
        null,
        {
          skipFailures: true,
          rules: {
            'aria-hidden-focus': { enabled: false },
            'aria-allowed-attr': { enabled: false },
            'aria-prohibited-attr': { enabled: false },
            'meta-viewport': { enabled: false },
            'aria-required-parent': { enabled: false },
            'label-title-only': { enabled: false },
            'color-contrast': { enabled: false },
            'landmark-one-main': {enabled: false},
            'label': {enabled: false},
            'region': {enabled: false},
            "heading-order": { enabled: true },
          },
        }
      );
    });
  });

  it('Axe: only one rule: color-contrast', () => {
    pages.forEach((page) => {
      cy.visit(encodeURI(page));
      cy.injectAxe();
      cy.checkA11y(null, { 
        skipFailures: true,
        runOnly: {
          type: 'rule',
          values: ['color-contrast']
        },
      });
    });
  }); 

  it('Axe: 只跑 WCAG2A 的規則(A)', () => {
    pages.forEach((page) => {
      cy.visit(encodeURI(page));
      cy.injectAxe();
      cy.checkA11y(
        null, 
        { 
          skipFailures: true,
          runOnly: { type: 'tag', values: ['wcag2a'] },
      });
    });
  }); 
  
  it('Axe: 只跑 WCAG2AA 的規則(AA)', () => {
    pages.forEach((page) => {
      cy.visit(encodeURI(page));
      cy.injectAxe();
      cy.checkA11y(
        null, 
        { 
        skipFailures: true,
        runOnly: { type: 'tag', values: ['wcag2aa'] },
      });
    });
  }); 

});
