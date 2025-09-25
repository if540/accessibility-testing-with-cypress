export default function axeImageAltLevelA(pages) {
    describe("image alt", () => {
        pages.forEach((page, index) => {
            it(`Axe: image alt 必須有意義 - 頁面 ${index + 1}: ${decodeURI(page)}`, () => {
                cy.request({url: page, failOnStatusCode: false, timeout: 10000}).as('req');
                return cy.get('@req').then((response) => {
                    cy.afterRequest(page, response, () => {
                    cy.checkA11y(
                        null,
                        {
                        skipFailures: false,
                        runOnly: {
                            type: 'rule',
                            values: ['no-generic-alt']
                        }
                        },
                        (violations) => {
                            cy.checkA11yViolationsDetails(violations, 'image alt 必須有意義');
                        }
                    );
                    });
                });
            });

            it(`Axe: 圖片必須有替代文字 - 頁面 ${index + 1}: ${decodeURI(page)}`, () => {
                cy.request({url: page, failOnStatusCode: false, timeout: 10000}).as('req');
                return cy.get('@req').then((response) => {
                    cy.afterRequest(page, response, () => {
                    cy.checkA11y(
                        null,
                        {
                        skipFailures: false,
                        runOnly: {
                            type: 'rule',
                            values: ['image-alt']
                        }
                        },
                        (violations) => {
                            cy.checkA11yViolationsDetails(violations, 'image alt');
                        }
                    );
                    });
                });
            });
        });
    });
}