// Negative-path authentication regression tests.
import LoginPage from '../../pages/LoginPage';
import { registerAuthIntercepts } from '../../helpers/intercepts';

describe(
  'Authentication Negative Paths',
  { tags: ['@regression', '#integration', '#staging'] },
  () => {
    beforeEach(() => {
      registerAuthIntercepts();
      LoginPage.visit();
    });

    it('rejects login and keeps the user on /#/login when credentials are invalid', () => {
      cy.step('Submit invalid user credentials from fixture');
      cy.fixture('users').then(({ invalidUser }) => {
        LoginPage.submit(invalidUser.email, invalidUser.password);
      });

      cy.step('Verify 401 response and visible error banner');
      cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);
      cy.url().should('include', LoginPage.url);
      LoginPage.errorBanner.should('be.visible');
    });

    it('keeps the login submit button disabled when email and password are empty', () => {
      cy.step('Verify submit button is disabled on initial empty form');
      LoginPage.loginButton.should('be.disabled');
    });
  }
);
