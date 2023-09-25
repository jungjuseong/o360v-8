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

describe('UserGroup e2e test', () => {
  const userGroupPageUrl = '/user-group';
  const userGroupPageUrlPattern = new RegExp('/user-group(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const userGroupSample = {"name":"into ferociously whup"};

  let userGroup;
  // let user;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/users',
      body: {"id":"e55719af-ad60-47ba-b062-515d2d036769","login":"gee consequently gutter","firstName":"Lavern","lastName":"Pagac"},
    }).then(({ body }) => {
      user = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/user-groups+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/user-groups').as('postEntityRequest');
    cy.intercept('DELETE', '/api/user-groups/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/user-group-accesses', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [user],
    });

  });
   */

  afterEach(() => {
    if (userGroup) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/user-groups/${userGroup.id}`,
      }).then(() => {
        userGroup = undefined;
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
  });
   */

  it('UserGroups menu should load UserGroups page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('user-group');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('UserGroup').should('exist');
    cy.url().should('match', userGroupPageUrlPattern);
  });

  describe('UserGroup page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(userGroupPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create UserGroup page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/user-group/new$'));
        cy.getEntityCreateUpdateHeading('UserGroup');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/user-groups',
          body: {
            ...userGroupSample,
            user: user,
          },
        }).then(({ body }) => {
          userGroup = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/user-groups+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [userGroup],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(userGroupPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(userGroupPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details UserGroup page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('userGroup');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupPageUrlPattern);
      });

      it('edit button click should load edit UserGroup page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserGroup');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupPageUrlPattern);
      });

      it('edit button click should load edit UserGroup page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserGroup');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of UserGroup', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('userGroup').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupPageUrlPattern);

        userGroup = undefined;
      });
    });
  });

  describe('new UserGroup page', () => {
    beforeEach(() => {
      cy.visit(`${userGroupPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('UserGroup');
    });

    it.skip('should create an instance of UserGroup', () => {
      cy.get(`[data-cy="name"]`).type('ditch gee fabricate');
      cy.get(`[data-cy="name"]`).should('have.value', 'ditch gee fabricate');

      cy.get(`[data-cy="user"]`).select([0]);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        userGroup = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', userGroupPageUrlPattern);
    });
  });
});
