package com.nxecom.api.dto;

import com.nxecom.api.entity.Cart;
import com.nxecom.api.entity.CartItem;
import lombok.Data;

import java.util.List;

@Data
public class CartResponse {
    private String id;
    private String sessionId;
    private List<CartItemResponse> items;
    private Double total;

    @Data
    public static class CartItemResponse {
        private String id;
        private ProductResponse product;
        private Integer quantity;
        private Double subtotal;
    }

    @Data
    public static class ProductResponse {
        private String id;
        private String name;
        private Double price;
        private String imageUrl;
        private String category;
        private Boolean inStock;
        private Double rating;
    }

    public static CartResponse from(Cart cart) {
        CartResponse res = new CartResponse();
        res.setId(cart.getId());
        res.setSessionId(cart.getSessionId());

        List<CartItemResponse> itemResponses = cart.getItems().stream().map(item -> {
            CartItemResponse ir = new CartItemResponse();
            ir.setId(item.getId());
            ir.setQuantity(item.getQuantity());
            ir.setSubtotal(item.getProduct().getPrice() * item.getQuantity());

            ProductResponse pr = new ProductResponse();
            pr.setId(item.getProduct().getId());
            pr.setName(item.getProduct().getName());
            pr.setPrice(item.getProduct().getPrice());
            pr.setImageUrl(item.getProduct().getImageUrl());
            pr.setCategory(item.getProduct().getCategory());
            pr.setInStock(item.getProduct().getInStock());
            pr.setRating(item.getProduct().getRating());
            ir.setProduct(pr);
            return ir;
        }).toList();

        res.setItems(itemResponses);
        res.setTotal(itemResponses.stream().mapToDouble(CartItemResponse::getSubtotal).sum());
        return res;
    }
}
