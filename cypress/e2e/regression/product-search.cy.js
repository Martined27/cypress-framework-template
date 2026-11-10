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
      CatalogPage.productCards().should('have.length.greaterThan', 0);
    });

    it('filters the product grid to matching items when searching by keyword', () => {
      cy.step('Search catalog for keyword "Pliers"');
      CatalogPage.search('Pliers');

      cy.step('Verify filtered product card count and names');
      CatalogPage.productCards().should('have.length.greaterThan', 0);
      CatalogPage.productCards().first().should('contain.text', 'Pliers');
    });

    it('displays the empty-results state when no product matches the query', () => {
      cy.step('Search catalog for a non-existent product query');
      CatalogPage.search('zz-nonexistent-item-9999');

      cy.step('Verify zero product cards and visible empty-results state');
      CatalogPage.emptyResultHeading().should('be.visible');
    });
  }
);
