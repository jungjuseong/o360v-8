package com.incite.o360v.repository;

import com.incite.o360v.domain.JiraSetUp;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the JiraSetUp entity.
 */
@SuppressWarnings("unused")
@Repository
public interface JiraSetUpRepository extends JpaRepository<JiraSetUp, Long> {}
