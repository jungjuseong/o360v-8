package com.incite.o360v.repository;

import com.incite.o360v.domain.ProjectGoal;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ProjectGoal entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProjectGoalRepository extends JpaRepository<ProjectGoal, Long> {}
