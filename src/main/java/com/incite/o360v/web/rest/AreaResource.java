package com.incite.o360v.web.rest;

import com.incite.o360v.domain.Area;
import com.incite.o360v.repository.AreaRepository;
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
 * REST controller for managing {@link com.incite.o360v.domain.Area}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AreaResource {

    private final Logger log = LoggerFactory.getLogger(AreaResource.class);

    private static final String ENTITY_NAME = "area";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AreaRepository areaRepository;

    public AreaResource(AreaRepository areaRepository) {
        this.areaRepository = areaRepository;
    }

    /**
     * {@code POST  /areas} : Create a new area.
     *
     * @param area the area to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new area, or with status {@code 400 (Bad Request)} if the area has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/areas")
    public ResponseEntity<Area> createArea(@Valid @RequestBody Area area) throws URISyntaxException {
        log.debug("REST request to save Area : {}", area);
        if (area.getId() != null) {
            throw new BadRequestAlertException("A new area cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Area result = areaRepository.save(area);
        return ResponseEntity
            .created(new URI("/api/areas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /areas/:id} : Updates an existing area.
     *
     * @param id the id of the area to save.
     * @param area the area to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated area,
     * or with status {@code 400 (Bad Request)} if the area is not valid,
     * or with status {@code 500 (Internal Server Error)} if the area couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/areas/{id}")
    public ResponseEntity<Area> updateArea(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Area area)
        throws URISyntaxException {
        log.debug("REST request to update Area : {}, {}", id, area);
        if (area.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, area.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!areaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Area result = areaRepository.save(area);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, area.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /areas/:id} : Partial updates given fields of an existing area, field will ignore if it is null
     *
     * @param id the id of the area to save.
     * @param area the area to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated area,
     * or with status {@code 400 (Bad Request)} if the area is not valid,
     * or with status {@code 404 (Not Found)} if the area is not found,
     * or with status {@code 500 (Internal Server Error)} if the area couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/areas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Area> partialUpdateArea(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Area area
    ) throws URISyntaxException {
        log.debug("REST request to partial update Area partially : {}, {}", id, area);
        if (area.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, area.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!areaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Area> result = areaRepository
            .findById(area.getId())
            .map(existingArea -> {
                if (area.getName() != null) {
                    existingArea.setName(area.getName());
                }

                return existingArea;
            })
            .map(areaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, area.getId().toString())
        );
    }

    /**
     * {@code GET  /areas} : get all the areas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of areas in body.
     */
    @GetMapping("/areas")
    public List<Area> getAllAreas() {
        log.debug("REST request to get all Areas");
        return areaRepository.findAll();
    }

    /**
     * {@code GET  /areas/:id} : get the "id" area.
     *
     * @param id the id of the area to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the area, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/areas/{id}")
    public ResponseEntity<Area> getArea(@PathVariable Long id) {
        log.debug("REST request to get Area : {}", id);
        Optional<Area> area = areaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(area);
    }

    /**
     * {@code DELETE  /areas/:id} : delete the "id" area.
     *
     * @param id the id of the area to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/areas/{id}")
    public ResponseEntity<Void> deleteArea(@PathVariable Long id) {
        log.debug("REST request to delete Area : {}", id);
        areaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
