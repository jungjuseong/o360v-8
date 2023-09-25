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

describe('JiraSetUp e2e test', () => {
  const jiraSetUpPageUrl = '/jira-set-up';
  const jiraSetUpPageUrlPattern = new RegExp('/jira-set-up(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const jiraSetUpSample = { url: 'https://partial-football.name', apiKey: 'underneath', project: 'institutionalise' };

  let jiraSetUp;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/jira-set-ups+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/jira-set-ups').as('postEntityRequest');
    cy.intercept('DELETE', '/api/jira-set-ups/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (jiraSetUp) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/jira-set-ups/${jiraSetUp.id}`,
      }).then(() => {
        jiraSetUp = undefined;
      });
    }
  });

  it('JiraSetUps menu should load JiraSetUps page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('jira-set-up');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('JiraSetUp').should('exist');
    cy.url().should('match', jiraSetUpPageUrlPattern);
  });

  describe('JiraSetUp page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(jiraSetUpPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create JiraSetUp page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/jira-set-up/new$'));
        cy.getEntityCreateUpdateHeading('JiraSetUp');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', jiraSetUpPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/jira-set-ups',
          body: jiraSetUpSample,
        }).then(({ body }) => {
          jiraSetUp = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/jira-set-ups+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [jiraSetUp],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(jiraSetUpPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details JiraSetUp page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('jiraSetUp');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', jiraSetUpPageUrlPattern);
      });

      it('edit button click should load edit JiraSetUp page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('JiraSetUp');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', jiraSetUpPageUrlPattern);
      });

      it('edit button click should load edit JiraSetUp page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('JiraSetUp');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', jiraSetUpPageUrlPattern);
      });

      it('last delete button click should delete instance of JiraSetUp', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('jiraSetUp').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', jiraSetUpPageUrlPattern);

        jiraSetUp = undefined;
      });
    });
  });

  describe('new JiraSetUp page', () => {
    beforeEach(() => {
      cy.visit(`${jiraSetUpPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('JiraSetUp');
    });

    it('should create an instance of JiraSetUp', () => {
      cy.get(`[data-cy="url"]`).type('https://adept-osprey.org/');
      cy.get(`[data-cy="url"]`).should('have.value', 'https://adept-osprey.org/');

      cy.get(`[data-cy="apiKey"]`).type('eek ah pursue');
      cy.get(`[data-cy="apiKey"]`).should('have.value', 'eek ah pursue');

      cy.get(`[data-cy="project"]`).type('never gesture now');
      cy.get(`[data-cy="project"]`).should('have.value', 'never gesture now');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        jiraSetUp = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', jiraSetUpPageUrlPattern);
    });
  });
});
