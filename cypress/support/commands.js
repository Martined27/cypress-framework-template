// Global custom commands — reserved strictly for cross-application primitives.
// Module-specific actions live on Page Objects (cypress/pages/) or scoped helpers (cypress/helpers/).

import { authenticateViaApi } from '../helpers/auth.helpers';

Cypress.Commands.add('dismissOverlays', () => {
  // Practice Software Testing does not render blocking modal overlays by default.
});

Cypress.Commands.add(
  'loginViaApi',
  (email = Cypress.env('TEST_EMAIL'), password = Cypress.env('TEST_PASSWORD')) => {
    cy.session(
      [email, password],
      () => {
        authenticateViaApi(email, password).then(({ token }) => {
          cy.visit('/auth/login');
          cy.window().then((win) => {
            win.localStorage.setItem('auth-token', token);
          });
        });
      },
      {
        validate() {
          cy.window().then((win) => {
            expect(win.localStorage.getItem('auth-token')).to.be.a('string');
          });
        },
      }
    );
  }
);
