// Smoke checks for core REST API readiness and authentication token issuance.
import { ensureTestUserExists, authenticateViaApi } from '../../helpers/auth.helpers';
import { searchProductsViaApi } from '../../helpers/basket.helpers';

describe('Core REST API Smoke Suite', { tags: ['@smoke', '@api'] }, () => {
  before(() => {
    ensureTestUserExists();
  });

  it('returns a non-empty product list from the catalog search endpoint', () => {
    searchProductsViaApi('').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq('success');
      expect(response.body.data).to.be.an('array').and.not.be.empty;
    });
  });

  it('issues a signed JWT and basket ID on valid user login', () => {
    authenticateViaApi().then(({ token, bid }) => {
      expect(token).to.be.a('string').and.not.be.empty;
      expect(bid).to.be.a('number');
    });
  });
});
