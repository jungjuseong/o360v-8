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

describe('UserGroupAccess e2e test', () => {
  const userGroupAccessPageUrl = '/user-group-access';
  const userGroupAccessPageUrlPattern = new RegExp('/user-group-access(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const userGroupAccessSample = {};

  let userGroupAccess;
  // let area;
  // let brand;
  // let audience;
  // let channel;
  // let country;
  // let userGroup;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/areas',
      body: {"name":"nor major"},
    }).then(({ body }) => {
      area = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/brands',
      body: {"name":"eulogize by"},
    }).then(({ body }) => {
      brand = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/audiences',
      body: {},
    }).then(({ body }) => {
      audience = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/channels',
      body: {"channelType":"PHONE"},
    }).then(({ body }) => {
      channel = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/countries',
      body: {"name":"caring"},
    }).then(({ body }) => {
      country = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/user-groups',
      body: {"name":"unaccountably athwart"},
    }).then(({ body }) => {
      userGroup = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/user-group-accesses+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/user-group-accesses').as('postEntityRequest');
    cy.intercept('DELETE', '/api/user-group-accesses/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/areas', {
      statusCode: 200,
      body: [area],
    });

    cy.intercept('GET', '/api/brands', {
      statusCode: 200,
      body: [brand],
    });

    cy.intercept('GET', '/api/audiences', {
      statusCode: 200,
      body: [audience],
    });

    cy.intercept('GET', '/api/channels', {
      statusCode: 200,
      body: [channel],
    });

    cy.intercept('GET', '/api/countries', {
      statusCode: 200,
      body: [country],
    });

    cy.intercept('GET', '/api/user-groups', {
      statusCode: 200,
      body: [userGroup],
    });

  });
   */

  afterEach(() => {
    if (userGroupAccess) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/user-group-accesses/${userGroupAccess.id}`,
      }).then(() => {
        userGroupAccess = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
  afterEach(() => {
    if (area) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/areas/${area.id}`,
      }).then(() => {
        area = undefined;
      });
    }
    if (brand) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/brands/${brand.id}`,
      }).then(() => {
        brand = undefined;
      });
    }
    if (audience) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/audiences/${audience.id}`,
      }).then(() => {
        audience = undefined;
      });
    }
    if (channel) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/channels/${channel.id}`,
      }).then(() => {
        channel = undefined;
      });
    }
    if (country) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/countries/${country.id}`,
      }).then(() => {
        country = undefined;
      });
    }
    if (userGroup) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/user-groups/${userGroup.id}`,
      }).then(() => {
        userGroup = undefined;
      });
    }
  });
   */

  it('UserGroupAccesses menu should load UserGroupAccesses page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('user-group-access');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('UserGroupAccess').should('exist');
    cy.url().should('match', userGroupAccessPageUrlPattern);
  });

  describe('UserGroupAccess page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(userGroupAccessPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create UserGroupAccess page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/user-group-access/new$'));
        cy.getEntityCreateUpdateHeading('UserGroupAccess');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupAccessPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/user-group-accesses',
          body: {
            ...userGroupAccessSample,
            area: area,
            brand: brand,
            audience: audience,
            channel: channel,
            country: country,
            userGroup: userGroup,
          },
        }).then(({ body }) => {
          userGroupAccess = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/user-group-accesses+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [userGroupAccess],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(userGroupAccessPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(userGroupAccessPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details UserGroupAccess page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('userGroupAccess');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupAccessPageUrlPattern);
      });

      it('edit button click should load edit UserGroupAccess page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserGroupAccess');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupAccessPageUrlPattern);
      });

      it('edit button click should load edit UserGroupAccess page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserGroupAccess');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupAccessPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of UserGroupAccess', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('userGroupAccess').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userGroupAccessPageUrlPattern);

        userGroupAccess = undefined;
      });
    });
  });

  describe('new UserGroupAccess page', () => {
    beforeEach(() => {
      cy.visit(`${userGroupAccessPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('UserGroupAccess');
    });

    it.skip('should create an instance of UserGroupAccess', () => {
      cy.get(`[data-cy="area"]`).select(1);
      cy.get(`[data-cy="brand"]`).select(1);
      cy.get(`[data-cy="audience"]`).select(1);
      cy.get(`[data-cy="channel"]`).select(1);
      cy.get(`[data-cy="country"]`).select(1);
      cy.get(`[data-cy="userGroup"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        userGroupAccess = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', userGroupAccessPageUrlPattern);
    });
  });
});
