/// <reference types="cypress" />
/* eslint-env cypress/globals */
/* eslint-disable jest/valid-expect, no-unused-expressions, cypress/no-unnecessary-waiting */

// baseurl 設定在 cypress.config.js 中
import { pages } from "../projectData/clound";

describe("全站通用 a11y 檢測", () => {

  describe("page-has-heading-one", () => {
    pages.forEach((page, index) => {
      it(`Axe: page-has-heading-one - 頁面 ${index + 1}: ${decodeURI(page)}`, () => {
        cy.request({url: page, failOnStatusCode: false, timeout: 10000}).as('req');
        return cy.get('@req').then((response) => {
          cy.afterRequest(page, response, () => {
            cy.checkA11y(
              null,
              {
                skipFailures: false,
                runOnly: {
                  type: 'rule',
                  values: ['page-has-heading-one']
                }
              },
              (violations) => {
                cy.checkA11yViolationsDetails(violations, '標題階層');
              }
            );
          });
        });
      });
    });
  });

  describe("heading-order", () => {
    pages.forEach((page, index) => {
      it(`Axe: heading-order (標題階層順序) - 頁面 ${index + 1}: ${decodeURI(page)}`, () => {
        cy.request({url: page, failOnStatusCode: false, timeout: 10000}).as('req');
        return cy.get('@req').then((response) => {
          cy.afterRequest(page, response, () => {
            cy.checkA11y(
              null,
              {
                skipFailures: false,
                runOnly: {
                  type: 'rule',
                  values: ['heading-order']
                }
              },
              (violations) => {
                cy.checkA11yViolationsDetails(violations, '標題階層');
              }
            );
          });
        });
      });
    });
  });

  describe("css-font-size-relative 相對字型尺寸單位", () => {
    pages.forEach((page, index) => {
      it(`a11y: css-font-size-relative - 頁面 ${index + 1}: ${decodeURI(page)}`, () => {
        cy.request({url: page, failOnStatusCode: false, timeout: 10000}).as('req');
        return cy.get('@req').then((response) => {
          cy.afterRequest(page, response, () => {
            cy.get('[style*="font-size"]').then((els) => {
              const errors = [];
              els.each((i, el) => {
                const styleAttr = el.getAttribute('style');
                const hasPx = styleAttr && /font-size\s*:\s*[\d.]+px/.test(styleAttr);
                
                if (hasPx) {
                  // 收集詳細的元素資訊
                  const elementInfo = {
                    tagName: el.tagName.toLowerCase(),
                    className: el.className || '',
                    id: el.id || '',
                    textContent: el.textContent ? el.textContent.trim().substring(0, 100) : '',
                    style: styleAttr,
                    outerHTML: el.outerHTML.substring(0, 200)
                  };
                  
                  errors.push(elementInfo);
                  
                  // 在 Cypress 日誌中記錄詳細資訊
                  cy.addTestContext(`❌ 發現使用 px 字型單位的元素 #${i + 1}:`);
                  cy.addTestContext(`   標籤: <${elementInfo.tagName}>`);
                  if (elementInfo.id) cy.addTestContext(`   ID: #${elementInfo.id}`);
                  if (elementInfo.className) cy.addTestContext(`   Class: .${elementInfo.className}`);
                  cy.addTestContext(`   Style: ${elementInfo.style}`);
                  if (elementInfo.textContent) cy.addTestContext(`   內容: "${elementInfo.textContent}"`);
                  cy.addTestContext(`   HTML: ${elementInfo.outerHTML}...`);
                  cy.addTestContext('');
                }
              });
              
              // 如果有錯誤，在 console 中輸出完整資訊
              if (errors.length > 0) {
                console.log('🚨 發現使用 px 字型單位的元素詳細資訊:', errors);
              }
              
              // 使用自定義錯誤訊息顯示所有問題元素
              const errorMessage = errors.length > 0 
                ? `發現 ${errors.length} 個元素使用 px 字型單位:\n${errors.map((err, idx) => 
                    `${idx + 1}. <${err.tagName}${err.id ? ` id="${err.id}"` : ''}${err.className ? ` class="${err.className}"` : ''}> - ${err.style}`
                  ).join('\n')}`
                : '';
      
              expect(errors.length, errorMessage).to.equal(0);
            });
          });
        });
      });
    });
  });

  describe("color-contrast", () => {
    pages.forEach((page, index) => {
      it(`Axe: color-contrast - 頁面 ${index + 1}: ${decodeURI(page)}`, () => {
        cy.request({url: page, failOnStatusCode: false, timeout: 10000}).as('req');
        cy.get('@req').then((response) => {
          cy.afterRequest(page, response, () => {
            cy.checkA11y(
              null, 
              { 
                skipFailures: false,
                runOnly: {
                  type: 'rule',
                  values: ['color-contrast']
                }
              },
              (violations) => {
                cy.checkA11yViolationsDetails(violations, '色彩對比');
              }
            );
          });
        });
      });
    });
  });

});

// 測試用
// assert.fail(`❌ 無效網址 (HTTP ${response.status})`);
// cy.checkA11y(
//   null,
//   {
//     skipFailures: true,
//     runOnly: {
//       type: 'rule',
//       values: ['heading-order']
//     },
//     rules: {
//       'aria-hidden-focus': { enabled: false },
//       'aria-allowed-attr': { enabled: false },
//       'aria-prohibited-attr': { enabled: false },
//       'meta-viewport': { enabled: false },
//       'aria-required-parent': { enabled: false },
//       'label-title-only': { enabled: false },
//       'color-contrast': { enabled: false },
//       'landmark-one-main': {enabled: false},
//       'label': {enabled: false},
//       'region': {enabled: false},
//       "heading-order": { enabled: true },
//     },
//   }
// );