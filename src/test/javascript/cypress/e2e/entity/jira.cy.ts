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

describe('Jira e2e test', () => {
  const jiraPageUrl = '/jira';
  const jiraPageUrlPattern = new RegExp('/jira(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const jiraSample = { url: 'https://treasured-icon.org/', apiKey: 'trustworthy son wince', project: 'sadly household' };

  let jira;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/jiras+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/jiras').as('postEntityRequest');
    cy.intercept('DELETE', '/api/jiras/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (jira) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/jiras/${jira.id}`,
      }).then(() => {
        jira = undefined;
      });
    }
  });

  it('Jiras menu should load Jiras page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('jira');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Jira').should('exist');
    cy.url().should('match', jiraPageUrlPattern);
  });

  describe('Jira page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(jiraPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Jira page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/jira/new$'));
        cy.getEntityCreateUpdateHeading('Jira');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', jiraPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/jiras',
          body: jiraSample,
        }).then(({ body }) => {
          jira = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/jiras+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [jira],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(jiraPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Jira page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('jira');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', jiraPageUrlPattern);
      });

      it('edit button click should load edit Jira page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Jira');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', jiraPageUrlPattern);
      });

      it('edit button click should load edit Jira page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Jira');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', jiraPageUrlPattern);
      });

      it('last delete button click should delete instance of Jira', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('jira').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', jiraPageUrlPattern);

        jira = undefined;
      });
    });
  });

  describe('new Jira page', () => {
    beforeEach(() => {
      cy.visit(`${jiraPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Jira');
    });

    it('should create an instance of Jira', () => {
      cy.get(`[data-cy="url"]`).type('https://equatorial-tulip.net');
      cy.get(`[data-cy="url"]`).should('have.value', 'https://equatorial-tulip.net');

      cy.get(`[data-cy="apiKey"]`).type('kiddingly outclass');
      cy.get(`[data-cy="apiKey"]`).should('have.value', 'kiddingly outclass');

      cy.get(`[data-cy="project"]`).type('righteously');
      cy.get(`[data-cy="project"]`).should('have.value', 'righteously');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        jira = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', jiraPageUrlPattern);
    });
  });
});
