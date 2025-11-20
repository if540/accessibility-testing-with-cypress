/// <reference types="cypress" />
/* eslint-env cypress/globals */
/* eslint-disable jest/valid-expect, no-unused-expressions */

describe("Cypress Axe CI 測試", () => {
  const baseUrl = Cypress.config('baseUrl')
  const hostname = new URL(baseUrl).hostname
  const safeHostname = hostname.replace(/\./g, '-')

  // 產生 yyyy-mm-dd_HH-MM-ss 格式的 timestamp (台北時間 UTC+8)
  const date = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find(p => p.type === 'year').value;
  const month = parts.find(p => p.type === 'month').value;
  const day = parts.find(p => p.type === 'day').value;
  const hour = parts.find(p => p.type === 'hour').value;
  const minute = parts.find(p => p.type === 'minute').value;
  const timestamp = `${year}-${month}-${day}_${hour}-${minute}`;
  const a11yReportFilePath = `cypress/reports/${safeHostname}/${timestamp}.json`;

  it('Axe: 首頁', () => {
    const page = "/#/example";
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
    const page = "/#/example/about";
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
