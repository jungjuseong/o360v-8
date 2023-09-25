package com.incite.o360v.web.rest;

import com.incite.o360v.domain.Stakeholder;
import com.incite.o360v.repository.StakeholderRepository;
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
 * REST controller for managing {@link com.incite.o360v.domain.Stakeholder}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StakeholderResource {

    private final Logger log = LoggerFactory.getLogger(StakeholderResource.class);

    private static final String ENTITY_NAME = "stakeholder";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StakeholderRepository stakeholderRepository;

    public StakeholderResource(StakeholderRepository stakeholderRepository) {
        this.stakeholderRepository = stakeholderRepository;
    }

    /**
     * {@code POST  /stakeholders} : Create a new stakeholder.
     *
     * @param stakeholder the stakeholder to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new stakeholder, or with status {@code 400 (Bad Request)} if the stakeholder has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/stakeholders")
    public ResponseEntity<Stakeholder> createStakeholder(@Valid @RequestBody Stakeholder stakeholder) throws URISyntaxException {
        log.debug("REST request to save Stakeholder : {}", stakeholder);
        if (stakeholder.getId() != null) {
            throw new BadRequestAlertException("A new stakeholder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Stakeholder result = stakeholderRepository.save(stakeholder);
        return ResponseEntity
            .created(new URI("/api/stakeholders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /stakeholders/:id} : Updates an existing stakeholder.
     *
     * @param id the id of the stakeholder to save.
     * @param stakeholder the stakeholder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stakeholder,
     * or with status {@code 400 (Bad Request)} if the stakeholder is not valid,
     * or with status {@code 500 (Internal Server Error)} if the stakeholder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/stakeholders/{id}")
    public ResponseEntity<Stakeholder> updateStakeholder(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Stakeholder stakeholder
    ) throws URISyntaxException {
        log.debug("REST request to update Stakeholder : {}, {}", id, stakeholder);
        if (stakeholder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stakeholder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!stakeholderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Stakeholder result = stakeholderRepository.save(stakeholder);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, stakeholder.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /stakeholders/:id} : Partial updates given fields of an existing stakeholder, field will ignore if it is null
     *
     * @param id the id of the stakeholder to save.
     * @param stakeholder the stakeholder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stakeholder,
     * or with status {@code 400 (Bad Request)} if the stakeholder is not valid,
     * or with status {@code 404 (Not Found)} if the stakeholder is not found,
     * or with status {@code 500 (Internal Server Error)} if the stakeholder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/stakeholders/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Stakeholder> partialUpdateStakeholder(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Stakeholder stakeholder
    ) throws URISyntaxException {
        log.debug("REST request to partial update Stakeholder partially : {}, {}", id, stakeholder);
        if (stakeholder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stakeholder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!stakeholderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Stakeholder> result = stakeholderRepository
            .findById(stakeholder.getId())
            .map(existingStakeholder -> {
                if (stakeholder.getCreatedDate() != null) {
                    existingStakeholder.setCreatedDate(stakeholder.getCreatedDate());
                }
                if (stakeholder.getCost() != null) {
                    existingStakeholder.setCost(stakeholder.getCost());
                }
                if (stakeholder.getStakeholderType() != null) {
                    existingStakeholder.setStakeholderType(stakeholder.getStakeholderType());
                }

                return existingStakeholder;
            })
            .map(stakeholderRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, stakeholder.getId().toString())
        );
    }

    /**
     * {@code GET  /stakeholders} : get all the stakeholders.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of stakeholders in body.
     */
    @GetMapping("/stakeholders")
    public List<Stakeholder> getAllStakeholders(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Stakeholders");
        if (eagerload) {
            return stakeholderRepository.findAllWithEagerRelationships();
        } else {
            return stakeholderRepository.findAll();
        }
    }

    /**
     * {@code GET  /stakeholders/:id} : get the "id" stakeholder.
     *
     * @param id the id of the stakeholder to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the stakeholder, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/stakeholders/{id}")
    public ResponseEntity<Stakeholder> getStakeholder(@PathVariable Long id) {
        log.debug("REST request to get Stakeholder : {}", id);
        Optional<Stakeholder> stakeholder = stakeholderRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(stakeholder);
    }

    /**
     * {@code DELETE  /stakeholders/:id} : delete the "id" stakeholder.
     *
     * @param id the id of the stakeholder to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/stakeholders/{id}")
    public ResponseEntity<Void> deleteStakeholder(@PathVariable Long id) {
        log.debug("REST request to delete Stakeholder : {}", id);
        stakeholderRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
