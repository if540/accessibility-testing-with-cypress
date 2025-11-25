/// <reference types="cypress" />
/// <reference types="cypress-axe" />

declare namespace Cypress {
  interface Chainable {
    /**
     * 自定義命令：獲取元素並顯示訊息
     * @param selector - CSS 選擇器
     * @param message - 錯誤訊息
     * @param options - Cypress 選項
     */
    getWithMessage(selector: string, message?: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>): Chainable<JQuery<HTMLElement>>;

    /**
     * 自定義命令：訪問 URL 並記錄日誌
     * @param url - 要訪問的 URL
     */
    visitWithLogging(url: string): Chainable<Window>;

    /**
     * 自定義命令：記錄頁面 URL
     * @param message - 要記錄的訊息
     */
    logPageUrl(message: string): Chainable<void>;

    /**
     * 自定義命令：等待 jQuery AJAX 載入完成
     * @param options - 配置選項
     */
    waitForJQueryAjax(options?: {
      timeout?: number;
      interval?: number;
      errorMsg?: string;
    }): Chainable<void>;

    /**
     * 自定義命令：在請求完成後執行
     * @param page - 頁面 URL
     * @param response - 響應物件
     * @param onSuccess - 成功時的回調函數
     */
    afterRequest(
      page: string,
      response: { status: number; statusText?: string },
      onSuccess?: (page: string, response: { status: number; statusText?: string }) => void
    ): Chainable<void>;

    /**
     * 自定義命令：配置 axe 中文規則
     */
    configureAxeZh(): Chainable<void>;

    /**
     * 自定義命令：顯示無障礙問題詳細資訊
     * @param violations - 無障礙問題陣列
     * @param testName - 測試名稱
     */
    checkA11yViolationsDetails(
      violations: Array<{
        description: string;
        impact?: string;
        tags: string[];
        helpUrl: string;
        nodes: Array<{
          target: string[];
          failureSummary?: string;
          any?: Array<{ data?: unknown }>;
        }>;
      }>,
      testName?: string
    ): Chainable<void>;

    /**
     * 自定義命令：執行無障礙測試並記錄結果
     * @param page - 要測試的頁面路徑
     * @param a11yReportFilePath - 報告檔案路徑
     * @param options - 選項
     */
    checkA11yAndReport(
      page: string,
      a11yReportFilePath: string,
      options?: {
        skipFailures?: boolean;
      }
    ): Chainable<void>;
  }
}

