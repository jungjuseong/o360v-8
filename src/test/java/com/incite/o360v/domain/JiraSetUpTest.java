package com.incite.o360v.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.incite.o360v.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class JiraSetUpTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(JiraSetUp.class);
        JiraSetUp jiraSetUp1 = new JiraSetUp();
        jiraSetUp1.setId(1L);
        JiraSetUp jiraSetUp2 = new JiraSetUp();
        jiraSetUp2.setId(jiraSetUp1.getId());
        assertThat(jiraSetUp1).isEqualTo(jiraSetUp2);
        jiraSetUp2.setId(2L);
        assertThat(jiraSetUp1).isNotEqualTo(jiraSetUp2);
        jiraSetUp1.setId(null);
        assertThat(jiraSetUp1).isNotEqualTo(jiraSetUp2);
    }
}
