package com.incite.o360v.web.rest;

import com.incite.o360v.domain.Company;
import com.incite.o360v.repository.CompanyRepository;
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
 * REST controller for managing {@link com.incite.o360v.domain.Company}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CompanyResource {

    private final Logger log = LoggerFactory.getLogger(CompanyResource.class);

    private static final String ENTITY_NAME = "company";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CompanyRepository companyRepository;

    public CompanyResource(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    /**
     * {@code POST  /companies} : Create a new company.
     *
     * @param company the company to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new company, or with status {@code 400 (Bad Request)} if the company has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/companies")
    public ResponseEntity<Company> createCompany(@Valid @RequestBody Company company) throws URISyntaxException {
        log.debug("REST request to save Company : {}", company);
        if (company.getId() != null) {
            throw new BadRequestAlertException("A new company cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Company result = companyRepository.save(company);
        return ResponseEntity
            .created(new URI("/api/companies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /companies/:id} : Updates an existing company.
     *
     * @param id the id of the company to save.
     * @param company the company to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated company,
     * or with status {@code 400 (Bad Request)} if the company is not valid,
     * or with status {@code 500 (Internal Server Error)} if the company couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/companies/{id}")
    public ResponseEntity<Company> updateCompany(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Company company
    ) throws URISyntaxException {
        log.debug("REST request to update Company : {}, {}", id, company);
        if (company.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, company.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!companyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Company result = companyRepository.save(company);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, company.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /companies/:id} : Partial updates given fields of an existing company, field will ignore if it is null
     *
     * @param id the id of the company to save.
     * @param company the company to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated company,
     * or with status {@code 400 (Bad Request)} if the company is not valid,
     * or with status {@code 404 (Not Found)} if the company is not found,
     * or with status {@code 500 (Internal Server Error)} if the company couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/companies/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Company> partialUpdateCompany(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Company company
    ) throws URISyntaxException {
        log.debug("REST request to partial update Company partially : {}, {}", id, company);
        if (company.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, company.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!companyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Company> result = companyRepository
            .findById(company.getId())
            .map(existingCompany -> {
                if (company.getName() != null) {
                    existingCompany.setName(company.getName());
                }
                if (company.getLogo() != null) {
                    existingCompany.setLogo(company.getLogo());
                }
                if (company.getLogoContentType() != null) {
                    existingCompany.setLogoContentType(company.getLogoContentType());
                }

                return existingCompany;
            })
            .map(companyRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, company.getId().toString())
        );
    }

    /**
     * {@code GET  /companies} : get all the companies.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of companies in body.
     */
    @GetMapping("/companies")
    public List<Company> getAllCompanies(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Companies");
        if (eagerload) {
            return companyRepository.findAllWithEagerRelationships();
        } else {
            return companyRepository.findAll();
        }
    }

    /**
     * {@code GET  /companies/:id} : get the "id" company.
     *
     * @param id the id of the company to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the company, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/companies/{id}")
    public ResponseEntity<Company> getCompany(@PathVariable Long id) {
        log.debug("REST request to get Company : {}", id);
        Optional<Company> company = companyRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(company);
    }

    /**
     * {@code DELETE  /companies/:id} : delete the "id" company.
     *
     * @param id the id of the company to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/companies/{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable Long id) {
        log.debug("REST request to delete Company : {}", id);
        companyRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
