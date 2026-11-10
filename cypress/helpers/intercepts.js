// Shared network intercept registration helpers.
// Used across multiple test suites for catalog and authentication endpoints.

export function registerCatalogIntercepts() {
  cy.intercept('**/products*').as('productSearch');
}

export function registerAuthIntercepts() {
  cy.intercept('POST', '**/users/login').as('loginRequest');
  cy.intercept('POST', '**/users/register').as('registerUser');
}
