package com.incite.o360v.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserGroupAccess.
 */
@Entity
@Table(name = "user_group_access")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserGroupAccess implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "brands" }, allowSetters = true)
    private Area area;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "audiences", "area" }, allowSetters = true)
    private Brand brand;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "channels", "brand" }, allowSetters = true)
    private Audience audience;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "projects", "audience" }, allowSetters = true)
    private Channel channel;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "projects" }, allowSetters = true)
    private Country country;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "userGroupAccesses", "users" }, allowSetters = true)
    private UserGroup userGroup;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserGroupAccess id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Area getArea() {
        return this.area;
    }

    public void setArea(Area area) {
        this.area = area;
    }

    public UserGroupAccess area(Area area) {
        this.setArea(area);
        return this;
    }

    public Brand getBrand() {
        return this.brand;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public UserGroupAccess brand(Brand brand) {
        this.setBrand(brand);
        return this;
    }

    public Audience getAudience() {
        return this.audience;
    }

    public void setAudience(Audience audience) {
        this.audience = audience;
    }

    public UserGroupAccess audience(Audience audience) {
        this.setAudience(audience);
        return this;
    }

    public Channel getChannel() {
        return this.channel;
    }

    public void setChannel(Channel channel) {
        this.channel = channel;
    }

    public UserGroupAccess channel(Channel channel) {
        this.setChannel(channel);
        return this;
    }

    public Country getCountry() {
        return this.country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public UserGroupAccess country(Country country) {
        this.setCountry(country);
        return this;
    }

    public UserGroup getUserGroup() {
        return this.userGroup;
    }

    public void setUserGroup(UserGroup userGroup) {
        this.userGroup = userGroup;
    }

    public UserGroupAccess userGroup(UserGroup userGroup) {
        this.setUserGroup(userGroup);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserGroupAccess)) {
            return false;
        }
        return id != null && id.equals(((UserGroupAccess) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserGroupAccess{" +
            "id=" + getId() +
            "}";
    }
}
