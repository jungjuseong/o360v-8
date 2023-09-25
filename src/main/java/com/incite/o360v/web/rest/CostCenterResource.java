package com.incite.o360v.web.rest;

import com.incite.o360v.domain.CostCenter;
import com.incite.o360v.repository.CostCenterRepository;
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
 * REST controller for managing {@link com.incite.o360v.domain.CostCenter}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CostCenterResource {

    private final Logger log = LoggerFactory.getLogger(CostCenterResource.class);

    private static final String ENTITY_NAME = "costCenter";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CostCenterRepository costCenterRepository;

    public CostCenterResource(CostCenterRepository costCenterRepository) {
        this.costCenterRepository = costCenterRepository;
    }

    /**
     * {@code POST  /cost-centers} : Create a new costCenter.
     *
     * @param costCenter the costCenter to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new costCenter, or with status {@code 400 (Bad Request)} if the costCenter has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/cost-centers")
    public ResponseEntity<CostCenter> createCostCenter(@Valid @RequestBody CostCenter costCenter) throws URISyntaxException {
        log.debug("REST request to save CostCenter : {}", costCenter);
        if (costCenter.getId() != null) {
            throw new BadRequestAlertException("A new costCenter cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CostCenter result = costCenterRepository.save(costCenter);
        return ResponseEntity
            .created(new URI("/api/cost-centers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /cost-centers/:id} : Updates an existing costCenter.
     *
     * @param id the id of the costCenter to save.
     * @param costCenter the costCenter to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated costCenter,
     * or with status {@code 400 (Bad Request)} if the costCenter is not valid,
     * or with status {@code 500 (Internal Server Error)} if the costCenter couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/cost-centers/{id}")
    public ResponseEntity<CostCenter> updateCostCenter(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CostCenter costCenter
    ) throws URISyntaxException {
        log.debug("REST request to update CostCenter : {}, {}", id, costCenter);
        if (costCenter.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, costCenter.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!costCenterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CostCenter result = costCenterRepository.save(costCenter);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, costCenter.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /cost-centers/:id} : Partial updates given fields of an existing costCenter, field will ignore if it is null
     *
     * @param id the id of the costCenter to save.
     * @param costCenter the costCenter to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated costCenter,
     * or with status {@code 400 (Bad Request)} if the costCenter is not valid,
     * or with status {@code 404 (Not Found)} if the costCenter is not found,
     * or with status {@code 500 (Internal Server Error)} if the costCenter couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/cost-centers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CostCenter> partialUpdateCostCenter(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CostCenter costCenter
    ) throws URISyntaxException {
        log.debug("REST request to partial update CostCenter partially : {}, {}", id, costCenter);
        if (costCenter.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, costCenter.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!costCenterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CostCenter> result = costCenterRepository
            .findById(costCenter.getId())
            .map(existingCostCenter -> {
                if (costCenter.getCostCenter() != null) {
                    existingCostCenter.setCostCenter(costCenter.getCostCenter());
                }

                return existingCostCenter;
            })
            .map(costCenterRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, costCenter.getId().toString())
        );
    }

    /**
     * {@code GET  /cost-centers} : get all the costCenters.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of costCenters in body.
     */
    @GetMapping("/cost-centers")
    public List<CostCenter> getAllCostCenters() {
        log.debug("REST request to get all CostCenters");
        return costCenterRepository.findAll();
    }

    /**
     * {@code GET  /cost-centers/:id} : get the "id" costCenter.
     *
     * @param id the id of the costCenter to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the costCenter, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/cost-centers/{id}")
    public ResponseEntity<CostCenter> getCostCenter(@PathVariable Long id) {
        log.debug("REST request to get CostCenter : {}", id);
        Optional<CostCenter> costCenter = costCenterRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(costCenter);
    }

    /**
     * {@code DELETE  /cost-centers/:id} : delete the "id" costCenter.
     *
     * @param id the id of the costCenter to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/cost-centers/{id}")
    public ResponseEntity<Void> deleteCostCenter(@PathVariable Long id) {
        log.debug("REST request to delete CostCenter : {}", id);
        costCenterRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
