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

describe('ProjectFile e2e test', () => {
  const projectFilePageUrl = '/project-file';
  const projectFilePageUrlPattern = new RegExp('/project-file(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const projectFileSample = {"file":"Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci5wbmc=","fileContentType":"unknown","name":"fooey"};

  let projectFile;
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
      body: {"code":"behind basic while","title":"although scarcely warlike","fiscalYear":"2023-09-16","budget":2714.72,"createdDate":"2023-09-16","startDate":"2023-09-16","deploymentDate":"2023-09-16","endDate":"2023-09-17","description":"shadow authentic","poNumber":"program of","jiraCode":"sarcastic kissingly","jiraUpdate":"2023-09-17","projectStatus":"STARTED","projectFinancialStatus":"GOOD"},
    }).then(({ body }) => {
      project = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/project-files+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/project-files').as('postEntityRequest');
    cy.intercept('DELETE', '/api/project-files/*').as('deleteEntityRequest');
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
    if (projectFile) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/project-files/${projectFile.id}`,
      }).then(() => {
        projectFile = undefined;
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

  it('ProjectFiles menu should load ProjectFiles page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('project-file');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ProjectFile').should('exist');
    cy.url().should('match', projectFilePageUrlPattern);
  });

  describe('ProjectFile page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(projectFilePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ProjectFile page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/project-file/new$'));
        cy.getEntityCreateUpdateHeading('ProjectFile');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectFilePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/project-files',
          body: {
            ...projectFileSample,
            project: project,
          },
        }).then(({ body }) => {
          projectFile = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/project-files+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [projectFile],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(projectFilePageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(projectFilePageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details ProjectFile page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('projectFile');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectFilePageUrlPattern);
      });

      it('edit button click should load edit ProjectFile page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ProjectFile');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectFilePageUrlPattern);
      });

      it('edit button click should load edit ProjectFile page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ProjectFile');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectFilePageUrlPattern);
      });

      it.skip('last delete button click should delete instance of ProjectFile', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('projectFile').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectFilePageUrlPattern);

        projectFile = undefined;
      });
    });
  });

  describe('new ProjectFile page', () => {
    beforeEach(() => {
      cy.visit(`${projectFilePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ProjectFile');
    });

    it.skip('should create an instance of ProjectFile', () => {
      cy.setFieldImageAsBytesOfEntity('file', 'integration-test.png', 'image/png');

      cy.get(`[data-cy="name"]`).type('truly saturate atop');
      cy.get(`[data-cy="name"]`).should('have.value', 'truly saturate atop');

      cy.get(`[data-cy="project"]`).select(1);

      // since cypress clicks submit too fast before the blob fields are validated
      cy.wait(200); // eslint-disable-line cypress/no-unnecessary-waiting
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        projectFile = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', projectFilePageUrlPattern);
    });
  });
});
