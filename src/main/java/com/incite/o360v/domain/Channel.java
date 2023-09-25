package com.incite.o360v.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.incite.o360v.domain.enumeration.ChannelType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Channel.
 */
@Entity
@Table(name = "channel")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Channel implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "channel_type")
    private ChannelType channelType;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "channel")
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

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "channels", "brand" }, allowSetters = true)
    private Audience audience;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Channel id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ChannelType getChannelType() {
        return this.channelType;
    }

    public Channel channelType(ChannelType channelType) {
        this.setChannelType(channelType);
        return this;
    }

    public void setChannelType(ChannelType channelType) {
        this.channelType = channelType;
    }

    public Set<Project> getProjects() {
        return this.projects;
    }

    public void setProjects(Set<Project> projects) {
        if (this.projects != null) {
            this.projects.forEach(i -> i.setChannel(null));
        }
        if (projects != null) {
            projects.forEach(i -> i.setChannel(this));
        }
        this.projects = projects;
    }

    public Channel projects(Set<Project> projects) {
        this.setProjects(projects);
        return this;
    }

    public Channel addProject(Project project) {
        this.projects.add(project);
        project.setChannel(this);
        return this;
    }

    public Channel removeProject(Project project) {
        this.projects.remove(project);
        project.setChannel(null);
        return this;
    }

    public Audience getAudience() {
        return this.audience;
    }

    public void setAudience(Audience audience) {
        this.audience = audience;
    }

    public Channel audience(Audience audience) {
        this.setAudience(audience);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Channel)) {
            return false;
        }
        return id != null && id.equals(((Channel) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Channel{" +
            "id=" + getId() +
            ", channelType='" + getChannelType() + "'" +
            "}";
    }
}
