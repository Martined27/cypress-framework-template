// Scoped shopping-basket API helpers.
// Used to seed cart state via REST endpoints before checkout tests.

export function createCartViaApi() {
  const apiUrl = Cypress.env('apiUrl') || 'https://api.practicesoftwaretesting.com';
  return cy
    .request({
      method: 'POST',
      url: `${apiUrl}/carts`,
    })
    .then((res) => {
      expect(res.status).to.eq(201);
      return res.body.id;
    });
}

export function seedBasketItemViaApi(cartId, productId, quantity = 2) {
  const apiUrl = Cypress.env('apiUrl') || 'https://api.practicesoftwaretesting.com';
  const resolveProductId = productId
    ? cy.wrap(productId)
    : cy.request(`${apiUrl}/products`).then((res) => res.body.data[0].id);

  return resolveProductId.then((validId) => {
    return cy.request({
      method: 'POST',
      url: `${apiUrl}/carts/${cartId}`,
      body: {
        product_id: validId,
        quantity,
      },
    });
  });
}
