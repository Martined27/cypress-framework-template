class LoginPage {
  get url() {
    return '/#/login';
  }

  get emailInput() {
    return cy.get('#email');
  }

  get passwordInput() {
    return cy.get('#password');
  }

  get loginButton() {
    return cy.get('#loginButton');
  }

  get errorBanner() {
    return cy.get('.error');
  }

  get newCustomerLink() {
    return cy.get('#newCustomerLink a');
  }

  visit() {
    cy.dismissOverlays();
    cy.visit(this.url);
  }

  // Scoped submit method on LoginPage — avoids colliding with RegistrationPage.submit() on global cy.*
  submit(email, password) {
    this.emailInput.clear().type(email);
    this.passwordInput.clear().type(password, { log: false });
    this.loginButton.click();
  }
}

export default new LoginPage();
