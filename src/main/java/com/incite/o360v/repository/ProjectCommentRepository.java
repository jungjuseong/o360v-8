package com.incite.o360v.repository;

import com.incite.o360v.domain.ProjectComment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ProjectComment entity.
 */
@Repository
public interface ProjectCommentRepository extends JpaRepository<ProjectComment, Long> {
    @Query("select projectComment from ProjectComment projectComment where projectComment.user.login = ?#{principal.preferredUsername}")
    List<ProjectComment> findByUserIsCurrentUser();

    default Optional<ProjectComment> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ProjectComment> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ProjectComment> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select projectComment from ProjectComment projectComment left join fetch projectComment.user left join fetch projectComment.project",
        countQuery = "select count(projectComment) from ProjectComment projectComment"
    )
    Page<ProjectComment> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select projectComment from ProjectComment projectComment left join fetch projectComment.user left join fetch projectComment.project"
    )
    List<ProjectComment> findAllWithToOneRelationships();

    @Query(
        "select projectComment from ProjectComment projectComment left join fetch projectComment.user left join fetch projectComment.project where projectComment.id =:id"
    )
    Optional<ProjectComment> findOneWithToOneRelationships(@Param("id") Long id);
}
