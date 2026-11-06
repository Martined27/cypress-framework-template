class RegistrationPage {
  get url() {
    return '/#/register';
  }

  get emailInput() {
    return cy.get('#emailControl');
  }

  get passwordInput() {
    return cy.get('#passwordControl');
  }

  get repeatPasswordInput() {
    return cy.get('#repeatPasswordControl');
  }

  // Angular Material mat-select renders options in an overlay container outside the form DOM tree.
  get securityQuestionSelect() {
    return cy.get('mat-select[name="securityQuestion"]');
  }

  get securityQuestionOptions() {
    return cy.get('mat-option');
  }

  get securityAnswerInput() {
    return cy.get('#securityAnswerControl');
  }

  get registerButton() {
    return cy.get('#registerButton');
  }

  visit() {
    cy.dismissOverlays();
    cy.visit(this.url);
  }

  // Scoped submit method on RegistrationPage — shares the clean .submit() name without global command conflict.
  submit({ email, password, answer = 'qa-answer' }) {
    this.emailInput.clear().type(email);
    this.passwordInput.clear().type(password, { log: false });
    this.repeatPasswordInput.clear().type(password, { log: false });
    this.securityQuestionSelect.click();
    this.securityQuestionOptions.first().click();
    this.securityAnswerInput.clear().type(answer);
    this.registerButton.click();
  }
}

export default new RegistrationPage();
