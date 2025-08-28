/// <reference types="cypress" />

describe("Sign Up Accessibility test suite", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.injectAxe();
  });

  it('should have a <noscript> tag for no-JavaScript scenarios', () => {
    // 檢查頁面中是否包含 <noscript> 標籤
    cy.get('noscript').should('exist');
    cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt').and('not.be.empty');
      });
    cy.checkA11y('img', { rules: { 'image-alt': { enabled: true } } });
  });

  // it('應該可以正常使用跳過鏈接', () => {
  //   // 假設頁面有一個 id 為 'skip-to-content' 的跳過鏈接
  //   // cy.get('.accessibility-nav').should('exist').focus().click();               
  //   // 確認跳過鏈接能夠正常工作，將頁面滾動到主要內容
  //   // cy.get('#C').should('be.visible');

  //   cy.get('.accessibility-nav')  // 獲取 .accessibility-nav 元素
  //     .should('exist')             // 確保該元素存在
  //     .invoke('attr', 'href')      // 取得 href 屬性
  //     .then((href) => {
  //       cy.get(href)               // 使用取得的 href 作為新的 selector
  //         .should('be.visible');    // 確保該元素是可見的
  //     });
  // });

  it('應該有適當的顏色對比', () => {
    // 檢查頁面上的所有元素是否符合顏色對比標準
    cy.checkA11y('h3', {
      rules: {
        'color-contrast': { enabled: true }
      }
    }, (violations) => {
      violations.forEach((violation) => {
        cy.task('log', JSON.stringify(violation.description, null, 2));
        console.log('violation', violation)
      });
      expect(violations).to.have.length(0);
    });
  });

  it('應該有適當的表單標籤', () => {
    cy.get('.form-check-input').each(($el) => {
      cy.wrap($el)
        .should(($el) => {
          expect($el).to.have.attr('aria-label');
        })
        .then(($id) => {
          cy.log($id);
        });
    });
  });

  // it('應該有適當的鍵盤導航', () => {
  //   // 檢查頁面上的所有可聚焦元素是否可以通過鍵盤導航
  //   cy.get('a, button, input, select, textarea, [tabindex]').each(($el) => {
  //     cy.wrap($el).focus().should('have.css', 'outline-style', 'solid');
  //   });
  // });

  // it('應該有適當的語意化 HTML', () => {
  //   // 檢查頁面上的所有語意化 HTML 標籤是否正確使用
  //   const semanticTags = ['header', 'nav', 'main', 'footer', 'article', 'section', 'aside'];
  //   semanticTags.forEach((tag) => {
  //     cy.get(tag).should('exist');
  //   });
  // });
});