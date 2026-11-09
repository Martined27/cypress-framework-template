const BasketPage = {
  url: '/checkout',
  basketRows: () => cy.get('table tbody tr'),
  productTitle: () => cy.get('[data-test="product-title"]'),
  productQuantity: () => cy.get('[data-test="product-quantity"]'),
  cartTotal: () => cy.get('[data-test="cart-total"]'),
  proceedButton: () => cy.get('[data-test="proceed-1"]'),

  visit: (cartId) => {
    cy.visit('/checkout', {
      onBeforeLoad(win) {
        if (cartId) {
          win.sessionStorage.setItem('cart_id', cartId);
        }
      },
    });
  },
};

export default BasketPage;
