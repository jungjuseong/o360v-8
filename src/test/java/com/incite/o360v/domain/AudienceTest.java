package com.incite.o360v.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.incite.o360v.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AudienceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Audience.class);
        Audience audience1 = new Audience();
        audience1.setId(1L);
        Audience audience2 = new Audience();
        audience2.setId(audience1.getId());
        assertThat(audience1).isEqualTo(audience2);
        audience2.setId(2L);
        assertThat(audience1).isNotEqualTo(audience2);
        audience1.setId(null);
        assertThat(audience1).isNotEqualTo(audience2);
    }
}
