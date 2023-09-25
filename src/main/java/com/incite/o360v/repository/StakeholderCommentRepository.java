package com.incite.o360v.repository;

import com.incite.o360v.domain.StakeholderComment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the StakeholderComment entity.
 */
@Repository
public interface StakeholderCommentRepository extends JpaRepository<StakeholderComment, Long> {
    @Query(
        "select stakeholderComment from StakeholderComment stakeholderComment where stakeholderComment.user.login = ?#{principal.preferredUsername}"
    )
    List<StakeholderComment> findByUserIsCurrentUser();

    default Optional<StakeholderComment> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<StakeholderComment> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<StakeholderComment> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select stakeholderComment from StakeholderComment stakeholderComment left join fetch stakeholderComment.user",
        countQuery = "select count(stakeholderComment) from StakeholderComment stakeholderComment"
    )
    Page<StakeholderComment> findAllWithToOneRelationships(Pageable pageable);

    @Query("select stakeholderComment from StakeholderComment stakeholderComment left join fetch stakeholderComment.user")
    List<StakeholderComment> findAllWithToOneRelationships();

    @Query(
        "select stakeholderComment from StakeholderComment stakeholderComment left join fetch stakeholderComment.user where stakeholderComment.id =:id"
    )
    Optional<StakeholderComment> findOneWithToOneRelationships(@Param("id") Long id);
}
