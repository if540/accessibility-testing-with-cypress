/// <reference types="cypress" />
/* eslint-env cypress/globals */
/* eslint-disable jest/valid-expect, no-unused-expressions */

describe("Moda Gov A11y", () => {
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
  const timestamp = `${year}${month}${day}${hour}${minute}`;
  const a11yReportFilePath = `cypress/reports/${safeHostname}/${timestamp}.json`;

  it('Axe: 首頁', () => {
    const page = "/";
    const testName = Cypress.currentTest.title;

    cy.visit(encodeURI(page));
    cy.injectAxe();
    
    // 使用 alias 來追蹤是否有 violations
    cy.wrap(false).as('hasViolations');
    
    cy.checkA11y(
      null, 
      { 
        skipFailures: true,
      }, 
      (violations) => {
        cy.wrap(true).as('hasViolations');
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
        });
      }
    ).then(() => {
      // 檢查是否有 violations，如果沒有也要記錄該頁面（空陣列）
      cy.get('@hasViolations').then((hasViolations) => {
        if (!hasViolations) {
          cy.task('readAndMergeJson', {
            page,
            filePath: a11yReportFilePath,
            newData: []
          });
        }
      });
    });
  });
  
  it('Axe: 關於moda', () => {
    const page = "/aboutus/402";
    const testName = Cypress.currentTest.title;
    
    cy.visit(encodeURI(page));
    cy.injectAxe();
    
    // 使用 alias 來追蹤是否有 violations
    cy.wrap(false).as('hasViolations');
    
    cy.checkA11y(
      null, 
      { 
        skipFailures: true,
      }, 
      (violations) => {
        cy.wrap(true).as('hasViolations');
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
        });
      }
    ).then(() => {
      // 檢查是否有 violations，如果沒有也要記錄該頁面（空陣列）
      cy.get('@hasViolations').then((hasViolations) => {
        if (!hasViolations) {
          cy.task('readAndMergeJson', {
            page,
            filePath: a11yReportFilePath,
            newData: []
          });
        }
      });
    });
  });

  it('Axe: 公告資訊總覽', () => {
    const page = "/press/370";
    const testName = Cypress.currentTest.title;
    
    cy.visit(encodeURI(page));
    cy.injectAxe();
    
    // 使用 alias 來追蹤是否有 violations
    cy.wrap(false).as('hasViolations');
    
    cy.checkA11y(
      null, 
      { 
        skipFailures: true,
      }, 
      (violations) => {
        cy.wrap(true).as('hasViolations');
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
        });
      }
    ).then(() => {
      // 檢查是否有 violations，如果沒有也要記錄該頁面（空陣列）
      cy.get('@hasViolations').then((hasViolations) => {
        if (!hasViolations) {
          cy.task('readAndMergeJson', {
            page,
            filePath: a11yReportFilePath,
            newData: []
          });
        }
      });
    });
  });

  it('Axe: 公告資訊-行政公告-列表', () => {
    const page = "/press/bulletin/1179";
    const testName = Cypress.currentTest.title;
    
    cy.visit(encodeURI(page));
    cy.injectAxe();
    
    // 使用 alias 來追蹤是否有 violations
    cy.wrap(false).as('hasViolations');
    
    cy.checkA11y(
      null, 
      { 
        skipFailures: true,
      }, 
      (violations) => {
        cy.wrap(true).as('hasViolations');
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
        });
      }
    ).then(() => {
      // 檢查是否有 violations，如果沒有也要記錄該頁面（空陣列）
      cy.get('@hasViolations').then((hasViolations) => {
        if (!hasViolations) {
          cy.task('readAndMergeJson', {
            page,
            filePath: a11yReportFilePath,
            newData: []
          });
        }
      });
    });
  });

  it('Axe: 網站導覽', () => {
    const page = "/sitemap/546";
    const testName = Cypress.currentTest.title;
    
    cy.visit(encodeURI(page));
    cy.injectAxe();
    
    // 使用 alias 來追蹤是否有 violations
    cy.wrap(false).as('hasViolations');
    
    cy.checkA11y(
      null, 
      { 
        skipFailures: true,
      }, 
      (violations) => {
        cy.wrap(true).as('hasViolations');
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
        });
      }
    ).then(() => {
      // 檢查是否有 violations，如果沒有也要記錄該頁面（空陣列）
      cy.get('@hasViolations').then((hasViolations) => {
        if (!hasViolations) {
          cy.task('readAndMergeJson', {
            page,
            filePath: a11yReportFilePath,
            newData: []
          });
        }
      });
    });
  });

});
