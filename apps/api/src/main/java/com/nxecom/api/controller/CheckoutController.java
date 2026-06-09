package com.nxecom.api.controller;

import com.nxecom.api.dto.CheckoutRequest;
import com.nxecom.api.dto.OrderResponse;
import com.nxecom.api.service.CheckoutService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse checkout(@Valid @RequestBody CheckoutRequest request,
                                  HttpSession session) {
        return checkoutService.checkout(session.getId(), request);
    }
}
