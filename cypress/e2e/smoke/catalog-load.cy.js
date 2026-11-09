// Smoke checks for main product catalog rendering and navigation shell.
import CatalogPage from '../../pages/CatalogPage';
import { registerCatalogIntercepts } from '../../helpers/intercepts';

describe(
  'Product Catalog Smoke Suite',
  { tags: ['@smoke', '#integration', '#staging', '#prod'] },
  () => {
    beforeEach(() => {
      registerCatalogIntercepts();
    });

    it('renders the product grid with available items on initial load', () => {
      cy.step('Open catalog page');
      CatalogPage.visit();

      cy.step('Verify product cards are rendered in the grid');
      CatalogPage.productCards().should('have.length.greaterThan', 0);
    });

    it('navigates to the login view from the top navigation sign in button', () => {
      cy.step('Open catalog page');
      CatalogPage.visit();

      cy.step('Select Sign In option and verify URL route');
      CatalogPage.signInButton().click();
      cy.url().should('include', '/auth/login');
    });
  }
);
