// Global custom commands — reserved strictly for cross-application primitives.
// Module-specific actions live on Page Objects (cypress/pages/) or scoped helpers (cypress/helpers/).

import { ensureTestUserExists, authenticateViaApi } from '../helpers/auth.helpers';

Cypress.Commands.add('dismissOverlays', () => {
  cy.setCookie('welcomebanner_status', 'dismiss');
  cy.setCookie('cookieconsent_status', 'dismiss');
});

Cypress.Commands.add(
  'loginViaApi',
  (email = Cypress.env('TEST_EMAIL'), password = Cypress.env('TEST_PASSWORD')) => {
    cy.dismissOverlays();
    ensureTestUserExists(email, password).then(() => {
      authenticateViaApi(email, password).then(({ token, bid }) => {
        cy.window().then((win) => {
          win.localStorage.setItem('token', token);
          win.sessionStorage.setItem('bid', String(bid));
        });
        cy.setCookie('token', token);
      });
    });
  }
);
