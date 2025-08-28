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
