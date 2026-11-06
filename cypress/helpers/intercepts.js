// Shared network intercept registration helper.

export function registerCatalogIntercepts() {
  cy.intercept('GET', '/rest/products/search*').as('productSearch');
  cy.intercept('GET', '/api/Quantitys*').as('productQuantities');
}

export function registerAuthIntercepts() {
  cy.intercept('POST', '/rest/user/login').as('loginRequest');
  cy.intercept('POST', '/api/Users*').as('registerUser');
}

export function registerBasketIntercepts() {
  cy.intercept('GET', '/rest/basket/*').as('getBasket');
  cy.intercept('POST', '/api/BasketItems*').as('addBasketItem');
  cy.intercept('DELETE', '/api/BasketItems/*').as('deleteBasketItem');
}
