package com.incite.o360v.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.incite.o360v.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProjectGoalTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProjectGoal.class);
        ProjectGoal projectGoal1 = new ProjectGoal();
        projectGoal1.setId(1L);
        ProjectGoal projectGoal2 = new ProjectGoal();
        projectGoal2.setId(projectGoal1.getId());
        assertThat(projectGoal1).isEqualTo(projectGoal2);
        projectGoal2.setId(2L);
        assertThat(projectGoal1).isNotEqualTo(projectGoal2);
        projectGoal1.setId(null);
        assertThat(projectGoal1).isNotEqualTo(projectGoal2);
    }
}
