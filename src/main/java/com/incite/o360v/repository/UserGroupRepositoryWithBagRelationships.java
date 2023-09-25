package com.incite.o360v.repository;

import com.incite.o360v.domain.UserGroup;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface UserGroupRepositoryWithBagRelationships {
    Optional<UserGroup> fetchBagRelationships(Optional<UserGroup> userGroup);

    List<UserGroup> fetchBagRelationships(List<UserGroup> userGroups);

    Page<UserGroup> fetchBagRelationships(Page<UserGroup> userGroups);
}
