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

describe('Area e2e test', () => {
  const areaPageUrl = '/area';
  const areaPageUrlPattern = new RegExp('/area(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const areaSample = { name: 'anti index backdate' };

  let area;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/areas+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/areas').as('postEntityRequest');
    cy.intercept('DELETE', '/api/areas/*').as('deleteEntityRequest');
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

  it('Areas menu should load Areas page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('area');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Area').should('exist');
    cy.url().should('match', areaPageUrlPattern);
  });

  describe('Area page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(areaPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Area page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/area/new$'));
        cy.getEntityCreateUpdateHeading('Area');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', areaPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/areas',
          body: areaSample,
        }).then(({ body }) => {
          area = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/areas+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [area],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(areaPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Area page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('area');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', areaPageUrlPattern);
      });

      it('edit button click should load edit Area page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Area');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', areaPageUrlPattern);
      });

      it('edit button click should load edit Area page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Area');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', areaPageUrlPattern);
      });

      it('last delete button click should delete instance of Area', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('area').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', areaPageUrlPattern);

        area = undefined;
      });
    });
  });

  describe('new Area page', () => {
    beforeEach(() => {
      cy.visit(`${areaPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Area');
    });

    it('should create an instance of Area', () => {
      cy.get(`[data-cy="name"]`).type('quarrelsome');
      cy.get(`[data-cy="name"]`).should('have.value', 'quarrelsome');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        area = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', areaPageUrlPattern);
    });
  });
});
