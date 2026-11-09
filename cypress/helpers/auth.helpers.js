// Scoped authentication API helpers.
// Shared across specs and custom commands that obtain bearer tokens.

export function authenticateViaApi(
  email = Cypress.env('TEST_EMAIL'),
  password = Cypress.env('TEST_PASSWORD')
) {
  const apiUrl = Cypress.env('apiUrl') || 'https://api.practicesoftwaretesting.com';
  return cy
    .request({
      method: 'POST',
      url: `${apiUrl}/users/login`,
      body: { email, password },
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      return {
        token: response.body.access_token,
        email,
      };
    });
}
