// Authenticated shopping basket lifecycle seeded via REST API helpers.
import BasketPage from '../../pages/BasketPage';
import { ensureTestUserExists, authenticateViaApi } from '../../helpers/auth.helpers';
import { clearBasketViaApi, seedBasketItemViaApi } from '../../helpers/basket.helpers';
import { registerBasketIntercepts } from '../../helpers/intercepts';

describe(
  'Shopping Basket Management',
  { tags: ['@regression', '#integration', '#staging'] },
  () => {
    beforeEach(() => {
      registerBasketIntercepts();
      ensureTestUserExists().then(() => {
        authenticateViaApi().then(({ token, bid }) => {
          clearBasketViaApi(token, bid).then(() => {
            seedBasketItemViaApi(token, bid, 1, 2);
          });
        });
      });
      cy.loginViaApi();
    });

    it('renders API-seeded basket items and enables the checkout button', () => {
      cy.step('Open shopping basket view and wait for basket payload');
      BasketPage.visit();
      cy.wait('@getBasket').its('response.statusCode').should('be.oneOf', [200, 304]);

      cy.step('Verify seeded item row is displayed and checkout button is enabled');
      BasketPage.basketRows.should('have.length', 1);
      BasketPage.checkoutButton.should('not.be.disabled');
    });

    it('removes an item from the basket and disables checkout when empty', () => {
      cy.step('Open shopping basket with seeded item');
      BasketPage.visit();
      cy.wait('@getBasket');

      cy.step('Delete item from basket and verify empty basket state');
      BasketPage.removeFirstItem();
      cy.wait('@deleteBasketItem').its('response.statusCode').should('eq', 200);
      BasketPage.basketRows.should('have.length', 0);
      BasketPage.checkoutButton.should('be.disabled');
    });
  }
);
