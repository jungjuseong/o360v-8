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

describe('Brand e2e test', () => {
  const brandPageUrl = '/brand';
  const brandPageUrlPattern = new RegExp('/brand(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const brandSample = { name: 'perfectly per' };

  let brand;
  let area;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/areas',
      body: { name: 'viciously' },
    }).then(({ body }) => {
      area = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/brands+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/brands').as('postEntityRequest');
    cy.intercept('DELETE', '/api/brands/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/audiences', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/areas', {
      statusCode: 200,
      body: [area],
    });
  });

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

  afterEach(() => {
    if (area) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/areas/${area.id}`,
      }).then(() => {
        area = undefined;
      });
    }
  });

  it('Brands menu should load Brands page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('brand');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Brand').should('exist');
    cy.url().should('match', brandPageUrlPattern);
  });

  describe('Brand page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(brandPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Brand page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/brand/new$'));
        cy.getEntityCreateUpdateHeading('Brand');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', brandPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/brands',
          body: {
            ...brandSample,
            area: area,
          },
        }).then(({ body }) => {
          brand = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/brands+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [brand],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(brandPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Brand page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('brand');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', brandPageUrlPattern);
      });

      it('edit button click should load edit Brand page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Brand');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', brandPageUrlPattern);
      });

      it('edit button click should load edit Brand page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Brand');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', brandPageUrlPattern);
      });

      it('last delete button click should delete instance of Brand', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('brand').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', brandPageUrlPattern);

        brand = undefined;
      });
    });
  });

  describe('new Brand page', () => {
    beforeEach(() => {
      cy.visit(`${brandPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Brand');
    });

    it('should create an instance of Brand', () => {
      cy.get(`[data-cy="name"]`).type('crossly ugh');
      cy.get(`[data-cy="name"]`).should('have.value', 'crossly ugh');

      cy.get(`[data-cy="area"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        brand = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', brandPageUrlPattern);
    });
  });
});
