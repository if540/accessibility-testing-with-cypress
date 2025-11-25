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
    path: '/aboutus/402',
    title: '關於moda'
  },
  {
    path: '/press/370',
    title: '公告資訊總覽'
  },
  {
    path: '/press/bulletin/1179',
    title: '公告資訊-行政公告-列表'
  },
  {
    path: '/sitemap/546',
    title: '網站導覽'
  },
  {
    path: '/aboutus/organization/620',
    title: '組織架構'
  }
]

describe("Moda Gov A11y", () => {
  const { safeReportFilePathName } = parseUrlToSafeNames(Cypress.config('baseUrl'));
  const a11yReportFilePath = `cypress/reports/${safeReportFilePathName}/${getTaipeiTimestamp().compact}.json`;

  pages.forEach((page) => {
    it(page.title, () => {
        cy.checkA11yAndReport(page.path, a11yReportFilePath);
    });
  });
});
