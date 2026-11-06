// Scoped shopping-basket & catalog API helpers.
// Imported only by catalog and basket specs to seed or clean state via REST.

export function clearBasketViaApi(token, bid) {
  return cy
    .request({
      method: 'GET',
      url: `/rest/basket/${bid}`,
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const items = res.body?.data?.Products || [];
      items.forEach((product) => {
        const basketItemId = product.BasketItem?.id;
        if (basketItemId) {
          cy.request({
            method: 'DELETE',
            url: `/api/BasketItems/${basketItemId}`,
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      });
    });
}

export function seedBasketItemViaApi(token, bid, productId = 1, quantity = 1) {
  return cy.request({
    method: 'POST',
    url: '/api/BasketItems/',
    headers: { Authorization: `Bearer ${token}` },
    body: {
      ProductId: productId,
      BasketId: String(bid),
      quantity,
    },
  });
}

export function searchProductsViaApi(query) {
  return cy.request({
    method: 'GET',
    url: `/rest/products/search?q=${encodeURIComponent(query)}`,
  });
}
