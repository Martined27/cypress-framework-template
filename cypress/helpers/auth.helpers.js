// Scoped authentication & user-provisioning API helpers.
// Imported explicitly only in specs or commands that manage user state.

export function uniqueEmail(prefix = 'qa.user') {
  const stamp = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  return `${prefix}.${stamp}@example.com`;
}

export function ensureTestUserExists(
  email = Cypress.env('TEST_EMAIL'),
  password = Cypress.env('TEST_PASSWORD')
) {
  return cy.request({
    method: 'POST',
    url: '/api/Users/',
    failOnStatusCode: false,
    body: {
      email,
      password,
      passwordRepeat: password,
      securityQuestion: {
        id: 1,
        question: 'Your eldest siblings middle name?',
      },
      securityAnswer: 'qa-automation',
    },
  });
}

export function authenticateViaApi(
  email = Cypress.env('TEST_EMAIL'),
  password = Cypress.env('TEST_PASSWORD')
) {
  return cy
    .request({
      method: 'POST',
      url: '/rest/user/login',
      body: { email, password },
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      return {
        token: response.body.authentication.token,
        bid: response.body.authentication.bid,
        umail: response.body.authentication.umail,
      };
    });
}
