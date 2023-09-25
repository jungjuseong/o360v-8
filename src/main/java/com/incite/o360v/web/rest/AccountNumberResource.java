package com.incite.o360v.web.rest;

import com.incite.o360v.domain.AccountNumber;
import com.incite.o360v.repository.AccountNumberRepository;
import com.incite.o360v.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.incite.o360v.domain.AccountNumber}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AccountNumberResource {

    private final Logger log = LoggerFactory.getLogger(AccountNumberResource.class);

    private static final String ENTITY_NAME = "accountNumber";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AccountNumberRepository accountNumberRepository;

    public AccountNumberResource(AccountNumberRepository accountNumberRepository) {
        this.accountNumberRepository = accountNumberRepository;
    }

    /**
     * {@code POST  /account-numbers} : Create a new accountNumber.
     *
     * @param accountNumber the accountNumber to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new accountNumber, or with status {@code 400 (Bad Request)} if the accountNumber has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/account-numbers")
    public ResponseEntity<AccountNumber> createAccountNumber(@Valid @RequestBody AccountNumber accountNumber) throws URISyntaxException {
        log.debug("REST request to save AccountNumber : {}", accountNumber);
        if (accountNumber.getId() != null) {
            throw new BadRequestAlertException("A new accountNumber cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AccountNumber result = accountNumberRepository.save(accountNumber);
        return ResponseEntity
            .created(new URI("/api/account-numbers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /account-numbers/:id} : Updates an existing accountNumber.
     *
     * @param id the id of the accountNumber to save.
     * @param accountNumber the accountNumber to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accountNumber,
     * or with status {@code 400 (Bad Request)} if the accountNumber is not valid,
     * or with status {@code 500 (Internal Server Error)} if the accountNumber couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/account-numbers/{id}")
    public ResponseEntity<AccountNumber> updateAccountNumber(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AccountNumber accountNumber
    ) throws URISyntaxException {
        log.debug("REST request to update AccountNumber : {}, {}", id, accountNumber);
        if (accountNumber.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accountNumber.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accountNumberRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AccountNumber result = accountNumberRepository.save(accountNumber);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accountNumber.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /account-numbers/:id} : Partial updates given fields of an existing accountNumber, field will ignore if it is null
     *
     * @param id the id of the accountNumber to save.
     * @param accountNumber the accountNumber to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accountNumber,
     * or with status {@code 400 (Bad Request)} if the accountNumber is not valid,
     * or with status {@code 404 (Not Found)} if the accountNumber is not found,
     * or with status {@code 500 (Internal Server Error)} if the accountNumber couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/account-numbers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AccountNumber> partialUpdateAccountNumber(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AccountNumber accountNumber
    ) throws URISyntaxException {
        log.debug("REST request to partial update AccountNumber partially : {}, {}", id, accountNumber);
        if (accountNumber.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accountNumber.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accountNumberRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AccountNumber> result = accountNumberRepository
            .findById(accountNumber.getId())
            .map(existingAccountNumber -> {
                if (accountNumber.getAccountNumber() != null) {
                    existingAccountNumber.setAccountNumber(accountNumber.getAccountNumber());
                }

                return existingAccountNumber;
            })
            .map(accountNumberRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accountNumber.getId().toString())
        );
    }

    /**
     * {@code GET  /account-numbers} : get all the accountNumbers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of accountNumbers in body.
     */
    @GetMapping("/account-numbers")
    public List<AccountNumber> getAllAccountNumbers() {
        log.debug("REST request to get all AccountNumbers");
        return accountNumberRepository.findAll();
    }

    /**
     * {@code GET  /account-numbers/:id} : get the "id" accountNumber.
     *
     * @param id the id of the accountNumber to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the accountNumber, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/account-numbers/{id}")
    public ResponseEntity<AccountNumber> getAccountNumber(@PathVariable Long id) {
        log.debug("REST request to get AccountNumber : {}", id);
        Optional<AccountNumber> accountNumber = accountNumberRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(accountNumber);
    }

    /**
     * {@code DELETE  /account-numbers/:id} : delete the "id" accountNumber.
     *
     * @param id the id of the accountNumber to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/account-numbers/{id}")
    public ResponseEntity<Void> deleteAccountNumber(@PathVariable Long id) {
        log.debug("REST request to delete AccountNumber : {}", id);
        accountNumberRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
