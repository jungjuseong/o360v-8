package com.incite.o360v.web.rest;

import com.incite.o360v.domain.ProjectComment;
import com.incite.o360v.repository.ProjectCommentRepository;
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
 * REST controller for managing {@link com.incite.o360v.domain.ProjectComment}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProjectCommentResource {

    private final Logger log = LoggerFactory.getLogger(ProjectCommentResource.class);

    private static final String ENTITY_NAME = "projectComment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProjectCommentRepository projectCommentRepository;

    public ProjectCommentResource(ProjectCommentRepository projectCommentRepository) {
        this.projectCommentRepository = projectCommentRepository;
    }

    /**
     * {@code POST  /project-comments} : Create a new projectComment.
     *
     * @param projectComment the projectComment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new projectComment, or with status {@code 400 (Bad Request)} if the projectComment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/project-comments")
    public ResponseEntity<ProjectComment> createProjectComment(@Valid @RequestBody ProjectComment projectComment)
        throws URISyntaxException {
        log.debug("REST request to save ProjectComment : {}", projectComment);
        if (projectComment.getId() != null) {
            throw new BadRequestAlertException("A new projectComment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProjectComment result = projectCommentRepository.save(projectComment);
        return ResponseEntity
            .created(new URI("/api/project-comments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /project-comments/:id} : Updates an existing projectComment.
     *
     * @param id the id of the projectComment to save.
     * @param projectComment the projectComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated projectComment,
     * or with status {@code 400 (Bad Request)} if the projectComment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the projectComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/project-comments/{id}")
    public ResponseEntity<ProjectComment> updateProjectComment(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProjectComment projectComment
    ) throws URISyntaxException {
        log.debug("REST request to update ProjectComment : {}, {}", id, projectComment);
        if (projectComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, projectComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!projectCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProjectComment result = projectCommentRepository.save(projectComment);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, projectComment.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /project-comments/:id} : Partial updates given fields of an existing projectComment, field will ignore if it is null
     *
     * @param id the id of the projectComment to save.
     * @param projectComment the projectComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated projectComment,
     * or with status {@code 400 (Bad Request)} if the projectComment is not valid,
     * or with status {@code 404 (Not Found)} if the projectComment is not found,
     * or with status {@code 500 (Internal Server Error)} if the projectComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/project-comments/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProjectComment> partialUpdateProjectComment(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProjectComment projectComment
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProjectComment partially : {}, {}", id, projectComment);
        if (projectComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, projectComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!projectCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProjectComment> result = projectCommentRepository
            .findById(projectComment.getId())
            .map(existingProjectComment -> {
                if (projectComment.getCreatedDate() != null) {
                    existingProjectComment.setCreatedDate(projectComment.getCreatedDate());
                }
                if (projectComment.getComment() != null) {
                    existingProjectComment.setComment(projectComment.getComment());
                }

                return existingProjectComment;
            })
            .map(projectCommentRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, projectComment.getId().toString())
        );
    }

    /**
     * {@code GET  /project-comments} : get all the projectComments.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of projectComments in body.
     */
    @GetMapping("/project-comments")
    public List<ProjectComment> getAllProjectComments(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ProjectComments");
        if (eagerload) {
            return projectCommentRepository.findAllWithEagerRelationships();
        } else {
            return projectCommentRepository.findAll();
        }
    }

    /**
     * {@code GET  /project-comments/:id} : get the "id" projectComment.
     *
     * @param id the id of the projectComment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the projectComment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/project-comments/{id}")
    public ResponseEntity<ProjectComment> getProjectComment(@PathVariable Long id) {
        log.debug("REST request to get ProjectComment : {}", id);
        Optional<ProjectComment> projectComment = projectCommentRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(projectComment);
    }

    /**
     * {@code DELETE  /project-comments/:id} : delete the "id" projectComment.
     *
     * @param id the id of the projectComment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/project-comments/{id}")
    public ResponseEntity<Void> deleteProjectComment(@PathVariable Long id) {
        log.debug("REST request to delete ProjectComment : {}", id);
        projectCommentRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
