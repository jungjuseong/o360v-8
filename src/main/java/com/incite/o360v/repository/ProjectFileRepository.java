package com.incite.o360v.repository;

import com.incite.o360v.domain.ProjectFile;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ProjectFile entity.
 */
@Repository
public interface ProjectFileRepository extends JpaRepository<ProjectFile, Long> {
    default Optional<ProjectFile> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ProjectFile> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ProjectFile> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select projectFile from ProjectFile projectFile left join fetch projectFile.project",
        countQuery = "select count(projectFile) from ProjectFile projectFile"
    )
    Page<ProjectFile> findAllWithToOneRelationships(Pageable pageable);

    @Query("select projectFile from ProjectFile projectFile left join fetch projectFile.project")
    List<ProjectFile> findAllWithToOneRelationships();

    @Query("select projectFile from ProjectFile projectFile left join fetch projectFile.project where projectFile.id =:id")
    Optional<ProjectFile> findOneWithToOneRelationships(@Param("id") Long id);
}
