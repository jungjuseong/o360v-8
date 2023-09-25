package com.incite.o360v.repository;

import com.incite.o360v.domain.UserGroup;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class UserGroupRepositoryWithBagRelationshipsImpl implements UserGroupRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<UserGroup> fetchBagRelationships(Optional<UserGroup> userGroup) {
        return userGroup.map(this::fetchUsers);
    }

    @Override
    public Page<UserGroup> fetchBagRelationships(Page<UserGroup> userGroups) {
        return new PageImpl<>(fetchBagRelationships(userGroups.getContent()), userGroups.getPageable(), userGroups.getTotalElements());
    }

    @Override
    public List<UserGroup> fetchBagRelationships(List<UserGroup> userGroups) {
        return Optional.of(userGroups).map(this::fetchUsers).orElse(Collections.emptyList());
    }

    UserGroup fetchUsers(UserGroup result) {
        return entityManager
            .createQuery(
                "select userGroup from UserGroup userGroup left join fetch userGroup.users where userGroup.id = :id",
                UserGroup.class
            )
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<UserGroup> fetchUsers(List<UserGroup> userGroups) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, userGroups.size()).forEach(index -> order.put(userGroups.get(index).getId(), index));
        List<UserGroup> result = entityManager
            .createQuery(
                "select userGroup from UserGroup userGroup left join fetch userGroup.users where userGroup in :userGroups",
                UserGroup.class
            )
            .setParameter("userGroups", userGroups)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
