package com.incite.o360v.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.incite.o360v.IntegrationTest;
import com.incite.o360v.domain.JiraSetUp;
import com.incite.o360v.repository.JiraSetUpRepository;
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
 * Integration tests for the {@link JiraSetUpResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class JiraSetUpResourceIT {

    private static final String DEFAULT_URL = "AAAAAAAAAA";
    private static final String UPDATED_URL = "BBBBBBBBBB";

    private static final String DEFAULT_API_KEY = "AAAAAAAAAA";
    private static final String UPDATED_API_KEY = "BBBBBBBBBB";

    private static final String DEFAULT_PROJECT = "AAAAAAAAAA";
    private static final String UPDATED_PROJECT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/jira-set-ups";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private JiraSetUpRepository jiraSetUpRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restJiraSetUpMockMvc;

    private JiraSetUp jiraSetUp;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JiraSetUp createEntity(EntityManager em) {
        JiraSetUp jiraSetUp = new JiraSetUp().url(DEFAULT_URL).apiKey(DEFAULT_API_KEY).project(DEFAULT_PROJECT);
        return jiraSetUp;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JiraSetUp createUpdatedEntity(EntityManager em) {
        JiraSetUp jiraSetUp = new JiraSetUp().url(UPDATED_URL).apiKey(UPDATED_API_KEY).project(UPDATED_PROJECT);
        return jiraSetUp;
    }

    @BeforeEach
    public void initTest() {
        jiraSetUp = createEntity(em);
    }

    @Test
    @Transactional
    void createJiraSetUp() throws Exception {
        int databaseSizeBeforeCreate = jiraSetUpRepository.findAll().size();
        // Create the JiraSetUp
        restJiraSetUpMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jiraSetUp))
            )
            .andExpect(status().isCreated());

        // Validate the JiraSetUp in the database
        List<JiraSetUp> jiraSetUpList = jiraSetUpRepository.findAll();
        assertThat(jiraSetUpList).hasSize(databaseSizeBeforeCreate + 1);
        JiraSetUp testJiraSetUp = jiraSetUpList.get(jiraSetUpList.size() - 1);
        assertThat(testJiraSetUp.getUrl()).isEqualTo(DEFAULT_URL);
        assertThat(testJiraSetUp.getApiKey()).isEqualTo(DEFAULT_API_KEY);
        assertThat(testJiraSetUp.getProject()).isEqualTo(DEFAULT_PROJECT);
    }

    @Test
    @Transactional
    void createJiraSetUpWithExistingId() throws Exception {
        // Create the JiraSetUp with an existing ID
        jiraSetUp.setId(1L);

        int databaseSizeBeforeCreate = jiraSetUpRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restJiraSetUpMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jiraSetUp))
            )
            .andExpect(status().isBadRequest());

        // Validate the JiraSetUp in the database
        List<JiraSetUp> jiraSetUpList = jiraSetUpRepository.findAll();
        assertThat(jiraSetUpList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkUrlIsRequired() throws Exception {
        int databaseSizeBeforeTest = jiraSetUpRepository.findAll().size();
        // set the field null
        jiraSetUp.setUrl(null);

        // Create the JiraSetUp, which fails.

        restJiraSetUpMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jiraSetUp))
            )
            .andExpect(status().isBadRequest());

        List<JiraSetUp> jiraSetUpList = jiraSetUpRepository.findAll();
        assertThat(jiraSetUpList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkApiKeyIsRequired() throws Exception {
        int databaseSizeBeforeTest = jiraSetUpRepository.findAll().size();
        // set the field null
        jiraSetUp.setApiKey(null);

        // Create the JiraSetUp, which fails.

        restJiraSetUpMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jiraSetUp))
            )
            .andExpect(status().isBadRequest());

        List<JiraSetUp> jiraSetUpList = jiraSetUpRepository.findAll();
        assertThat(jiraSetUpList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkProjectIsRequired() throws Exception {
        int databaseSizeBeforeTest = jiraSetUpRepository.findAll().size();
        // set the field null
        jiraSetUp.setProject(null);

        // Create the JiraSetUp, which fails.

        restJiraSetUpMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jiraSetUp))
            )
            .andExpect(status().isBadRequest());

        List<JiraSetUp> jiraSetUpList = jiraSetUpRepository.findAll();
        assertThat(jiraSetUpList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllJiraSetUps() throws Exception {
        // Initialize the database
        jiraSetUpRepository.saveAndFlush(jiraSetUp);

        // Get all the jiraSetUpList
        restJiraSetUpMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(jiraSetUp.getId().intValue())))
            .andExpect(jsonPath("$.[*].url").value(hasItem(DEFAULT_URL)))
            .andExpect(jsonPath("$.[*].apiKey").value(hasItem(DEFAULT_API_KEY)))
            .andExpect(jsonPath("$.[*].project").value(hasItem(DEFAULT_PROJECT)));
    }

    @Test
    @Transactional
    void getJiraSetUp() throws Exception {
        // Initialize the database
        jiraSetUpRepository.saveAndFlush(jiraSetUp);

        // Get the jiraSetUp
        restJiraSetUpMockMvc
            .perform(get(ENTITY_API_URL_ID, jiraSetUp.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(jiraSetUp.getId().intValue()))
            .andExpect(jsonPath("$.url").value(DEFAULT_URL))
            .andExpect(jsonPath("$.apiKey").value(DEFAULT_API_KEY))
            .andExpect(jsonPath("$.project").value(DEFAULT_PROJECT));
    }

    @Test
    @Transactional
    void getNonExistingJiraSetUp() throws Exception {
        // Get the jiraSetUp
        restJiraSetUpMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingJiraSetUp() throws Exception {
        // Initialize the database
        jiraSetUpRepository.saveAndFlush(jiraSetUp);

        int databaseSizeBeforeUpdate = jiraSetUpRepository.findAll().size();

        // Update the jiraSetUp
        JiraSetUp updatedJiraSetUp = jiraSetUpRepository.findById(jiraSetUp.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedJiraSetUp are not directly saved in db
        em.detach(updatedJiraSetUp);
        updatedJiraSetUp.url(UPDATED_URL).apiKey(UPDATED_API_KEY).project(UPDATED_PROJECT);

        restJiraSetUpMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedJiraSetUp.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedJiraSetUp))
            )
            .andExpect(status().isOk());

        // Validate the JiraSetUp in the database
        List<JiraSetUp> jiraSetUpList = jiraSetUpRepository.findAll();
        assertThat(jiraSetUpList).hasSize(databaseSizeBeforeUpdate);
        JiraSetUp testJiraSetUp = jiraSetUpList.get(jiraSetUpList.size() - 1);
        assertThat(testJiraSetUp.getUrl()).isEqualTo(UPDATED_URL);
        assertThat(testJiraSetUp.getApiKey()).isEqualTo(UPDATED_API_KEY);
        assertThat(testJiraSetUp.getProject()).isEqualTo(UPDATED_PROJECT);
    }

    @Test
    @Transactional
    void putNonExistingJiraSetUp() throws Exception {
        int databaseSizeBeforeUpdate = jiraSetUpRepository.findAll().size();
        jiraSetUp.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJiraSetUpMockMvc
            .perform(
                put(ENTITY_API_URL_ID, jiraSetUp.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jiraSetUp))
            )
            .andExpect(status().isBadRequest());

        // Validate the JiraSetUp in the database
        List<JiraSetUp> jiraSetUpList = jiraSetUpRepository.findAll();
        assertThat(jiraSetUpList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchJiraSetUp() throws Exception {
        int databaseSizeBeforeUpdate = jiraSetUpRepository.findAll().size();
        jiraSetUp.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJiraSetUpMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jiraSetUp))
            )
            .andExpect(status().isBadRequest());

        // Validate the JiraSetUp in the database
        List<JiraSetUp> jiraSetUpList = jiraSetUpRepository.findAll();
        assertThat(jiraSetUpList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamJiraSetUp() throws Exception {
        int databaseSizeBeforeUpdate = jiraSetUpRepository.findAll().size();
        jiraSetUp.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJiraSetUpMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jiraSetUp))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the JiraSetUp in the database
        List<JiraSetUp> jiraSetUpList = jiraSetUpRepository.findAll();
        assertThat(jiraSetUpList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateJiraSetUpWithPatch() throws Exception {
        // Initialize the database
        jiraSetUpRepository.saveAndFlush(jiraSetUp);

        int databaseSizeBeforeUpdate = jiraSetUpRepository.findAll().size();

        // Update the jiraSetUp using partial update
        JiraSetUp partialUpdatedJiraSetUp = new JiraSetUp();
        partialUpdatedJiraSetUp.setId(jiraSetUp.getId());

        restJiraSetUpMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJiraSetUp.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJiraSetUp))
            )
            .andExpect(status().isOk());

        // Validate the JiraSetUp in the database
        List<JiraSetUp> jiraSetUpList = jiraSetUpRepository.findAll();
        assertThat(jiraSetUpList).hasSize(databaseSizeBeforeUpdate);
        JiraSetUp testJiraSetUp = jiraSetUpList.get(jiraSetUpList.size() - 1);
        assertThat(testJiraSetUp.getUrl()).isEqualTo(DEFAULT_URL);
        assertThat(testJiraSetUp.getApiKey()).isEqualTo(DEFAULT_API_KEY);
        assertThat(testJiraSetUp.getProject()).isEqualTo(DEFAULT_PROJECT);
    }

    @Test
    @Transactional
    void fullUpdateJiraSetUpWithPatch() throws Exception {
        // Initialize the database
        jiraSetUpRepository.saveAndFlush(jiraSetUp);

        int databaseSizeBeforeUpdate = jiraSetUpRepository.findAll().size();

        // Update the jiraSetUp using partial update
        JiraSetUp partialUpdatedJiraSetUp = new JiraSetUp();
        partialUpdatedJiraSetUp.setId(jiraSetUp.getId());

        partialUpdatedJiraSetUp.url(UPDATED_URL).apiKey(UPDATED_API_KEY).project(UPDATED_PROJECT);

        restJiraSetUpMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJiraSetUp.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJiraSetUp))
            )
            .andExpect(status().isOk());

        // Validate the JiraSetUp in the database
        List<JiraSetUp> jiraSetUpList = jiraSetUpRepository.findAll();
        assertThat(jiraSetUpList).hasSize(databaseSizeBeforeUpdate);
        JiraSetUp testJiraSetUp = jiraSetUpList.get(jiraSetUpList.size() - 1);
        assertThat(testJiraSetUp.getUrl()).isEqualTo(UPDATED_URL);
        assertThat(testJiraSetUp.getApiKey()).isEqualTo(UPDATED_API_KEY);
        assertThat(testJiraSetUp.getProject()).isEqualTo(UPDATED_PROJECT);
    }

    @Test
    @Transactional
    void patchNonExistingJiraSetUp() throws Exception {
        int databaseSizeBeforeUpdate = jiraSetUpRepository.findAll().size();
        jiraSetUp.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJiraSetUpMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, jiraSetUp.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(jiraSetUp))
            )
            .andExpect(status().isBadRequest());

        // Validate the JiraSetUp in the database
        List<JiraSetUp> jiraSetUpList = jiraSetUpRepository.findAll();
        assertThat(jiraSetUpList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchJiraSetUp() throws Exception {
        int databaseSizeBeforeUpdate = jiraSetUpRepository.findAll().size();
        jiraSetUp.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJiraSetUpMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(jiraSetUp))
            )
            .andExpect(status().isBadRequest());

        // Validate the JiraSetUp in the database
        List<JiraSetUp> jiraSetUpList = jiraSetUpRepository.findAll();
        assertThat(jiraSetUpList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamJiraSetUp() throws Exception {
        int databaseSizeBeforeUpdate = jiraSetUpRepository.findAll().size();
        jiraSetUp.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJiraSetUpMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(jiraSetUp))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the JiraSetUp in the database
        List<JiraSetUp> jiraSetUpList = jiraSetUpRepository.findAll();
        assertThat(jiraSetUpList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteJiraSetUp() throws Exception {
        // Initialize the database
        jiraSetUpRepository.saveAndFlush(jiraSetUp);

        int databaseSizeBeforeDelete = jiraSetUpRepository.findAll().size();

        // Delete the jiraSetUp
        restJiraSetUpMockMvc
            .perform(delete(ENTITY_API_URL_ID, jiraSetUp.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<JiraSetUp> jiraSetUpList = jiraSetUpRepository.findAll();
        assertThat(jiraSetUpList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
