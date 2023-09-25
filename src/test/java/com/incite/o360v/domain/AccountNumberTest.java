package com.incite.o360v.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.incite.o360v.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AccountNumberTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AccountNumber.class);
        AccountNumber accountNumber1 = new AccountNumber();
        accountNumber1.setId(1L);
        AccountNumber accountNumber2 = new AccountNumber();
        accountNumber2.setId(accountNumber1.getId());
        assertThat(accountNumber1).isEqualTo(accountNumber2);
        accountNumber2.setId(2L);
        assertThat(accountNumber1).isNotEqualTo(accountNumber2);
        accountNumber1.setId(null);
        assertThat(accountNumber1).isNotEqualTo(accountNumber2);
    }
}
