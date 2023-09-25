package com.incite.o360v.repository;

import com.incite.o360v.domain.Jira;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Jira entity.
 */
@SuppressWarnings("unused")
@Repository
public interface JiraRepository extends JpaRepository<Jira, Long> {}
