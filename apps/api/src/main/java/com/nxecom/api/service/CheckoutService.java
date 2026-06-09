package com.nxecom.api.service;

import com.nxecom.api.dto.CheckoutRequest;
import com.nxecom.api.dto.OrderResponse;
import com.nxecom.api.entity.Cart;
import com.nxecom.api.entity.Order;
import com.nxecom.api.entity.OrderItem;
import com.nxecom.api.repository.CartRepository;
import com.nxecom.api.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CheckoutService {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final PaymentService paymentService;
    private final CartService cartService;

    @Transactional
    public OrderResponse checkout(String sessionId, CheckoutRequest req) {
        Cart cart = cartRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new IllegalStateException("Cart not found for session: " + sessionId));

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot checkout with an empty cart");
        }

        double total = cart.getItems().stream()
                .mapToDouble(i -> i.getProduct().getPrice() * i.getQuantity())
                .sum();

        PaymentService.PaymentResult result = paymentService.process(total);
        if (result != PaymentService.PaymentResult.SUCCESS) {
            throw new RuntimeException("Payment failed");
        }

        Order order = Order.builder()
                .sessionId(sessionId)
                .status(Order.OrderStatus.CONFIRMED)
                .total(total)
                .shippingName(req.getName())
                .shippingAddress(req.getAddress())
                .shippingCity(req.getCity())
                .shippingZip(req.getZip())
                .createdAt(LocalDateTime.now())
                .items(new ArrayList<>())
                .build();

        cart.getItems().forEach(cartItem -> {
            OrderItem oi = OrderItem.builder()
                    .order(order)
                    .productId(cartItem.getProduct().getId())
                    .productName(cartItem.getProduct().getName())
                    .price(cartItem.getProduct().getPrice())
                    .quantity(cartItem.getQuantity())
                    .subtotal(cartItem.getProduct().getPrice() * cartItem.getQuantity())
                    .build();
            order.getItems().add(oi);
        });

        Order saved = orderRepository.save(order);
        cartService.clearCart(sessionId);
        return OrderResponse.from(saved);
    }
}
