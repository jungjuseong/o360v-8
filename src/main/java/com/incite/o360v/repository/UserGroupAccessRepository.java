package com.incite.o360v.repository;

import com.incite.o360v.domain.UserGroupAccess;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the UserGroupAccess entity.
 */
@Repository
public interface UserGroupAccessRepository extends JpaRepository<UserGroupAccess, Long> {
    default Optional<UserGroupAccess> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<UserGroupAccess> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<UserGroupAccess> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select userGroupAccess from UserGroupAccess userGroupAccess left join fetch userGroupAccess.area left join fetch userGroupAccess.brand left join fetch userGroupAccess.country left join fetch userGroupAccess.userGroup",
        countQuery = "select count(userGroupAccess) from UserGroupAccess userGroupAccess"
    )
    Page<UserGroupAccess> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select userGroupAccess from UserGroupAccess userGroupAccess left join fetch userGroupAccess.area left join fetch userGroupAccess.brand left join fetch userGroupAccess.country left join fetch userGroupAccess.userGroup"
    )
    List<UserGroupAccess> findAllWithToOneRelationships();

    @Query(
        "select userGroupAccess from UserGroupAccess userGroupAccess left join fetch userGroupAccess.area left join fetch userGroupAccess.brand left join fetch userGroupAccess.country left join fetch userGroupAccess.userGroup where userGroupAccess.id =:id"
    )
    Optional<UserGroupAccess> findOneWithToOneRelationships(@Param("id") Long id);
}
