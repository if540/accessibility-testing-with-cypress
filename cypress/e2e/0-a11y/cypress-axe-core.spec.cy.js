/// <reference types="cypress" />
/* eslint-env cypress/globals */
/* eslint-disable jest/valid-expect, no-unused-expressions */

// baseurl 設定在 cypress.config.js 中
const pages = ["/"];

describe("Axe API 操作各式範例", () => {
  
  it('Axe: 預設規則', () => {
    pages.forEach((page) => {
      cy.visit(encodeURI(page));
      cy.injectAxe();
      cy.checkA11y(
        null, 
        { 
        skipFailures: true,
      });
    });
  });
  
  // it('Axe: WCAG2A 和 WCAG2AA 限定規則', () => {
  //   pages.forEach((page) => {
  //     cy.visit(encodeURI(page));
  //     cy.injectAxe();
  //     cy.checkA11y(
  //       null, 
  //       { 
  //       skipFailures: true,
  //       runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
  //     });
  //   });
  // });

  // it('Axe: 自訂規則', () => {
  //   pages.forEach((page) => {
  //     cy.visit(encodeURI(page));
  //     cy.injectAxe();
  //     // 自訂規則
  //     cy.configureAxeZh();
  //     cy.checkA11y(
  //       null, 
  //       { 
  //       skipFailures: true,
  //     });
  //   });
  // });

  // it('Axe: 指定規則停用', () => {
  //   pages.forEach((page) => {
  //     cy.visit(encodeURI(page));
  //     cy.injectAxe();
  //     cy.checkA11y(
  //       null,
  //       {
  //         skipFailures: true,
  //         rules: {
  //           'aria-hidden-focus': { enabled: false },
  //           'aria-allowed-attr': { enabled: false },
  //           'aria-prohibited-attr': { enabled: false },
  //           'meta-viewport': { enabled: false },
  //           'aria-required-parent': { enabled: false },
  //           'label-title-only': { enabled: false },
  //           'color-contrast': { enabled: false },
  //           'landmark-one-main': {enabled: false},
  //           'label': {enabled: false},
  //           'region': {enabled: false},
  //           "heading-order": { enabled: true },
  //         },
  //       }
  //     );
  //   });
  // });

  // it('Axe: 指定規則執行: color-contrast', () => {
  //   pages.forEach((page) => {
  //     cy.visit(encodeURI(page));
  //     cy.injectAxe();
  //     cy.checkA11y(null, { 
  //       skipFailures: true,
  //       runOnly: {
  //         type: 'rule',
  //         values: ['color-contrast']
  //       },
  //     });
  //   });
  // });

});
