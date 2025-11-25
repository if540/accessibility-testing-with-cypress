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
    path: '/web/cabcych/Introduction_new',
    title: '現任局長介紹'
  },
  {
    path: '/web/cabcych/news',
    title: '新聞發布(article38)-列表頁面'
  },
  {
    path: '/web/cabcych/news_25112517113179356?id=25112517091388031',
    title: '新聞發布列表(article38)-文章詳細頁面'
  },
  {
    path: '/web/cabcych/Sitemap',
    title: '網站導覽(Sitemap1)'
  }
]

describe("嘉義市文化局 A11y", () => {
  const { safeReportFilePathName } = parseUrlToSafeNames(Cypress.config('baseUrl'));
  const a11yReportFilePath = `cypress/reports/${safeReportFilePathName}/${getTaipeiTimestamp().compact}.json`;

  pages.forEach((page) => {
    it(page.title, () => {
        cy.checkA11yAndReport(page.path, a11yReportFilePath);
    });
  });
});
