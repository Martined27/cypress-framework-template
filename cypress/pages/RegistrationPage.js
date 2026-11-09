const RegistrationPage = {
  url: '/auth/register',
  firstNameInput: () => cy.get('[data-test="first-name"]'),
  lastNameInput: () => cy.get('[data-test="last-name"]'),
  dobInput: () => cy.get('[data-test="dob"]'),
  streetInput: () => cy.get('[data-test="street"]'),
  houseNumberInput: () => cy.get('[data-test="house_number"]'),
  postalCodeInput: () => cy.get('[data-test="postal_code"]'),
  cityInput: () => cy.get('[data-test="city"]'),
  stateInput: () => cy.get('[data-test="state"]'),
  countrySelect: () => cy.get('[data-test="country"]'),
  phoneInput: () => cy.get('[data-test="phone"]'),
  emailInput: () => cy.get('[data-test="email"]'),
  passwordInput: () => cy.get('#password'),
  registerButton: () => cy.get('[data-test="register-submit"]'),
  errorBanner: () => cy.get('[data-test="register-error"]'),

  visit: () => cy.visit('/auth/register'),
  submit: ({
    firstName = 'Jane',
    lastName = 'Doe',
    dob = '1992-04-12',
    street = '123 Testing Ave',
    houseNumber = '10',
    postalCode = '12345',
    city = 'Anytown',
    state = 'NY',
    country = 'US',
    phone = '5551234567',
    email,
    password,
  }) => {
    RegistrationPage.firstNameInput().clear().type(firstName);
    RegistrationPage.lastNameInput().clear().type(lastName);
    RegistrationPage.dobInput().clear().type(dob);
    RegistrationPage.streetInput().clear().type(street);
    RegistrationPage.houseNumberInput().clear().type(houseNumber);
    RegistrationPage.postalCodeInput().clear().type(postalCode);
    RegistrationPage.cityInput().clear().type(city);
    RegistrationPage.stateInput().clear().type(state);
    RegistrationPage.countrySelect().select(country);
    RegistrationPage.phoneInput().clear().type(phone);
    RegistrationPage.emailInput().clear().type(email);
    RegistrationPage.passwordInput().clear().type(password, { log: false });
    RegistrationPage.registerButton().click();
  },
};

export default RegistrationPage;
