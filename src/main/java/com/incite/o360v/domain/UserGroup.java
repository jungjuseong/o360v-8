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
 * A UserGroup.
 */
@Entity
@Table(name = "user_group")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserGroup implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "userGroup")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "area", "brand", "audience", "channel", "country", "userGroup" }, allowSetters = true)
    private Set<UserGroupAccess> userGroupAccesses = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @NotNull
    @JoinTable(
        name = "rel_user_group__user",
        joinColumns = @JoinColumn(name = "user_group_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<User> users = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserGroup id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public UserGroup name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<UserGroupAccess> getUserGroupAccesses() {
        return this.userGroupAccesses;
    }

    public void setUserGroupAccesses(Set<UserGroupAccess> userGroupAccesses) {
        if (this.userGroupAccesses != null) {
            this.userGroupAccesses.forEach(i -> i.setUserGroup(null));
        }
        if (userGroupAccesses != null) {
            userGroupAccesses.forEach(i -> i.setUserGroup(this));
        }
        this.userGroupAccesses = userGroupAccesses;
    }

    public UserGroup userGroupAccesses(Set<UserGroupAccess> userGroupAccesses) {
        this.setUserGroupAccesses(userGroupAccesses);
        return this;
    }

    public UserGroup addUserGroupAccess(UserGroupAccess userGroupAccess) {
        this.userGroupAccesses.add(userGroupAccess);
        userGroupAccess.setUserGroup(this);
        return this;
    }

    public UserGroup removeUserGroupAccess(UserGroupAccess userGroupAccess) {
        this.userGroupAccesses.remove(userGroupAccess);
        userGroupAccess.setUserGroup(null);
        return this;
    }

    public Set<User> getUsers() {
        return this.users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public UserGroup users(Set<User> users) {
        this.setUsers(users);
        return this;
    }

    public UserGroup addUser(User user) {
        this.users.add(user);
        return this;
    }

    public UserGroup removeUser(User user) {
        this.users.remove(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserGroup)) {
            return false;
        }
        return id != null && id.equals(((UserGroup) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserGroup{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
