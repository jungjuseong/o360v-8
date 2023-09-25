package com.incite.o360v.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.incite.o360v.IntegrationTest;
import com.incite.o360v.domain.Area;
import com.incite.o360v.domain.Audience;
import com.incite.o360v.domain.Brand;
import com.incite.o360v.domain.Channel;
import com.incite.o360v.domain.Country;
import com.incite.o360v.domain.UserGroup;
import com.incite.o360v.domain.UserGroupAccess;
import com.incite.o360v.repository.UserGroupAccessRepository;
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
 * Integration tests for the {@link UserGroupAccessResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class UserGroupAccessResourceIT {

    private static final String ENTITY_API_URL = "/api/user-group-accesses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserGroupAccessRepository userGroupAccessRepository;

    @Mock
    private UserGroupAccessRepository userGroupAccessRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserGroupAccessMockMvc;

    private UserGroupAccess userGroupAccess;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserGroupAccess createEntity(EntityManager em) {
        UserGroupAccess userGroupAccess = new UserGroupAccess();
        // Add required entity
        Area area;
        if (TestUtil.findAll(em, Area.class).isEmpty()) {
            area = AreaResourceIT.createEntity(em);
            em.persist(area);
            em.flush();
        } else {
            area = TestUtil.findAll(em, Area.class).get(0);
        }
        userGroupAccess.setArea(area);
        // Add required entity
        Brand brand;
        if (TestUtil.findAll(em, Brand.class).isEmpty()) {
            brand = BrandResourceIT.createEntity(em);
            em.persist(brand);
            em.flush();
        } else {
            brand = TestUtil.findAll(em, Brand.class).get(0);
        }
        userGroupAccess.setBrand(brand);
        // Add required entity
        Audience audience;
        if (TestUtil.findAll(em, Audience.class).isEmpty()) {
            audience = AudienceResourceIT.createEntity(em);
            em.persist(audience);
            em.flush();
        } else {
            audience = TestUtil.findAll(em, Audience.class).get(0);
        }
        userGroupAccess.setAudience(audience);
        // Add required entity
        Channel channel;
        if (TestUtil.findAll(em, Channel.class).isEmpty()) {
            channel = ChannelResourceIT.createEntity(em);
            em.persist(channel);
            em.flush();
        } else {
            channel = TestUtil.findAll(em, Channel.class).get(0);
        }
        userGroupAccess.setChannel(channel);
        // Add required entity
        Country country;
        if (TestUtil.findAll(em, Country.class).isEmpty()) {
            country = CountryResourceIT.createEntity(em);
            em.persist(country);
            em.flush();
        } else {
            country = TestUtil.findAll(em, Country.class).get(0);
        }
        userGroupAccess.setCountry(country);
        // Add required entity
        UserGroup userGroup;
        if (TestUtil.findAll(em, UserGroup.class).isEmpty()) {
            userGroup = UserGroupResourceIT.createEntity(em);
            em.persist(userGroup);
            em.flush();
        } else {
            userGroup = TestUtil.findAll(em, UserGroup.class).get(0);
        }
        userGroupAccess.setUserGroup(userGroup);
        return userGroupAccess;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserGroupAccess createUpdatedEntity(EntityManager em) {
        UserGroupAccess userGroupAccess = new UserGroupAccess();
        // Add required entity
        Area area;
        if (TestUtil.findAll(em, Area.class).isEmpty()) {
            area = AreaResourceIT.createUpdatedEntity(em);
            em.persist(area);
            em.flush();
        } else {
            area = TestUtil.findAll(em, Area.class).get(0);
        }
        userGroupAccess.setArea(area);
        // Add required entity
        Brand brand;
        if (TestUtil.findAll(em, Brand.class).isEmpty()) {
            brand = BrandResourceIT.createUpdatedEntity(em);
            em.persist(brand);
            em.flush();
        } else {
            brand = TestUtil.findAll(em, Brand.class).get(0);
        }
        userGroupAccess.setBrand(brand);
        // Add required entity
        Audience audience;
        if (TestUtil.findAll(em, Audience.class).isEmpty()) {
            audience = AudienceResourceIT.createUpdatedEntity(em);
            em.persist(audience);
            em.flush();
        } else {
            audience = TestUtil.findAll(em, Audience.class).get(0);
        }
        userGroupAccess.setAudience(audience);
        // Add required entity
        Channel channel;
        if (TestUtil.findAll(em, Channel.class).isEmpty()) {
            channel = ChannelResourceIT.createUpdatedEntity(em);
            em.persist(channel);
            em.flush();
        } else {
            channel = TestUtil.findAll(em, Channel.class).get(0);
        }
        userGroupAccess.setChannel(channel);
        // Add required entity
        Country country;
        if (TestUtil.findAll(em, Country.class).isEmpty()) {
            country = CountryResourceIT.createUpdatedEntity(em);
            em.persist(country);
            em.flush();
        } else {
            country = TestUtil.findAll(em, Country.class).get(0);
        }
        userGroupAccess.setCountry(country);
        // Add required entity
        UserGroup userGroup;
        if (TestUtil.findAll(em, UserGroup.class).isEmpty()) {
            userGroup = UserGroupResourceIT.createUpdatedEntity(em);
            em.persist(userGroup);
            em.flush();
        } else {
            userGroup = TestUtil.findAll(em, UserGroup.class).get(0);
        }
        userGroupAccess.setUserGroup(userGroup);
        return userGroupAccess;
    }

    @BeforeEach
    public void initTest() {
        userGroupAccess = createEntity(em);
    }

    @Test
    @Transactional
    void createUserGroupAccess() throws Exception {
        int databaseSizeBeforeCreate = userGroupAccessRepository.findAll().size();
        // Create the UserGroupAccess
        restUserGroupAccessMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userGroupAccess))
            )
            .andExpect(status().isCreated());

        // Validate the UserGroupAccess in the database
        List<UserGroupAccess> userGroupAccessList = userGroupAccessRepository.findAll();
        assertThat(userGroupAccessList).hasSize(databaseSizeBeforeCreate + 1);
        UserGroupAccess testUserGroupAccess = userGroupAccessList.get(userGroupAccessList.size() - 1);
    }

    @Test
    @Transactional
    void createUserGroupAccessWithExistingId() throws Exception {
        // Create the UserGroupAccess with an existing ID
        userGroupAccess.setId(1L);

        int databaseSizeBeforeCreate = userGroupAccessRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserGroupAccessMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userGroupAccess))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserGroupAccess in the database
        List<UserGroupAccess> userGroupAccessList = userGroupAccessRepository.findAll();
        assertThat(userGroupAccessList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUserGroupAccesses() throws Exception {
        // Initialize the database
        userGroupAccessRepository.saveAndFlush(userGroupAccess);

        // Get all the userGroupAccessList
        restUserGroupAccessMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userGroupAccess.getId().intValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllUserGroupAccessesWithEagerRelationshipsIsEnabled() throws Exception {
        when(userGroupAccessRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restUserGroupAccessMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(userGroupAccessRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllUserGroupAccessesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(userGroupAccessRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restUserGroupAccessMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(userGroupAccessRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getUserGroupAccess() throws Exception {
        // Initialize the database
        userGroupAccessRepository.saveAndFlush(userGroupAccess);

        // Get the userGroupAccess
        restUserGroupAccessMockMvc
            .perform(get(ENTITY_API_URL_ID, userGroupAccess.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userGroupAccess.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingUserGroupAccess() throws Exception {
        // Get the userGroupAccess
        restUserGroupAccessMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserGroupAccess() throws Exception {
        // Initialize the database
        userGroupAccessRepository.saveAndFlush(userGroupAccess);

        int databaseSizeBeforeUpdate = userGroupAccessRepository.findAll().size();

        // Update the userGroupAccess
        UserGroupAccess updatedUserGroupAccess = userGroupAccessRepository.findById(userGroupAccess.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedUserGroupAccess are not directly saved in db
        em.detach(updatedUserGroupAccess);

        restUserGroupAccessMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserGroupAccess.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserGroupAccess))
            )
            .andExpect(status().isOk());

        // Validate the UserGroupAccess in the database
        List<UserGroupAccess> userGroupAccessList = userGroupAccessRepository.findAll();
        assertThat(userGroupAccessList).hasSize(databaseSizeBeforeUpdate);
        UserGroupAccess testUserGroupAccess = userGroupAccessList.get(userGroupAccessList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingUserGroupAccess() throws Exception {
        int databaseSizeBeforeUpdate = userGroupAccessRepository.findAll().size();
        userGroupAccess.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserGroupAccessMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userGroupAccess.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userGroupAccess))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserGroupAccess in the database
        List<UserGroupAccess> userGroupAccessList = userGroupAccessRepository.findAll();
        assertThat(userGroupAccessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserGroupAccess() throws Exception {
        int databaseSizeBeforeUpdate = userGroupAccessRepository.findAll().size();
        userGroupAccess.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserGroupAccessMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userGroupAccess))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserGroupAccess in the database
        List<UserGroupAccess> userGroupAccessList = userGroupAccessRepository.findAll();
        assertThat(userGroupAccessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserGroupAccess() throws Exception {
        int databaseSizeBeforeUpdate = userGroupAccessRepository.findAll().size();
        userGroupAccess.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserGroupAccessMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userGroupAccess))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserGroupAccess in the database
        List<UserGroupAccess> userGroupAccessList = userGroupAccessRepository.findAll();
        assertThat(userGroupAccessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserGroupAccessWithPatch() throws Exception {
        // Initialize the database
        userGroupAccessRepository.saveAndFlush(userGroupAccess);

        int databaseSizeBeforeUpdate = userGroupAccessRepository.findAll().size();

        // Update the userGroupAccess using partial update
        UserGroupAccess partialUpdatedUserGroupAccess = new UserGroupAccess();
        partialUpdatedUserGroupAccess.setId(userGroupAccess.getId());

        restUserGroupAccessMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserGroupAccess.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserGroupAccess))
            )
            .andExpect(status().isOk());

        // Validate the UserGroupAccess in the database
        List<UserGroupAccess> userGroupAccessList = userGroupAccessRepository.findAll();
        assertThat(userGroupAccessList).hasSize(databaseSizeBeforeUpdate);
        UserGroupAccess testUserGroupAccess = userGroupAccessList.get(userGroupAccessList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateUserGroupAccessWithPatch() throws Exception {
        // Initialize the database
        userGroupAccessRepository.saveAndFlush(userGroupAccess);

        int databaseSizeBeforeUpdate = userGroupAccessRepository.findAll().size();

        // Update the userGroupAccess using partial update
        UserGroupAccess partialUpdatedUserGroupAccess = new UserGroupAccess();
        partialUpdatedUserGroupAccess.setId(userGroupAccess.getId());

        restUserGroupAccessMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserGroupAccess.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserGroupAccess))
            )
            .andExpect(status().isOk());

        // Validate the UserGroupAccess in the database
        List<UserGroupAccess> userGroupAccessList = userGroupAccessRepository.findAll();
        assertThat(userGroupAccessList).hasSize(databaseSizeBeforeUpdate);
        UserGroupAccess testUserGroupAccess = userGroupAccessList.get(userGroupAccessList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingUserGroupAccess() throws Exception {
        int databaseSizeBeforeUpdate = userGroupAccessRepository.findAll().size();
        userGroupAccess.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserGroupAccessMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userGroupAccess.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userGroupAccess))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserGroupAccess in the database
        List<UserGroupAccess> userGroupAccessList = userGroupAccessRepository.findAll();
        assertThat(userGroupAccessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserGroupAccess() throws Exception {
        int databaseSizeBeforeUpdate = userGroupAccessRepository.findAll().size();
        userGroupAccess.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserGroupAccessMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userGroupAccess))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserGroupAccess in the database
        List<UserGroupAccess> userGroupAccessList = userGroupAccessRepository.findAll();
        assertThat(userGroupAccessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserGroupAccess() throws Exception {
        int databaseSizeBeforeUpdate = userGroupAccessRepository.findAll().size();
        userGroupAccess.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserGroupAccessMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userGroupAccess))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserGroupAccess in the database
        List<UserGroupAccess> userGroupAccessList = userGroupAccessRepository.findAll();
        assertThat(userGroupAccessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserGroupAccess() throws Exception {
        // Initialize the database
        userGroupAccessRepository.saveAndFlush(userGroupAccess);

        int databaseSizeBeforeDelete = userGroupAccessRepository.findAll().size();

        // Delete the userGroupAccess
        restUserGroupAccessMockMvc
            .perform(delete(ENTITY_API_URL_ID, userGroupAccess.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserGroupAccess> userGroupAccessList = userGroupAccessRepository.findAll();
        assertThat(userGroupAccessList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
