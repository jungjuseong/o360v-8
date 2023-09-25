package com.incite.o360v.web.rest;

import com.incite.o360v.domain.ProjectDate;
import com.incite.o360v.repository.ProjectDateRepository;
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
 * REST controller for managing {@link com.incite.o360v.domain.ProjectDate}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProjectDateResource {

    private final Logger log = LoggerFactory.getLogger(ProjectDateResource.class);

    private static final String ENTITY_NAME = "projectDate";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProjectDateRepository projectDateRepository;

    public ProjectDateResource(ProjectDateRepository projectDateRepository) {
        this.projectDateRepository = projectDateRepository;
    }

    /**
     * {@code POST  /project-dates} : Create a new projectDate.
     *
     * @param projectDate the projectDate to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new projectDate, or with status {@code 400 (Bad Request)} if the projectDate has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/project-dates")
    public ResponseEntity<ProjectDate> createProjectDate(@Valid @RequestBody ProjectDate projectDate) throws URISyntaxException {
        log.debug("REST request to save ProjectDate : {}", projectDate);
        if (projectDate.getId() != null) {
            throw new BadRequestAlertException("A new projectDate cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProjectDate result = projectDateRepository.save(projectDate);
        return ResponseEntity
            .created(new URI("/api/project-dates/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /project-dates/:id} : Updates an existing projectDate.
     *
     * @param id the id of the projectDate to save.
     * @param projectDate the projectDate to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated projectDate,
     * or with status {@code 400 (Bad Request)} if the projectDate is not valid,
     * or with status {@code 500 (Internal Server Error)} if the projectDate couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/project-dates/{id}")
    public ResponseEntity<ProjectDate> updateProjectDate(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProjectDate projectDate
    ) throws URISyntaxException {
        log.debug("REST request to update ProjectDate : {}, {}", id, projectDate);
        if (projectDate.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, projectDate.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!projectDateRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProjectDate result = projectDateRepository.save(projectDate);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, projectDate.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /project-dates/:id} : Partial updates given fields of an existing projectDate, field will ignore if it is null
     *
     * @param id the id of the projectDate to save.
     * @param projectDate the projectDate to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated projectDate,
     * or with status {@code 400 (Bad Request)} if the projectDate is not valid,
     * or with status {@code 404 (Not Found)} if the projectDate is not found,
     * or with status {@code 500 (Internal Server Error)} if the projectDate couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/project-dates/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProjectDate> partialUpdateProjectDate(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProjectDate projectDate
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProjectDate partially : {}, {}", id, projectDate);
        if (projectDate.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, projectDate.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!projectDateRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProjectDate> result = projectDateRepository
            .findById(projectDate.getId())
            .map(existingProjectDate -> {
                if (projectDate.getDate() != null) {
                    existingProjectDate.setDate(projectDate.getDate());
                }
                if (projectDate.getProjectDateType() != null) {
                    existingProjectDate.setProjectDateType(projectDate.getProjectDateType());
                }

                return existingProjectDate;
            })
            .map(projectDateRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, projectDate.getId().toString())
        );
    }

    /**
     * {@code GET  /project-dates} : get all the projectDates.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of projectDates in body.
     */
    @GetMapping("/project-dates")
    public List<ProjectDate> getAllProjectDates(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ProjectDates");
        if (eagerload) {
            return projectDateRepository.findAllWithEagerRelationships();
        } else {
            return projectDateRepository.findAll();
        }
    }

    /**
     * {@code GET  /project-dates/:id} : get the "id" projectDate.
     *
     * @param id the id of the projectDate to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the projectDate, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/project-dates/{id}")
    public ResponseEntity<ProjectDate> getProjectDate(@PathVariable Long id) {
        log.debug("REST request to get ProjectDate : {}", id);
        Optional<ProjectDate> projectDate = projectDateRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(projectDate);
    }

    /**
     * {@code DELETE  /project-dates/:id} : delete the "id" projectDate.
     *
     * @param id the id of the projectDate to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/project-dates/{id}")
    public ResponseEntity<Void> deleteProjectDate(@PathVariable Long id) {
        log.debug("REST request to delete ProjectDate : {}", id);
        projectDateRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
