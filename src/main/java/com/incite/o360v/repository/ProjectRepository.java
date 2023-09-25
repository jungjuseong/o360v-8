package com.incite.o360v.repository;

import com.incite.o360v.domain.Project;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Project entity.
 *
 * When extending this class, extend ProjectRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface ProjectRepository extends ProjectRepositoryWithBagRelationships, JpaRepository<Project, Long> {
    default Optional<Project> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Project> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Project> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    @Query(
        value = "select project from Project project left join fetch project.parentProject left join fetch project.goal left join fetch project.costCenter left join fetch project.accountNumber left join fetch project.projectOwner",
        countQuery = "select count(project) from Project project"
    )
    Page<Project> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select project from Project project left join fetch project.parentProject left join fetch project.goal left join fetch project.costCenter left join fetch project.accountNumber left join fetch project.projectOwner"
    )
    List<Project> findAllWithToOneRelationships();

    @Query(
        "select project from Project project left join fetch project.parentProject left join fetch project.goal left join fetch project.costCenter left join fetch project.accountNumber left join fetch project.projectOwner where project.id =:id"
    )
    Optional<Project> findOneWithToOneRelationships(@Param("id") Long id);
}
