// Smoke check for end-to-end user login via UI using LoginPage.submit().
import LoginPage from '../../pages/LoginPage';
import { registerAuthIntercepts } from '../../helpers/intercepts';

describe(
  'Authentication Login Smoke Suite',
  { tags: ['@smoke', '#integration', '#staging'] },
  () => {
    it('authenticates a registered user and redirects to the account view', () => {
      cy.step('Open Login page and register auth network intercept');
      registerAuthIntercepts();
      LoginPage.visit();

      cy.step('Submit valid user credentials via LoginPage.submit()');
      LoginPage.submit(Cypress.env('TEST_EMAIL'), Cypress.env('TEST_PASSWORD'));

      cy.step('Verify 200 login response and redirect to account view');
      cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
      cy.url().should('include', '/account');
      LoginPage.accountMenuButton().should('be.visible');
    });
  }
);
