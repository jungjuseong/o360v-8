package com.incite.o360v.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.incite.o360v.domain.enumeration.StakeholderType;
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
 * A Stakeholder.
 */
@Entity
@Table(name = "stakeholder")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Stakeholder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "created_date", nullable = false)
    private LocalDate createdDate;

    @Column(name = "cost", precision = 21, scale = 2)
    private BigDecimal cost;

    @Enumerated(EnumType.STRING)
    @Column(name = "stakeholder_type")
    private StakeholderType stakeholderType;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "stakeholder")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "stakeholder" }, allowSetters = true)
    private Set<StakeholderComment> stakeholderComments = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @NotNull
    @JoinTable(
        name = "rel_stakeholder__user",
        joinColumns = @JoinColumn(name = "stakeholder_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<User> users = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
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
    private Project project;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Stakeholder id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getCreatedDate() {
        return this.createdDate;
    }

    public Stakeholder createdDate(LocalDate createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public BigDecimal getCost() {
        return this.cost;
    }

    public Stakeholder cost(BigDecimal cost) {
        this.setCost(cost);
        return this;
    }

    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }

    public StakeholderType getStakeholderType() {
        return this.stakeholderType;
    }

    public Stakeholder stakeholderType(StakeholderType stakeholderType) {
        this.setStakeholderType(stakeholderType);
        return this;
    }

    public void setStakeholderType(StakeholderType stakeholderType) {
        this.stakeholderType = stakeholderType;
    }

    public Set<StakeholderComment> getStakeholderComments() {
        return this.stakeholderComments;
    }

    public void setStakeholderComments(Set<StakeholderComment> stakeholderComments) {
        if (this.stakeholderComments != null) {
            this.stakeholderComments.forEach(i -> i.setStakeholder(null));
        }
        if (stakeholderComments != null) {
            stakeholderComments.forEach(i -> i.setStakeholder(this));
        }
        this.stakeholderComments = stakeholderComments;
    }

    public Stakeholder stakeholderComments(Set<StakeholderComment> stakeholderComments) {
        this.setStakeholderComments(stakeholderComments);
        return this;
    }

    public Stakeholder addStakeholderComment(StakeholderComment stakeholderComment) {
        this.stakeholderComments.add(stakeholderComment);
        stakeholderComment.setStakeholder(this);
        return this;
    }

    public Stakeholder removeStakeholderComment(StakeholderComment stakeholderComment) {
        this.stakeholderComments.remove(stakeholderComment);
        stakeholderComment.setStakeholder(null);
        return this;
    }

    public Set<User> getUsers() {
        return this.users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public Stakeholder users(Set<User> users) {
        this.setUsers(users);
        return this;
    }

    public Stakeholder addUser(User user) {
        this.users.add(user);
        return this;
    }

    public Stakeholder removeUser(User user) {
        this.users.remove(user);
        return this;
    }

    public Project getProject() {
        return this.project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Stakeholder project(Project project) {
        this.setProject(project);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Stakeholder)) {
            return false;
        }
        return id != null && id.equals(((Stakeholder) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Stakeholder{" +
            "id=" + getId() +
            ", createdDate='" + getCreatedDate() + "'" +
            ", cost=" + getCost() +
            ", stakeholderType='" + getStakeholderType() + "'" +
            "}";
    }
}
