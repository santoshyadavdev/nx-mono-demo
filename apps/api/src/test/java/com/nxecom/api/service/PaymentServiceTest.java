package com.nxecom.api.service;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class PaymentServiceTest {

    private final PaymentService paymentService = new PaymentService();

    @Test
    void process_alwaysReturnsSuccess() {
        PaymentService.PaymentResult result = paymentService.process(99.99);
        assertThat(result).isEqualTo(PaymentService.PaymentResult.SUCCESS);
    }
}
