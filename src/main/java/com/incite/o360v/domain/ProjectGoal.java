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
 * A ProjectGoal.
 */
@Entity
@Table(name = "project_goal")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProjectGoal implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "project_completion")
    private Integer projectCompletion;

    @Column(name = "project_completion_burn_rate")
    private Integer projectCompletionBurnRate;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "goal")
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

    public ProjectGoal id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public ProjectGoal name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getProjectCompletion() {
        return this.projectCompletion;
    }

    public ProjectGoal projectCompletion(Integer projectCompletion) {
        this.setProjectCompletion(projectCompletion);
        return this;
    }

    public void setProjectCompletion(Integer projectCompletion) {
        this.projectCompletion = projectCompletion;
    }

    public Integer getProjectCompletionBurnRate() {
        return this.projectCompletionBurnRate;
    }

    public ProjectGoal projectCompletionBurnRate(Integer projectCompletionBurnRate) {
        this.setProjectCompletionBurnRate(projectCompletionBurnRate);
        return this;
    }

    public void setProjectCompletionBurnRate(Integer projectCompletionBurnRate) {
        this.projectCompletionBurnRate = projectCompletionBurnRate;
    }

    public Set<Project> getProjects() {
        return this.projects;
    }

    public void setProjects(Set<Project> projects) {
        if (this.projects != null) {
            this.projects.forEach(i -> i.setGoal(null));
        }
        if (projects != null) {
            projects.forEach(i -> i.setGoal(this));
        }
        this.projects = projects;
    }

    public ProjectGoal projects(Set<Project> projects) {
        this.setProjects(projects);
        return this;
    }

    public ProjectGoal addProject(Project project) {
        this.projects.add(project);
        project.setGoal(this);
        return this;
    }

    public ProjectGoal removeProject(Project project) {
        this.projects.remove(project);
        project.setGoal(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProjectGoal)) {
            return false;
        }
        return id != null && id.equals(((ProjectGoal) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProjectGoal{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", projectCompletion=" + getProjectCompletion() +
            ", projectCompletionBurnRate=" + getProjectCompletionBurnRate() +
            "}";
    }
}
