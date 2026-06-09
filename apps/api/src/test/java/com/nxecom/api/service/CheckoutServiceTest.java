package com.nxecom.api.service;

import com.nxecom.api.dto.CheckoutRequest;
import com.nxecom.api.dto.OrderResponse;
import com.nxecom.api.entity.*;
import com.nxecom.api.repository.CartRepository;
import com.nxecom.api.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CheckoutServiceTest {

    @Mock CartRepository cartRepository;
    @Mock OrderRepository orderRepository;
    @Mock PaymentService paymentService;
    @Mock CartService cartService;

    @InjectMocks CheckoutService checkoutService;

    private Product product;
    private CartItem cartItem;
    private Cart cart;
    private CheckoutRequest request;

    @BeforeEach
    void setUp() {
        product = Product.builder()
                .id("p1").name("Widget").price(10.0)
                .imageUrl("").category("").inStock(true).rating(4.0)
                .build();
        cartItem = CartItem.builder().id("ci1").product(product).quantity(2).build();
        cart = Cart.builder().id("c1").sessionId("sess1")
                .items(new ArrayList<>(List.of(cartItem))).build();
        cartItem.setCart(cart);

        request = new CheckoutRequest();
        request.setName("Jane Doe");
        request.setAddress("123 Main St");
        request.setCity("Springfield");
        request.setZip("12345");
    }

    @Test
    void checkout_returnsOrderResponse_whenCartHasItems() {
        when(cartRepository.findBySessionId("sess1")).thenReturn(Optional.of(cart));
        when(paymentService.process(20.0)).thenReturn(PaymentService.PaymentResult.SUCCESS);
        Order saved = Order.builder().id("o1").sessionId("sess1")
                .status(Order.OrderStatus.CONFIRMED).total(20.0)
                .shippingName("Jane Doe").shippingAddress("123 Main St")
                .shippingCity("Springfield").shippingZip("12345")
                .createdAt(java.time.LocalDateTime.now()).items(new ArrayList<>()).build();
        when(orderRepository.save(any())).thenReturn(saved);

        OrderResponse result = checkoutService.checkout("sess1", request);

        assertThat(result.getId()).isEqualTo("o1");
        assertThat(result.getStatus()).isEqualTo("CONFIRMED");
        verify(cartService).clearCart("sess1");
    }

    @Test
    void checkout_throwsException_whenCartIsEmpty() {
        Cart emptyCart = Cart.builder().sessionId("sess1").items(new ArrayList<>()).build();
        when(cartRepository.findBySessionId("sess1")).thenReturn(Optional.of(emptyCart));

        assertThatThrownBy(() -> checkoutService.checkout("sess1", request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("empty");
    }

    @Test
    void checkout_throwsException_whenCartNotFound() {
        when(cartRepository.findBySessionId("sess1")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> checkoutService.checkout("sess1", request))
                .isInstanceOf(IllegalStateException.class);
    }
}
