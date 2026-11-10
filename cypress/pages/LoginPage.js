const LoginPage = {
  url: '/auth/login',
  emailInput: () => cy.get('[data-test="email"]'),
  passwordInput: () => cy.get('#password'),
  loginButton: () => cy.get('[data-test="login-submit"]'),
  errorBanner: () => cy.get('[data-test="login-error"]'),
  emailError: () => cy.get('[data-test="email-error"]'),
  newCustomerLink: () => cy.get('[data-test="register-link"]'),
  accountMenuButton: () => cy.get('[data-test="nav-menu"]'),

  visit: () => cy.visit('/auth/login'),
  submit: (email, password) => {
    if (email) LoginPage.emailInput().clear().type(email);
    if (password) LoginPage.passwordInput().clear().type(password, { log: false });
    LoginPage.loginButton().click();
  },
};

export default LoginPage;
