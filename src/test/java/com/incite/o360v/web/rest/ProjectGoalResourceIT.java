package com.incite.o360v.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.incite.o360v.IntegrationTest;
import com.incite.o360v.domain.ProjectGoal;
import com.incite.o360v.repository.ProjectGoalRepository;
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
 * Integration tests for the {@link ProjectGoalResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProjectGoalResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_PROJECT_COMPLETION = 1;
    private static final Integer UPDATED_PROJECT_COMPLETION = 2;

    private static final Integer DEFAULT_PROJECT_COMPLETION_BURN_RATE = 1;
    private static final Integer UPDATED_PROJECT_COMPLETION_BURN_RATE = 2;

    private static final String ENTITY_API_URL = "/api/project-goals";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProjectGoalRepository projectGoalRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProjectGoalMockMvc;

    private ProjectGoal projectGoal;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProjectGoal createEntity(EntityManager em) {
        ProjectGoal projectGoal = new ProjectGoal()
            .name(DEFAULT_NAME)
            .projectCompletion(DEFAULT_PROJECT_COMPLETION)
            .projectCompletionBurnRate(DEFAULT_PROJECT_COMPLETION_BURN_RATE);
        return projectGoal;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProjectGoal createUpdatedEntity(EntityManager em) {
        ProjectGoal projectGoal = new ProjectGoal()
            .name(UPDATED_NAME)
            .projectCompletion(UPDATED_PROJECT_COMPLETION)
            .projectCompletionBurnRate(UPDATED_PROJECT_COMPLETION_BURN_RATE);
        return projectGoal;
    }

    @BeforeEach
    public void initTest() {
        projectGoal = createEntity(em);
    }

    @Test
    @Transactional
    void createProjectGoal() throws Exception {
        int databaseSizeBeforeCreate = projectGoalRepository.findAll().size();
        // Create the ProjectGoal
        restProjectGoalMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectGoal))
            )
            .andExpect(status().isCreated());

        // Validate the ProjectGoal in the database
        List<ProjectGoal> projectGoalList = projectGoalRepository.findAll();
        assertThat(projectGoalList).hasSize(databaseSizeBeforeCreate + 1);
        ProjectGoal testProjectGoal = projectGoalList.get(projectGoalList.size() - 1);
        assertThat(testProjectGoal.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProjectGoal.getProjectCompletion()).isEqualTo(DEFAULT_PROJECT_COMPLETION);
        assertThat(testProjectGoal.getProjectCompletionBurnRate()).isEqualTo(DEFAULT_PROJECT_COMPLETION_BURN_RATE);
    }

    @Test
    @Transactional
    void createProjectGoalWithExistingId() throws Exception {
        // Create the ProjectGoal with an existing ID
        projectGoal.setId(1L);

        int databaseSizeBeforeCreate = projectGoalRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProjectGoalMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectGoal))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectGoal in the database
        List<ProjectGoal> projectGoalList = projectGoalRepository.findAll();
        assertThat(projectGoalList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = projectGoalRepository.findAll().size();
        // set the field null
        projectGoal.setName(null);

        // Create the ProjectGoal, which fails.

        restProjectGoalMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectGoal))
            )
            .andExpect(status().isBadRequest());

        List<ProjectGoal> projectGoalList = projectGoalRepository.findAll();
        assertThat(projectGoalList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProjectGoals() throws Exception {
        // Initialize the database
        projectGoalRepository.saveAndFlush(projectGoal);

        // Get all the projectGoalList
        restProjectGoalMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(projectGoal.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].projectCompletion").value(hasItem(DEFAULT_PROJECT_COMPLETION)))
            .andExpect(jsonPath("$.[*].projectCompletionBurnRate").value(hasItem(DEFAULT_PROJECT_COMPLETION_BURN_RATE)));
    }

    @Test
    @Transactional
    void getProjectGoal() throws Exception {
        // Initialize the database
        projectGoalRepository.saveAndFlush(projectGoal);

        // Get the projectGoal
        restProjectGoalMockMvc
            .perform(get(ENTITY_API_URL_ID, projectGoal.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(projectGoal.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.projectCompletion").value(DEFAULT_PROJECT_COMPLETION))
            .andExpect(jsonPath("$.projectCompletionBurnRate").value(DEFAULT_PROJECT_COMPLETION_BURN_RATE));
    }

    @Test
    @Transactional
    void getNonExistingProjectGoal() throws Exception {
        // Get the projectGoal
        restProjectGoalMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProjectGoal() throws Exception {
        // Initialize the database
        projectGoalRepository.saveAndFlush(projectGoal);

        int databaseSizeBeforeUpdate = projectGoalRepository.findAll().size();

        // Update the projectGoal
        ProjectGoal updatedProjectGoal = projectGoalRepository.findById(projectGoal.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedProjectGoal are not directly saved in db
        em.detach(updatedProjectGoal);
        updatedProjectGoal
            .name(UPDATED_NAME)
            .projectCompletion(UPDATED_PROJECT_COMPLETION)
            .projectCompletionBurnRate(UPDATED_PROJECT_COMPLETION_BURN_RATE);

        restProjectGoalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProjectGoal.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProjectGoal))
            )
            .andExpect(status().isOk());

        // Validate the ProjectGoal in the database
        List<ProjectGoal> projectGoalList = projectGoalRepository.findAll();
        assertThat(projectGoalList).hasSize(databaseSizeBeforeUpdate);
        ProjectGoal testProjectGoal = projectGoalList.get(projectGoalList.size() - 1);
        assertThat(testProjectGoal.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProjectGoal.getProjectCompletion()).isEqualTo(UPDATED_PROJECT_COMPLETION);
        assertThat(testProjectGoal.getProjectCompletionBurnRate()).isEqualTo(UPDATED_PROJECT_COMPLETION_BURN_RATE);
    }

    @Test
    @Transactional
    void putNonExistingProjectGoal() throws Exception {
        int databaseSizeBeforeUpdate = projectGoalRepository.findAll().size();
        projectGoal.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProjectGoalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, projectGoal.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectGoal))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectGoal in the database
        List<ProjectGoal> projectGoalList = projectGoalRepository.findAll();
        assertThat(projectGoalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProjectGoal() throws Exception {
        int databaseSizeBeforeUpdate = projectGoalRepository.findAll().size();
        projectGoal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectGoalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectGoal))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectGoal in the database
        List<ProjectGoal> projectGoalList = projectGoalRepository.findAll();
        assertThat(projectGoalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProjectGoal() throws Exception {
        int databaseSizeBeforeUpdate = projectGoalRepository.findAll().size();
        projectGoal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectGoalMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectGoal))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProjectGoal in the database
        List<ProjectGoal> projectGoalList = projectGoalRepository.findAll();
        assertThat(projectGoalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProjectGoalWithPatch() throws Exception {
        // Initialize the database
        projectGoalRepository.saveAndFlush(projectGoal);

        int databaseSizeBeforeUpdate = projectGoalRepository.findAll().size();

        // Update the projectGoal using partial update
        ProjectGoal partialUpdatedProjectGoal = new ProjectGoal();
        partialUpdatedProjectGoal.setId(projectGoal.getId());

        partialUpdatedProjectGoal.projectCompletion(UPDATED_PROJECT_COMPLETION);

        restProjectGoalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProjectGoal.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProjectGoal))
            )
            .andExpect(status().isOk());

        // Validate the ProjectGoal in the database
        List<ProjectGoal> projectGoalList = projectGoalRepository.findAll();
        assertThat(projectGoalList).hasSize(databaseSizeBeforeUpdate);
        ProjectGoal testProjectGoal = projectGoalList.get(projectGoalList.size() - 1);
        assertThat(testProjectGoal.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProjectGoal.getProjectCompletion()).isEqualTo(UPDATED_PROJECT_COMPLETION);
        assertThat(testProjectGoal.getProjectCompletionBurnRate()).isEqualTo(DEFAULT_PROJECT_COMPLETION_BURN_RATE);
    }

    @Test
    @Transactional
    void fullUpdateProjectGoalWithPatch() throws Exception {
        // Initialize the database
        projectGoalRepository.saveAndFlush(projectGoal);

        int databaseSizeBeforeUpdate = projectGoalRepository.findAll().size();

        // Update the projectGoal using partial update
        ProjectGoal partialUpdatedProjectGoal = new ProjectGoal();
        partialUpdatedProjectGoal.setId(projectGoal.getId());

        partialUpdatedProjectGoal
            .name(UPDATED_NAME)
            .projectCompletion(UPDATED_PROJECT_COMPLETION)
            .projectCompletionBurnRate(UPDATED_PROJECT_COMPLETION_BURN_RATE);

        restProjectGoalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProjectGoal.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProjectGoal))
            )
            .andExpect(status().isOk());

        // Validate the ProjectGoal in the database
        List<ProjectGoal> projectGoalList = projectGoalRepository.findAll();
        assertThat(projectGoalList).hasSize(databaseSizeBeforeUpdate);
        ProjectGoal testProjectGoal = projectGoalList.get(projectGoalList.size() - 1);
        assertThat(testProjectGoal.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProjectGoal.getProjectCompletion()).isEqualTo(UPDATED_PROJECT_COMPLETION);
        assertThat(testProjectGoal.getProjectCompletionBurnRate()).isEqualTo(UPDATED_PROJECT_COMPLETION_BURN_RATE);
    }

    @Test
    @Transactional
    void patchNonExistingProjectGoal() throws Exception {
        int databaseSizeBeforeUpdate = projectGoalRepository.findAll().size();
        projectGoal.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProjectGoalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, projectGoal.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projectGoal))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectGoal in the database
        List<ProjectGoal> projectGoalList = projectGoalRepository.findAll();
        assertThat(projectGoalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProjectGoal() throws Exception {
        int databaseSizeBeforeUpdate = projectGoalRepository.findAll().size();
        projectGoal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectGoalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projectGoal))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectGoal in the database
        List<ProjectGoal> projectGoalList = projectGoalRepository.findAll();
        assertThat(projectGoalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProjectGoal() throws Exception {
        int databaseSizeBeforeUpdate = projectGoalRepository.findAll().size();
        projectGoal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectGoalMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projectGoal))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProjectGoal in the database
        List<ProjectGoal> projectGoalList = projectGoalRepository.findAll();
        assertThat(projectGoalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProjectGoal() throws Exception {
        // Initialize the database
        projectGoalRepository.saveAndFlush(projectGoal);

        int databaseSizeBeforeDelete = projectGoalRepository.findAll().size();

        // Delete the projectGoal
        restProjectGoalMockMvc
            .perform(delete(ENTITY_API_URL_ID, projectGoal.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProjectGoal> projectGoalList = projectGoalRepository.findAll();
        assertThat(projectGoalList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
