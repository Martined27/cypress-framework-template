// Smoke checks for main product catalog rendering and navigation shell.
import CatalogPage from '../../pages/CatalogPage';
import { registerCatalogIntercepts } from '../../helpers/intercepts';

describe(
  'Product Catalog Smoke Suite',
  { tags: ['@smoke', '#integration', '#staging', '#prod'] },
  () => {
    beforeEach(() => {
      registerCatalogIntercepts();
      CatalogPage.visit();
    });

    it('renders the product grid with available items on initial load', () => {
      cy.step('Wait for catalog search API response');
      cy.wait('@productSearch').its('response.statusCode').should('be.oneOf', [200, 304]);

      cy.step('Verify product cards are rendered in the grid');
      CatalogPage.productCards.should('have.length.greaterThan', 0);
    });

    it('navigates to the login view from the top account menu', () => {
      cy.step('Open top navigation account menu');
      CatalogPage.accountMenuButton.click();

      cy.step('Select Login option and verify URL route');
      CatalogPage.loginMenuButton.click();
      cy.url().should('include', '/#/login');
    });
  }
);
