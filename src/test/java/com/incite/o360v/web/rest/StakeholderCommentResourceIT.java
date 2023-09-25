package com.incite.o360v.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.incite.o360v.IntegrationTest;
import com.incite.o360v.domain.Stakeholder;
import com.incite.o360v.domain.StakeholderComment;
import com.incite.o360v.domain.User;
import com.incite.o360v.repository.StakeholderCommentRepository;
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
 * Integration tests for the {@link StakeholderCommentResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class StakeholderCommentResourceIT {

    private static final LocalDate DEFAULT_CREATED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/stakeholder-comments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StakeholderCommentRepository stakeholderCommentRepository;

    @Mock
    private StakeholderCommentRepository stakeholderCommentRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStakeholderCommentMockMvc;

    private StakeholderComment stakeholderComment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StakeholderComment createEntity(EntityManager em) {
        StakeholderComment stakeholderComment = new StakeholderComment().createdDate(DEFAULT_CREATED_DATE).comment(DEFAULT_COMMENT);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        stakeholderComment.setUser(user);
        // Add required entity
        Stakeholder stakeholder;
        if (TestUtil.findAll(em, Stakeholder.class).isEmpty()) {
            stakeholder = StakeholderResourceIT.createEntity(em);
            em.persist(stakeholder);
            em.flush();
        } else {
            stakeholder = TestUtil.findAll(em, Stakeholder.class).get(0);
        }
        stakeholderComment.setStakeholder(stakeholder);
        return stakeholderComment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StakeholderComment createUpdatedEntity(EntityManager em) {
        StakeholderComment stakeholderComment = new StakeholderComment().createdDate(UPDATED_CREATED_DATE).comment(UPDATED_COMMENT);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        stakeholderComment.setUser(user);
        // Add required entity
        Stakeholder stakeholder;
        if (TestUtil.findAll(em, Stakeholder.class).isEmpty()) {
            stakeholder = StakeholderResourceIT.createUpdatedEntity(em);
            em.persist(stakeholder);
            em.flush();
        } else {
            stakeholder = TestUtil.findAll(em, Stakeholder.class).get(0);
        }
        stakeholderComment.setStakeholder(stakeholder);
        return stakeholderComment;
    }

    @BeforeEach
    public void initTest() {
        stakeholderComment = createEntity(em);
    }

    @Test
    @Transactional
    void createStakeholderComment() throws Exception {
        int databaseSizeBeforeCreate = stakeholderCommentRepository.findAll().size();
        // Create the StakeholderComment
        restStakeholderCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stakeholderComment))
            )
            .andExpect(status().isCreated());

        // Validate the StakeholderComment in the database
        List<StakeholderComment> stakeholderCommentList = stakeholderCommentRepository.findAll();
        assertThat(stakeholderCommentList).hasSize(databaseSizeBeforeCreate + 1);
        StakeholderComment testStakeholderComment = stakeholderCommentList.get(stakeholderCommentList.size() - 1);
        assertThat(testStakeholderComment.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testStakeholderComment.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void createStakeholderCommentWithExistingId() throws Exception {
        // Create the StakeholderComment with an existing ID
        stakeholderComment.setId(1L);

        int databaseSizeBeforeCreate = stakeholderCommentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStakeholderCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stakeholderComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the StakeholderComment in the database
        List<StakeholderComment> stakeholderCommentList = stakeholderCommentRepository.findAll();
        assertThat(stakeholderCommentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCreatedDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = stakeholderCommentRepository.findAll().size();
        // set the field null
        stakeholderComment.setCreatedDate(null);

        // Create the StakeholderComment, which fails.

        restStakeholderCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stakeholderComment))
            )
            .andExpect(status().isBadRequest());

        List<StakeholderComment> stakeholderCommentList = stakeholderCommentRepository.findAll();
        assertThat(stakeholderCommentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllStakeholderComments() throws Exception {
        // Initialize the database
        stakeholderCommentRepository.saveAndFlush(stakeholderComment);

        // Get all the stakeholderCommentList
        restStakeholderCommentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(stakeholderComment.getId().intValue())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllStakeholderCommentsWithEagerRelationshipsIsEnabled() throws Exception {
        when(stakeholderCommentRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restStakeholderCommentMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(stakeholderCommentRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllStakeholderCommentsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(stakeholderCommentRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restStakeholderCommentMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(stakeholderCommentRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getStakeholderComment() throws Exception {
        // Initialize the database
        stakeholderCommentRepository.saveAndFlush(stakeholderComment);

        // Get the stakeholderComment
        restStakeholderCommentMockMvc
            .perform(get(ENTITY_API_URL_ID, stakeholderComment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(stakeholderComment.getId().intValue()))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingStakeholderComment() throws Exception {
        // Get the stakeholderComment
        restStakeholderCommentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingStakeholderComment() throws Exception {
        // Initialize the database
        stakeholderCommentRepository.saveAndFlush(stakeholderComment);

        int databaseSizeBeforeUpdate = stakeholderCommentRepository.findAll().size();

        // Update the stakeholderComment
        StakeholderComment updatedStakeholderComment = stakeholderCommentRepository.findById(stakeholderComment.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedStakeholderComment are not directly saved in db
        em.detach(updatedStakeholderComment);
        updatedStakeholderComment.createdDate(UPDATED_CREATED_DATE).comment(UPDATED_COMMENT);

        restStakeholderCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStakeholderComment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStakeholderComment))
            )
            .andExpect(status().isOk());

        // Validate the StakeholderComment in the database
        List<StakeholderComment> stakeholderCommentList = stakeholderCommentRepository.findAll();
        assertThat(stakeholderCommentList).hasSize(databaseSizeBeforeUpdate);
        StakeholderComment testStakeholderComment = stakeholderCommentList.get(stakeholderCommentList.size() - 1);
        assertThat(testStakeholderComment.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testStakeholderComment.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void putNonExistingStakeholderComment() throws Exception {
        int databaseSizeBeforeUpdate = stakeholderCommentRepository.findAll().size();
        stakeholderComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStakeholderCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, stakeholderComment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stakeholderComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the StakeholderComment in the database
        List<StakeholderComment> stakeholderCommentList = stakeholderCommentRepository.findAll();
        assertThat(stakeholderCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStakeholderComment() throws Exception {
        int databaseSizeBeforeUpdate = stakeholderCommentRepository.findAll().size();
        stakeholderComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStakeholderCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stakeholderComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the StakeholderComment in the database
        List<StakeholderComment> stakeholderCommentList = stakeholderCommentRepository.findAll();
        assertThat(stakeholderCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStakeholderComment() throws Exception {
        int databaseSizeBeforeUpdate = stakeholderCommentRepository.findAll().size();
        stakeholderComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStakeholderCommentMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stakeholderComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the StakeholderComment in the database
        List<StakeholderComment> stakeholderCommentList = stakeholderCommentRepository.findAll();
        assertThat(stakeholderCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStakeholderCommentWithPatch() throws Exception {
        // Initialize the database
        stakeholderCommentRepository.saveAndFlush(stakeholderComment);

        int databaseSizeBeforeUpdate = stakeholderCommentRepository.findAll().size();

        // Update the stakeholderComment using partial update
        StakeholderComment partialUpdatedStakeholderComment = new StakeholderComment();
        partialUpdatedStakeholderComment.setId(stakeholderComment.getId());

        partialUpdatedStakeholderComment.comment(UPDATED_COMMENT);

        restStakeholderCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStakeholderComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStakeholderComment))
            )
            .andExpect(status().isOk());

        // Validate the StakeholderComment in the database
        List<StakeholderComment> stakeholderCommentList = stakeholderCommentRepository.findAll();
        assertThat(stakeholderCommentList).hasSize(databaseSizeBeforeUpdate);
        StakeholderComment testStakeholderComment = stakeholderCommentList.get(stakeholderCommentList.size() - 1);
        assertThat(testStakeholderComment.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testStakeholderComment.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void fullUpdateStakeholderCommentWithPatch() throws Exception {
        // Initialize the database
        stakeholderCommentRepository.saveAndFlush(stakeholderComment);

        int databaseSizeBeforeUpdate = stakeholderCommentRepository.findAll().size();

        // Update the stakeholderComment using partial update
        StakeholderComment partialUpdatedStakeholderComment = new StakeholderComment();
        partialUpdatedStakeholderComment.setId(stakeholderComment.getId());

        partialUpdatedStakeholderComment.createdDate(UPDATED_CREATED_DATE).comment(UPDATED_COMMENT);

        restStakeholderCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStakeholderComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStakeholderComment))
            )
            .andExpect(status().isOk());

        // Validate the StakeholderComment in the database
        List<StakeholderComment> stakeholderCommentList = stakeholderCommentRepository.findAll();
        assertThat(stakeholderCommentList).hasSize(databaseSizeBeforeUpdate);
        StakeholderComment testStakeholderComment = stakeholderCommentList.get(stakeholderCommentList.size() - 1);
        assertThat(testStakeholderComment.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testStakeholderComment.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void patchNonExistingStakeholderComment() throws Exception {
        int databaseSizeBeforeUpdate = stakeholderCommentRepository.findAll().size();
        stakeholderComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStakeholderCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, stakeholderComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stakeholderComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the StakeholderComment in the database
        List<StakeholderComment> stakeholderCommentList = stakeholderCommentRepository.findAll();
        assertThat(stakeholderCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStakeholderComment() throws Exception {
        int databaseSizeBeforeUpdate = stakeholderCommentRepository.findAll().size();
        stakeholderComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStakeholderCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stakeholderComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the StakeholderComment in the database
        List<StakeholderComment> stakeholderCommentList = stakeholderCommentRepository.findAll();
        assertThat(stakeholderCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStakeholderComment() throws Exception {
        int databaseSizeBeforeUpdate = stakeholderCommentRepository.findAll().size();
        stakeholderComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStakeholderCommentMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stakeholderComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the StakeholderComment in the database
        List<StakeholderComment> stakeholderCommentList = stakeholderCommentRepository.findAll();
        assertThat(stakeholderCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStakeholderComment() throws Exception {
        // Initialize the database
        stakeholderCommentRepository.saveAndFlush(stakeholderComment);

        int databaseSizeBeforeDelete = stakeholderCommentRepository.findAll().size();

        // Delete the stakeholderComment
        restStakeholderCommentMockMvc
            .perform(delete(ENTITY_API_URL_ID, stakeholderComment.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<StakeholderComment> stakeholderCommentList = stakeholderCommentRepository.findAll();
        assertThat(stakeholderCommentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
