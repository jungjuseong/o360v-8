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

describe('ProjectOwner e2e test', () => {
  const projectOwnerPageUrl = '/project-owner';
  const projectOwnerPageUrlPattern = new RegExp('/project-owner(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const projectOwnerSample = { name: 'assembly easy-going' };

  let projectOwner;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/project-owners+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/project-owners').as('postEntityRequest');
    cy.intercept('DELETE', '/api/project-owners/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (projectOwner) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/project-owners/${projectOwner.id}`,
      }).then(() => {
        projectOwner = undefined;
      });
    }
  });

  it('ProjectOwners menu should load ProjectOwners page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('project-owner');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ProjectOwner').should('exist');
    cy.url().should('match', projectOwnerPageUrlPattern);
  });

  describe('ProjectOwner page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(projectOwnerPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ProjectOwner page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/project-owner/new$'));
        cy.getEntityCreateUpdateHeading('ProjectOwner');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectOwnerPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/project-owners',
          body: projectOwnerSample,
        }).then(({ body }) => {
          projectOwner = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/project-owners+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [projectOwner],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(projectOwnerPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ProjectOwner page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('projectOwner');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectOwnerPageUrlPattern);
      });

      it('edit button click should load edit ProjectOwner page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ProjectOwner');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectOwnerPageUrlPattern);
      });

      it('edit button click should load edit ProjectOwner page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ProjectOwner');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectOwnerPageUrlPattern);
      });

      it('last delete button click should delete instance of ProjectOwner', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('projectOwner').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectOwnerPageUrlPattern);

        projectOwner = undefined;
      });
    });
  });

  describe('new ProjectOwner page', () => {
    beforeEach(() => {
      cy.visit(`${projectOwnerPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ProjectOwner');
    });

    it('should create an instance of ProjectOwner', () => {
      cy.get(`[data-cy="name"]`).type('rearm');
      cy.get(`[data-cy="name"]`).should('have.value', 'rearm');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        projectOwner = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', projectOwnerPageUrlPattern);
    });
  });
});
