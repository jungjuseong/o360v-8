package com.incite.o360v.web.rest;

import com.incite.o360v.domain.Jira;
import com.incite.o360v.repository.JiraRepository;
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
 * REST controller for managing {@link com.incite.o360v.domain.Jira}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class JiraResource {

    private final Logger log = LoggerFactory.getLogger(JiraResource.class);

    private static final String ENTITY_NAME = "jira";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final JiraRepository jiraRepository;

    public JiraResource(JiraRepository jiraRepository) {
        this.jiraRepository = jiraRepository;
    }

    /**
     * {@code POST  /jiras} : Create a new jira.
     *
     * @param jira the jira to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new jira, or with status {@code 400 (Bad Request)} if the jira has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/jiras")
    public ResponseEntity<Jira> createJira(@Valid @RequestBody Jira jira) throws URISyntaxException {
        log.debug("REST request to save Jira : {}", jira);
        if (jira.getId() != null) {
            throw new BadRequestAlertException("A new jira cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Jira result = jiraRepository.save(jira);
        return ResponseEntity
            .created(new URI("/api/jiras/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /jiras/:id} : Updates an existing jira.
     *
     * @param id the id of the jira to save.
     * @param jira the jira to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jira,
     * or with status {@code 400 (Bad Request)} if the jira is not valid,
     * or with status {@code 500 (Internal Server Error)} if the jira couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/jiras/{id}")
    public ResponseEntity<Jira> updateJira(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Jira jira)
        throws URISyntaxException {
        log.debug("REST request to update Jira : {}, {}", id, jira);
        if (jira.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, jira.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jiraRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Jira result = jiraRepository.save(jira);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, jira.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /jiras/:id} : Partial updates given fields of an existing jira, field will ignore if it is null
     *
     * @param id the id of the jira to save.
     * @param jira the jira to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jira,
     * or with status {@code 400 (Bad Request)} if the jira is not valid,
     * or with status {@code 404 (Not Found)} if the jira is not found,
     * or with status {@code 500 (Internal Server Error)} if the jira couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/jiras/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Jira> partialUpdateJira(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Jira jira
    ) throws URISyntaxException {
        log.debug("REST request to partial update Jira partially : {}, {}", id, jira);
        if (jira.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, jira.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jiraRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Jira> result = jiraRepository
            .findById(jira.getId())
            .map(existingJira -> {
                if (jira.getUrl() != null) {
                    existingJira.setUrl(jira.getUrl());
                }
                if (jira.getApiKey() != null) {
                    existingJira.setApiKey(jira.getApiKey());
                }
                if (jira.getProject() != null) {
                    existingJira.setProject(jira.getProject());
                }

                return existingJira;
            })
            .map(jiraRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, jira.getId().toString())
        );
    }

    /**
     * {@code GET  /jiras} : get all the jiras.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of jiras in body.
     */
    @GetMapping("/jiras")
    public List<Jira> getAllJiras() {
        log.debug("REST request to get all Jiras");
        return jiraRepository.findAll();
    }

    /**
     * {@code GET  /jiras/:id} : get the "id" jira.
     *
     * @param id the id of the jira to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the jira, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/jiras/{id}")
    public ResponseEntity<Jira> getJira(@PathVariable Long id) {
        log.debug("REST request to get Jira : {}", id);
        Optional<Jira> jira = jiraRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(jira);
    }

    /**
     * {@code DELETE  /jiras/:id} : delete the "id" jira.
     *
     * @param id the id of the jira to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/jiras/{id}")
    public ResponseEntity<Void> deleteJira(@PathVariable Long id) {
        log.debug("REST request to delete Jira : {}", id);
        jiraRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
