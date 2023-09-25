package com.incite.o360v.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.incite.o360v.IntegrationTest;
import com.incite.o360v.domain.Project;
import com.incite.o360v.domain.ProjectFile;
import com.incite.o360v.repository.ProjectFileRepository;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link ProjectFileResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ProjectFileResourceIT {

    private static final byte[] DEFAULT_FILE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_FILE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_FILE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_FILE_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/project-files";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProjectFileRepository projectFileRepository;

    @Mock
    private ProjectFileRepository projectFileRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProjectFileMockMvc;

    private ProjectFile projectFile;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProjectFile createEntity(EntityManager em) {
        ProjectFile projectFile = new ProjectFile().file(DEFAULT_FILE).fileContentType(DEFAULT_FILE_CONTENT_TYPE).name(DEFAULT_NAME);
        // Add required entity
        Project project;
        if (TestUtil.findAll(em, Project.class).isEmpty()) {
            project = ProjectResourceIT.createEntity(em);
            em.persist(project);
            em.flush();
        } else {
            project = TestUtil.findAll(em, Project.class).get(0);
        }
        projectFile.setProject(project);
        return projectFile;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProjectFile createUpdatedEntity(EntityManager em) {
        ProjectFile projectFile = new ProjectFile().file(UPDATED_FILE).fileContentType(UPDATED_FILE_CONTENT_TYPE).name(UPDATED_NAME);
        // Add required entity
        Project project;
        if (TestUtil.findAll(em, Project.class).isEmpty()) {
            project = ProjectResourceIT.createUpdatedEntity(em);
            em.persist(project);
            em.flush();
        } else {
            project = TestUtil.findAll(em, Project.class).get(0);
        }
        projectFile.setProject(project);
        return projectFile;
    }

    @BeforeEach
    public void initTest() {
        projectFile = createEntity(em);
    }

    @Test
    @Transactional
    void createProjectFile() throws Exception {
        int databaseSizeBeforeCreate = projectFileRepository.findAll().size();
        // Create the ProjectFile
        restProjectFileMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectFile))
            )
            .andExpect(status().isCreated());

        // Validate the ProjectFile in the database
        List<ProjectFile> projectFileList = projectFileRepository.findAll();
        assertThat(projectFileList).hasSize(databaseSizeBeforeCreate + 1);
        ProjectFile testProjectFile = projectFileList.get(projectFileList.size() - 1);
        assertThat(testProjectFile.getFile()).isEqualTo(DEFAULT_FILE);
        assertThat(testProjectFile.getFileContentType()).isEqualTo(DEFAULT_FILE_CONTENT_TYPE);
        assertThat(testProjectFile.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createProjectFileWithExistingId() throws Exception {
        // Create the ProjectFile with an existing ID
        projectFile.setId(1L);

        int databaseSizeBeforeCreate = projectFileRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProjectFileMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectFile))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectFile in the database
        List<ProjectFile> projectFileList = projectFileRepository.findAll();
        assertThat(projectFileList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = projectFileRepository.findAll().size();
        // set the field null
        projectFile.setName(null);

        // Create the ProjectFile, which fails.

        restProjectFileMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectFile))
            )
            .andExpect(status().isBadRequest());

        List<ProjectFile> projectFileList = projectFileRepository.findAll();
        assertThat(projectFileList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProjectFiles() throws Exception {
        // Initialize the database
        projectFileRepository.saveAndFlush(projectFile);

        // Get all the projectFileList
        restProjectFileMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(projectFile.getId().intValue())))
            .andExpect(jsonPath("$.[*].fileContentType").value(hasItem(DEFAULT_FILE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].file").value(hasItem(Base64Utils.encodeToString(DEFAULT_FILE))))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProjectFilesWithEagerRelationshipsIsEnabled() throws Exception {
        when(projectFileRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProjectFileMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(projectFileRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProjectFilesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(projectFileRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProjectFileMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(projectFileRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getProjectFile() throws Exception {
        // Initialize the database
        projectFileRepository.saveAndFlush(projectFile);

        // Get the projectFile
        restProjectFileMockMvc
            .perform(get(ENTITY_API_URL_ID, projectFile.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(projectFile.getId().intValue()))
            .andExpect(jsonPath("$.fileContentType").value(DEFAULT_FILE_CONTENT_TYPE))
            .andExpect(jsonPath("$.file").value(Base64Utils.encodeToString(DEFAULT_FILE)))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingProjectFile() throws Exception {
        // Get the projectFile
        restProjectFileMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProjectFile() throws Exception {
        // Initialize the database
        projectFileRepository.saveAndFlush(projectFile);

        int databaseSizeBeforeUpdate = projectFileRepository.findAll().size();

        // Update the projectFile
        ProjectFile updatedProjectFile = projectFileRepository.findById(projectFile.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedProjectFile are not directly saved in db
        em.detach(updatedProjectFile);
        updatedProjectFile.file(UPDATED_FILE).fileContentType(UPDATED_FILE_CONTENT_TYPE).name(UPDATED_NAME);

        restProjectFileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProjectFile.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProjectFile))
            )
            .andExpect(status().isOk());

        // Validate the ProjectFile in the database
        List<ProjectFile> projectFileList = projectFileRepository.findAll();
        assertThat(projectFileList).hasSize(databaseSizeBeforeUpdate);
        ProjectFile testProjectFile = projectFileList.get(projectFileList.size() - 1);
        assertThat(testProjectFile.getFile()).isEqualTo(UPDATED_FILE);
        assertThat(testProjectFile.getFileContentType()).isEqualTo(UPDATED_FILE_CONTENT_TYPE);
        assertThat(testProjectFile.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingProjectFile() throws Exception {
        int databaseSizeBeforeUpdate = projectFileRepository.findAll().size();
        projectFile.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProjectFileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, projectFile.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectFile))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectFile in the database
        List<ProjectFile> projectFileList = projectFileRepository.findAll();
        assertThat(projectFileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProjectFile() throws Exception {
        int databaseSizeBeforeUpdate = projectFileRepository.findAll().size();
        projectFile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectFileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectFile))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectFile in the database
        List<ProjectFile> projectFileList = projectFileRepository.findAll();
        assertThat(projectFileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProjectFile() throws Exception {
        int databaseSizeBeforeUpdate = projectFileRepository.findAll().size();
        projectFile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectFileMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projectFile))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProjectFile in the database
        List<ProjectFile> projectFileList = projectFileRepository.findAll();
        assertThat(projectFileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProjectFileWithPatch() throws Exception {
        // Initialize the database
        projectFileRepository.saveAndFlush(projectFile);

        int databaseSizeBeforeUpdate = projectFileRepository.findAll().size();

        // Update the projectFile using partial update
        ProjectFile partialUpdatedProjectFile = new ProjectFile();
        partialUpdatedProjectFile.setId(projectFile.getId());

        partialUpdatedProjectFile.file(UPDATED_FILE).fileContentType(UPDATED_FILE_CONTENT_TYPE);

        restProjectFileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProjectFile.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProjectFile))
            )
            .andExpect(status().isOk());

        // Validate the ProjectFile in the database
        List<ProjectFile> projectFileList = projectFileRepository.findAll();
        assertThat(projectFileList).hasSize(databaseSizeBeforeUpdate);
        ProjectFile testProjectFile = projectFileList.get(projectFileList.size() - 1);
        assertThat(testProjectFile.getFile()).isEqualTo(UPDATED_FILE);
        assertThat(testProjectFile.getFileContentType()).isEqualTo(UPDATED_FILE_CONTENT_TYPE);
        assertThat(testProjectFile.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateProjectFileWithPatch() throws Exception {
        // Initialize the database
        projectFileRepository.saveAndFlush(projectFile);

        int databaseSizeBeforeUpdate = projectFileRepository.findAll().size();

        // Update the projectFile using partial update
        ProjectFile partialUpdatedProjectFile = new ProjectFile();
        partialUpdatedProjectFile.setId(projectFile.getId());

        partialUpdatedProjectFile.file(UPDATED_FILE).fileContentType(UPDATED_FILE_CONTENT_TYPE).name(UPDATED_NAME);

        restProjectFileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProjectFile.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProjectFile))
            )
            .andExpect(status().isOk());

        // Validate the ProjectFile in the database
        List<ProjectFile> projectFileList = projectFileRepository.findAll();
        assertThat(projectFileList).hasSize(databaseSizeBeforeUpdate);
        ProjectFile testProjectFile = projectFileList.get(projectFileList.size() - 1);
        assertThat(testProjectFile.getFile()).isEqualTo(UPDATED_FILE);
        assertThat(testProjectFile.getFileContentType()).isEqualTo(UPDATED_FILE_CONTENT_TYPE);
        assertThat(testProjectFile.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingProjectFile() throws Exception {
        int databaseSizeBeforeUpdate = projectFileRepository.findAll().size();
        projectFile.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProjectFileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, projectFile.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projectFile))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectFile in the database
        List<ProjectFile> projectFileList = projectFileRepository.findAll();
        assertThat(projectFileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProjectFile() throws Exception {
        int databaseSizeBeforeUpdate = projectFileRepository.findAll().size();
        projectFile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectFileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projectFile))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProjectFile in the database
        List<ProjectFile> projectFileList = projectFileRepository.findAll();
        assertThat(projectFileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProjectFile() throws Exception {
        int databaseSizeBeforeUpdate = projectFileRepository.findAll().size();
        projectFile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjectFileMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projectFile))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProjectFile in the database
        List<ProjectFile> projectFileList = projectFileRepository.findAll();
        assertThat(projectFileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProjectFile() throws Exception {
        // Initialize the database
        projectFileRepository.saveAndFlush(projectFile);

        int databaseSizeBeforeDelete = projectFileRepository.findAll().size();

        // Delete the projectFile
        restProjectFileMockMvc
            .perform(delete(ENTITY_API_URL_ID, projectFile.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProjectFile> projectFileList = projectFileRepository.findAll();
        assertThat(projectFileList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
