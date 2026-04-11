package com.nxecom.api.service;

import com.nxecom.api.dto.CartResponse;
import com.nxecom.api.entity.Cart;
import com.nxecom.api.entity.CartItem;
import com.nxecom.api.entity.Product;
import com.nxecom.api.repository.CartItemRepository;
import com.nxecom.api.repository.CartRepository;
import com.nxecom.api.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Transactional
    public CartResponse getOrCreateCart(String sessionId) {
        Cart cart = cartRepository.findBySessionId(sessionId)
                .orElseGet(() -> cartRepository.save(
                        Cart.builder().sessionId(sessionId).build()));
        return CartResponse.from(cart);
    }

    @Transactional
    public CartResponse addItem(String sessionId, String productId, int quantity) {
        Cart cart = cartRepository.findBySessionId(sessionId)
                .orElseGet(() -> cartRepository.save(
                        Cart.builder().sessionId(sessionId).build()));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .ifPresentOrElse(
                        existing -> existing.setQuantity(existing.getQuantity() + quantity),
                        () -> cart.getItems().add(
                                CartItem.builder().cart(cart).product(product).quantity(quantity).build())
                );

        return CartResponse.from(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse updateItem(String sessionId, String itemId, int quantity) {
        Cart cart = cartRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Cart not found for session: " + sessionId));

        cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .ifPresent(item -> {
                    if (quantity <= 0) {
                        cart.getItems().remove(item);
                        cartItemRepository.delete(item);
                    } else {
                        item.setQuantity(quantity);
                    }
                });

        return CartResponse.from(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse removeItem(String sessionId, String itemId) {
        Cart cart = cartRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Cart not found for session: " + sessionId));

        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        cartItemRepository.deleteById(itemId);
        return CartResponse.from(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(String sessionId) {
        cartRepository.findBySessionId(sessionId).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepository.save(cart);
        });
    }
}
