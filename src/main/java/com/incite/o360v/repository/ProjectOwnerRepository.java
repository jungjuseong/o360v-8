package com.incite.o360v.repository;

import com.incite.o360v.domain.ProjectOwner;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ProjectOwner entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProjectOwnerRepository extends JpaRepository<ProjectOwner, Long> {}
