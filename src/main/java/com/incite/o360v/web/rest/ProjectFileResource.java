package com.incite.o360v.web.rest;

import com.incite.o360v.domain.ProjectFile;
import com.incite.o360v.repository.ProjectFileRepository;
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
 * REST controller for managing {@link com.incite.o360v.domain.ProjectFile}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProjectFileResource {

    private final Logger log = LoggerFactory.getLogger(ProjectFileResource.class);

    private static final String ENTITY_NAME = "projectFile";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProjectFileRepository projectFileRepository;

    public ProjectFileResource(ProjectFileRepository projectFileRepository) {
        this.projectFileRepository = projectFileRepository;
    }

    /**
     * {@code POST  /project-files} : Create a new projectFile.
     *
     * @param projectFile the projectFile to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new projectFile, or with status {@code 400 (Bad Request)} if the projectFile has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/project-files")
    public ResponseEntity<ProjectFile> createProjectFile(@Valid @RequestBody ProjectFile projectFile) throws URISyntaxException {
        log.debug("REST request to save ProjectFile : {}", projectFile);
        if (projectFile.getId() != null) {
            throw new BadRequestAlertException("A new projectFile cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProjectFile result = projectFileRepository.save(projectFile);
        return ResponseEntity
            .created(new URI("/api/project-files/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /project-files/:id} : Updates an existing projectFile.
     *
     * @param id the id of the projectFile to save.
     * @param projectFile the projectFile to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated projectFile,
     * or with status {@code 400 (Bad Request)} if the projectFile is not valid,
     * or with status {@code 500 (Internal Server Error)} if the projectFile couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/project-files/{id}")
    public ResponseEntity<ProjectFile> updateProjectFile(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProjectFile projectFile
    ) throws URISyntaxException {
        log.debug("REST request to update ProjectFile : {}, {}", id, projectFile);
        if (projectFile.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, projectFile.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!projectFileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProjectFile result = projectFileRepository.save(projectFile);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, projectFile.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /project-files/:id} : Partial updates given fields of an existing projectFile, field will ignore if it is null
     *
     * @param id the id of the projectFile to save.
     * @param projectFile the projectFile to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated projectFile,
     * or with status {@code 400 (Bad Request)} if the projectFile is not valid,
     * or with status {@code 404 (Not Found)} if the projectFile is not found,
     * or with status {@code 500 (Internal Server Error)} if the projectFile couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/project-files/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProjectFile> partialUpdateProjectFile(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProjectFile projectFile
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProjectFile partially : {}, {}", id, projectFile);
        if (projectFile.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, projectFile.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!projectFileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProjectFile> result = projectFileRepository
            .findById(projectFile.getId())
            .map(existingProjectFile -> {
                if (projectFile.getFile() != null) {
                    existingProjectFile.setFile(projectFile.getFile());
                }
                if (projectFile.getFileContentType() != null) {
                    existingProjectFile.setFileContentType(projectFile.getFileContentType());
                }
                if (projectFile.getName() != null) {
                    existingProjectFile.setName(projectFile.getName());
                }

                return existingProjectFile;
            })
            .map(projectFileRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, projectFile.getId().toString())
        );
    }

    /**
     * {@code GET  /project-files} : get all the projectFiles.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of projectFiles in body.
     */
    @GetMapping("/project-files")
    public List<ProjectFile> getAllProjectFiles(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ProjectFiles");
        if (eagerload) {
            return projectFileRepository.findAllWithEagerRelationships();
        } else {
            return projectFileRepository.findAll();
        }
    }

    /**
     * {@code GET  /project-files/:id} : get the "id" projectFile.
     *
     * @param id the id of the projectFile to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the projectFile, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/project-files/{id}")
    public ResponseEntity<ProjectFile> getProjectFile(@PathVariable Long id) {
        log.debug("REST request to get ProjectFile : {}", id);
        Optional<ProjectFile> projectFile = projectFileRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(projectFile);
    }

    /**
     * {@code DELETE  /project-files/:id} : delete the "id" projectFile.
     *
     * @param id the id of the projectFile to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/project-files/{id}")
    public ResponseEntity<Void> deleteProjectFile(@PathVariable Long id) {
        log.debug("REST request to delete ProjectFile : {}", id);
        projectFileRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
