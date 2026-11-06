// Global Cypress support entry point.
import 'cypress-mochawesome-reporter/register';
import 'cypress-plugin-steps';
import registerCypressGrep from '@cypress/grep/src/support';
import './commands';

registerCypressGrep();
