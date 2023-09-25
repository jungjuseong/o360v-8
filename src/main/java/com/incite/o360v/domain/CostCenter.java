package com.incite.o360v.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CostCenter.
 */
@Entity
@Table(name = "cost_center")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CostCenter implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "cost_center", nullable = false)
    private String costCenter;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "costCenter")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = {
            "projects",
            "projectDates",
            "stakeholders",
            "projectFiles",
            "projectComments",
            "countries",
            "parentProject",
            "goal",
            "channel",
            "costCenter",
            "accountNumber",
            "projectOwner",
        },
        allowSetters = true
    )
    private Set<Project> projects = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CostCenter id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCostCenter() {
        return this.costCenter;
    }

    public CostCenter costCenter(String costCenter) {
        this.setCostCenter(costCenter);
        return this;
    }

    public void setCostCenter(String costCenter) {
        this.costCenter = costCenter;
    }

    public Set<Project> getProjects() {
        return this.projects;
    }

    public void setProjects(Set<Project> projects) {
        if (this.projects != null) {
            this.projects.forEach(i -> i.setCostCenter(null));
        }
        if (projects != null) {
            projects.forEach(i -> i.setCostCenter(this));
        }
        this.projects = projects;
    }

    public CostCenter projects(Set<Project> projects) {
        this.setProjects(projects);
        return this;
    }

    public CostCenter addProject(Project project) {
        this.projects.add(project);
        project.setCostCenter(this);
        return this;
    }

    public CostCenter removeProject(Project project) {
        this.projects.remove(project);
        project.setCostCenter(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CostCenter)) {
            return false;
        }
        return id != null && id.equals(((CostCenter) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CostCenter{" +
            "id=" + getId() +
            ", costCenter='" + getCostCenter() + "'" +
            "}";
    }
}
