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

describe('ProjectDate e2e test', () => {
  const projectDatePageUrl = '/project-date';
  const projectDatePageUrlPattern = new RegExp('/project-date(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const projectDateSample = {"date":"2023-09-17"};

  let projectDate;
  // let project;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/projects',
      body: {"code":"before","title":"notable ah","fiscalYear":"2023-09-16","budget":10465.82,"createdDate":"2023-09-16","startDate":"2023-09-17","deploymentDate":"2023-09-16","endDate":"2023-09-16","description":"since down phooey","poNumber":"atop whoever","jiraCode":"caftan disloyal","jiraUpdate":"2023-09-16","projectStatus":"READY","projectFinancialStatus":"POOR"},
    }).then(({ body }) => {
      project = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/project-dates+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/project-dates').as('postEntityRequest');
    cy.intercept('DELETE', '/api/project-dates/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/projects', {
      statusCode: 200,
      body: [project],
    });

  });
   */

  afterEach(() => {
    if (projectDate) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/project-dates/${projectDate.id}`,
      }).then(() => {
        projectDate = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
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
   */

  it('ProjectDates menu should load ProjectDates page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('project-date');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ProjectDate').should('exist');
    cy.url().should('match', projectDatePageUrlPattern);
  });

  describe('ProjectDate page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(projectDatePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ProjectDate page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/project-date/new$'));
        cy.getEntityCreateUpdateHeading('ProjectDate');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectDatePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/project-dates',
          body: {
            ...projectDateSample,
            project: project,
          },
        }).then(({ body }) => {
          projectDate = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/project-dates+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [projectDate],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(projectDatePageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(projectDatePageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details ProjectDate page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('projectDate');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectDatePageUrlPattern);
      });

      it('edit button click should load edit ProjectDate page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ProjectDate');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectDatePageUrlPattern);
      });

      it('edit button click should load edit ProjectDate page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ProjectDate');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectDatePageUrlPattern);
      });

      it.skip('last delete button click should delete instance of ProjectDate', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('projectDate').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectDatePageUrlPattern);

        projectDate = undefined;
      });
    });
  });

  describe('new ProjectDate page', () => {
    beforeEach(() => {
      cy.visit(`${projectDatePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ProjectDate');
    });

    it.skip('should create an instance of ProjectDate', () => {
      cy.get(`[data-cy="date"]`).type('2023-09-16');
      cy.get(`[data-cy="date"]`).blur();
      cy.get(`[data-cy="date"]`).should('have.value', '2023-09-16');

      cy.get(`[data-cy="projectDateType"]`).select('DATE_TYPE1');

      cy.get(`[data-cy="project"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        projectDate = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', projectDatePageUrlPattern);
    });
  });
});
