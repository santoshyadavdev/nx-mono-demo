package com.nxecom.api.controller;

import com.nxecom.api.dto.AddToCartRequest;
import com.nxecom.api.dto.CartResponse;
import com.nxecom.api.dto.UpdateCartItemRequest;
import com.nxecom.api.service.CartService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public CartResponse getCart(HttpSession session) {
        return cartService.getOrCreateCart(session.getId());
    }

    @PostMapping("/items")
    public CartResponse addItem(@RequestBody AddToCartRequest req, HttpSession session) {
        return cartService.addItem(session.getId(), req.getProductId(), req.getQuantity());
    }

    @PutMapping("/items/{itemId}")
    public CartResponse updateItem(@PathVariable String itemId,
                                   @RequestBody UpdateCartItemRequest req,
                                   HttpSession session) {
        return cartService.updateItem(session.getId(), itemId, req.getQuantity());
    }

    @DeleteMapping("/items/{itemId}")
    public CartResponse removeItem(@PathVariable String itemId, HttpSession session) {
        return cartService.removeItem(session.getId(), itemId);
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(HttpSession session) {
        cartService.clearCart(session.getId());
        return ResponseEntity.noContent().build();
    }
}
