package com.incite.o360v.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.incite.o360v.IntegrationTest;
import com.incite.o360v.domain.Jira;
import com.incite.o360v.repository.JiraRepository;
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
 * Integration tests for the {@link JiraResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class JiraResourceIT {

    private static final String DEFAULT_URL = "AAAAAAAAAA";
    private static final String UPDATED_URL = "BBBBBBBBBB";

    private static final String DEFAULT_API_KEY = "AAAAAAAAAA";
    private static final String UPDATED_API_KEY = "BBBBBBBBBB";

    private static final String DEFAULT_PROJECT = "AAAAAAAAAA";
    private static final String UPDATED_PROJECT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/jiras";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private JiraRepository jiraRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restJiraMockMvc;

    private Jira jira;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Jira createEntity(EntityManager em) {
        Jira jira = new Jira().url(DEFAULT_URL).apiKey(DEFAULT_API_KEY).project(DEFAULT_PROJECT);
        return jira;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Jira createUpdatedEntity(EntityManager em) {
        Jira jira = new Jira().url(UPDATED_URL).apiKey(UPDATED_API_KEY).project(UPDATED_PROJECT);
        return jira;
    }

    @BeforeEach
    public void initTest() {
        jira = createEntity(em);
    }

    @Test
    @Transactional
    void createJira() throws Exception {
        int databaseSizeBeforeCreate = jiraRepository.findAll().size();
        // Create the Jira
        restJiraMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(jira))
            )
            .andExpect(status().isCreated());

        // Validate the Jira in the database
        List<Jira> jiraList = jiraRepository.findAll();
        assertThat(jiraList).hasSize(databaseSizeBeforeCreate + 1);
        Jira testJira = jiraList.get(jiraList.size() - 1);
        assertThat(testJira.getUrl()).isEqualTo(DEFAULT_URL);
        assertThat(testJira.getApiKey()).isEqualTo(DEFAULT_API_KEY);
        assertThat(testJira.getProject()).isEqualTo(DEFAULT_PROJECT);
    }

    @Test
    @Transactional
    void createJiraWithExistingId() throws Exception {
        // Create the Jira with an existing ID
        jira.setId(1L);

        int databaseSizeBeforeCreate = jiraRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restJiraMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(jira))
            )
            .andExpect(status().isBadRequest());

        // Validate the Jira in the database
        List<Jira> jiraList = jiraRepository.findAll();
        assertThat(jiraList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkUrlIsRequired() throws Exception {
        int databaseSizeBeforeTest = jiraRepository.findAll().size();
        // set the field null
        jira.setUrl(null);

        // Create the Jira, which fails.

        restJiraMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(jira))
            )
            .andExpect(status().isBadRequest());

        List<Jira> jiraList = jiraRepository.findAll();
        assertThat(jiraList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkApiKeyIsRequired() throws Exception {
        int databaseSizeBeforeTest = jiraRepository.findAll().size();
        // set the field null
        jira.setApiKey(null);

        // Create the Jira, which fails.

        restJiraMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(jira))
            )
            .andExpect(status().isBadRequest());

        List<Jira> jiraList = jiraRepository.findAll();
        assertThat(jiraList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkProjectIsRequired() throws Exception {
        int databaseSizeBeforeTest = jiraRepository.findAll().size();
        // set the field null
        jira.setProject(null);

        // Create the Jira, which fails.

        restJiraMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(jira))
            )
            .andExpect(status().isBadRequest());

        List<Jira> jiraList = jiraRepository.findAll();
        assertThat(jiraList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllJiras() throws Exception {
        // Initialize the database
        jiraRepository.saveAndFlush(jira);

        // Get all the jiraList
        restJiraMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(jira.getId().intValue())))
            .andExpect(jsonPath("$.[*].url").value(hasItem(DEFAULT_URL)))
            .andExpect(jsonPath("$.[*].apiKey").value(hasItem(DEFAULT_API_KEY)))
            .andExpect(jsonPath("$.[*].project").value(hasItem(DEFAULT_PROJECT)));
    }

    @Test
    @Transactional
    void getJira() throws Exception {
        // Initialize the database
        jiraRepository.saveAndFlush(jira);

        // Get the jira
        restJiraMockMvc
            .perform(get(ENTITY_API_URL_ID, jira.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(jira.getId().intValue()))
            .andExpect(jsonPath("$.url").value(DEFAULT_URL))
            .andExpect(jsonPath("$.apiKey").value(DEFAULT_API_KEY))
            .andExpect(jsonPath("$.project").value(DEFAULT_PROJECT));
    }

    @Test
    @Transactional
    void getNonExistingJira() throws Exception {
        // Get the jira
        restJiraMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingJira() throws Exception {
        // Initialize the database
        jiraRepository.saveAndFlush(jira);

        int databaseSizeBeforeUpdate = jiraRepository.findAll().size();

        // Update the jira
        Jira updatedJira = jiraRepository.findById(jira.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedJira are not directly saved in db
        em.detach(updatedJira);
        updatedJira.url(UPDATED_URL).apiKey(UPDATED_API_KEY).project(UPDATED_PROJECT);

        restJiraMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedJira.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedJira))
            )
            .andExpect(status().isOk());

        // Validate the Jira in the database
        List<Jira> jiraList = jiraRepository.findAll();
        assertThat(jiraList).hasSize(databaseSizeBeforeUpdate);
        Jira testJira = jiraList.get(jiraList.size() - 1);
        assertThat(testJira.getUrl()).isEqualTo(UPDATED_URL);
        assertThat(testJira.getApiKey()).isEqualTo(UPDATED_API_KEY);
        assertThat(testJira.getProject()).isEqualTo(UPDATED_PROJECT);
    }

    @Test
    @Transactional
    void putNonExistingJira() throws Exception {
        int databaseSizeBeforeUpdate = jiraRepository.findAll().size();
        jira.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJiraMockMvc
            .perform(
                put(ENTITY_API_URL_ID, jira.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jira))
            )
            .andExpect(status().isBadRequest());

        // Validate the Jira in the database
        List<Jira> jiraList = jiraRepository.findAll();
        assertThat(jiraList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchJira() throws Exception {
        int databaseSizeBeforeUpdate = jiraRepository.findAll().size();
        jira.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJiraMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jira))
            )
            .andExpect(status().isBadRequest());

        // Validate the Jira in the database
        List<Jira> jiraList = jiraRepository.findAll();
        assertThat(jiraList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamJira() throws Exception {
        int databaseSizeBeforeUpdate = jiraRepository.findAll().size();
        jira.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJiraMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(jira))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Jira in the database
        List<Jira> jiraList = jiraRepository.findAll();
        assertThat(jiraList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateJiraWithPatch() throws Exception {
        // Initialize the database
        jiraRepository.saveAndFlush(jira);

        int databaseSizeBeforeUpdate = jiraRepository.findAll().size();

        // Update the jira using partial update
        Jira partialUpdatedJira = new Jira();
        partialUpdatedJira.setId(jira.getId());

        partialUpdatedJira.url(UPDATED_URL).project(UPDATED_PROJECT);

        restJiraMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJira.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJira))
            )
            .andExpect(status().isOk());

        // Validate the Jira in the database
        List<Jira> jiraList = jiraRepository.findAll();
        assertThat(jiraList).hasSize(databaseSizeBeforeUpdate);
        Jira testJira = jiraList.get(jiraList.size() - 1);
        assertThat(testJira.getUrl()).isEqualTo(UPDATED_URL);
        assertThat(testJira.getApiKey()).isEqualTo(DEFAULT_API_KEY);
        assertThat(testJira.getProject()).isEqualTo(UPDATED_PROJECT);
    }

    @Test
    @Transactional
    void fullUpdateJiraWithPatch() throws Exception {
        // Initialize the database
        jiraRepository.saveAndFlush(jira);

        int databaseSizeBeforeUpdate = jiraRepository.findAll().size();

        // Update the jira using partial update
        Jira partialUpdatedJira = new Jira();
        partialUpdatedJira.setId(jira.getId());

        partialUpdatedJira.url(UPDATED_URL).apiKey(UPDATED_API_KEY).project(UPDATED_PROJECT);

        restJiraMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJira.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJira))
            )
            .andExpect(status().isOk());

        // Validate the Jira in the database
        List<Jira> jiraList = jiraRepository.findAll();
        assertThat(jiraList).hasSize(databaseSizeBeforeUpdate);
        Jira testJira = jiraList.get(jiraList.size() - 1);
        assertThat(testJira.getUrl()).isEqualTo(UPDATED_URL);
        assertThat(testJira.getApiKey()).isEqualTo(UPDATED_API_KEY);
        assertThat(testJira.getProject()).isEqualTo(UPDATED_PROJECT);
    }

    @Test
    @Transactional
    void patchNonExistingJira() throws Exception {
        int databaseSizeBeforeUpdate = jiraRepository.findAll().size();
        jira.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJiraMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, jira.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(jira))
            )
            .andExpect(status().isBadRequest());

        // Validate the Jira in the database
        List<Jira> jiraList = jiraRepository.findAll();
        assertThat(jiraList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchJira() throws Exception {
        int databaseSizeBeforeUpdate = jiraRepository.findAll().size();
        jira.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJiraMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(jira))
            )
            .andExpect(status().isBadRequest());

        // Validate the Jira in the database
        List<Jira> jiraList = jiraRepository.findAll();
        assertThat(jiraList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamJira() throws Exception {
        int databaseSizeBeforeUpdate = jiraRepository.findAll().size();
        jira.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJiraMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(jira))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Jira in the database
        List<Jira> jiraList = jiraRepository.findAll();
        assertThat(jiraList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteJira() throws Exception {
        // Initialize the database
        jiraRepository.saveAndFlush(jira);

        int databaseSizeBeforeDelete = jiraRepository.findAll().size();

        // Delete the jira
        restJiraMockMvc
            .perform(delete(ENTITY_API_URL_ID, jira.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Jira> jiraList = jiraRepository.findAll();
        assertThat(jiraList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
