class BasketPage {
  get url() {
    return '/#/basket';
  }

  get basketRows() {
    return cy.get('mat-row');
  }

  get checkoutButton() {
    return cy.get('#checkoutButton');
  }

  get totalPrice() {
    return cy.get('#price');
  }

  visit() {
    cy.dismissOverlays();
    cy.visit(this.url);
  }

  removeFirstItem() {
    return this.basketRows.first().find('.fa-trash-alt').parents('button').click();
  }
}

export default new BasketPage();
