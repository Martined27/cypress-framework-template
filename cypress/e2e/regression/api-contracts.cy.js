// Authenticated REST API contract and authorization checks.
import { ensureTestUserExists, authenticateViaApi } from '../../helpers/auth.helpers';

describe(
  'Authenticated REST API Contracts',
  { tags: ['@regression', '@api', '#integration', '#staging'] },
  () => {
    before(() => {
      ensureTestUserExists();
    });

    it('returns the authenticated user profile from /rest/user/whoami when session token is valid', () => {
      cy.step('Authenticate via REST and verify /rest/user/whoami returns caller email');
      authenticateViaApi().then(({ token, umail }) => {
        cy.setCookie('token', token);
        cy.request({
          method: 'GET',
          url: '/rest/user/whoami',
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body.user.email).to.eq(umail);
        });
      });
    });

    it(
      'rejects unauthenticated access to protected basket endpoints with 401',
      { tags: ['#integration', '#staging', '#prod'] },
      () => {
        cy.step('Request /rest/basket/1 without authentication token and verify 401');
        cy.request({
          method: 'GET',
          url: '/rest/basket/1',
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(401);
        });
      }
    );
  }
);
