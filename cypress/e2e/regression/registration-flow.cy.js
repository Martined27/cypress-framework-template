// End-to-end customer registration walkthrough using RegistrationPage.submit().
import RegistrationPage from '../../pages/RegistrationPage';
import LoginPage from '../../pages/LoginPage';
import { uniqueEmail } from '../../helpers/auth.helpers';
import { registerAuthIntercepts } from '../../helpers/intercepts';

describe(
  'Customer Registration Walkthrough',
  { tags: ['@regression', '#integration'] },
  () => {
    it('registers a new account and redirects to the login screen', () => {
      const newEmail = uniqueEmail('new.customer');
      registerAuthIntercepts();

      cy.step('Navigate to customer registration form');
      RegistrationPage.visit();

      cy.step('Complete and submit registration form via RegistrationPage.submit()');
      RegistrationPage.submit({
        email: newEmail,
        password: Cypress.env('TEST_PASSWORD'),
        answer: 'automation-test',
      });

      cy.step('Verify 201 Created API response and redirect to /#/login');
      cy.wait('@registerUser').its('response.statusCode').should('eq', 201);
      cy.url().should('include', LoginPage.url);
    });
  }
);
