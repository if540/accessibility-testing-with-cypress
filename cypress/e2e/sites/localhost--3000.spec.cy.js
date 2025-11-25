/// <reference types="cypress" />
/* eslint-env cypress/globals */
/* eslint-disable jest/valid-expect, no-unused-expressions */

const parseUrlToSafeNames = require('../../utils/a11y/parse-url-to-safe-names');
const getTaipeiTimestamp = require('../../utils/a11y/get-taipei-timestamp');

const pages = [
    {
        path: '/',
        title: '首頁'
    },
    {
        path: '/#/example',
        title: '範例網站 - 首頁'
    },
    {
        path: '/#/example/about',
        title: '範例網站 - 關於我們'
    }
]

describe("Cypress Axe CI 測試", () => {
    const { safeReportFilePathName } = parseUrlToSafeNames(Cypress.config('baseUrl'));
    const a11yReportFilePath = `cypress/reports/${safeReportFilePathName}/${getTaipeiTimestamp().compact}.json`;

    pages.forEach((page) => {
        it(page.title, () => {
            cy.checkA11yAndReport(page.path, a11yReportFilePath);
        });
    });

    // it('首頁', () => {
    //   cy.checkA11yAndReport('/', a11yReportFilePath);
    // });

});