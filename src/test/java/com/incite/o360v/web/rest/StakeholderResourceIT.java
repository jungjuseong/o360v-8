package com.incite.o360v.web.rest;

import static com.incite.o360v.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.incite.o360v.IntegrationTest;
import com.incite.o360v.domain.Project;
import com.incite.o360v.domain.Stakeholder;
import com.incite.o360v.domain.User;
import com.incite.o360v.domain.enumeration.StakeholderType;
import com.incite.o360v.repository.StakeholderRepository;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
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
 * Integration tests for the {@link StakeholderResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class StakeholderResourceIT {

    private static final LocalDate DEFAULT_CREATED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final BigDecimal DEFAULT_COST = new BigDecimal(1);
    private static final BigDecimal UPDATED_COST = new BigDecimal(2);

    private static final StakeholderType DEFAULT_STAKEHOLDER_TYPE = StakeholderType.STAFF;
    private static final StakeholderType UPDATED_STAKEHOLDER_TYPE = StakeholderType.THIRD_PARTY;

    private static final String ENTITY_API_URL = "/api/stakeholders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StakeholderRepository stakeholderRepository;

    @Mock
    private StakeholderRepository stakeholderRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStakeholderMockMvc;

    private Stakeholder stakeholder;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Stakeholder createEntity(EntityManager em) {
        Stakeholder stakeholder = new Stakeholder()
            .createdDate(DEFAULT_CREATED_DATE)
            .cost(DEFAULT_COST)
            .stakeholderType(DEFAULT_STAKEHOLDER_TYPE);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        stakeholder.getUsers().add(user);
        // Add required entity
        Project project;
        if (TestUtil.findAll(em, Project.class).isEmpty()) {
            project = ProjectResourceIT.createEntity(em);
            em.persist(project);
            em.flush();
        } else {
            project = TestUtil.findAll(em, Project.class).get(0);
        }
        stakeholder.setProject(project);
        return stakeholder;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Stakeholder createUpdatedEntity(EntityManager em) {
        Stakeholder stakeholder = new Stakeholder()
            .createdDate(UPDATED_CREATED_DATE)
            .cost(UPDATED_COST)
            .stakeholderType(UPDATED_STAKEHOLDER_TYPE);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        stakeholder.getUsers().add(user);
        // Add required entity
        Project project;
        if (TestUtil.findAll(em, Project.class).isEmpty()) {
            project = ProjectResourceIT.createUpdatedEntity(em);
            em.persist(project);
            em.flush();
        } else {
            project = TestUtil.findAll(em, Project.class).get(0);
        }
        stakeholder.setProject(project);
        return stakeholder;
    }

    @BeforeEach
    public void initTest() {
        stakeholder = createEntity(em);
    }

    @Test
    @Transactional
    void createStakeholder() throws Exception {
        int databaseSizeBeforeCreate = stakeholderRepository.findAll().size();
        // Create the Stakeholder
        restStakeholderMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stakeholder))
            )
            .andExpect(status().isCreated());

        // Validate the Stakeholder in the database
        List<Stakeholder> stakeholderList = stakeholderRepository.findAll();
        assertThat(stakeholderList).hasSize(databaseSizeBeforeCreate + 1);
        Stakeholder testStakeholder = stakeholderList.get(stakeholderList.size() - 1);
        assertThat(testStakeholder.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testStakeholder.getCost()).isEqualByComparingTo(DEFAULT_COST);
        assertThat(testStakeholder.getStakeholderType()).isEqualTo(DEFAULT_STAKEHOLDER_TYPE);
    }

    @Test
    @Transactional
    void createStakeholderWithExistingId() throws Exception {
        // Create the Stakeholder with an existing ID
        stakeholder.setId(1L);

        int databaseSizeBeforeCreate = stakeholderRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStakeholderMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stakeholder))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stakeholder in the database
        List<Stakeholder> stakeholderList = stakeholderRepository.findAll();
        assertThat(stakeholderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCreatedDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = stakeholderRepository.findAll().size();
        // set the field null
        stakeholder.setCreatedDate(null);

        // Create the Stakeholder, which fails.

        restStakeholderMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stakeholder))
            )
            .andExpect(status().isBadRequest());

        List<Stakeholder> stakeholderList = stakeholderRepository.findAll();
        assertThat(stakeholderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllStakeholders() throws Exception {
        // Initialize the database
        stakeholderRepository.saveAndFlush(stakeholder);

        // Get all the stakeholderList
        restStakeholderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(stakeholder.getId().intValue())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].cost").value(hasItem(sameNumber(DEFAULT_COST))))
            .andExpect(jsonPath("$.[*].stakeholderType").value(hasItem(DEFAULT_STAKEHOLDER_TYPE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllStakeholdersWithEagerRelationshipsIsEnabled() throws Exception {
        when(stakeholderRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restStakeholderMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(stakeholderRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllStakeholdersWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(stakeholderRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restStakeholderMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(stakeholderRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getStakeholder() throws Exception {
        // Initialize the database
        stakeholderRepository.saveAndFlush(stakeholder);

        // Get the stakeholder
        restStakeholderMockMvc
            .perform(get(ENTITY_API_URL_ID, stakeholder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(stakeholder.getId().intValue()))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.cost").value(sameNumber(DEFAULT_COST)))
            .andExpect(jsonPath("$.stakeholderType").value(DEFAULT_STAKEHOLDER_TYPE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingStakeholder() throws Exception {
        // Get the stakeholder
        restStakeholderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingStakeholder() throws Exception {
        // Initialize the database
        stakeholderRepository.saveAndFlush(stakeholder);

        int databaseSizeBeforeUpdate = stakeholderRepository.findAll().size();

        // Update the stakeholder
        Stakeholder updatedStakeholder = stakeholderRepository.findById(stakeholder.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedStakeholder are not directly saved in db
        em.detach(updatedStakeholder);
        updatedStakeholder.createdDate(UPDATED_CREATED_DATE).cost(UPDATED_COST).stakeholderType(UPDATED_STAKEHOLDER_TYPE);

        restStakeholderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStakeholder.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStakeholder))
            )
            .andExpect(status().isOk());

        // Validate the Stakeholder in the database
        List<Stakeholder> stakeholderList = stakeholderRepository.findAll();
        assertThat(stakeholderList).hasSize(databaseSizeBeforeUpdate);
        Stakeholder testStakeholder = stakeholderList.get(stakeholderList.size() - 1);
        assertThat(testStakeholder.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testStakeholder.getCost()).isEqualByComparingTo(UPDATED_COST);
        assertThat(testStakeholder.getStakeholderType()).isEqualTo(UPDATED_STAKEHOLDER_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingStakeholder() throws Exception {
        int databaseSizeBeforeUpdate = stakeholderRepository.findAll().size();
        stakeholder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStakeholderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, stakeholder.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stakeholder))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stakeholder in the database
        List<Stakeholder> stakeholderList = stakeholderRepository.findAll();
        assertThat(stakeholderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStakeholder() throws Exception {
        int databaseSizeBeforeUpdate = stakeholderRepository.findAll().size();
        stakeholder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStakeholderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stakeholder))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stakeholder in the database
        List<Stakeholder> stakeholderList = stakeholderRepository.findAll();
        assertThat(stakeholderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStakeholder() throws Exception {
        int databaseSizeBeforeUpdate = stakeholderRepository.findAll().size();
        stakeholder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStakeholderMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stakeholder))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Stakeholder in the database
        List<Stakeholder> stakeholderList = stakeholderRepository.findAll();
        assertThat(stakeholderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStakeholderWithPatch() throws Exception {
        // Initialize the database
        stakeholderRepository.saveAndFlush(stakeholder);

        int databaseSizeBeforeUpdate = stakeholderRepository.findAll().size();

        // Update the stakeholder using partial update
        Stakeholder partialUpdatedStakeholder = new Stakeholder();
        partialUpdatedStakeholder.setId(stakeholder.getId());

        restStakeholderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStakeholder.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStakeholder))
            )
            .andExpect(status().isOk());

        // Validate the Stakeholder in the database
        List<Stakeholder> stakeholderList = stakeholderRepository.findAll();
        assertThat(stakeholderList).hasSize(databaseSizeBeforeUpdate);
        Stakeholder testStakeholder = stakeholderList.get(stakeholderList.size() - 1);
        assertThat(testStakeholder.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testStakeholder.getCost()).isEqualByComparingTo(DEFAULT_COST);
        assertThat(testStakeholder.getStakeholderType()).isEqualTo(DEFAULT_STAKEHOLDER_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateStakeholderWithPatch() throws Exception {
        // Initialize the database
        stakeholderRepository.saveAndFlush(stakeholder);

        int databaseSizeBeforeUpdate = stakeholderRepository.findAll().size();

        // Update the stakeholder using partial update
        Stakeholder partialUpdatedStakeholder = new Stakeholder();
        partialUpdatedStakeholder.setId(stakeholder.getId());

        partialUpdatedStakeholder.createdDate(UPDATED_CREATED_DATE).cost(UPDATED_COST).stakeholderType(UPDATED_STAKEHOLDER_TYPE);

        restStakeholderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStakeholder.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStakeholder))
            )
            .andExpect(status().isOk());

        // Validate the Stakeholder in the database
        List<Stakeholder> stakeholderList = stakeholderRepository.findAll();
        assertThat(stakeholderList).hasSize(databaseSizeBeforeUpdate);
        Stakeholder testStakeholder = stakeholderList.get(stakeholderList.size() - 1);
        assertThat(testStakeholder.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testStakeholder.getCost()).isEqualByComparingTo(UPDATED_COST);
        assertThat(testStakeholder.getStakeholderType()).isEqualTo(UPDATED_STAKEHOLDER_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingStakeholder() throws Exception {
        int databaseSizeBeforeUpdate = stakeholderRepository.findAll().size();
        stakeholder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStakeholderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, stakeholder.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stakeholder))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stakeholder in the database
        List<Stakeholder> stakeholderList = stakeholderRepository.findAll();
        assertThat(stakeholderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStakeholder() throws Exception {
        int databaseSizeBeforeUpdate = stakeholderRepository.findAll().size();
        stakeholder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStakeholderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stakeholder))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stakeholder in the database
        List<Stakeholder> stakeholderList = stakeholderRepository.findAll();
        assertThat(stakeholderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStakeholder() throws Exception {
        int databaseSizeBeforeUpdate = stakeholderRepository.findAll().size();
        stakeholder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStakeholderMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stakeholder))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Stakeholder in the database
        List<Stakeholder> stakeholderList = stakeholderRepository.findAll();
        assertThat(stakeholderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStakeholder() throws Exception {
        // Initialize the database
        stakeholderRepository.saveAndFlush(stakeholder);

        int databaseSizeBeforeDelete = stakeholderRepository.findAll().size();

        // Delete the stakeholder
        restStakeholderMockMvc
            .perform(delete(ENTITY_API_URL_ID, stakeholder.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Stakeholder> stakeholderList = stakeholderRepository.findAll();
        assertThat(stakeholderList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
