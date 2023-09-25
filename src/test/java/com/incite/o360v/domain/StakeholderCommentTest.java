package com.incite.o360v.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.incite.o360v.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class StakeholderCommentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(StakeholderComment.class);
        StakeholderComment stakeholderComment1 = new StakeholderComment();
        stakeholderComment1.setId(1L);
        StakeholderComment stakeholderComment2 = new StakeholderComment();
        stakeholderComment2.setId(stakeholderComment1.getId());
        assertThat(stakeholderComment1).isEqualTo(stakeholderComment2);
        stakeholderComment2.setId(2L);
        assertThat(stakeholderComment1).isNotEqualTo(stakeholderComment2);
        stakeholderComment1.setId(null);
        assertThat(stakeholderComment1).isNotEqualTo(stakeholderComment2);
    }
}
