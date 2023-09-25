package com.incite.o360v.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.incite.o360v.IntegrationTest;
import com.incite.o360v.domain.Project;
import com.incite.o360v.domain.ProjectDate;
import com.incite.o360v.domain.enumeration.ProjectDateType;
import com.incite.o360v.repository.ProjectDateRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link ProjectDateResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ProjectDateResourceIT {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final ProjectDateType DEFAULT_PROJECT_DATE_TYPE = ProjectDateType.DATE_TYPE1;
    private static final ProjectDateType UPDATED_PROJECT_DATE_TYPE = ProjectDateType.DATE_TYPE2;

    private static final String ENTITY_API_URL = "/api/project-dates";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProjectDateRepository projectDateRepository;

    @Mock
    private ProjectDateRepository projectDateRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProjectDateMockMvc;

    private ProjectDate projectDate;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProjectDate createEntity(EntityManager em) {
        ProjectDate projectDate = new ProjectDate().date(DEFAULT_DATE).projectDateType(DEFAULT_PROJECT_DATE_TYPE);
        // Add required entity
        Project project;
        if (TestUtil.findAll(em, Project.class).isEmpty()) {
            project = ProjectResourceIT.createEntity(em);
            em.persist(project);
            em.flush();
        } else {
            project = TestUtil.findAll(em, Project.class).get(0);
        }
        projectDate.setProject(project);
        return projectDate;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProjectDate createUpdatedEntity(EntityManager em) {
        ProjectDate projectDate = new ProjectDate().date(UPDATED_DATE).projectDateType(UPDATED_PROJECT_DATE_TYPE);
        // Add required entity
        Project project;
        if (TestUtil.findAll(em, Project.class).isEmpty()) {
            project = ProjectResourceIT.createUpdatedEntity(em);
            em.persist(project);
            em.flush();
        } else {
            project = TestUtil.findAll(em, Project.class).get(0);
        }
        projectDate.setProject(project);
        return projectDate;
    }

    @BeforeEach
    public void initTest() {
        projectDate = createEntity(em);
    }

    @Test
    @Transactional
    void createProjectDate() throws Exception {
        int databaseSizeBeforeCreate = projectDateRepository.findAll().size();
        // Create the ProjectDate
        restProjectDateMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectDate))
            )
            .andExpect(status().isCreated());

        // Validate the ProjectDate in the database
        List<ProjectDate> projectDateList = projectDateRepository.findAll();
        assertThat(projectDateList).hasSize(databaseSizeBeforeCreate + 1);
        ProjectDate testProjectDate = projectDateList.get(projectDateList.size() - 1);
        assertThat(testProjectDate.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testProjectDate.getProjectDateType()).isEqualTo(DEFAULT_PROJECT_DATE_TYPE);
    }

    @Test
    @Transactional
    void createProjectDateWithExistingId() throws Exception {
        // Create the ProjectDate with an existing ID
        projectDate.setId(1L);

        int databaseSizeBeforeCreate = projectDateRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProjectDateMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectDate))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectDate in the database
        List<ProjectDate> projectDateList = projectDateRepository.findAll();
        assertThat(projectDateList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = projectDateRepository.findAll().size();
        // set the field null
        projectDate.setDate(null);

        // Create the ProjectDate, which fails.

        restProjectDateMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectDate))
            )
            .andExpect(status().isBadRequest());

        List<ProjectDate> projectDateList = projectDateRepository.findAll();
        assertThat(projectDateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProjectDates() throws Exception {
        // Initialize the database
        projectDateRepository.saveAndFlush(projectDate);

        // Get all the projectDateList
        restProjectDateMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(projectDate.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].projectDateType").value(hasItem(DEFAULT_PROJECT_DATE_TYPE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProjectDatesWithEagerRelationshipsIsEnabled() throws Exception {
        when(projectDateRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProjectDateMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(projectDateRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProjectDatesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(projectDateRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProjectDateMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(projectDateRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getProjectDate() throws Exception {
        // Initialize the database
        projectDateRepository.saveAndFlush(projectDate);

        // Get the projectDate
        restProjectDateMockMvc
            .perform(get(ENTITY_API_URL_ID, projectDate.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(projectDate.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.projectDateType").value(DEFAULT_PROJECT_DATE_TYPE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingProjectDate() throws Exception {
        // Get the projectDate
        restProjectDateMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProjectDate() throws Exception {
        // Initialize the database
        projectDateRepository.saveAndFlush(projectDate);

        int databaseSizeBeforeUpdate = projectDateRepository.findAll().size();

        // Update the projectDate
        ProjectDate updatedProjectDate = projectDateRepository.findById(projectDate.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedProjectDate are not directly saved in db
        em.detach(updatedProjectDate);
        updatedProjectDate.date(UPDATED_DATE).projectDateType(UPDATED_PROJECT_DATE_TYPE);

        restProjectDateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProjectDate.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProjectDate))
            )
            .andExpect(status().isOk());

        // Validate the ProjectDate in the database
        List<ProjectDate> projectDateList = projectDateRepository.findAll();
        assertThat(projectDateList).hasSize(databaseSizeBeforeUpdate);
        ProjectDate testProjectDate = projectDateList.get(projectDateList.size() - 1);
        assertThat(testProjectDate.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testProjectDate.getProjectDateType()).isEqualTo(UPDATED_PROJECT_DATE_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingProjectDate() throws Exception {
        int databaseSizeBeforeUpdate = projectDateRepository.findAll().size();
        projectDate.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProjectDateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, projectDate.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectDate))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectDate in the database
        List<ProjectDate> projectDateList = projectDateRepository.findAll();
        assertThat(projectDateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProjectDate() throws Exception {
        int databaseSizeBeforeUpdate = projectDateRepository.findAll().size();
        projectDate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectDateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectDate))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectDate in the database
        List<ProjectDate> projectDateList = projectDateRepository.findAll();
        assertThat(projectDateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProjectDate() throws Exception {
        int databaseSizeBeforeUpdate = projectDateRepository.findAll().size();
        projectDate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectDateMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectDate))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProjectDate in the database
        List<ProjectDate> projectDateList = projectDateRepository.findAll();
        assertThat(projectDateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProjectDateWithPatch() throws Exception {
        // Initialize the database
        projectDateRepository.saveAndFlush(projectDate);

        int databaseSizeBeforeUpdate = projectDateRepository.findAll().size();

        // Update the projectDate using partial update
        ProjectDate partialUpdatedProjectDate = new ProjectDate();
        partialUpdatedProjectDate.setId(projectDate.getId());

        partialUpdatedProjectDate.projectDateType(UPDATED_PROJECT_DATE_TYPE);

        restProjectDateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProjectDate.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProjectDate))
            )
            .andExpect(status().isOk());

        // Validate the ProjectDate in the database
        List<ProjectDate> projectDateList = projectDateRepository.findAll();
        assertThat(projectDateList).hasSize(databaseSizeBeforeUpdate);
        ProjectDate testProjectDate = projectDateList.get(projectDateList.size() - 1);
        assertThat(testProjectDate.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testProjectDate.getProjectDateType()).isEqualTo(UPDATED_PROJECT_DATE_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateProjectDateWithPatch() throws Exception {
        // Initialize the database
        projectDateRepository.saveAndFlush(projectDate);

        int databaseSizeBeforeUpdate = projectDateRepository.findAll().size();

        // Update the projectDate using partial update
        ProjectDate partialUpdatedProjectDate = new ProjectDate();
        partialUpdatedProjectDate.setId(projectDate.getId());

        partialUpdatedProjectDate.date(UPDATED_DATE).projectDateType(UPDATED_PROJECT_DATE_TYPE);

        restProjectDateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProjectDate.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProjectDate))
            )
            .andExpect(status().isOk());

        // Validate the ProjectDate in the database
        List<ProjectDate> projectDateList = projectDateRepository.findAll();
        assertThat(projectDateList).hasSize(databaseSizeBeforeUpdate);
        ProjectDate testProjectDate = projectDateList.get(projectDateList.size() - 1);
        assertThat(testProjectDate.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testProjectDate.getProjectDateType()).isEqualTo(UPDATED_PROJECT_DATE_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingProjectDate() throws Exception {
        int databaseSizeBeforeUpdate = projectDateRepository.findAll().size();
        projectDate.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProjectDateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, projectDate.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projectDate))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectDate in the database
        List<ProjectDate> projectDateList = projectDateRepository.findAll();
        assertThat(projectDateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProjectDate() throws Exception {
        int databaseSizeBeforeUpdate = projectDateRepository.findAll().size();
        projectDate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectDateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projectDate))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectDate in the database
        List<ProjectDate> projectDateList = projectDateRepository.findAll();
        assertThat(projectDateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProjectDate() throws Exception {
        int databaseSizeBeforeUpdate = projectDateRepository.findAll().size();
        projectDate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectDateMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projectDate))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProjectDate in the database
        List<ProjectDate> projectDateList = projectDateRepository.findAll();
        assertThat(projectDateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProjectDate() throws Exception {
        // Initialize the database
        projectDateRepository.saveAndFlush(projectDate);

        int databaseSizeBeforeDelete = projectDateRepository.findAll().size();

        // Delete the projectDate
        restProjectDateMockMvc
            .perform(delete(ENTITY_API_URL_ID, projectDate.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProjectDate> projectDateList = projectDateRepository.findAll();
        assertThat(projectDateList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
