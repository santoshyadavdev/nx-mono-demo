package com.nxecom.api.dto;

import com.nxecom.api.entity.Order;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private String id;
    private String status;
    private Double total;
    private String shippingName;
    private String shippingAddress;
    private String shippingCity;
    private String shippingZip;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;

    @Data
    public static class OrderItemResponse {
        private String id;
        private String productId;
        private String productName;
        private Double price;
        private Integer quantity;
        private Double subtotal;
    }

    public static OrderResponse from(Order order) {
        OrderResponse res = new OrderResponse();
        res.setId(order.getId());
        res.setStatus(order.getStatus().name());
        res.setTotal(order.getTotal());
        res.setShippingName(order.getShippingName());
        res.setShippingAddress(order.getShippingAddress());
        res.setShippingCity(order.getShippingCity());
        res.setShippingZip(order.getShippingZip());
        res.setCreatedAt(order.getCreatedAt());
        res.setItems(order.getItems().stream().map(item -> {
            OrderItemResponse ir = new OrderItemResponse();
            ir.setId(item.getId());
            ir.setProductId(item.getProductId());
            ir.setProductName(item.getProductName());
            ir.setPrice(item.getPrice());
            ir.setQuantity(item.getQuantity());
            ir.setSubtotal(item.getSubtotal());
            return ir;
        }).toList());
        return res;
    }
}
