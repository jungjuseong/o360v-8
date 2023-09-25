package com.incite.o360v.repository;

import com.incite.o360v.domain.Audience;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Audience entity.
 */
@Repository
public interface AudienceRepository extends JpaRepository<Audience, Long> {
    default Optional<Audience> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Audience> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Audience> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select audience from Audience audience left join fetch audience.brand",
        countQuery = "select count(audience) from Audience audience"
    )
    Page<Audience> findAllWithToOneRelationships(Pageable pageable);

    @Query("select audience from Audience audience left join fetch audience.brand")
    List<Audience> findAllWithToOneRelationships();

    @Query("select audience from Audience audience left join fetch audience.brand where audience.id =:id")
    Optional<Audience> findOneWithToOneRelationships(@Param("id") Long id);
}
