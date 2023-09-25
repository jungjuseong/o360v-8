package com.incite.o360v.web.rest;

import com.incite.o360v.domain.ProjectGoal;
import com.incite.o360v.repository.ProjectGoalRepository;
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
 * REST controller for managing {@link com.incite.o360v.domain.ProjectGoal}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProjectGoalResource {

    private final Logger log = LoggerFactory.getLogger(ProjectGoalResource.class);

    private static final String ENTITY_NAME = "projectGoal";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProjectGoalRepository projectGoalRepository;

    public ProjectGoalResource(ProjectGoalRepository projectGoalRepository) {
        this.projectGoalRepository = projectGoalRepository;
    }

    /**
     * {@code POST  /project-goals} : Create a new projectGoal.
     *
     * @param projectGoal the projectGoal to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new projectGoal, or with status {@code 400 (Bad Request)} if the projectGoal has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/project-goals")
    public ResponseEntity<ProjectGoal> createProjectGoal(@Valid @RequestBody ProjectGoal projectGoal) throws URISyntaxException {
        log.debug("REST request to save ProjectGoal : {}", projectGoal);
        if (projectGoal.getId() != null) {
            throw new BadRequestAlertException("A new projectGoal cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProjectGoal result = projectGoalRepository.save(projectGoal);
        return ResponseEntity
            .created(new URI("/api/project-goals/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /project-goals/:id} : Updates an existing projectGoal.
     *
     * @param id the id of the projectGoal to save.
     * @param projectGoal the projectGoal to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated projectGoal,
     * or with status {@code 400 (Bad Request)} if the projectGoal is not valid,
     * or with status {@code 500 (Internal Server Error)} if the projectGoal couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/project-goals/{id}")
    public ResponseEntity<ProjectGoal> updateProjectGoal(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProjectGoal projectGoal
    ) throws URISyntaxException {
        log.debug("REST request to update ProjectGoal : {}, {}", id, projectGoal);
        if (projectGoal.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, projectGoal.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!projectGoalRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProjectGoal result = projectGoalRepository.save(projectGoal);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, projectGoal.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /project-goals/:id} : Partial updates given fields of an existing projectGoal, field will ignore if it is null
     *
     * @param id the id of the projectGoal to save.
     * @param projectGoal the projectGoal to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated projectGoal,
     * or with status {@code 400 (Bad Request)} if the projectGoal is not valid,
     * or with status {@code 404 (Not Found)} if the projectGoal is not found,
     * or with status {@code 500 (Internal Server Error)} if the projectGoal couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/project-goals/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProjectGoal> partialUpdateProjectGoal(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProjectGoal projectGoal
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProjectGoal partially : {}, {}", id, projectGoal);
        if (projectGoal.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, projectGoal.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!projectGoalRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProjectGoal> result = projectGoalRepository
            .findById(projectGoal.getId())
            .map(existingProjectGoal -> {
                if (projectGoal.getName() != null) {
                    existingProjectGoal.setName(projectGoal.getName());
                }
                if (projectGoal.getProjectCompletion() != null) {
                    existingProjectGoal.setProjectCompletion(projectGoal.getProjectCompletion());
                }
                if (projectGoal.getProjectCompletionBurnRate() != null) {
                    existingProjectGoal.setProjectCompletionBurnRate(projectGoal.getProjectCompletionBurnRate());
                }

                return existingProjectGoal;
            })
            .map(projectGoalRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, projectGoal.getId().toString())
        );
    }

    /**
     * {@code GET  /project-goals} : get all the projectGoals.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of projectGoals in body.
     */
    @GetMapping("/project-goals")
    public List<ProjectGoal> getAllProjectGoals() {
        log.debug("REST request to get all ProjectGoals");
        return projectGoalRepository.findAll();
    }

    /**
     * {@code GET  /project-goals/:id} : get the "id" projectGoal.
     *
     * @param id the id of the projectGoal to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the projectGoal, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/project-goals/{id}")
    public ResponseEntity<ProjectGoal> getProjectGoal(@PathVariable Long id) {
        log.debug("REST request to get ProjectGoal : {}", id);
        Optional<ProjectGoal> projectGoal = projectGoalRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(projectGoal);
    }

    /**
     * {@code DELETE  /project-goals/:id} : delete the "id" projectGoal.
     *
     * @param id the id of the projectGoal to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/project-goals/{id}")
    public ResponseEntity<Void> deleteProjectGoal(@PathVariable Long id) {
        log.debug("REST request to delete ProjectGoal : {}", id);
        projectGoalRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
