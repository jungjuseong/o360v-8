package com.incite.o360v.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.incite.o360v.IntegrationTest;
import com.incite.o360v.domain.AccountNumber;
import com.incite.o360v.repository.AccountNumberRepository;
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
 * Integration tests for the {@link AccountNumberResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AccountNumberResourceIT {

    private static final String DEFAULT_ACCOUNT_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_ACCOUNT_NUMBER = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/account-numbers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AccountNumberRepository accountNumberRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAccountNumberMockMvc;

    private AccountNumber accountNumber;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AccountNumber createEntity(EntityManager em) {
        AccountNumber accountNumber = new AccountNumber().accountNumber(DEFAULT_ACCOUNT_NUMBER);
        return accountNumber;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AccountNumber createUpdatedEntity(EntityManager em) {
        AccountNumber accountNumber = new AccountNumber().accountNumber(UPDATED_ACCOUNT_NUMBER);
        return accountNumber;
    }

    @BeforeEach
    public void initTest() {
        accountNumber = createEntity(em);
    }

    @Test
    @Transactional
    void createAccountNumber() throws Exception {
        int databaseSizeBeforeCreate = accountNumberRepository.findAll().size();
        // Create the AccountNumber
        restAccountNumberMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accountNumber))
            )
            .andExpect(status().isCreated());

        // Validate the AccountNumber in the database
        List<AccountNumber> accountNumberList = accountNumberRepository.findAll();
        assertThat(accountNumberList).hasSize(databaseSizeBeforeCreate + 1);
        AccountNumber testAccountNumber = accountNumberList.get(accountNumberList.size() - 1);
        assertThat(testAccountNumber.getAccountNumber()).isEqualTo(DEFAULT_ACCOUNT_NUMBER);
    }

    @Test
    @Transactional
    void createAccountNumberWithExistingId() throws Exception {
        // Create the AccountNumber with an existing ID
        accountNumber.setId(1L);

        int databaseSizeBeforeCreate = accountNumberRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAccountNumberMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accountNumber))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountNumber in the database
        List<AccountNumber> accountNumberList = accountNumberRepository.findAll();
        assertThat(accountNumberList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkAccountNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = accountNumberRepository.findAll().size();
        // set the field null
        accountNumber.setAccountNumber(null);

        // Create the AccountNumber, which fails.

        restAccountNumberMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accountNumber))
            )
            .andExpect(status().isBadRequest());

        List<AccountNumber> accountNumberList = accountNumberRepository.findAll();
        assertThat(accountNumberList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAccountNumbers() throws Exception {
        // Initialize the database
        accountNumberRepository.saveAndFlush(accountNumber);

        // Get all the accountNumberList
        restAccountNumberMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(accountNumber.getId().intValue())))
            .andExpect(jsonPath("$.[*].accountNumber").value(hasItem(DEFAULT_ACCOUNT_NUMBER)));
    }

    @Test
    @Transactional
    void getAccountNumber() throws Exception {
        // Initialize the database
        accountNumberRepository.saveAndFlush(accountNumber);

        // Get the accountNumber
        restAccountNumberMockMvc
            .perform(get(ENTITY_API_URL_ID, accountNumber.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(accountNumber.getId().intValue()))
            .andExpect(jsonPath("$.accountNumber").value(DEFAULT_ACCOUNT_NUMBER));
    }

    @Test
    @Transactional
    void getNonExistingAccountNumber() throws Exception {
        // Get the accountNumber
        restAccountNumberMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAccountNumber() throws Exception {
        // Initialize the database
        accountNumberRepository.saveAndFlush(accountNumber);

        int databaseSizeBeforeUpdate = accountNumberRepository.findAll().size();

        // Update the accountNumber
        AccountNumber updatedAccountNumber = accountNumberRepository.findById(accountNumber.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAccountNumber are not directly saved in db
        em.detach(updatedAccountNumber);
        updatedAccountNumber.accountNumber(UPDATED_ACCOUNT_NUMBER);

        restAccountNumberMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAccountNumber.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAccountNumber))
            )
            .andExpect(status().isOk());

        // Validate the AccountNumber in the database
        List<AccountNumber> accountNumberList = accountNumberRepository.findAll();
        assertThat(accountNumberList).hasSize(databaseSizeBeforeUpdate);
        AccountNumber testAccountNumber = accountNumberList.get(accountNumberList.size() - 1);
        assertThat(testAccountNumber.getAccountNumber()).isEqualTo(UPDATED_ACCOUNT_NUMBER);
    }

    @Test
    @Transactional
    void putNonExistingAccountNumber() throws Exception {
        int databaseSizeBeforeUpdate = accountNumberRepository.findAll().size();
        accountNumber.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccountNumberMockMvc
            .perform(
                put(ENTITY_API_URL_ID, accountNumber.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accountNumber))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountNumber in the database
        List<AccountNumber> accountNumberList = accountNumberRepository.findAll();
        assertThat(accountNumberList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAccountNumber() throws Exception {
        int databaseSizeBeforeUpdate = accountNumberRepository.findAll().size();
        accountNumber.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountNumberMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accountNumber))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountNumber in the database
        List<AccountNumber> accountNumberList = accountNumberRepository.findAll();
        assertThat(accountNumberList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAccountNumber() throws Exception {
        int databaseSizeBeforeUpdate = accountNumberRepository.findAll().size();
        accountNumber.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountNumberMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accountNumber))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AccountNumber in the database
        List<AccountNumber> accountNumberList = accountNumberRepository.findAll();
        assertThat(accountNumberList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAccountNumberWithPatch() throws Exception {
        // Initialize the database
        accountNumberRepository.saveAndFlush(accountNumber);

        int databaseSizeBeforeUpdate = accountNumberRepository.findAll().size();

        // Update the accountNumber using partial update
        AccountNumber partialUpdatedAccountNumber = new AccountNumber();
        partialUpdatedAccountNumber.setId(accountNumber.getId());

        restAccountNumberMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccountNumber.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAccountNumber))
            )
            .andExpect(status().isOk());

        // Validate the AccountNumber in the database
        List<AccountNumber> accountNumberList = accountNumberRepository.findAll();
        assertThat(accountNumberList).hasSize(databaseSizeBeforeUpdate);
        AccountNumber testAccountNumber = accountNumberList.get(accountNumberList.size() - 1);
        assertThat(testAccountNumber.getAccountNumber()).isEqualTo(DEFAULT_ACCOUNT_NUMBER);
    }

    @Test
    @Transactional
    void fullUpdateAccountNumberWithPatch() throws Exception {
        // Initialize the database
        accountNumberRepository.saveAndFlush(accountNumber);

        int databaseSizeBeforeUpdate = accountNumberRepository.findAll().size();

        // Update the accountNumber using partial update
        AccountNumber partialUpdatedAccountNumber = new AccountNumber();
        partialUpdatedAccountNumber.setId(accountNumber.getId());

        partialUpdatedAccountNumber.accountNumber(UPDATED_ACCOUNT_NUMBER);

        restAccountNumberMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccountNumber.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAccountNumber))
            )
            .andExpect(status().isOk());

        // Validate the AccountNumber in the database
        List<AccountNumber> accountNumberList = accountNumberRepository.findAll();
        assertThat(accountNumberList).hasSize(databaseSizeBeforeUpdate);
        AccountNumber testAccountNumber = accountNumberList.get(accountNumberList.size() - 1);
        assertThat(testAccountNumber.getAccountNumber()).isEqualTo(UPDATED_ACCOUNT_NUMBER);
    }

    @Test
    @Transactional
    void patchNonExistingAccountNumber() throws Exception {
        int databaseSizeBeforeUpdate = accountNumberRepository.findAll().size();
        accountNumber.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccountNumberMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, accountNumber.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accountNumber))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountNumber in the database
        List<AccountNumber> accountNumberList = accountNumberRepository.findAll();
        assertThat(accountNumberList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAccountNumber() throws Exception {
        int databaseSizeBeforeUpdate = accountNumberRepository.findAll().size();
        accountNumber.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountNumberMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accountNumber))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountNumber in the database
        List<AccountNumber> accountNumberList = accountNumberRepository.findAll();
        assertThat(accountNumberList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAccountNumber() throws Exception {
        int databaseSizeBeforeUpdate = accountNumberRepository.findAll().size();
        accountNumber.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountNumberMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accountNumber))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AccountNumber in the database
        List<AccountNumber> accountNumberList = accountNumberRepository.findAll();
        assertThat(accountNumberList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAccountNumber() throws Exception {
        // Initialize the database
        accountNumberRepository.saveAndFlush(accountNumber);

        int databaseSizeBeforeDelete = accountNumberRepository.findAll().size();

        // Delete the accountNumber
        restAccountNumberMockMvc
            .perform(delete(ENTITY_API_URL_ID, accountNumber.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AccountNumber> accountNumberList = accountNumberRepository.findAll();
        assertThat(accountNumberList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
