// End-to-end customer registration walkthrough using RegistrationPage.submit().
import RegistrationPage from '../../pages/RegistrationPage';
import LoginPage from '../../pages/LoginPage';
import { registerAuthIntercepts } from '../../helpers/intercepts';

describe(
  'Customer Registration Walkthrough',
  { tags: ['@regression', '#integration'] },
  () => {
    it('registers a new account and redirects to the login screen', () => {
      const stamp = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const newEmail = `new.customer.${stamp}@example.com`;
      const strongPassword = `Testing_QA_${stamp.slice(-4)}!#zX`;
      registerAuthIntercepts();

      cy.step('Navigate to customer registration form');
      RegistrationPage.visit();

      cy.step('Complete and submit registration form via RegistrationPage.submit()');
      RegistrationPage.submit({
        firstName: 'Jane',
        lastName: 'Automation',
        dob: '1995-05-15',
        street: '100 Automation Way',
        houseNumber: '10',
        postalCode: '10001',
        city: 'New York',
        state: 'NY',
        country: 'US',
        phone: '2125550199',
        email: newEmail,
        password: strongPassword,
      });

      cy.step('Verify 201 Created API response and redirect to /auth/login');
      cy.wait('@registerUser').its('response.statusCode').should('eq', 201);
      cy.url().should('include', LoginPage.url);
    });
  }
);
