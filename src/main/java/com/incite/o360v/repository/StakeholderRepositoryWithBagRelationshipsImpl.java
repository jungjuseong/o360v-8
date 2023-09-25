package com.incite.o360v.repository;

import com.incite.o360v.domain.Stakeholder;
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
public class StakeholderRepositoryWithBagRelationshipsImpl implements StakeholderRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Stakeholder> fetchBagRelationships(Optional<Stakeholder> stakeholder) {
        return stakeholder.map(this::fetchUsers);
    }

    @Override
    public Page<Stakeholder> fetchBagRelationships(Page<Stakeholder> stakeholders) {
        return new PageImpl<>(
            fetchBagRelationships(stakeholders.getContent()),
            stakeholders.getPageable(),
            stakeholders.getTotalElements()
        );
    }

    @Override
    public List<Stakeholder> fetchBagRelationships(List<Stakeholder> stakeholders) {
        return Optional.of(stakeholders).map(this::fetchUsers).orElse(Collections.emptyList());
    }

    Stakeholder fetchUsers(Stakeholder result) {
        return entityManager
            .createQuery(
                "select stakeholder from Stakeholder stakeholder left join fetch stakeholder.users where stakeholder.id = :id",
                Stakeholder.class
            )
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<Stakeholder> fetchUsers(List<Stakeholder> stakeholders) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, stakeholders.size()).forEach(index -> order.put(stakeholders.get(index).getId(), index));
        List<Stakeholder> result = entityManager
            .createQuery(
                "select stakeholder from Stakeholder stakeholder left join fetch stakeholder.users where stakeholder in :stakeholders",
                Stakeholder.class
            )
            .setParameter("stakeholders", stakeholders)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
