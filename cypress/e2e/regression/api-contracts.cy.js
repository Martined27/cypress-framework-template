// Authenticated REST API contract and authorization checks.
import { authenticateViaApi } from '../../helpers/auth.helpers';

describe(
  'Authenticated REST API Contracts',
  { tags: ['@regression', '@api', '#integration', '#staging'] },
  () => {
    it('returns the authenticated user profile from /users/me when session token is valid', () => {
      cy.step('Authenticate via REST and verify /users/me returns caller profile');
      authenticateViaApi().then(({ token, email }) => {
        cy.request({
          method: 'GET',
          url: `${Cypress.env('apiUrl')}/users/me`,
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body.email).to.eq(email);
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('first_name');
        });
      });
    });

    it(
      'rejects unauthenticated access to protected user profile endpoint with 401',
      { tags: ['#integration', '#staging', '#prod'] },
      () => {
        cy.step('Request /users/me without authorization token and verify 401');
        cy.request({
          method: 'GET',
          url: `${Cypress.env('apiUrl')}/users/me`,
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(401);
        });
      }
    );

    it('returns structured product pagination and schema from /products endpoint', () => {
      cy.step('Request /products and assert pagination schema');
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/products`,
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('current_page');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array').that.is.not.empty;
        const firstItem = res.body.data[0];
        expect(firstItem).to.have.property('id');
        expect(firstItem).to.have.property('name');
        expect(firstItem).to.have.property('price');
      });
    });
  }
);
