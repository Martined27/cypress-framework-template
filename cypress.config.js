require('dotenv').config();
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    charts: true,
    reportPageTitle: 'Cypress E2E Suite Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://practicesoftwaretesting.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    env: {
      apiUrl: process.env.CYPRESS_API_URL || 'https://api.practicesoftwaretesting.com',
      TEST_EMAIL: process.env.TEST_EMAIL || 'customer@practicesoftwaretesting.com',
      TEST_PASSWORD: process.env.TEST_PASSWORD || 'welcome01',
      grepFilterSpecs: true,
      grepOmitFiltered: true,
    },
    setupNodeEvents(on, config) {
      try {
        const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');
        on('before:run', async (details) => {
          try {
            await beforeRunHook(details);
          } catch (err) {
            void err;
          }
        });
        on('after:run', async (results) => {
          try {
            await afterRunHook(results);
          } catch (err) {
            void err;
          }
        });
      } catch (err) {
        void err;
      }
      require('@cypress/grep/src/plugin')(config);
      return config;
    },
  },
});
