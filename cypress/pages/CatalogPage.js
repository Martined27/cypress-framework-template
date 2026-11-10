const CatalogPage = {
  url: '/',
  productCards: () => cy.get('[data-test="product-name"]'),
  searchInput: () => cy.get('[data-test="search-query"]'),
  searchSubmitButton: () => cy.get('[data-test="search-submit"]'),
  searchResetButton: () => cy.get('[data-test="search-reset"]'),
  emptyResultHeading: () => cy.get('[data-test="no-results"]'),
  accountMenuButton: () => cy.get('[data-test="nav-menu"]'),
  signInButton: () => cy.get('[data-test="nav-sign-in"]'),
  basketButton: () => cy.get('[data-test="nav-cart"]'),
  cartQuantity: () => cy.get('[data-test="cart-quantity"]'),

  visit: () => cy.visit('/'),
  search: (term) => {
    CatalogPage.searchInput().clear().type(term);
    CatalogPage.searchSubmitButton().click();
  },
};

export default CatalogPage;
