// Smoke checks for core REST API readiness and authentication token issuance.
import { authenticateViaApi } from '../../helpers/auth.helpers';

describe(
  'Core REST API Smoke Suite',
  { tags: ['@smoke', '@api', '#integration', '#staging', '#prod'] },
  () => {
    it('returns a non-empty product list from the catalog search endpoint', () => {
      cy.step('Request product catalog list via REST API');
      cy.request(`${Cypress.env('apiUrl')}/products`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.be.an('array').and.not.be.empty;
      });
    });

    it(
      'issues a signed JWT on valid user login',
      { tags: ['#integration', '#staging'] },
      () => {
        cy.step('Authenticate test user against POST /users/login');
        authenticateViaApi().then(({ token, email }) => {
          expect(token).to.be.a('string').and.not.be.empty;
          expect(email).to.eq(Cypress.env('TEST_EMAIL'));
        });
      }
    );
  }
);
