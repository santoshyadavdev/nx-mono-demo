package com.nxecom.api.config;

import com.nxecom.api.entity.Product;
import com.nxecom.api.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) return;

        List<Product> products = List.of(
            Product.builder()
                .name("Wireless Headphones")
                .description("Premium noise-cancelling wireless headphones with 30-hour battery life and crystal-clear audio.")
                .price(149.99).imageUrl("https://picsum.photos/seed/headphones/400/300")
                .category("Electronics").inStock(true).rating(4.5).build(),
            Product.builder()
                .name("Running Shoes")
                .description("Lightweight and responsive running shoes with advanced cushioning for all-day comfort.")
                .price(89.99).imageUrl("https://picsum.photos/seed/shoes/400/300")
                .category("Footwear").inStock(true).rating(4.7).build(),
            Product.builder()
                .name("Mechanical Keyboard")
                .description("Compact TKL mechanical keyboard with Cherry MX switches and RGB backlight.")
                .price(119.99).imageUrl("https://picsum.photos/seed/keyboard/400/300")
                .category("Electronics").inStock(true).rating(4.8).build(),
            Product.builder()
                .name("Leather Backpack")
                .description("Genuine leather backpack with laptop compartment, perfect for work or travel.")
                .price(199.99).imageUrl("https://picsum.photos/seed/backpack/400/300")
                .category("Bags").inStock(false).rating(4.3).build(),
            Product.builder()
                .name("Smart Watch")
                .description("Feature-packed smartwatch with health tracking, GPS, and 7-day battery life.")
                .price(249.99).imageUrl("https://picsum.photos/seed/watch/400/300")
                .category("Electronics").inStock(true).rating(4.6).build(),
            Product.builder()
                .name("Yoga Mat")
                .description("Eco-friendly non-slip yoga mat with alignment lines and carrying strap.")
                .price(39.99).imageUrl("https://picsum.photos/seed/yogamat/400/300")
                .category("Sports").inStock(true).rating(4.4).build(),
            Product.builder()
                .name("Coffee Maker")
                .description("Programmable 12-cup coffee maker with built-in grinder and thermal carafe.")
                .price(79.99).imageUrl("https://picsum.photos/seed/coffee/400/300")
                .category("Kitchen").inStock(true).rating(4.2).build(),
            Product.builder()
                .name("Sunglasses")
                .description("Polarised UV400 sunglasses with lightweight titanium frame.")
                .price(59.99).imageUrl("https://picsum.photos/seed/sunglasses/400/300")
                .category("Accessories").inStock(true).rating(4.1).build()
        );

        productRepository.saveAll(products);
        log.info("Seeded {} products into H2 database", products.size());
    }
}
