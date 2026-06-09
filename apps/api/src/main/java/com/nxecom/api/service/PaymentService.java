package com.nxecom.api.service;

import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    public enum PaymentResult {
        SUCCESS, FAILED
    }

    /**
     * Dummy payment processor. Always succeeds.
     * Replace this with a real gateway (e.g. Stripe) in production.
     */
    public PaymentResult process(double amount) {
        return PaymentResult.SUCCESS;
    }
}
