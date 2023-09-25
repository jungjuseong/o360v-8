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

describe('Stakeholder e2e test', () => {
  const stakeholderPageUrl = '/stakeholder';
  const stakeholderPageUrlPattern = new RegExp('/stakeholder(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const stakeholderSample = {"createdDate":"2023-09-17"};

  let stakeholder;
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
      body: {"id":"8550756d-0a7f-408e-a24d-7161ea156258","login":"oboe","firstName":"Sherman","lastName":"Smith"},
    }).then(({ body }) => {
      user = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/projects',
      body: {"code":"however missile","title":"income","fiscalYear":"2023-09-16","budget":27642.64,"createdDate":"2023-09-16","startDate":"2023-09-16","deploymentDate":"2023-09-17","endDate":"2023-09-16","description":"beyond","poNumber":"meh","jiraCode":"fiercely ripe hardware","jiraUpdate":"2023-09-16","projectStatus":"READY","projectFinancialStatus":"POOR"},
    }).then(({ body }) => {
      project = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/stakeholders+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/stakeholders').as('postEntityRequest');
    cy.intercept('DELETE', '/api/stakeholders/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/stakeholder-comments', {
      statusCode: 200,
      body: [],
    });

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
    if (stakeholder) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/stakeholders/${stakeholder.id}`,
      }).then(() => {
        stakeholder = undefined;
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

  it('Stakeholders menu should load Stakeholders page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('stakeholder');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Stakeholder').should('exist');
    cy.url().should('match', stakeholderPageUrlPattern);
  });

  describe('Stakeholder page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(stakeholderPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Stakeholder page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/stakeholder/new$'));
        cy.getEntityCreateUpdateHeading('Stakeholder');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', stakeholderPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/stakeholders',
          body: {
            ...stakeholderSample,
            user: user,
            project: project,
          },
        }).then(({ body }) => {
          stakeholder = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/stakeholders+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [stakeholder],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(stakeholderPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(stakeholderPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details Stakeholder page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('stakeholder');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', stakeholderPageUrlPattern);
      });

      it('edit button click should load edit Stakeholder page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Stakeholder');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', stakeholderPageUrlPattern);
      });

      it('edit button click should load edit Stakeholder page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Stakeholder');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', stakeholderPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of Stakeholder', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('stakeholder').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', stakeholderPageUrlPattern);

        stakeholder = undefined;
      });
    });
  });

  describe('new Stakeholder page', () => {
    beforeEach(() => {
      cy.visit(`${stakeholderPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Stakeholder');
    });

    it.skip('should create an instance of Stakeholder', () => {
      cy.get(`[data-cy="createdDate"]`).type('2023-09-16');
      cy.get(`[data-cy="createdDate"]`).blur();
      cy.get(`[data-cy="createdDate"]`).should('have.value', '2023-09-16');

      cy.get(`[data-cy="cost"]`).type('14673.25');
      cy.get(`[data-cy="cost"]`).should('have.value', '14673.25');

      cy.get(`[data-cy="stakeholderType"]`).select('STAFF');

      cy.get(`[data-cy="user"]`).select([0]);
      cy.get(`[data-cy="project"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        stakeholder = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', stakeholderPageUrlPattern);
    });
  });
});
