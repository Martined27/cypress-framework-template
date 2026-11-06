// Product catalog search and filtering regression tests.
import CatalogPage from '../../pages/CatalogPage';
import { registerCatalogIntercepts } from '../../helpers/intercepts';

describe(
  'Product Catalog Search & Filtering',
  { tags: ['@regression', '#integration', '#staging', '#prod'] },
  () => {
    beforeEach(() => {
      registerCatalogIntercepts();
      CatalogPage.visit();
      cy.wait('@productSearch');
    });

    it('filters the product grid to matching items when searching by keyword', () => {
      cy.step('Search catalog for keyword "Apple"');
      CatalogPage.search('Apple');

      cy.step('Verify URL query parameter and filtered product card count');
      cy.url().should('include', 'q=Apple');
      CatalogPage.productCards.should('have.length.greaterThan', 0);
      CatalogPage.productCards.should('have.length.lessThan', 12);
    });

    it('displays the empty-results state when no product matches the query', () => {
      cy.step('Search catalog for a non-existent product query');
      CatalogPage.search('zz-nonexistent-item-9999');

      cy.step('Verify zero product cards and visible empty-results state');
      cy.url().should('include', 'q=zz-nonexistent-item-9999');
      CatalogPage.productCards.should('have.length', 0);
      CatalogPage.emptyResultHeading.should('be.visible');
    });
  }
);
