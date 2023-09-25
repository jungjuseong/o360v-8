package com.incite.o360v.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.incite.o360v.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProjectCommentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProjectComment.class);
        ProjectComment projectComment1 = new ProjectComment();
        projectComment1.setId(1L);
        ProjectComment projectComment2 = new ProjectComment();
        projectComment2.setId(projectComment1.getId());
        assertThat(projectComment1).isEqualTo(projectComment2);
        projectComment2.setId(2L);
        assertThat(projectComment1).isNotEqualTo(projectComment2);
        projectComment1.setId(null);
        assertThat(projectComment1).isNotEqualTo(projectComment2);
    }
}
