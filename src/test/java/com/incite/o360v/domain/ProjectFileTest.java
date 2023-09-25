package com.incite.o360v.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.incite.o360v.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProjectFileTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProjectFile.class);
        ProjectFile projectFile1 = new ProjectFile();
        projectFile1.setId(1L);
        ProjectFile projectFile2 = new ProjectFile();
        projectFile2.setId(projectFile1.getId());
        assertThat(projectFile1).isEqualTo(projectFile2);
        projectFile2.setId(2L);
        assertThat(projectFile1).isNotEqualTo(projectFile2);
        projectFile1.setId(null);
        assertThat(projectFile1).isNotEqualTo(projectFile2);
    }
}
