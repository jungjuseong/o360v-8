package com.incite.o360v.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.incite.o360v.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class JiraTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Jira.class);
        Jira jira1 = new Jira();
        jira1.setId(1L);
        Jira jira2 = new Jira();
        jira2.setId(jira1.getId());
        assertThat(jira1).isEqualTo(jira2);
        jira2.setId(2L);
        assertThat(jira1).isNotEqualTo(jira2);
        jira1.setId(null);
        assertThat(jira1).isNotEqualTo(jira2);
    }
}
