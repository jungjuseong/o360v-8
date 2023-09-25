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

describe('Audience e2e test', () => {
  const audiencePageUrl = '/audience';
  const audiencePageUrlPattern = new RegExp('/audience(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const audienceSample = {};

  let audience;
  // let brand;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/brands',
      body: {"name":"times amount engineering"},
    }).then(({ body }) => {
      brand = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/audiences+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/audiences').as('postEntityRequest');
    cy.intercept('DELETE', '/api/audiences/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/channels', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/brands', {
      statusCode: 200,
      body: [brand],
    });

  });
   */

  afterEach(() => {
    if (audience) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/audiences/${audience.id}`,
      }).then(() => {
        audience = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
  afterEach(() => {
    if (brand) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/brands/${brand.id}`,
      }).then(() => {
        brand = undefined;
      });
    }
  });
   */

  it('Audiences menu should load Audiences page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('audience');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Audience').should('exist');
    cy.url().should('match', audiencePageUrlPattern);
  });

  describe('Audience page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(audiencePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Audience page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/audience/new$'));
        cy.getEntityCreateUpdateHeading('Audience');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', audiencePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/audiences',
          body: {
            ...audienceSample,
            brand: brand,
          },
        }).then(({ body }) => {
          audience = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/audiences+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [audience],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(audiencePageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(audiencePageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details Audience page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('audience');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', audiencePageUrlPattern);
      });

      it('edit button click should load edit Audience page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Audience');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', audiencePageUrlPattern);
      });

      it('edit button click should load edit Audience page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Audience');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', audiencePageUrlPattern);
      });

      it.skip('last delete button click should delete instance of Audience', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('audience').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', audiencePageUrlPattern);

        audience = undefined;
      });
    });
  });

  describe('new Audience page', () => {
    beforeEach(() => {
      cy.visit(`${audiencePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Audience');
    });

    it.skip('should create an instance of Audience', () => {
      cy.get(`[data-cy="brand"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        audience = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', audiencePageUrlPattern);
    });
  });
});
