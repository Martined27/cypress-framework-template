// Product catalog search and filtering regression tests.
import CatalogPage from '../../pages/CatalogPage';
import { registerCatalogIntercepts } from '../../helpers/intercepts';

describe('Product Catalog Search & Filtering', { tags: ['@regression'] }, () => {
  beforeEach(() => {
    registerCatalogIntercepts();
    CatalogPage.visit();
    cy.wait('@productSearch');
  });

  it('filters the product grid to matching items when searching by keyword', () => {
    CatalogPage.search('Apple');
    cy.url().should('include', 'q=Apple');
    CatalogPage.productCards.should('have.length.greaterThan', 0);
    CatalogPage.productCards.should('have.length.lessThan', 12);
  });

  it('displays the empty-results state when no product matches the query', () => {
    CatalogPage.search('zz-nonexistent-item-9999');
    cy.url().should('include', 'q=zz-nonexistent-item-9999');
    CatalogPage.productCards.should('have.length', 0);
    CatalogPage.emptyResultHeading.should('be.visible');
  });
});
