/**
 * Axe: table (Level A)
 * @param {string[]} pages 頁面列表
 */
export default function axeTableLevelA(pages) {
    describe("table 寬鬆正確性", () => {
        pages.forEach((page, index) => {
            it(`Axe: table 寬鬆正確性 - 頁面 ${index + 1}: ${decodeURI(page)}`, () => {
                cy.request({url: page, failOnStatusCode: false, timeout: 10000}).as('req');
                return cy.get('@req').then((response) => {
                    cy.afterRequest(page, response, () => {
                        cy.checkA11y(
                            null,
                            {
                                skipFailures: false,
                                runOnly: {
                                    type: 'rule',
                                    values: ['td-headers-attr', 'th-has-data-cells', 'scope-attr-valid', 'td-has-header']
                                }
                            },
                            (violations) => {
                                cy.checkA11yViolationsDetails(violations, '表格 th 元素應有資料單元');
                            }
                        );
                    });
                });
            });
        });
    });
}