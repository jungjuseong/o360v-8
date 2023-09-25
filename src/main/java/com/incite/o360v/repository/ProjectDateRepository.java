package com.incite.o360v.repository;

import com.incite.o360v.domain.ProjectDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ProjectDate entity.
 */
@Repository
public interface ProjectDateRepository extends JpaRepository<ProjectDate, Long> {
    default Optional<ProjectDate> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ProjectDate> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ProjectDate> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select projectDate from ProjectDate projectDate left join fetch projectDate.project",
        countQuery = "select count(projectDate) from ProjectDate projectDate"
    )
    Page<ProjectDate> findAllWithToOneRelationships(Pageable pageable);

    @Query("select projectDate from ProjectDate projectDate left join fetch projectDate.project")
    List<ProjectDate> findAllWithToOneRelationships();

    @Query("select projectDate from ProjectDate projectDate left join fetch projectDate.project where projectDate.id =:id")
    Optional<ProjectDate> findOneWithToOneRelationships(@Param("id") Long id);
}
