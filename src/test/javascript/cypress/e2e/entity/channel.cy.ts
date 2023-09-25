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

describe('Channel e2e test', () => {
  const channelPageUrl = '/channel';
  const channelPageUrlPattern = new RegExp('/channel(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const channelSample = {};

  let channel;
  // let audience;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/audiences',
      body: {},
    }).then(({ body }) => {
      audience = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/channels+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/channels').as('postEntityRequest');
    cy.intercept('DELETE', '/api/channels/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/projects', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/audiences', {
      statusCode: 200,
      body: [audience],
    });

  });
   */

  afterEach(() => {
    if (channel) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/channels/${channel.id}`,
      }).then(() => {
        channel = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
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
   */

  it('Channels menu should load Channels page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('channel');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Channel').should('exist');
    cy.url().should('match', channelPageUrlPattern);
  });

  describe('Channel page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(channelPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Channel page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/channel/new$'));
        cy.getEntityCreateUpdateHeading('Channel');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', channelPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/channels',
          body: {
            ...channelSample,
            audience: audience,
          },
        }).then(({ body }) => {
          channel = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/channels+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [channel],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(channelPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(channelPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details Channel page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('channel');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', channelPageUrlPattern);
      });

      it('edit button click should load edit Channel page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Channel');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', channelPageUrlPattern);
      });

      it('edit button click should load edit Channel page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Channel');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', channelPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of Channel', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('channel').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', channelPageUrlPattern);

        channel = undefined;
      });
    });
  });

  describe('new Channel page', () => {
    beforeEach(() => {
      cy.visit(`${channelPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Channel');
    });

    it.skip('should create an instance of Channel', () => {
      cy.get(`[data-cy="channelType"]`).select('PHONE');

      cy.get(`[data-cy="audience"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        channel = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', channelPageUrlPattern);
    });
  });
});
