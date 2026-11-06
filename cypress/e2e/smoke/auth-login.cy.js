// Smoke check for end-to-end user login via UI using LoginPage.submit().
import LoginPage from '../../pages/LoginPage';
import CatalogPage from '../../pages/CatalogPage';
import { ensureTestUserExists } from '../../helpers/auth.helpers';
import { registerAuthIntercepts } from '../../helpers/intercepts';

describe(
  'Authentication Login Smoke Suite',
  { tags: ['@smoke', '#integration', '#staging'] },
  () => {
    before(() => {
      ensureTestUserExists();
    });

    it('authenticates a registered user and redirects to the product catalog', () => {
      cy.step('Open Login page and register auth network intercept');
      registerAuthIntercepts();
      LoginPage.visit();

      cy.step('Submit valid user credentials via LoginPage.submit()');
      LoginPage.submit(Cypress.env('TEST_EMAIL'), Cypress.env('TEST_PASSWORD'));

      cy.step('Verify 200 login response and redirect to authenticated catalog');
      cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
      cy.url().should('include', CatalogPage.url);
      CatalogPage.basketButton.should('be.visible');
    });
  }
);
