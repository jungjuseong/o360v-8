package com.incite.o360v.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.incite.o360v.domain.enumeration.ProjectFinancialStatus;
import com.incite.o360v.domain.enumeration.ProjectStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Project.
 */
@Entity
@Table(name = "project")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Project implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "code", nullable = false)
    private String code;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @NotNull
    @Column(name = "fiscal_year", nullable = false)
    private LocalDate fiscalYear;

    @NotNull
    @Column(name = "budget", precision = 21, scale = 2, nullable = false)
    private BigDecimal budget;

    @NotNull
    @Column(name = "created_date", nullable = false)
    private LocalDate createdDate;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @NotNull
    @Column(name = "deployment_date", nullable = false)
    private LocalDate deploymentDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "po_number", nullable = false)
    private String poNumber;

    @Column(name = "jira_code")
    private String jiraCode;

    @Column(name = "jira_update")
    private LocalDate jiraUpdate;

    @Enumerated(EnumType.STRING)
    @Column(name = "project_status")
    private ProjectStatus projectStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "project_financial_status")
    private ProjectFinancialStatus projectFinancialStatus;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "parentProject")
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

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "project")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "project" }, allowSetters = true)
    private Set<ProjectDate> projectDates = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "project")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "stakeholderComments", "users", "project" }, allowSetters = true)
    private Set<Stakeholder> stakeholders = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "project")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "project" }, allowSetters = true)
    private Set<ProjectFile> projectFiles = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "project")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "project" }, allowSetters = true)
    private Set<ProjectComment> projectComments = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_project__country",
        joinColumns = @JoinColumn(name = "project_id"),
        inverseJoinColumns = @JoinColumn(name = "country_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "projects" }, allowSetters = true)
    private Set<Country> countries = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
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
    private Project parentProject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "projects" }, allowSetters = true)
    private ProjectGoal goal;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "projects", "audience" }, allowSetters = true)
    private Channel channel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "projects" }, allowSetters = true)
    private CostCenter costCenter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "projects" }, allowSetters = true)
    private AccountNumber accountNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "projects" }, allowSetters = true)
    private ProjectOwner projectOwner;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Project id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public Project code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTitle() {
        return this.title;
    }

    public Project title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDate getFiscalYear() {
        return this.fiscalYear;
    }

    public Project fiscalYear(LocalDate fiscalYear) {
        this.setFiscalYear(fiscalYear);
        return this;
    }

    public void setFiscalYear(LocalDate fiscalYear) {
        this.fiscalYear = fiscalYear;
    }

    public BigDecimal getBudget() {
        return this.budget;
    }

    public Project budget(BigDecimal budget) {
        this.setBudget(budget);
        return this;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public LocalDate getCreatedDate() {
        return this.createdDate;
    }

    public Project createdDate(LocalDate createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public Project startDate(LocalDate startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getDeploymentDate() {
        return this.deploymentDate;
    }

    public Project deploymentDate(LocalDate deploymentDate) {
        this.setDeploymentDate(deploymentDate);
        return this;
    }

    public void setDeploymentDate(LocalDate deploymentDate) {
        this.deploymentDate = deploymentDate;
    }

    public LocalDate getEndDate() {
        return this.endDate;
    }

    public Project endDate(LocalDate endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getDescription() {
        return this.description;
    }

    public Project description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPoNumber() {
        return this.poNumber;
    }

    public Project poNumber(String poNumber) {
        this.setPoNumber(poNumber);
        return this;
    }

    public void setPoNumber(String poNumber) {
        this.poNumber = poNumber;
    }

    public String getJiraCode() {
        return this.jiraCode;
    }

    public Project jiraCode(String jiraCode) {
        this.setJiraCode(jiraCode);
        return this;
    }

    public void setJiraCode(String jiraCode) {
        this.jiraCode = jiraCode;
    }

    public LocalDate getJiraUpdate() {
        return this.jiraUpdate;
    }

    public Project jiraUpdate(LocalDate jiraUpdate) {
        this.setJiraUpdate(jiraUpdate);
        return this;
    }

    public void setJiraUpdate(LocalDate jiraUpdate) {
        this.jiraUpdate = jiraUpdate;
    }

    public ProjectStatus getProjectStatus() {
        return this.projectStatus;
    }

    public Project projectStatus(ProjectStatus projectStatus) {
        this.setProjectStatus(projectStatus);
        return this;
    }

    public void setProjectStatus(ProjectStatus projectStatus) {
        this.projectStatus = projectStatus;
    }

    public ProjectFinancialStatus getProjectFinancialStatus() {
        return this.projectFinancialStatus;
    }

    public Project projectFinancialStatus(ProjectFinancialStatus projectFinancialStatus) {
        this.setProjectFinancialStatus(projectFinancialStatus);
        return this;
    }

    public void setProjectFinancialStatus(ProjectFinancialStatus projectFinancialStatus) {
        this.projectFinancialStatus = projectFinancialStatus;
    }

    public Set<Project> getProjects() {
        return this.projects;
    }

    public void setProjects(Set<Project> projects) {
        if (this.projects != null) {
            this.projects.forEach(i -> i.setParentProject(null));
        }
        if (projects != null) {
            projects.forEach(i -> i.setParentProject(this));
        }
        this.projects = projects;
    }

    public Project projects(Set<Project> projects) {
        this.setProjects(projects);
        return this;
    }

    public Project addProject(Project project) {
        this.projects.add(project);
        project.setParentProject(this);
        return this;
    }

    public Project removeProject(Project project) {
        this.projects.remove(project);
        project.setParentProject(null);
        return this;
    }

    public Set<ProjectDate> getProjectDates() {
        return this.projectDates;
    }

    public void setProjectDates(Set<ProjectDate> projectDates) {
        if (this.projectDates != null) {
            this.projectDates.forEach(i -> i.setProject(null));
        }
        if (projectDates != null) {
            projectDates.forEach(i -> i.setProject(this));
        }
        this.projectDates = projectDates;
    }

    public Project projectDates(Set<ProjectDate> projectDates) {
        this.setProjectDates(projectDates);
        return this;
    }

    public Project addProjectDate(ProjectDate projectDate) {
        this.projectDates.add(projectDate);
        projectDate.setProject(this);
        return this;
    }

    public Project removeProjectDate(ProjectDate projectDate) {
        this.projectDates.remove(projectDate);
        projectDate.setProject(null);
        return this;
    }

    public Set<Stakeholder> getStakeholders() {
        return this.stakeholders;
    }

    public void setStakeholders(Set<Stakeholder> stakeholders) {
        if (this.stakeholders != null) {
            this.stakeholders.forEach(i -> i.setProject(null));
        }
        if (stakeholders != null) {
            stakeholders.forEach(i -> i.setProject(this));
        }
        this.stakeholders = stakeholders;
    }

    public Project stakeholders(Set<Stakeholder> stakeholders) {
        this.setStakeholders(stakeholders);
        return this;
    }

    public Project addStakeholder(Stakeholder stakeholder) {
        this.stakeholders.add(stakeholder);
        stakeholder.setProject(this);
        return this;
    }

    public Project removeStakeholder(Stakeholder stakeholder) {
        this.stakeholders.remove(stakeholder);
        stakeholder.setProject(null);
        return this;
    }

    public Set<ProjectFile> getProjectFiles() {
        return this.projectFiles;
    }

    public void setProjectFiles(Set<ProjectFile> projectFiles) {
        if (this.projectFiles != null) {
            this.projectFiles.forEach(i -> i.setProject(null));
        }
        if (projectFiles != null) {
            projectFiles.forEach(i -> i.setProject(this));
        }
        this.projectFiles = projectFiles;
    }

    public Project projectFiles(Set<ProjectFile> projectFiles) {
        this.setProjectFiles(projectFiles);
        return this;
    }

    public Project addProjectFile(ProjectFile projectFile) {
        this.projectFiles.add(projectFile);
        projectFile.setProject(this);
        return this;
    }

    public Project removeProjectFile(ProjectFile projectFile) {
        this.projectFiles.remove(projectFile);
        projectFile.setProject(null);
        return this;
    }

    public Set<ProjectComment> getProjectComments() {
        return this.projectComments;
    }

    public void setProjectComments(Set<ProjectComment> projectComments) {
        if (this.projectComments != null) {
            this.projectComments.forEach(i -> i.setProject(null));
        }
        if (projectComments != null) {
            projectComments.forEach(i -> i.setProject(this));
        }
        this.projectComments = projectComments;
    }

    public Project projectComments(Set<ProjectComment> projectComments) {
        this.setProjectComments(projectComments);
        return this;
    }

    public Project addProjectComment(ProjectComment projectComment) {
        this.projectComments.add(projectComment);
        projectComment.setProject(this);
        return this;
    }

    public Project removeProjectComment(ProjectComment projectComment) {
        this.projectComments.remove(projectComment);
        projectComment.setProject(null);
        return this;
    }

    public Set<Country> getCountries() {
        return this.countries;
    }

    public void setCountries(Set<Country> countries) {
        this.countries = countries;
    }

    public Project countries(Set<Country> countries) {
        this.setCountries(countries);
        return this;
    }

    public Project addCountry(Country country) {
        this.countries.add(country);
        country.getProjects().add(this);
        return this;
    }

    public Project removeCountry(Country country) {
        this.countries.remove(country);
        country.getProjects().remove(this);
        return this;
    }

    public Project getParentProject() {
        return this.parentProject;
    }

    public void setParentProject(Project project) {
        this.parentProject = project;
    }

    public Project parentProject(Project project) {
        this.setParentProject(project);
        return this;
    }

    public ProjectGoal getGoal() {
        return this.goal;
    }

    public void setGoal(ProjectGoal projectGoal) {
        this.goal = projectGoal;
    }

    public Project goal(ProjectGoal projectGoal) {
        this.setGoal(projectGoal);
        return this;
    }

    public Channel getChannel() {
        return this.channel;
    }

    public void setChannel(Channel channel) {
        this.channel = channel;
    }

    public Project channel(Channel channel) {
        this.setChannel(channel);
        return this;
    }

    public CostCenter getCostCenter() {
        return this.costCenter;
    }

    public void setCostCenter(CostCenter costCenter) {
        this.costCenter = costCenter;
    }

    public Project costCenter(CostCenter costCenter) {
        this.setCostCenter(costCenter);
        return this;
    }

    public AccountNumber getAccountNumber() {
        return this.accountNumber;
    }

    public void setAccountNumber(AccountNumber accountNumber) {
        this.accountNumber = accountNumber;
    }

    public Project accountNumber(AccountNumber accountNumber) {
        this.setAccountNumber(accountNumber);
        return this;
    }

    public ProjectOwner getProjectOwner() {
        return this.projectOwner;
    }

    public void setProjectOwner(ProjectOwner projectOwner) {
        this.projectOwner = projectOwner;
    }

    public Project projectOwner(ProjectOwner projectOwner) {
        this.setProjectOwner(projectOwner);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Project)) {
            return false;
        }
        return id != null && id.equals(((Project) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Project{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", title='" + getTitle() + "'" +
            ", fiscalYear='" + getFiscalYear() + "'" +
            ", budget=" + getBudget() +
            ", createdDate='" + getCreatedDate() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", deploymentDate='" + getDeploymentDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", description='" + getDescription() + "'" +
            ", poNumber='" + getPoNumber() + "'" +
            ", jiraCode='" + getJiraCode() + "'" +
            ", jiraUpdate='" + getJiraUpdate() + "'" +
            ", projectStatus='" + getProjectStatus() + "'" +
            ", projectFinancialStatus='" + getProjectFinancialStatus() + "'" +
            "}";
    }
}
