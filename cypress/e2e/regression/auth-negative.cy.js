// Negative authentication tests for invalid credentials and empty fields.
import LoginPage from '../../pages/LoginPage';
import { registerAuthIntercepts } from '../../helpers/intercepts';

describe(
  'Negative Authentication Scenarios',
  { tags: ['@regression', '#integration', '#staging'] },
  () => {
    beforeEach(() => {
      registerAuthIntercepts();
      LoginPage.visit();
    });

    it('displays an error message when submitting an unregistered email', () => {
      cy.fixture('users').then((users) => {
        cy.step('Attempt login with unregistered user credentials');
        LoginPage.submit(users.invalidUser.email, users.invalidUser.password);

        cy.step('Verify 401 Unauthorized API response and visible error alert');
        cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);
        cy.url().should('include', LoginPage.url);
        LoginPage.errorBanner().should('be.visible');
      });
    });

    it('shows validation error feedback when submitting an empty login form', () => {
      cy.step('Submit empty credentials form');
      LoginPage.loginButton().click();

      cy.step('Verify field-level error message is displayed');
      LoginPage.emailError().should('be.visible');
    });
  }
);
