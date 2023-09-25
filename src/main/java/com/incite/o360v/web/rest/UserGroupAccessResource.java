package com.incite.o360v.web.rest;

import com.incite.o360v.domain.UserGroupAccess;
import com.incite.o360v.repository.UserGroupAccessRepository;
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
 * REST controller for managing {@link com.incite.o360v.domain.UserGroupAccess}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserGroupAccessResource {

    private final Logger log = LoggerFactory.getLogger(UserGroupAccessResource.class);

    private static final String ENTITY_NAME = "userGroupAccess";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserGroupAccessRepository userGroupAccessRepository;

    public UserGroupAccessResource(UserGroupAccessRepository userGroupAccessRepository) {
        this.userGroupAccessRepository = userGroupAccessRepository;
    }

    /**
     * {@code POST  /user-group-accesses} : Create a new userGroupAccess.
     *
     * @param userGroupAccess the userGroupAccess to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userGroupAccess, or with status {@code 400 (Bad Request)} if the userGroupAccess has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-group-accesses")
    public ResponseEntity<UserGroupAccess> createUserGroupAccess(@Valid @RequestBody UserGroupAccess userGroupAccess)
        throws URISyntaxException {
        log.debug("REST request to save UserGroupAccess : {}", userGroupAccess);
        if (userGroupAccess.getId() != null) {
            throw new BadRequestAlertException("A new userGroupAccess cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserGroupAccess result = userGroupAccessRepository.save(userGroupAccess);
        return ResponseEntity
            .created(new URI("/api/user-group-accesses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-group-accesses/:id} : Updates an existing userGroupAccess.
     *
     * @param id the id of the userGroupAccess to save.
     * @param userGroupAccess the userGroupAccess to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userGroupAccess,
     * or with status {@code 400 (Bad Request)} if the userGroupAccess is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userGroupAccess couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-group-accesses/{id}")
    public ResponseEntity<UserGroupAccess> updateUserGroupAccess(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody UserGroupAccess userGroupAccess
    ) throws URISyntaxException {
        log.debug("REST request to update UserGroupAccess : {}, {}", id, userGroupAccess);
        if (userGroupAccess.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userGroupAccess.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userGroupAccessRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserGroupAccess result = userGroupAccessRepository.save(userGroupAccess);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userGroupAccess.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-group-accesses/:id} : Partial updates given fields of an existing userGroupAccess, field will ignore if it is null
     *
     * @param id the id of the userGroupAccess to save.
     * @param userGroupAccess the userGroupAccess to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userGroupAccess,
     * or with status {@code 400 (Bad Request)} if the userGroupAccess is not valid,
     * or with status {@code 404 (Not Found)} if the userGroupAccess is not found,
     * or with status {@code 500 (Internal Server Error)} if the userGroupAccess couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-group-accesses/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserGroupAccess> partialUpdateUserGroupAccess(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody UserGroupAccess userGroupAccess
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserGroupAccess partially : {}, {}", id, userGroupAccess);
        if (userGroupAccess.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userGroupAccess.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userGroupAccessRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserGroupAccess> result = userGroupAccessRepository.findById(userGroupAccess.getId()).map(userGroupAccessRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userGroupAccess.getId().toString())
        );
    }

    /**
     * {@code GET  /user-group-accesses} : get all the userGroupAccesses.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userGroupAccesses in body.
     */
    @GetMapping("/user-group-accesses")
    public List<UserGroupAccess> getAllUserGroupAccesses(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all UserGroupAccesses");
        if (eagerload) {
            return userGroupAccessRepository.findAllWithEagerRelationships();
        } else {
            return userGroupAccessRepository.findAll();
        }
    }

    /**
     * {@code GET  /user-group-accesses/:id} : get the "id" userGroupAccess.
     *
     * @param id the id of the userGroupAccess to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userGroupAccess, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-group-accesses/{id}")
    public ResponseEntity<UserGroupAccess> getUserGroupAccess(@PathVariable Long id) {
        log.debug("REST request to get UserGroupAccess : {}", id);
        Optional<UserGroupAccess> userGroupAccess = userGroupAccessRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(userGroupAccess);
    }

    /**
     * {@code DELETE  /user-group-accesses/:id} : delete the "id" userGroupAccess.
     *
     * @param id the id of the userGroupAccess to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-group-accesses/{id}")
    public ResponseEntity<Void> deleteUserGroupAccess(@PathVariable Long id) {
        log.debug("REST request to delete UserGroupAccess : {}", id);
        userGroupAccessRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
