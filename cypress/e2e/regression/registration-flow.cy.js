// End-to-end customer registration walkthrough using RegistrationPage.submit().
import RegistrationPage from '../../pages/RegistrationPage';
import LoginPage from '../../pages/LoginPage';
import { uniqueEmail } from '../../helpers/auth.helpers';
import { registerAuthIntercepts } from '../../helpers/intercepts';

describe('Customer Registration Walkthrough', { tags: ['@regression'] }, () => {
  it('registers a new account and redirects to the login screen', () => {
    const newEmail = uniqueEmail('new.customer');
    registerAuthIntercepts();

    RegistrationPage.visit();
    RegistrationPage.submit({
      email: newEmail,
      password: Cypress.env('TEST_PASSWORD'),
      answer: 'automation-test',
    });

    cy.wait('@registerUser').its('response.statusCode').should('eq', 201);
    cy.url().should('include', LoginPage.url);
  });
});
