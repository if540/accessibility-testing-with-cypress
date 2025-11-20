/// <reference types="cypress" />
/* eslint-env cypress/globals */
/* eslint-disable jest/valid-expect, no-unused-expressions */

describe("Cypress Axe CI 測試", () => {
  const baseUrl = Cypress.config('baseUrl')
  const hostname = new URL(baseUrl).hostname
  const safeHostname = hostname.replace(/\./g, '-')

  // 產生 yyyy-mm-dd_HH-MM-ss 格式的 timestamp
  const date = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const timestamp = [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ].join('-') + '_' +
  [pad(date.getHours()), pad(date.getMinutes())].join('-');
  const a11yReportFilePath = `cypress/reports/${safeHostname}/${timestamp}.json`;

  it('Axe: 首頁', () => {
    const page = "/";
    const testName = Cypress.currentTest.title;

    cy.visit(encodeURI(page));
    cy.injectAxe();
    cy.checkA11y(
      null, 
      { 
        skipFailures: true,
      }, 
      (violations) => {
        // 為新的 violations 加上頁面資訊
        const violationsWithPage = violations.map(violation => ({
          ...violation,
          page,
          testName
        }));
        
        // 使用 task 讀取並合併檔案
        cy.task('readAndMergeJson', {
          page,
          filePath: a11yReportFilePath,
          newData: violationsWithPage
        }).then((mergedData) => {
          // 寫入合併後的資料
          cy.writeFile(a11yReportFilePath, mergedData);
        });
      }
    );
  });
  
  it('Axe: 關於我們', () => {
    const page = "/#/about";
    const testName = Cypress.currentTest.title;
    
    cy.visit(encodeURI(page));
    cy.injectAxe();
    cy.checkA11y(
      null, 
      { 
        skipFailures: true,
      }, 
      (violations) => {
        // 為新的 violations 加上頁面資訊
        const violationsWithPage = violations.map(violation => ({
          ...violation,
          page,
          testName
        }));
        
        // 使用 task 讀取並合併檔案
        cy.task('readAndMergeJson', {
          page,
          filePath: a11yReportFilePath,
          newData: violationsWithPage
        }).then((mergedData) => {
          // 寫入合併後的資料
          cy.writeFile(a11yReportFilePath, mergedData);
        });
      }
    );
  });

});
