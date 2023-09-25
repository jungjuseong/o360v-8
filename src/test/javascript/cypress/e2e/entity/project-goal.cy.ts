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

describe('ProjectGoal e2e test', () => {
  const projectGoalPageUrl = '/project-goal';
  const projectGoalPageUrlPattern = new RegExp('/project-goal(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const projectGoalSample = { name: 'meanwhile' };

  let projectGoal;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/project-goals+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/project-goals').as('postEntityRequest');
    cy.intercept('DELETE', '/api/project-goals/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (projectGoal) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/project-goals/${projectGoal.id}`,
      }).then(() => {
        projectGoal = undefined;
      });
    }
  });

  it('ProjectGoals menu should load ProjectGoals page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('project-goal');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ProjectGoal').should('exist');
    cy.url().should('match', projectGoalPageUrlPattern);
  });

  describe('ProjectGoal page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(projectGoalPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ProjectGoal page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/project-goal/new$'));
        cy.getEntityCreateUpdateHeading('ProjectGoal');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectGoalPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/project-goals',
          body: projectGoalSample,
        }).then(({ body }) => {
          projectGoal = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/project-goals+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [projectGoal],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(projectGoalPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ProjectGoal page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('projectGoal');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectGoalPageUrlPattern);
      });

      it('edit button click should load edit ProjectGoal page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ProjectGoal');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectGoalPageUrlPattern);
      });

      it('edit button click should load edit ProjectGoal page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ProjectGoal');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectGoalPageUrlPattern);
      });

      it('last delete button click should delete instance of ProjectGoal', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('projectGoal').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', projectGoalPageUrlPattern);

        projectGoal = undefined;
      });
    });
  });

  describe('new ProjectGoal page', () => {
    beforeEach(() => {
      cy.visit(`${projectGoalPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ProjectGoal');
    });

    it('should create an instance of ProjectGoal', () => {
      cy.get(`[data-cy="name"]`).type('quaintly transcript');
      cy.get(`[data-cy="name"]`).should('have.value', 'quaintly transcript');

      cy.get(`[data-cy="projectCompletion"]`).type('31198');
      cy.get(`[data-cy="projectCompletion"]`).should('have.value', '31198');

      cy.get(`[data-cy="projectCompletionBurnRate"]`).type('14744');
      cy.get(`[data-cy="projectCompletionBurnRate"]`).should('have.value', '14744');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        projectGoal = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', projectGoalPageUrlPattern);
    });
  });
});
