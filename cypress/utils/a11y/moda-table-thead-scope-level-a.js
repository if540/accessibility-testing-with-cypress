/**
 * Moda: table thead scope(Level A)
 * @param {string[]} pages 頁面列表
 */
export default function modaTableTheadScopeLevelA(pages) {
    describe('thead th 必須有正確 scope 屬性 (HM1130101C)', () => {
        pages.forEach((page, index) => {
            it(`Moda: table thead scope - 頁面 ${index + 1}: ${decodeURI(page)}`, () => {
                cy.request({url: page, failOnStatusCode: false, timeout: 10000}).as('req');
                return cy.get('@req').then((response) => {
                    cy.afterRequest(page, response, () => {
                        cy.document().then(($doc) => {
                            if($doc.querySelectorAll('thead').length > 0) {
                                cy.get('thead th').each((el) => {
                                    // 斷言 th 有 scope 屬性
                                    cy.wrap(el).should('have.attr', 'scope').then((scope) => {
                                        // 可選：檢查 scope 屬性值是否為 row/col
                                        expect(['row', 'col', 'rowgroup', 'colgroup']).to.include(scope);
                                    });
                                });
                            } else {
                                cy.log('沒有 thead')
                            }
                        });
                    });
                });
            });
        })
    })
}