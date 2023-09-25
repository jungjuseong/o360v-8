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

describe('StakeholderComment e2e test', () => {
  const stakeholderCommentPageUrl = '/stakeholder-comment';
  const stakeholderCommentPageUrlPattern = new RegExp('/stakeholder-comment(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const stakeholderCommentSample = {"createdDate":"2023-09-16","comment":"Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci50eHQ="};

  let stakeholderComment;
  // let user;
  // let stakeholder;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/users',
      body: {"id":"daade700-7e2a-4323-bd70-7a5871bf3a63","login":"hungrily sweetly sternly","firstName":"Elvis","lastName":"Dickens"},
    }).then(({ body }) => {
      user = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/stakeholders',
      body: {"createdDate":"2023-09-17","cost":10300.59,"stakeholderType":"STAFF"},
    }).then(({ body }) => {
      stakeholder = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/stakeholder-comments+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/stakeholder-comments').as('postEntityRequest');
    cy.intercept('DELETE', '/api/stakeholder-comments/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [user],
    });

    cy.intercept('GET', '/api/stakeholders', {
      statusCode: 200,
      body: [stakeholder],
    });

  });
   */

  afterEach(() => {
    if (stakeholderComment) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/stakeholder-comments/${stakeholderComment.id}`,
      }).then(() => {
        stakeholderComment = undefined;
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
    if (stakeholder) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/stakeholders/${stakeholder.id}`,
      }).then(() => {
        stakeholder = undefined;
      });
    }
  });
   */

  it('StakeholderComments menu should load StakeholderComments page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('stakeholder-comment');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('StakeholderComment').should('exist');
    cy.url().should('match', stakeholderCommentPageUrlPattern);
  });

  describe('StakeholderComment page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(stakeholderCommentPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create StakeholderComment page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/stakeholder-comment/new$'));
        cy.getEntityCreateUpdateHeading('StakeholderComment');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', stakeholderCommentPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/stakeholder-comments',
          body: {
            ...stakeholderCommentSample,
            user: user,
            stakeholder: stakeholder,
          },
        }).then(({ body }) => {
          stakeholderComment = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/stakeholder-comments+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [stakeholderComment],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(stakeholderCommentPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(stakeholderCommentPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details StakeholderComment page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('stakeholderComment');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', stakeholderCommentPageUrlPattern);
      });

      it('edit button click should load edit StakeholderComment page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('StakeholderComment');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', stakeholderCommentPageUrlPattern);
      });

      it('edit button click should load edit StakeholderComment page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('StakeholderComment');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', stakeholderCommentPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of StakeholderComment', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('stakeholderComment').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', stakeholderCommentPageUrlPattern);

        stakeholderComment = undefined;
      });
    });
  });

  describe('new StakeholderComment page', () => {
    beforeEach(() => {
      cy.visit(`${stakeholderCommentPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('StakeholderComment');
    });

    it.skip('should create an instance of StakeholderComment', () => {
      cy.get(`[data-cy="createdDate"]`).type('2023-09-16');
      cy.get(`[data-cy="createdDate"]`).blur();
      cy.get(`[data-cy="createdDate"]`).should('have.value', '2023-09-16');

      cy.get(`[data-cy="comment"]`).type('../fake-data/blob/hipster.txt');
      cy.get(`[data-cy="comment"]`).invoke('val').should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(`[data-cy="user"]`).select(1);
      cy.get(`[data-cy="stakeholder"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        stakeholderComment = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', stakeholderCommentPageUrlPattern);
    });
  });
});
