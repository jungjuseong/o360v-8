import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('AccountNumber e2e test', () => {
  const accountNumberPageUrl = '/account-number';
  const accountNumberPageUrlPattern = new RegExp('/account-number(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const accountNumberSample = { accountNumber: 'amid right' };

  let accountNumber;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/account-numbers+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/account-numbers').as('postEntityRequest');
    cy.intercept('DELETE', '/api/account-numbers/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (accountNumber) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/account-numbers/${accountNumber.id}`,
      }).then(() => {
        accountNumber = undefined;
      });
    }
  });

  it('AccountNumbers menu should load AccountNumbers page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('account-number');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('AccountNumber').should('exist');
    cy.url().should('match', accountNumberPageUrlPattern);
  });

  describe('AccountNumber page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(accountNumberPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create AccountNumber page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/account-number/new$'));
        cy.getEntityCreateUpdateHeading('AccountNumber');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', accountNumberPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/account-numbers',
          body: accountNumberSample,
        }).then(({ body }) => {
          accountNumber = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/account-numbers+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [accountNumber],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(accountNumberPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details AccountNumber page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('accountNumber');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', accountNumberPageUrlPattern);
      });

      it('edit button click should load edit AccountNumber page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AccountNumber');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', accountNumberPageUrlPattern);
      });

      it('edit button click should load edit AccountNumber page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AccountNumber');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', accountNumberPageUrlPattern);
      });

      it('last delete button click should delete instance of AccountNumber', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('accountNumber').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', accountNumberPageUrlPattern);

        accountNumber = undefined;
      });
    });
  });

  describe('new AccountNumber page', () => {
    beforeEach(() => {
      cy.visit(`${accountNumberPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('AccountNumber');
    });

    it('should create an instance of AccountNumber', () => {
      cy.get(`[data-cy="accountNumber"]`).type('method soulful basis');
      cy.get(`[data-cy="accountNumber"]`).should('have.value', 'method soulful basis');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        accountNumber = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', accountNumberPageUrlPattern);
    });
  });
});
