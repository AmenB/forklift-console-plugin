declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(providerName?: string, username?: string, password?: string): Chainable<Element>;
      logout(): Chainable<Element>;
    }
  }
}

const KUBEADMIN_USERNAME = 'kubeadmin';
const KUBEADMIN_IDP = 'kube:admin';

Cypress.Commands.add('login', (provider: string, username: string, password: string) => {
  // Check if auth is disabled (for a local development environment).
  cy.visit(''); // visits baseUrl which is set in plugins.js
  cy.window().then((win: any) => {
    console.log('Password value:', password, Cypress.env('BRIDGE_KUBEADMIN_PASSWORD'));
    console.log('Password value:', password, Cypress.env('VMWARE_URL'));

    // if (win.SERVER_FLAGS?.authDisabled) {
    //   cy.task('log', '  skipping login, console is running with auth disabled');
    //   return;
    // }
    // Make sure we clear the cookie in case a previous test failed to logout.
    cy.clearCookie('openshift-session-token');

    cy.get('[data-test-id=login]', { timeout: 60000 }).should('be.visible');
    const idp = provider || KUBEADMIN_IDP;
    // cy.task('log', `  Logging in as ${username || KUBEADMIN_USERNAME}`);
    cy.get('[data-test-id="login"]').should('be.visible');
    cy.get('body').then(($body) => {
      if ($body.text().includes(idp)) {
        cy.contains(idp).should('be.visible').click();
      }
    });
    cy.get('#inputUsername').type(username || KUBEADMIN_USERNAME);
    cy.get('#inputPassword').type(password || Cypress.env('BRIDGE_KUBEADMIN_PASSWORD'));
    cy.get('button[type=submit]').click();
    // cy.get('[data-test="user-dropdown-toggle"]', { timeout: 60000 }).should('be.visible');
  });
});

// Cypress.Commands.add('logout', () => {
//   // Check if auth is disabled (for a local development environment).
//   cy.window().then((win: any) => {
//     if (win.SERVER_FLAGS?.authDisabled) {
//       cy.task('log', '  skipping logout, console is running with auth disabled');
//       return;
//     }
//     cy.task('log', '  Logging out');
//     cy.byTestID('user-dropdown').click();
//     cy.byTestID('log-out').should('be.visible');
//     // eslint-disable-next-line cypress/no-force
//     cy.byTestID('log-out').click();
//     cy.byLegacyTestID('login').should('be.visible');
//   });
// });
