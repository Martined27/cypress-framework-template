// Authenticated shopping basket lifecycle seeded via REST API helpers.
import BasketPage from '../../pages/BasketPage';
import { createCartViaApi, seedBasketItemViaApi } from '../../helpers/basket.helpers';

describe(
  'Shopping Basket Management',
  { tags: ['@regression', '#integration', '#staging'] },
  () => {
    let testCartId;

    beforeEach(() => {
      cy.intercept('GET', '**/carts/*').as('getBasket');
      cy.intercept('DELETE', '**/carts/*/product/*').as('deleteBasketItem');

      createCartViaApi().then((cartId) => {
        testCartId = cartId;
        seedBasketItemViaApi(cartId);
      });
      cy.loginViaApi();
    });

    it('renders API-seeded basket items and enables the proceed to checkout button', () => {
      cy.step('Open shopping basket view with seeded cart ID');
      BasketPage.visit(testCartId);
      cy.wait('@getBasket').its('response.statusCode').should('be.oneOf', [200, 304]);

      cy.step('Verify seeded item row is displayed and proceed button is visible');
      BasketPage.basketRows().should('have.length.at.least', 1);
      BasketPage.proceedButton().should('be.visible');
    });

    it('removes an item from the basket via the UI delete button', () => {
      cy.step('Open shopping basket with seeded item');
      BasketPage.visit(testCartId);
      cy.wait('@getBasket');

      cy.step('Delete item from basket and verify API call');
      BasketPage.basketRows().first().find('a').last().click();
      cy.wait('@deleteBasketItem').its('response.statusCode').should('eq', 204);
    });
  }
);
