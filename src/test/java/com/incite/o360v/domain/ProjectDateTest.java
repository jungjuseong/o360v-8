package com.incite.o360v.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.incite.o360v.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProjectDateTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProjectDate.class);
        ProjectDate projectDate1 = new ProjectDate();
        projectDate1.setId(1L);
        ProjectDate projectDate2 = new ProjectDate();
        projectDate2.setId(projectDate1.getId());
        assertThat(projectDate1).isEqualTo(projectDate2);
        projectDate2.setId(2L);
        assertThat(projectDate1).isNotEqualTo(projectDate2);
        projectDate1.setId(null);
        assertThat(projectDate1).isNotEqualTo(projectDate2);
    }
}
