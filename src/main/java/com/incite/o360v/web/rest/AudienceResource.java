package com.incite.o360v.web.rest;

import com.incite.o360v.domain.Audience;
import com.incite.o360v.repository.AudienceRepository;
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
 * REST controller for managing {@link com.incite.o360v.domain.Audience}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AudienceResource {

    private final Logger log = LoggerFactory.getLogger(AudienceResource.class);

    private static final String ENTITY_NAME = "audience";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AudienceRepository audienceRepository;

    public AudienceResource(AudienceRepository audienceRepository) {
        this.audienceRepository = audienceRepository;
    }

    /**
     * {@code POST  /audiences} : Create a new audience.
     *
     * @param audience the audience to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new audience, or with status {@code 400 (Bad Request)} if the audience has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/audiences")
    public ResponseEntity<Audience> createAudience(@Valid @RequestBody Audience audience) throws URISyntaxException {
        log.debug("REST request to save Audience : {}", audience);
        if (audience.getId() != null) {
            throw new BadRequestAlertException("A new audience cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Audience result = audienceRepository.save(audience);
        return ResponseEntity
            .created(new URI("/api/audiences/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /audiences/:id} : Updates an existing audience.
     *
     * @param id the id of the audience to save.
     * @param audience the audience to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated audience,
     * or with status {@code 400 (Bad Request)} if the audience is not valid,
     * or with status {@code 500 (Internal Server Error)} if the audience couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/audiences/{id}")
    public ResponseEntity<Audience> updateAudience(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Audience audience
    ) throws URISyntaxException {
        log.debug("REST request to update Audience : {}, {}", id, audience);
        if (audience.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, audience.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!audienceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Audience result = audienceRepository.save(audience);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, audience.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /audiences/:id} : Partial updates given fields of an existing audience, field will ignore if it is null
     *
     * @param id the id of the audience to save.
     * @param audience the audience to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated audience,
     * or with status {@code 400 (Bad Request)} if the audience is not valid,
     * or with status {@code 404 (Not Found)} if the audience is not found,
     * or with status {@code 500 (Internal Server Error)} if the audience couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/audiences/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Audience> partialUpdateAudience(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Audience audience
    ) throws URISyntaxException {
        log.debug("REST request to partial update Audience partially : {}, {}", id, audience);
        if (audience.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, audience.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!audienceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Audience> result = audienceRepository.findById(audience.getId()).map(audienceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, audience.getId().toString())
        );
    }

    /**
     * {@code GET  /audiences} : get all the audiences.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of audiences in body.
     */
    @GetMapping("/audiences")
    public List<Audience> getAllAudiences(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Audiences");
        if (eagerload) {
            return audienceRepository.findAllWithEagerRelationships();
        } else {
            return audienceRepository.findAll();
        }
    }

    /**
     * {@code GET  /audiences/:id} : get the "id" audience.
     *
     * @param id the id of the audience to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the audience, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/audiences/{id}")
    public ResponseEntity<Audience> getAudience(@PathVariable Long id) {
        log.debug("REST request to get Audience : {}", id);
        Optional<Audience> audience = audienceRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(audience);
    }

    /**
     * {@code DELETE  /audiences/:id} : delete the "id" audience.
     *
     * @param id the id of the audience to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/audiences/{id}")
    public ResponseEntity<Void> deleteAudience(@PathVariable Long id) {
        log.debug("REST request to delete Audience : {}", id);
        audienceRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
