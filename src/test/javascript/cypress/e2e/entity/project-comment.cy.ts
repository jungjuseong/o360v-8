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

describe('ProjectComment e2e test', () => {
  const projectCommentPageUrl = '/project-comment';
  const projectCommentPageUrlPattern = new RegExp('/project-comment(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const projectCommentSample = {"createdDate":"2023-09-16","comment":"Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci50eHQ="};

  let projectComment;
  // let user;
  // let project;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/users',
      body: {"id":"bc2d24ce-1f35-4b90-96e1-a23873f4ddf8","login":"or while trigonometry","firstName":"Maximillia","lastName":"Crooks"},
    }).then(({ body }) => {
      user = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/projects',
      body: {"code":"bus","title":"yet mochi promptly","fiscalYear":"2023-09-17","budget":21886.5,"createdDate":"2023-09-16","startDate":"2023-09-16","deploymentDate":"2023-09-16","endDate":"2023-09-17","description":"spout","poNumber":"what excepting","jiraCode":"gray","jiraUpdate":"2023-09-16","projectStatus":"STARTED","projectFinancialStatus":"GOOD"},
    }).then(({ body }) => {
      project = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/project-comments+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/project-comments').as('postEntityRequest');
    cy.intercept('DELETE', '/api/project-comments/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [user],
    });

    cy.intercept('GET', '/api/projects', {
      statusCode: 200,
      body: [project],
    });

  });
   */

  afterEach(() => {
    if (projectComment) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/project-comments/${projectComment.id}`,
      }).then(() => {
        projectComment = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
  afterEach(() => {
    if (user) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/users/${user.id}`,
      }).then(() => {
        user = undefined;
      });
    }
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

  it('ProjectComments menu should load ProjectComments page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('project-comment');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ProjectComment').should('exist');
    cy.url().should('match', projectCommentPageUrlPattern);
  });

  describe('ProjectComment page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(projectCommentPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ProjectComment page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/project-comment/new$'));
        cy.getEntityCreateUpdateHeading('ProjectComment');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectCommentPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/project-comments',
          body: {
            ...projectCommentSample,
            user: user,
            project: project,
          },
        }).then(({ body }) => {
          projectComment = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/project-comments+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [projectComment],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(projectCommentPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(projectCommentPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details ProjectComment page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('projectComment');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectCommentPageUrlPattern);
      });

      it('edit button click should load edit ProjectComment page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ProjectComment');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectCommentPageUrlPattern);
      });

      it('edit button click should load edit ProjectComment page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ProjectComment');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectCommentPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of ProjectComment', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('projectComment').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectCommentPageUrlPattern);

        projectComment = undefined;
      });
    });
  });

  describe('new ProjectComment page', () => {
    beforeEach(() => {
      cy.visit(`${projectCommentPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ProjectComment');
    });

    it.skip('should create an instance of ProjectComment', () => {
      cy.get(`[data-cy="createdDate"]`).type('2023-09-17');
      cy.get(`[data-cy="createdDate"]`).blur();
      cy.get(`[data-cy="createdDate"]`).should('have.value', '2023-09-17');

      cy.get(`[data-cy="comment"]`).type('../fake-data/blob/hipster.txt');
      cy.get(`[data-cy="comment"]`).invoke('val').should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(`[data-cy="user"]`).select(1);
      cy.get(`[data-cy="project"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        projectComment = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', projectCommentPageUrlPattern);
    });
  });
});
