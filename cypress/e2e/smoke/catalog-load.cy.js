// Smoke checks for main product catalog rendering and navigation shell.
import CatalogPage from '../../pages/CatalogPage';
import { registerCatalogIntercepts } from '../../helpers/intercepts';

describe('Product Catalog Smoke Suite', { tags: ['@smoke'] }, () => {
  beforeEach(() => {
    registerCatalogIntercepts();
    CatalogPage.visit();
  });

  it('renders the product grid with available items on initial load', () => {
    cy.wait('@productSearch').its('response.statusCode').should('be.oneOf', [200, 304]);
    CatalogPage.productCards.should('have.length.greaterThan', 0);
  });

  it('navigates to the login view from the top account menu', () => {
    CatalogPage.accountMenuButton.click();
    CatalogPage.loginMenuButton.click();
    cy.url().should('include', '/#/login');
  });
});
