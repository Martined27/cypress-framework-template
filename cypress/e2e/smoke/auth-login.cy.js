// Smoke check for end-to-end user login via UI using LoginPage.submit().
import LoginPage from '../../pages/LoginPage';
import CatalogPage from '../../pages/CatalogPage';
import { ensureTestUserExists } from '../../helpers/auth.helpers';
import { registerAuthIntercepts } from '../../helpers/intercepts';

describe('Authentication Login Smoke Suite', { tags: ['@smoke'] }, () => {
  before(() => {
    ensureTestUserExists();
  });

  it('authenticates a registered user and redirects to the product catalog', () => {
    registerAuthIntercepts();
    LoginPage.visit();
    LoginPage.submit(Cypress.env('TEST_EMAIL'), Cypress.env('TEST_PASSWORD'));

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    cy.url().should('include', CatalogPage.url);
    CatalogPage.basketButton.should('be.visible');
  });
});
