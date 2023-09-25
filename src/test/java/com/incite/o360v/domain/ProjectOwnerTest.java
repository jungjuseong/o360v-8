package com.incite.o360v.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.incite.o360v.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProjectOwnerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProjectOwner.class);
        ProjectOwner projectOwner1 = new ProjectOwner();
        projectOwner1.setId(1L);
        ProjectOwner projectOwner2 = new ProjectOwner();
        projectOwner2.setId(projectOwner1.getId());
        assertThat(projectOwner1).isEqualTo(projectOwner2);
        projectOwner2.setId(2L);
        assertThat(projectOwner1).isNotEqualTo(projectOwner2);
        projectOwner1.setId(null);
        assertThat(projectOwner1).isNotEqualTo(projectOwner2);
    }
}
