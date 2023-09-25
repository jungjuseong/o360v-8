package com.incite.o360v.repository;

import com.incite.o360v.domain.Stakeholder;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface StakeholderRepositoryWithBagRelationships {
    Optional<Stakeholder> fetchBagRelationships(Optional<Stakeholder> stakeholder);

    List<Stakeholder> fetchBagRelationships(List<Stakeholder> stakeholders);

    Page<Stakeholder> fetchBagRelationships(Page<Stakeholder> stakeholders);
}
