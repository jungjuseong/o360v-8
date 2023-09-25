package com.incite.o360v.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.incite.o360v.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UserGroupAccessTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserGroupAccess.class);
        UserGroupAccess userGroupAccess1 = new UserGroupAccess();
        userGroupAccess1.setId(1L);
        UserGroupAccess userGroupAccess2 = new UserGroupAccess();
        userGroupAccess2.setId(userGroupAccess1.getId());
        assertThat(userGroupAccess1).isEqualTo(userGroupAccess2);
        userGroupAccess2.setId(2L);
        assertThat(userGroupAccess1).isNotEqualTo(userGroupAccess2);
        userGroupAccess1.setId(null);
        assertThat(userGroupAccess1).isNotEqualTo(userGroupAccess2);
    }
}
