# Accessibility testing with Cypress

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/CIRCLECI-GWP/accessibility-testing-using-cypress/tree/fix%2Faccessibility-violations.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/CIRCLECI-GWP/accessibility-testing-using-cypress/tree/fix%2Faccessibility-violations)

A repository to test accessibility issues with Cypress.

## 測試

### 1. 啟動專案站點伺服器(內建 React 測試環境)

```bash
# default application server is port :3000
pnpm start
```

### 2. 運行可訪問性測試

```bash
# 執行 Cypress APP
pnpm run cypress:open

# 執行所有測試
pnpm run cypress:run

# 執行無障礙測試（不產生報告）
pnpm run test:a11y

# 執行無障礙測試（產生報告）
pnpm run test:a11y:report
```

## **腳本環境變數配置**

本專案支援透過環境變數來控制測試環境和報告器：

> defaultBaseUrl: http://localhost:3000，配置於 cypress.config.js

```bash
# 測試不同環境
cross-env CYPRESS_BASE_URL=https://staging.example.com pnpm run test:a11y
cross-env CYPRESS_BASE_URL=https://production.example.com pnpm run test:a11y:report

# 使用不同的報告器
cross-env CYPRESS_REPORTER=spec pnpm run test:a11y
```

### 報告和截圖儲存

- **報告位置**: `cypress/reports/`
- **截圖位置**: `cypress/screenshots/` (根據 baseUrl 自動分類資料夾，僅用於暫存，報告中採用 base64 格式嵌入)
- **檔案命名**: 根據 baseUrl 自動分類並加入時間戳記，例如：
  - `http://localhost:3000` → `accessibility-report-localhost_2025-09-25_14-11-48.html`
  - `https://trp.nlma.gov.tw/w/trp` → `accessibility-report-trp-nlma-gov-tw_2025-09-25_14-11-48.html`
- **截圖分類**: 不同環境的截圖會儲存在不同資料夾：
  - `cypress/screenshots/localhost/common.spec.cy.js/` (預設 localhost)
  - `cypress/screenshots/trp-nlma-gov-tw/common.spec.cy.js/` (指定 baseURL)

## **故障排除**

如果遇到 Cypress 無法執行的問題：

```bash
# 重新安裝 Cypress
npx cypress install

# 清除快取並重新安裝
pnpm store prune
pnpm install
npx cypress install
```

## **Cypress 升級指南**

> 升級 Cypress 到最新版本

```bash
# 升級 Cypress 相關套件
pnpm update cypress cypress-axe cypress-mochawesome-reporter cypress-wait-until

# 升級 axe-core
pnpm update axe-core

# 升級報告相關套件
pnpm update mochawesome-merge mochawesome-report-generator

# 重新安裝 Cypress(C:\Users\CCWORK\AppData\Local\Cypress\Cache\x.x.x)
npx cypress install

# 上一步安裝好後，如果需要使用 Cypress APP，需手動修改捷徑 ICON 路徑
C:\Users\CCWORK\AppData\Local\Cypress\Cache\x.x.x\Cypress\Cypress.exe
C:\Users\CCWORK\AppData\Local\Cypress\Cache\x.x.x
```