class CatalogPage {
  get url() {
    return '/#/search';
  }

  get productCards() {
    return cy.get('mat-grid-tile');
  }

  get searchIcon() {
    return cy.get('#searchQuery');
  }

  // Angular Material mat-form-field wraps the actual <input> inside #searchQuery.
  get searchInput() {
    return cy.get('#searchQuery input');
  }

  get accountMenuButton() {
    return cy.get('#navbarAccount');
  }

  get loginMenuButton() {
    return cy.get('#navbarLoginButton');
  }

  get basketButton() {
    return cy.get('button[routerlink="/basket"]');
  }

  get emptyResultHeading() {
    return cy.get('.noResultText');
  }

  visit() {
    cy.dismissOverlays();
    cy.visit(this.url);
  }

  search(term) {
    this.searchIcon.click();
    this.searchInput.clear().type(`${term}{enter}`);
  }

  addFirstAvailableProductToBasket() {
    return this.productCards
      .first()
      .find('button[aria-label="Add to Basket"]')
      .click();
  }
}

export default new CatalogPage();
