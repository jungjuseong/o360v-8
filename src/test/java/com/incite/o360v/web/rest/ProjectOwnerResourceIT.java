package com.incite.o360v.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.incite.o360v.IntegrationTest;
import com.incite.o360v.domain.ProjectOwner;
import com.incite.o360v.repository.ProjectOwnerRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProjectOwnerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProjectOwnerResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/project-owners";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProjectOwnerRepository projectOwnerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProjectOwnerMockMvc;

    private ProjectOwner projectOwner;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProjectOwner createEntity(EntityManager em) {
        ProjectOwner projectOwner = new ProjectOwner().name(DEFAULT_NAME);
        return projectOwner;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProjectOwner createUpdatedEntity(EntityManager em) {
        ProjectOwner projectOwner = new ProjectOwner().name(UPDATED_NAME);
        return projectOwner;
    }

    @BeforeEach
    public void initTest() {
        projectOwner = createEntity(em);
    }

    @Test
    @Transactional
    void createProjectOwner() throws Exception {
        int databaseSizeBeforeCreate = projectOwnerRepository.findAll().size();
        // Create the ProjectOwner
        restProjectOwnerMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectOwner))
            )
            .andExpect(status().isCreated());

        // Validate the ProjectOwner in the database
        List<ProjectOwner> projectOwnerList = projectOwnerRepository.findAll();
        assertThat(projectOwnerList).hasSize(databaseSizeBeforeCreate + 1);
        ProjectOwner testProjectOwner = projectOwnerList.get(projectOwnerList.size() - 1);
        assertThat(testProjectOwner.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createProjectOwnerWithExistingId() throws Exception {
        // Create the ProjectOwner with an existing ID
        projectOwner.setId(1L);

        int databaseSizeBeforeCreate = projectOwnerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProjectOwnerMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectOwner))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectOwner in the database
        List<ProjectOwner> projectOwnerList = projectOwnerRepository.findAll();
        assertThat(projectOwnerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = projectOwnerRepository.findAll().size();
        // set the field null
        projectOwner.setName(null);

        // Create the ProjectOwner, which fails.

        restProjectOwnerMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectOwner))
            )
            .andExpect(status().isBadRequest());

        List<ProjectOwner> projectOwnerList = projectOwnerRepository.findAll();
        assertThat(projectOwnerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProjectOwners() throws Exception {
        // Initialize the database
        projectOwnerRepository.saveAndFlush(projectOwner);

        // Get all the projectOwnerList
        restProjectOwnerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(projectOwner.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getProjectOwner() throws Exception {
        // Initialize the database
        projectOwnerRepository.saveAndFlush(projectOwner);

        // Get the projectOwner
        restProjectOwnerMockMvc
            .perform(get(ENTITY_API_URL_ID, projectOwner.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(projectOwner.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingProjectOwner() throws Exception {
        // Get the projectOwner
        restProjectOwnerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProjectOwner() throws Exception {
        // Initialize the database
        projectOwnerRepository.saveAndFlush(projectOwner);

        int databaseSizeBeforeUpdate = projectOwnerRepository.findAll().size();

        // Update the projectOwner
        ProjectOwner updatedProjectOwner = projectOwnerRepository.findById(projectOwner.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedProjectOwner are not directly saved in db
        em.detach(updatedProjectOwner);
        updatedProjectOwner.name(UPDATED_NAME);

        restProjectOwnerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProjectOwner.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProjectOwner))
            )
            .andExpect(status().isOk());

        // Validate the ProjectOwner in the database
        List<ProjectOwner> projectOwnerList = projectOwnerRepository.findAll();
        assertThat(projectOwnerList).hasSize(databaseSizeBeforeUpdate);
        ProjectOwner testProjectOwner = projectOwnerList.get(projectOwnerList.size() - 1);
        assertThat(testProjectOwner.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingProjectOwner() throws Exception {
        int databaseSizeBeforeUpdate = projectOwnerRepository.findAll().size();
        projectOwner.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProjectOwnerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, projectOwner.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectOwner))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectOwner in the database
        List<ProjectOwner> projectOwnerList = projectOwnerRepository.findAll();
        assertThat(projectOwnerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProjectOwner() throws Exception {
        int databaseSizeBeforeUpdate = projectOwnerRepository.findAll().size();
        projectOwner.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectOwnerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectOwner))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectOwner in the database
        List<ProjectOwner> projectOwnerList = projectOwnerRepository.findAll();
        assertThat(projectOwnerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProjectOwner() throws Exception {
        int databaseSizeBeforeUpdate = projectOwnerRepository.findAll().size();
        projectOwner.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectOwnerMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectOwner))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProjectOwner in the database
        List<ProjectOwner> projectOwnerList = projectOwnerRepository.findAll();
        assertThat(projectOwnerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProjectOwnerWithPatch() throws Exception {
        // Initialize the database
        projectOwnerRepository.saveAndFlush(projectOwner);

        int databaseSizeBeforeUpdate = projectOwnerRepository.findAll().size();

        // Update the projectOwner using partial update
        ProjectOwner partialUpdatedProjectOwner = new ProjectOwner();
        partialUpdatedProjectOwner.setId(projectOwner.getId());

        restProjectOwnerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProjectOwner.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProjectOwner))
            )
            .andExpect(status().isOk());

        // Validate the ProjectOwner in the database
        List<ProjectOwner> projectOwnerList = projectOwnerRepository.findAll();
        assertThat(projectOwnerList).hasSize(databaseSizeBeforeUpdate);
        ProjectOwner testProjectOwner = projectOwnerList.get(projectOwnerList.size() - 1);
        assertThat(testProjectOwner.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateProjectOwnerWithPatch() throws Exception {
        // Initialize the database
        projectOwnerRepository.saveAndFlush(projectOwner);

        int databaseSizeBeforeUpdate = projectOwnerRepository.findAll().size();

        // Update the projectOwner using partial update
        ProjectOwner partialUpdatedProjectOwner = new ProjectOwner();
        partialUpdatedProjectOwner.setId(projectOwner.getId());

        partialUpdatedProjectOwner.name(UPDATED_NAME);

        restProjectOwnerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProjectOwner.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProjectOwner))
            )
            .andExpect(status().isOk());

        // Validate the ProjectOwner in the database
        List<ProjectOwner> projectOwnerList = projectOwnerRepository.findAll();
        assertThat(projectOwnerList).hasSize(databaseSizeBeforeUpdate);
        ProjectOwner testProjectOwner = projectOwnerList.get(projectOwnerList.size() - 1);
        assertThat(testProjectOwner.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingProjectOwner() throws Exception {
        int databaseSizeBeforeUpdate = projectOwnerRepository.findAll().size();
        projectOwner.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProjectOwnerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, projectOwner.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projectOwner))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectOwner in the database
        List<ProjectOwner> projectOwnerList = projectOwnerRepository.findAll();
        assertThat(projectOwnerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProjectOwner() throws Exception {
        int databaseSizeBeforeUpdate = projectOwnerRepository.findAll().size();
        projectOwner.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectOwnerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projectOwner))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectOwner in the database
        List<ProjectOwner> projectOwnerList = projectOwnerRepository.findAll();
        assertThat(projectOwnerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProjectOwner() throws Exception {
        int databaseSizeBeforeUpdate = projectOwnerRepository.findAll().size();
        projectOwner.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectOwnerMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projectOwner))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProjectOwner in the database
        List<ProjectOwner> projectOwnerList = projectOwnerRepository.findAll();
        assertThat(projectOwnerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProjectOwner() throws Exception {
        // Initialize the database
        projectOwnerRepository.saveAndFlush(projectOwner);

        int databaseSizeBeforeDelete = projectOwnerRepository.findAll().size();

        // Delete the projectOwner
        restProjectOwnerMockMvc
            .perform(delete(ENTITY_API_URL_ID, projectOwner.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProjectOwner> projectOwnerList = projectOwnerRepository.findAll();
        assertThat(projectOwnerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
