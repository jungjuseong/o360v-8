package com.incite.o360v.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.incite.o360v.IntegrationTest;
import com.incite.o360v.domain.Audience;
import com.incite.o360v.domain.Brand;
import com.incite.o360v.repository.AudienceRepository;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AudienceResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class AudienceResourceIT {

    private static final String ENTITY_API_URL = "/api/audiences";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AudienceRepository audienceRepository;

    @Mock
    private AudienceRepository audienceRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAudienceMockMvc;

    private Audience audience;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Audience createEntity(EntityManager em) {
        Audience audience = new Audience();
        // Add required entity
        Brand brand;
        if (TestUtil.findAll(em, Brand.class).isEmpty()) {
            brand = BrandResourceIT.createEntity(em);
            em.persist(brand);
            em.flush();
        } else {
            brand = TestUtil.findAll(em, Brand.class).get(0);
        }
        audience.setBrand(brand);
        return audience;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Audience createUpdatedEntity(EntityManager em) {
        Audience audience = new Audience();
        // Add required entity
        Brand brand;
        if (TestUtil.findAll(em, Brand.class).isEmpty()) {
            brand = BrandResourceIT.createUpdatedEntity(em);
            em.persist(brand);
            em.flush();
        } else {
            brand = TestUtil.findAll(em, Brand.class).get(0);
        }
        audience.setBrand(brand);
        return audience;
    }

    @BeforeEach
    public void initTest() {
        audience = createEntity(em);
    }

    @Test
    @Transactional
    void createAudience() throws Exception {
        int databaseSizeBeforeCreate = audienceRepository.findAll().size();
        // Create the Audience
        restAudienceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(audience))
            )
            .andExpect(status().isCreated());

        // Validate the Audience in the database
        List<Audience> audienceList = audienceRepository.findAll();
        assertThat(audienceList).hasSize(databaseSizeBeforeCreate + 1);
        Audience testAudience = audienceList.get(audienceList.size() - 1);
    }

    @Test
    @Transactional
    void createAudienceWithExistingId() throws Exception {
        // Create the Audience with an existing ID
        audience.setId(1L);

        int databaseSizeBeforeCreate = audienceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAudienceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(audience))
            )
            .andExpect(status().isBadRequest());

        // Validate the Audience in the database
        List<Audience> audienceList = audienceRepository.findAll();
        assertThat(audienceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAudiences() throws Exception {
        // Initialize the database
        audienceRepository.saveAndFlush(audience);

        // Get all the audienceList
        restAudienceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(audience.getId().intValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAudiencesWithEagerRelationshipsIsEnabled() throws Exception {
        when(audienceRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAudienceMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(audienceRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAudiencesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(audienceRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAudienceMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(audienceRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getAudience() throws Exception {
        // Initialize the database
        audienceRepository.saveAndFlush(audience);

        // Get the audience
        restAudienceMockMvc
            .perform(get(ENTITY_API_URL_ID, audience.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(audience.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingAudience() throws Exception {
        // Get the audience
        restAudienceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAudience() throws Exception {
        // Initialize the database
        audienceRepository.saveAndFlush(audience);

        int databaseSizeBeforeUpdate = audienceRepository.findAll().size();

        // Update the audience
        Audience updatedAudience = audienceRepository.findById(audience.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAudience are not directly saved in db
        em.detach(updatedAudience);

        restAudienceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAudience.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAudience))
            )
            .andExpect(status().isOk());

        // Validate the Audience in the database
        List<Audience> audienceList = audienceRepository.findAll();
        assertThat(audienceList).hasSize(databaseSizeBeforeUpdate);
        Audience testAudience = audienceList.get(audienceList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingAudience() throws Exception {
        int databaseSizeBeforeUpdate = audienceRepository.findAll().size();
        audience.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAudienceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, audience.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(audience))
            )
            .andExpect(status().isBadRequest());

        // Validate the Audience in the database
        List<Audience> audienceList = audienceRepository.findAll();
        assertThat(audienceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAudience() throws Exception {
        int databaseSizeBeforeUpdate = audienceRepository.findAll().size();
        audience.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAudienceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(audience))
            )
            .andExpect(status().isBadRequest());

        // Validate the Audience in the database
        List<Audience> audienceList = audienceRepository.findAll();
        assertThat(audienceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAudience() throws Exception {
        int databaseSizeBeforeUpdate = audienceRepository.findAll().size();
        audience.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAudienceMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(audience))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Audience in the database
        List<Audience> audienceList = audienceRepository.findAll();
        assertThat(audienceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAudienceWithPatch() throws Exception {
        // Initialize the database
        audienceRepository.saveAndFlush(audience);

        int databaseSizeBeforeUpdate = audienceRepository.findAll().size();

        // Update the audience using partial update
        Audience partialUpdatedAudience = new Audience();
        partialUpdatedAudience.setId(audience.getId());

        restAudienceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAudience.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAudience))
            )
            .andExpect(status().isOk());

        // Validate the Audience in the database
        List<Audience> audienceList = audienceRepository.findAll();
        assertThat(audienceList).hasSize(databaseSizeBeforeUpdate);
        Audience testAudience = audienceList.get(audienceList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateAudienceWithPatch() throws Exception {
        // Initialize the database
        audienceRepository.saveAndFlush(audience);

        int databaseSizeBeforeUpdate = audienceRepository.findAll().size();

        // Update the audience using partial update
        Audience partialUpdatedAudience = new Audience();
        partialUpdatedAudience.setId(audience.getId());

        restAudienceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAudience.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAudience))
            )
            .andExpect(status().isOk());

        // Validate the Audience in the database
        List<Audience> audienceList = audienceRepository.findAll();
        assertThat(audienceList).hasSize(databaseSizeBeforeUpdate);
        Audience testAudience = audienceList.get(audienceList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingAudience() throws Exception {
        int databaseSizeBeforeUpdate = audienceRepository.findAll().size();
        audience.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAudienceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, audience.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(audience))
            )
            .andExpect(status().isBadRequest());

        // Validate the Audience in the database
        List<Audience> audienceList = audienceRepository.findAll();
        assertThat(audienceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAudience() throws Exception {
        int databaseSizeBeforeUpdate = audienceRepository.findAll().size();
        audience.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAudienceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(audience))
            )
            .andExpect(status().isBadRequest());

        // Validate the Audience in the database
        List<Audience> audienceList = audienceRepository.findAll();
        assertThat(audienceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAudience() throws Exception {
        int databaseSizeBeforeUpdate = audienceRepository.findAll().size();
        audience.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAudienceMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(audience))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Audience in the database
        List<Audience> audienceList = audienceRepository.findAll();
        assertThat(audienceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAudience() throws Exception {
        // Initialize the database
        audienceRepository.saveAndFlush(audience);

        int databaseSizeBeforeDelete = audienceRepository.findAll().size();

        // Delete the audience
        restAudienceMockMvc
            .perform(delete(ENTITY_API_URL_ID, audience.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Audience> audienceList = audienceRepository.findAll();
        assertThat(audienceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
