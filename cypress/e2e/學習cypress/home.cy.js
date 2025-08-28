context('試著寫 Cypress 測試', () => {

  it('檢查H1的標題是否正確', () => {
    cy.visit('https://example.cypress.io');
    cy
      .get('.banner-alt')
      .should('have.length', 3)
      .contains('.row', 'Commands')
    cy.log('test 自訂')
  })

  it('測試 Axe 引用', () => {
    cy.visit('http://localhost:3000')
    cy.injectAxe();
    // cy.window().then(win => {
    //   console.log(win.axe._audit.checks['page-has-heading-one']);
    // })
    cy.checkA11y(null, {
      skipFailures: true,
      rules: {
        'landmark-one-main': {enabled: false},
        'label': {enabled: false},
        'region': {enabled: false},
        'color-contrast': { enabled: true },
        'page-has-heading-one': { enabled: true },
      },
    }, (violations) => {
      if (violations.length) {
        // 你可以自己決定要怎麼 log
        cy.log(`${violations.length} accessibility violations found`);
        // 或寫入 report
      }
    });
  })

})

// describe("全站 a11y 檢測 (HM1130104E: 巢狀標頭)", () => {
//   pages.forEach((page) => {
//     it(`檢測頁面 ${page}`, () => {
//       // 訪問頁面
//       cy.visit(`http://127.0.0.1:8000${page}`);

//       // 注入 axe-core
//       cy.injectAxe();

//       cy.get("h1").then(($h1) => {
//         if ($h1.length > 1) {
//           throw new Error(`頁面有 ${$h1.length} 個 H1，違反 HM1130104E`);
//         }
//       });

//       // 自動檢測 a11y
//       cy.checkA11y(
//         null,
//         {
//           runOnly: {
//             type: "tag",
//             values: ["wcag2a"],
//           },
//           rules: {
//             "heading-order": { enabled: true },
//             "page-has-heading-one": { enabled: true }, // 檢查至少一個 H1
//           },
//         },
//         (violations) => {
//           if (violations.length) {
//             violations.forEach((violation) => {
//               console.log(`問題: ${violation.id} - ${violation.help}`);
//               violation.nodes.forEach((node) => {
//                 console.log(
//                   `元素: ${node.target.join(", ")}\nHTML: ${node.html}\n描述: ${
//                     node.failureSummary
//                   }`
//                 );
//               });
//             });
//             assert.equal(violations.length, 0, "存在 a11y 問題");
//           }
//         }
//       );
//     });
//   });
// });
