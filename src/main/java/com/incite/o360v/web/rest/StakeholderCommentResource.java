package com.incite.o360v.web.rest;

import com.incite.o360v.domain.StakeholderComment;
import com.incite.o360v.repository.StakeholderCommentRepository;
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
 * REST controller for managing {@link com.incite.o360v.domain.StakeholderComment}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StakeholderCommentResource {

    private final Logger log = LoggerFactory.getLogger(StakeholderCommentResource.class);

    private static final String ENTITY_NAME = "stakeholderComment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StakeholderCommentRepository stakeholderCommentRepository;

    public StakeholderCommentResource(StakeholderCommentRepository stakeholderCommentRepository) {
        this.stakeholderCommentRepository = stakeholderCommentRepository;
    }

    /**
     * {@code POST  /stakeholder-comments} : Create a new stakeholderComment.
     *
     * @param stakeholderComment the stakeholderComment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new stakeholderComment, or with status {@code 400 (Bad Request)} if the stakeholderComment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/stakeholder-comments")
    public ResponseEntity<StakeholderComment> createStakeholderComment(@Valid @RequestBody StakeholderComment stakeholderComment)
        throws URISyntaxException {
        log.debug("REST request to save StakeholderComment : {}", stakeholderComment);
        if (stakeholderComment.getId() != null) {
            throw new BadRequestAlertException("A new stakeholderComment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        StakeholderComment result = stakeholderCommentRepository.save(stakeholderComment);
        return ResponseEntity
            .created(new URI("/api/stakeholder-comments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /stakeholder-comments/:id} : Updates an existing stakeholderComment.
     *
     * @param id the id of the stakeholderComment to save.
     * @param stakeholderComment the stakeholderComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stakeholderComment,
     * or with status {@code 400 (Bad Request)} if the stakeholderComment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the stakeholderComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/stakeholder-comments/{id}")
    public ResponseEntity<StakeholderComment> updateStakeholderComment(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody StakeholderComment stakeholderComment
    ) throws URISyntaxException {
        log.debug("REST request to update StakeholderComment : {}, {}", id, stakeholderComment);
        if (stakeholderComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stakeholderComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!stakeholderCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        StakeholderComment result = stakeholderCommentRepository.save(stakeholderComment);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, stakeholderComment.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /stakeholder-comments/:id} : Partial updates given fields of an existing stakeholderComment, field will ignore if it is null
     *
     * @param id the id of the stakeholderComment to save.
     * @param stakeholderComment the stakeholderComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stakeholderComment,
     * or with status {@code 400 (Bad Request)} if the stakeholderComment is not valid,
     * or with status {@code 404 (Not Found)} if the stakeholderComment is not found,
     * or with status {@code 500 (Internal Server Error)} if the stakeholderComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/stakeholder-comments/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<StakeholderComment> partialUpdateStakeholderComment(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody StakeholderComment stakeholderComment
    ) throws URISyntaxException {
        log.debug("REST request to partial update StakeholderComment partially : {}, {}", id, stakeholderComment);
        if (stakeholderComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stakeholderComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!stakeholderCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<StakeholderComment> result = stakeholderCommentRepository
            .findById(stakeholderComment.getId())
            .map(existingStakeholderComment -> {
                if (stakeholderComment.getCreatedDate() != null) {
                    existingStakeholderComment.setCreatedDate(stakeholderComment.getCreatedDate());
                }
                if (stakeholderComment.getComment() != null) {
                    existingStakeholderComment.setComment(stakeholderComment.getComment());
                }

                return existingStakeholderComment;
            })
            .map(stakeholderCommentRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, stakeholderComment.getId().toString())
        );
    }

    /**
     * {@code GET  /stakeholder-comments} : get all the stakeholderComments.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of stakeholderComments in body.
     */
    @GetMapping("/stakeholder-comments")
    public List<StakeholderComment> getAllStakeholderComments(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all StakeholderComments");
        if (eagerload) {
            return stakeholderCommentRepository.findAllWithEagerRelationships();
        } else {
            return stakeholderCommentRepository.findAll();
        }
    }

    /**
     * {@code GET  /stakeholder-comments/:id} : get the "id" stakeholderComment.
     *
     * @param id the id of the stakeholderComment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the stakeholderComment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/stakeholder-comments/{id}")
    public ResponseEntity<StakeholderComment> getStakeholderComment(@PathVariable Long id) {
        log.debug("REST request to get StakeholderComment : {}", id);
        Optional<StakeholderComment> stakeholderComment = stakeholderCommentRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(stakeholderComment);
    }

    /**
     * {@code DELETE  /stakeholder-comments/:id} : delete the "id" stakeholderComment.
     *
     * @param id the id of the stakeholderComment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/stakeholder-comments/{id}")
    public ResponseEntity<Void> deleteStakeholderComment(@PathVariable Long id) {
        log.debug("REST request to delete StakeholderComment : {}", id);
        stakeholderCommentRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
