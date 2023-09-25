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

describe('Project e2e test', () => {
  const projectPageUrl = '/project';
  const projectPageUrlPattern = new RegExp('/project(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const projectSample = {"code":"nor","title":"short-term","fiscalYear":"2023-09-16","budget":11543.09,"createdDate":"2023-09-16","startDate":"2023-09-17","deploymentDate":"2023-09-16","endDate":"2023-09-17","poNumber":"gee yahoo content"};

  let project;
  // let channel;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/channels',
      body: {"channelType":"ZOOM"},
    }).then(({ body }) => {
      channel = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/projects+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/projects').as('postEntityRequest');
    cy.intercept('DELETE', '/api/projects/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/projects', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/project-dates', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/stakeholders', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/project-files', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/project-comments', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/countries', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/project-goals', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/channels', {
      statusCode: 200,
      body: [channel],
    });

    cy.intercept('GET', '/api/cost-centers', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/account-numbers', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/project-owners', {
      statusCode: 200,
      body: [],
    });

  });
   */

  afterEach(() => {
    if (project) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/projects/${project.id}`,
      }).then(() => {
        project = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
  afterEach(() => {
    if (channel) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/channels/${channel.id}`,
      }).then(() => {
        channel = undefined;
      });
    }
  });
   */

  it('Projects menu should load Projects page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('project');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Project').should('exist');
    cy.url().should('match', projectPageUrlPattern);
  });

  describe('Project page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(projectPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Project page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/project/new$'));
        cy.getEntityCreateUpdateHeading('Project');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/projects',
          body: {
            ...projectSample,
            channel: channel,
          },
        }).then(({ body }) => {
          project = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/projects+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [project],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(projectPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(projectPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details Project page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('project');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectPageUrlPattern);
      });

      it('edit button click should load edit Project page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Project');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectPageUrlPattern);
      });

      it('edit button click should load edit Project page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Project');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of Project', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('project').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectPageUrlPattern);

        project = undefined;
      });
    });
  });

  describe('new Project page', () => {
    beforeEach(() => {
      cy.visit(`${projectPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Project');
    });

    it.skip('should create an instance of Project', () => {
      cy.get(`[data-cy="code"]`).type('by');
      cy.get(`[data-cy="code"]`).should('have.value', 'by');

      cy.get(`[data-cy="title"]`).type('feminize second stew');
      cy.get(`[data-cy="title"]`).should('have.value', 'feminize second stew');

      cy.get(`[data-cy="fiscalYear"]`).type('2023-09-17');
      cy.get(`[data-cy="fiscalYear"]`).blur();
      cy.get(`[data-cy="fiscalYear"]`).should('have.value', '2023-09-17');

      cy.get(`[data-cy="budget"]`).type('24316.33');
      cy.get(`[data-cy="budget"]`).should('have.value', '24316.33');

      cy.get(`[data-cy="createdDate"]`).type('2023-09-16');
      cy.get(`[data-cy="createdDate"]`).blur();
      cy.get(`[data-cy="createdDate"]`).should('have.value', '2023-09-16');

      cy.get(`[data-cy="startDate"]`).type('2023-09-16');
      cy.get(`[data-cy="startDate"]`).blur();
      cy.get(`[data-cy="startDate"]`).should('have.value', '2023-09-16');

      cy.get(`[data-cy="deploymentDate"]`).type('2023-09-17');
      cy.get(`[data-cy="deploymentDate"]`).blur();
      cy.get(`[data-cy="deploymentDate"]`).should('have.value', '2023-09-17');

      cy.get(`[data-cy="endDate"]`).type('2023-09-16');
      cy.get(`[data-cy="endDate"]`).blur();
      cy.get(`[data-cy="endDate"]`).should('have.value', '2023-09-16');

      cy.get(`[data-cy="description"]`).type('unless tobacco');
      cy.get(`[data-cy="description"]`).should('have.value', 'unless tobacco');

      cy.get(`[data-cy="poNumber"]`).type('versus hmph');
      cy.get(`[data-cy="poNumber"]`).should('have.value', 'versus hmph');

      cy.get(`[data-cy="jiraCode"]`).type('furthermore');
      cy.get(`[data-cy="jiraCode"]`).should('have.value', 'furthermore');

      cy.get(`[data-cy="jiraUpdate"]`).type('2023-09-16');
      cy.get(`[data-cy="jiraUpdate"]`).blur();
      cy.get(`[data-cy="jiraUpdate"]`).should('have.value', '2023-09-16');

      cy.get(`[data-cy="projectStatus"]`).select('READY');

      cy.get(`[data-cy="projectFinancialStatus"]`).select('BAD');

      cy.get(`[data-cy="channel"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        project = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', projectPageUrlPattern);
    });
  });
});
