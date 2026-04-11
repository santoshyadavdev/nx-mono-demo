package com.nxecom.api.dto;

import lombok.Data;

@Data
public class AddToCartRequest {
    private String productId;
    private Integer quantity;
}
