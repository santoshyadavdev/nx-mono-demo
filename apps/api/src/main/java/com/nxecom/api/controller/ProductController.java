package com.nxecom.api.controller;

import com.nxecom.api.entity.Product;
import com.nxecom.api.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<Product> getAll(@RequestParam(required = false) String category) {
        return category != null
                ? productService.getByCategory(category)
                : productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable String id) {
        return productService.getProduct(id);
    }
}
