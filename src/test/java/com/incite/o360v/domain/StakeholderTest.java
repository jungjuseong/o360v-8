package com.incite.o360v.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.incite.o360v.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class StakeholderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Stakeholder.class);
        Stakeholder stakeholder1 = new Stakeholder();
        stakeholder1.setId(1L);
        Stakeholder stakeholder2 = new Stakeholder();
        stakeholder2.setId(stakeholder1.getId());
        assertThat(stakeholder1).isEqualTo(stakeholder2);
        stakeholder2.setId(2L);
        assertThat(stakeholder1).isNotEqualTo(stakeholder2);
        stakeholder1.setId(null);
        assertThat(stakeholder1).isNotEqualTo(stakeholder2);
    }
}
