package com.incite.o360v.web.rest;

import com.incite.o360v.domain.JiraSetUp;
import com.incite.o360v.repository.JiraSetUpRepository;
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
 * REST controller for managing {@link com.incite.o360v.domain.JiraSetUp}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class JiraSetUpResource {

    private final Logger log = LoggerFactory.getLogger(JiraSetUpResource.class);

    private static final String ENTITY_NAME = "jiraSetUp";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final JiraSetUpRepository jiraSetUpRepository;

    public JiraSetUpResource(JiraSetUpRepository jiraSetUpRepository) {
        this.jiraSetUpRepository = jiraSetUpRepository;
    }

    /**
     * {@code POST  /jira-set-ups} : Create a new jiraSetUp.
     *
     * @param jiraSetUp the jiraSetUp to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new jiraSetUp, or with status {@code 400 (Bad Request)} if the jiraSetUp has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/jira-set-ups")
    public ResponseEntity<JiraSetUp> createJiraSetUp(@Valid @RequestBody JiraSetUp jiraSetUp) throws URISyntaxException {
        log.debug("REST request to save JiraSetUp : {}", jiraSetUp);
        if (jiraSetUp.getId() != null) {
            throw new BadRequestAlertException("A new jiraSetUp cannot already have an ID", ENTITY_NAME, "idexists");
        }
        JiraSetUp result = jiraSetUpRepository.save(jiraSetUp);
        return ResponseEntity
            .created(new URI("/api/jira-set-ups/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /jira-set-ups/:id} : Updates an existing jiraSetUp.
     *
     * @param id the id of the jiraSetUp to save.
     * @param jiraSetUp the jiraSetUp to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jiraSetUp,
     * or with status {@code 400 (Bad Request)} if the jiraSetUp is not valid,
     * or with status {@code 500 (Internal Server Error)} if the jiraSetUp couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/jira-set-ups/{id}")
    public ResponseEntity<JiraSetUp> updateJiraSetUp(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody JiraSetUp jiraSetUp
    ) throws URISyntaxException {
        log.debug("REST request to update JiraSetUp : {}, {}", id, jiraSetUp);
        if (jiraSetUp.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, jiraSetUp.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jiraSetUpRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        JiraSetUp result = jiraSetUpRepository.save(jiraSetUp);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, jiraSetUp.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /jira-set-ups/:id} : Partial updates given fields of an existing jiraSetUp, field will ignore if it is null
     *
     * @param id the id of the jiraSetUp to save.
     * @param jiraSetUp the jiraSetUp to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jiraSetUp,
     * or with status {@code 400 (Bad Request)} if the jiraSetUp is not valid,
     * or with status {@code 404 (Not Found)} if the jiraSetUp is not found,
     * or with status {@code 500 (Internal Server Error)} if the jiraSetUp couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/jira-set-ups/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<JiraSetUp> partialUpdateJiraSetUp(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody JiraSetUp jiraSetUp
    ) throws URISyntaxException {
        log.debug("REST request to partial update JiraSetUp partially : {}, {}", id, jiraSetUp);
        if (jiraSetUp.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, jiraSetUp.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jiraSetUpRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<JiraSetUp> result = jiraSetUpRepository
            .findById(jiraSetUp.getId())
            .map(existingJiraSetUp -> {
                if (jiraSetUp.getUrl() != null) {
                    existingJiraSetUp.setUrl(jiraSetUp.getUrl());
                }
                if (jiraSetUp.getApiKey() != null) {
                    existingJiraSetUp.setApiKey(jiraSetUp.getApiKey());
                }
                if (jiraSetUp.getProject() != null) {
                    existingJiraSetUp.setProject(jiraSetUp.getProject());
                }

                return existingJiraSetUp;
            })
            .map(jiraSetUpRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, jiraSetUp.getId().toString())
        );
    }

    /**
     * {@code GET  /jira-set-ups} : get all the jiraSetUps.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of jiraSetUps in body.
     */
    @GetMapping("/jira-set-ups")
    public List<JiraSetUp> getAllJiraSetUps() {
        log.debug("REST request to get all JiraSetUps");
        return jiraSetUpRepository.findAll();
    }

    /**
     * {@code GET  /jira-set-ups/:id} : get the "id" jiraSetUp.
     *
     * @param id the id of the jiraSetUp to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the jiraSetUp, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/jira-set-ups/{id}")
    public ResponseEntity<JiraSetUp> getJiraSetUp(@PathVariable Long id) {
        log.debug("REST request to get JiraSetUp : {}", id);
        Optional<JiraSetUp> jiraSetUp = jiraSetUpRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(jiraSetUp);
    }

    /**
     * {@code DELETE  /jira-set-ups/:id} : delete the "id" jiraSetUp.
     *
     * @param id the id of the jiraSetUp to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/jira-set-ups/{id}")
    public ResponseEntity<Void> deleteJiraSetUp(@PathVariable Long id) {
        log.debug("REST request to delete JiraSetUp : {}", id);
        jiraSetUpRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
