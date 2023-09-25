package com.incite.o360v.repository;

import com.incite.o360v.domain.AccountNumber;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AccountNumber entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AccountNumberRepository extends JpaRepository<AccountNumber, Long> {}
