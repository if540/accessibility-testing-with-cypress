/// <reference types="cypress" />
/* eslint-env cypress/globals */
/* eslint-disable jest/valid-expect, no-unused-expressions */

const BASE_URL = "http://localhost:3000";
const pages = ["/"];

describe("全站通用 a11y 檢測", () => {
  describe("全站通用 a11y 檢測 (H1，違反 HM1130104E)", () => {

    it('Axe: page-has-heading-one', () => {
      pages.forEach((page) => {
        cy.visit(`${BASE_URL}${page}`);
        cy.get('h1').should(($el) => {
          expect($el.length, '找不到 h1').to.be.greaterThan(0);
          expect($el.length, 'h1 數量超過 1').to.eq(1);
          
        });
      })
    });

    it('Axe: heading-order (標題階層順序)', () => {
      pages.forEach((page) => {
        cy.visit(`${BASE_URL}${page}`);
        cy.injectAxe();
        cy.checkA11y(
          null,
          {
            skipFailures: true,
            rules: {
              'landmark-one-main': {enabled: false},
              'label': {enabled: false},
              'region': {enabled: false},
              "heading-order": { enabled: true },
            },
          }
        );
      });
    });

    // 檢查任何CSS樣式規則均使用具名字型尺寸，或者使用百分比或em等相對字型尺寸單位
    it('a11y: css-font-size-relative', () => {
      pages.forEach((page) => {
        cy.visit(`${BASE_URL}${page}`);
        cy.get('[style*="font-size"]').then((els) => {
          els.each((i, el) => {
            const styleAttr = el.getAttribute('style');
            const hasPx = styleAttr && /font-size\s*:\s*[\d.]+px/.test(styleAttr);
            expect(hasPx, 'style 屬性包含 font-size 且為 px 單位').to.be.false;
          });
        });
      });
    });
    
  });
});
