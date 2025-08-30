const { defineConfig } = require('cypress')

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Accessibility Testing Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: true,
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
    reportFilename: 'accessibility-report',
    showPassed: true,
    showSkipped: true,
    showFailed: true,
    code: false,
    addContext: true,
    saveJson: true,
    saveHtml: true,
    includeAssets: true,
    debug: true
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);

      on('task', {
        log(message) {
          console.log(message)
          return null
        }
      })
    },
  },
})