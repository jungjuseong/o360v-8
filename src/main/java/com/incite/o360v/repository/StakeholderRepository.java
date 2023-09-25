package com.incite.o360v.repository;

import com.incite.o360v.domain.Stakeholder;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Stakeholder entity.
 *
 * When extending this class, extend StakeholderRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface StakeholderRepository extends StakeholderRepositoryWithBagRelationships, JpaRepository<Stakeholder, Long> {
    default Optional<Stakeholder> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Stakeholder> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Stakeholder> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    @Query(
        value = "select stakeholder from Stakeholder stakeholder left join fetch stakeholder.project",
        countQuery = "select count(stakeholder) from Stakeholder stakeholder"
    )
    Page<Stakeholder> findAllWithToOneRelationships(Pageable pageable);

    @Query("select stakeholder from Stakeholder stakeholder left join fetch stakeholder.project")
    List<Stakeholder> findAllWithToOneRelationships();

    @Query("select stakeholder from Stakeholder stakeholder left join fetch stakeholder.project where stakeholder.id =:id")
    Optional<Stakeholder> findOneWithToOneRelationships(@Param("id") Long id);
}
