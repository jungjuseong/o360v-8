package com.incite.o360v.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.incite.o360v.IntegrationTest;
import com.incite.o360v.domain.Project;
import com.incite.o360v.domain.ProjectComment;
import com.incite.o360v.domain.User;
import com.incite.o360v.repository.ProjectCommentRepository;
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
 * Integration tests for the {@link ProjectCommentResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ProjectCommentResourceIT {

    private static final LocalDate DEFAULT_CREATED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/project-comments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProjectCommentRepository projectCommentRepository;

    @Mock
    private ProjectCommentRepository projectCommentRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProjectCommentMockMvc;

    private ProjectComment projectComment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProjectComment createEntity(EntityManager em) {
        ProjectComment projectComment = new ProjectComment().createdDate(DEFAULT_CREATED_DATE).comment(DEFAULT_COMMENT);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        projectComment.setUser(user);
        // Add required entity
        Project project;
        if (TestUtil.findAll(em, Project.class).isEmpty()) {
            project = ProjectResourceIT.createEntity(em);
            em.persist(project);
            em.flush();
        } else {
            project = TestUtil.findAll(em, Project.class).get(0);
        }
        projectComment.setProject(project);
        return projectComment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProjectComment createUpdatedEntity(EntityManager em) {
        ProjectComment projectComment = new ProjectComment().createdDate(UPDATED_CREATED_DATE).comment(UPDATED_COMMENT);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        projectComment.setUser(user);
        // Add required entity
        Project project;
        if (TestUtil.findAll(em, Project.class).isEmpty()) {
            project = ProjectResourceIT.createUpdatedEntity(em);
            em.persist(project);
            em.flush();
        } else {
            project = TestUtil.findAll(em, Project.class).get(0);
        }
        projectComment.setProject(project);
        return projectComment;
    }

    @BeforeEach
    public void initTest() {
        projectComment = createEntity(em);
    }

    @Test
    @Transactional
    void createProjectComment() throws Exception {
        int databaseSizeBeforeCreate = projectCommentRepository.findAll().size();
        // Create the ProjectComment
        restProjectCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectComment))
            )
            .andExpect(status().isCreated());

        // Validate the ProjectComment in the database
        List<ProjectComment> projectCommentList = projectCommentRepository.findAll();
        assertThat(projectCommentList).hasSize(databaseSizeBeforeCreate + 1);
        ProjectComment testProjectComment = projectCommentList.get(projectCommentList.size() - 1);
        assertThat(testProjectComment.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testProjectComment.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void createProjectCommentWithExistingId() throws Exception {
        // Create the ProjectComment with an existing ID
        projectComment.setId(1L);

        int databaseSizeBeforeCreate = projectCommentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProjectCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectComment in the database
        List<ProjectComment> projectCommentList = projectCommentRepository.findAll();
        assertThat(projectCommentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCreatedDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = projectCommentRepository.findAll().size();
        // set the field null
        projectComment.setCreatedDate(null);

        // Create the ProjectComment, which fails.

        restProjectCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectComment))
            )
            .andExpect(status().isBadRequest());

        List<ProjectComment> projectCommentList = projectCommentRepository.findAll();
        assertThat(projectCommentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProjectComments() throws Exception {
        // Initialize the database
        projectCommentRepository.saveAndFlush(projectComment);

        // Get all the projectCommentList
        restProjectCommentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(projectComment.getId().intValue())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProjectCommentsWithEagerRelationshipsIsEnabled() throws Exception {
        when(projectCommentRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProjectCommentMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(projectCommentRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProjectCommentsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(projectCommentRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProjectCommentMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(projectCommentRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getProjectComment() throws Exception {
        // Initialize the database
        projectCommentRepository.saveAndFlush(projectComment);

        // Get the projectComment
        restProjectCommentMockMvc
            .perform(get(ENTITY_API_URL_ID, projectComment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(projectComment.getId().intValue()))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingProjectComment() throws Exception {
        // Get the projectComment
        restProjectCommentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProjectComment() throws Exception {
        // Initialize the database
        projectCommentRepository.saveAndFlush(projectComment);

        int databaseSizeBeforeUpdate = projectCommentRepository.findAll().size();

        // Update the projectComment
        ProjectComment updatedProjectComment = projectCommentRepository.findById(projectComment.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedProjectComment are not directly saved in db
        em.detach(updatedProjectComment);
        updatedProjectComment.createdDate(UPDATED_CREATED_DATE).comment(UPDATED_COMMENT);

        restProjectCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProjectComment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProjectComment))
            )
            .andExpect(status().isOk());

        // Validate the ProjectComment in the database
        List<ProjectComment> projectCommentList = projectCommentRepository.findAll();
        assertThat(projectCommentList).hasSize(databaseSizeBeforeUpdate);
        ProjectComment testProjectComment = projectCommentList.get(projectCommentList.size() - 1);
        assertThat(testProjectComment.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testProjectComment.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void putNonExistingProjectComment() throws Exception {
        int databaseSizeBeforeUpdate = projectCommentRepository.findAll().size();
        projectComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProjectCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, projectComment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectComment in the database
        List<ProjectComment> projectCommentList = projectCommentRepository.findAll();
        assertThat(projectCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProjectComment() throws Exception {
        int databaseSizeBeforeUpdate = projectCommentRepository.findAll().size();
        projectComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectComment in the database
        List<ProjectComment> projectCommentList = projectCommentRepository.findAll();
        assertThat(projectCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProjectComment() throws Exception {
        int databaseSizeBeforeUpdate = projectCommentRepository.findAll().size();
        projectComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectCommentMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProjectComment in the database
        List<ProjectComment> projectCommentList = projectCommentRepository.findAll();
        assertThat(projectCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProjectCommentWithPatch() throws Exception {
        // Initialize the database
        projectCommentRepository.saveAndFlush(projectComment);

        int databaseSizeBeforeUpdate = projectCommentRepository.findAll().size();

        // Update the projectComment using partial update
        ProjectComment partialUpdatedProjectComment = new ProjectComment();
        partialUpdatedProjectComment.setId(projectComment.getId());

        partialUpdatedProjectComment.comment(UPDATED_COMMENT);

        restProjectCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProjectComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProjectComment))
            )
            .andExpect(status().isOk());

        // Validate the ProjectComment in the database
        List<ProjectComment> projectCommentList = projectCommentRepository.findAll();
        assertThat(projectCommentList).hasSize(databaseSizeBeforeUpdate);
        ProjectComment testProjectComment = projectCommentList.get(projectCommentList.size() - 1);
        assertThat(testProjectComment.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testProjectComment.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void fullUpdateProjectCommentWithPatch() throws Exception {
        // Initialize the database
        projectCommentRepository.saveAndFlush(projectComment);

        int databaseSizeBeforeUpdate = projectCommentRepository.findAll().size();

        // Update the projectComment using partial update
        ProjectComment partialUpdatedProjectComment = new ProjectComment();
        partialUpdatedProjectComment.setId(projectComment.getId());

        partialUpdatedProjectComment.createdDate(UPDATED_CREATED_DATE).comment(UPDATED_COMMENT);

        restProjectCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProjectComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProjectComment))
            )
            .andExpect(status().isOk());

        // Validate the ProjectComment in the database
        List<ProjectComment> projectCommentList = projectCommentRepository.findAll();
        assertThat(projectCommentList).hasSize(databaseSizeBeforeUpdate);
        ProjectComment testProjectComment = projectCommentList.get(projectCommentList.size() - 1);
        assertThat(testProjectComment.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testProjectComment.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void patchNonExistingProjectComment() throws Exception {
        int databaseSizeBeforeUpdate = projectCommentRepository.findAll().size();
        projectComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProjectCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, projectComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projectComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectComment in the database
        List<ProjectComment> projectCommentList = projectCommentRepository.findAll();
        assertThat(projectCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProjectComment() throws Exception {
        int databaseSizeBeforeUpdate = projectCommentRepository.findAll().size();
        projectComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projectComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectComment in the database
        List<ProjectComment> projectCommentList = projectCommentRepository.findAll();
        assertThat(projectCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProjectComment() throws Exception {
        int databaseSizeBeforeUpdate = projectCommentRepository.findAll().size();
        projectComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectCommentMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projectComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProjectComment in the database
        List<ProjectComment> projectCommentList = projectCommentRepository.findAll();
        assertThat(projectCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProjectComment() throws Exception {
        // Initialize the database
        projectCommentRepository.saveAndFlush(projectComment);

        int databaseSizeBeforeDelete = projectCommentRepository.findAll().size();

        // Delete the projectComment
        restProjectCommentMockMvc
            .perform(delete(ENTITY_API_URL_ID, projectComment.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProjectComment> projectCommentList = projectCommentRepository.findAll();
        assertThat(projectCommentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
