package com.incite.o360v.repository;

import com.incite.o360v.domain.Project;
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
public class ProjectRepositoryWithBagRelationshipsImpl implements ProjectRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Project> fetchBagRelationships(Optional<Project> project) {
        return project.map(this::fetchCountries);
    }

    @Override
    public Page<Project> fetchBagRelationships(Page<Project> projects) {
        return new PageImpl<>(fetchBagRelationships(projects.getContent()), projects.getPageable(), projects.getTotalElements());
    }

    @Override
    public List<Project> fetchBagRelationships(List<Project> projects) {
        return Optional.of(projects).map(this::fetchCountries).orElse(Collections.emptyList());
    }

    Project fetchCountries(Project result) {
        return entityManager
            .createQuery("select project from Project project left join fetch project.countries where project.id = :id", Project.class)
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<Project> fetchCountries(List<Project> projects) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, projects.size()).forEach(index -> order.put(projects.get(index).getId(), index));
        List<Project> result = entityManager
            .createQuery("select project from Project project left join fetch project.countries where project in :projects", Project.class)
            .setParameter("projects", projects)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
