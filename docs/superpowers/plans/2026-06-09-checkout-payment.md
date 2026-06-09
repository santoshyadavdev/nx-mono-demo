# Checkout & Payment Processing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a checkout flow where the user submits a shipping address, a dummy payment is processed, an Order is saved, the cart is cleared, and the user sees an order confirmation page.

**Architecture:** Single `POST /api/checkout` endpoint on the Spring Boot backend. `CheckoutService` validates the cart, calls a dummy `PaymentService` (always succeeds), persists `Order`/`OrderItem` entities, and clears the cart. The Angular frontend adds a `CheckoutPage` with a reactive address form and an `OrderConfirmationPage` that displays the result.

**Tech Stack:** Java 21, Spring Boot 3.5, Lombok, JPA/H2 (backend); Angular 17+ standalone components, ReactiveFormsModule, NgRx Store, `@nx-ecom-app/data-access` library (frontend).

---

## Backend Tasks

### Task 1: Order & OrderItem entities

**Files:**
- Create: `apps/api/src/main/java/com/nxecom/api/entity/Order.java`
- Create: `apps/api/src/main/java/com/nxecom/api/entity/OrderItem.java`

- [ ] **Step 1: Create `Order.java`**

```java
package com.nxecom.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String sessionId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Column(nullable = false)
    private Double total;

    @Column(nullable = false)
    private String shippingName;

    @Column(nullable = false)
    private String shippingAddress;

    @Column(nullable = false)
    private String shippingCity;

    @Column(nullable = false)
    private String shippingZip;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    public enum OrderStatus {
        CONFIRMED
    }
}
```

- [ ] **Step 2: Create `OrderItem.java`**

```java
package com.nxecom.api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @ToString.Exclude
    private Order order;

    @Column(nullable = false)
    private String productId;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double subtotal;
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/main/java/com/nxecom/api/entity/Order.java \
        apps/api/src/main/java/com/nxecom/api/entity/OrderItem.java
git commit -m "feat(api): add Order and OrderItem entities"
```

---

### Task 2: Repositories

**Files:**
- Create: `apps/api/src/main/java/com/nxecom/api/repository/OrderRepository.java`
- Create: `apps/api/src/main/java/com/nxecom/api/repository/OrderItemRepository.java`

- [ ] **Step 1: Create `OrderRepository.java`**

```java
package com.nxecom.api.repository;

import com.nxecom.api.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
}
```

- [ ] **Step 2: Create `OrderItemRepository.java`**

```java
package com.nxecom.api.repository;

import com.nxecom.api.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, String> {
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/main/java/com/nxecom/api/repository/OrderRepository.java \
        apps/api/src/main/java/com/nxecom/api/repository/OrderItemRepository.java
git commit -m "feat(api): add Order and OrderItem repositories"
```

---

### Task 3: DTOs

**Files:**
- Create: `apps/api/src/main/java/com/nxecom/api/dto/CheckoutRequest.java`
- Create: `apps/api/src/main/java/com/nxecom/api/dto/OrderResponse.java`

- [ ] **Step 1: Create `CheckoutRequest.java`**

```java
package com.nxecom.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CheckoutRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String address;

    @NotBlank
    private String city;

    @NotBlank
    private String zip;
}
```

- [ ] **Step 2: Create `OrderResponse.java`**

```java
package com.nxecom.api.dto;

import com.nxecom.api.entity.Order;
import com.nxecom.api.entity.OrderItem;
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
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/main/java/com/nxecom/api/dto/CheckoutRequest.java \
        apps/api/src/main/java/com/nxecom/api/dto/OrderResponse.java
git commit -m "feat(api): add CheckoutRequest and OrderResponse DTOs"
```

---

### Task 4: PaymentService (dummy)

**Files:**
- Create: `apps/api/src/main/java/com/nxecom/api/service/PaymentService.java`
- Create: `apps/api/src/test/java/com/nxecom/api/service/PaymentServiceTest.java`

- [ ] **Step 1: Write the failing test**

Create `apps/api/src/test/java/com/nxecom/api/service/PaymentServiceTest.java`:

```java
package com.nxecom.api.service;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class PaymentServiceTest {

    private final PaymentService paymentService = new PaymentService();

    @Test
    void process_alwaysReturnsSuccess() {
        PaymentService.PaymentResult result = paymentService.process(99.99);
        assertThat(result).isEqualTo(PaymentService.PaymentResult.SUCCESS);
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd apps/api && ./gradlew test --tests "com.nxecom.api.service.PaymentServiceTest" 2>&1 | tail -20
```

Expected: FAILED — `PaymentService` class not found.

- [ ] **Step 3: Create `PaymentService.java`**

```java
package com.nxecom.api.service;

import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    public enum PaymentResult {
        SUCCESS, FAILED
    }

    /**
     * Dummy payment processor. Always succeeds.
     * Replace this with a real gateway (e.g. Stripe) in production.
     */
    public PaymentResult process(double amount) {
        return PaymentResult.SUCCESS;
    }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd apps/api && ./gradlew test --tests "com.nxecom.api.service.PaymentServiceTest" 2>&1 | tail -20
```

Expected: BUILD SUCCESSFUL, 1 test passed.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/main/java/com/nxecom/api/service/PaymentService.java \
        apps/api/src/test/java/com/nxecom/api/service/PaymentServiceTest.java
git commit -m "feat(api): add dummy PaymentService"
```

---

### Task 5: CheckoutService

**Files:**
- Create: `apps/api/src/main/java/com/nxecom/api/service/CheckoutService.java`
- Create: `apps/api/src/test/java/com/nxecom/api/service/CheckoutServiceTest.java`

- [ ] **Step 1: Write failing tests**

Create `apps/api/src/test/java/com/nxecom/api/service/CheckoutServiceTest.java`:

```java
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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd apps/api && ./gradlew test --tests "com.nxecom.api.service.CheckoutServiceTest" 2>&1 | tail -20
```

Expected: FAILED — `CheckoutService` not found.

- [ ] **Step 3: Create `CheckoutService.java`**

```java
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd apps/api && ./gradlew test --tests "com.nxecom.api.service.CheckoutServiceTest" 2>&1 | tail -20
```

Expected: BUILD SUCCESSFUL, 3 tests passed.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/main/java/com/nxecom/api/service/CheckoutService.java \
        apps/api/src/test/java/com/nxecom/api/service/CheckoutServiceTest.java
git commit -m "feat(api): add CheckoutService with dummy payment"
```

---

### Task 6: CheckoutController + global exception handler

**Files:**
- Create: `apps/api/src/main/java/com/nxecom/api/controller/CheckoutController.java`
- Create: `apps/api/src/main/java/com/nxecom/api/config/GlobalExceptionHandler.java`

- [ ] **Step 1: Create `CheckoutController.java`**

```java
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
```

- [ ] **Step 2: Check if `GlobalExceptionHandler` already exists in `config/`**

Look in `apps/api/src/main/java/com/nxecom/api/config/`. If a `GlobalExceptionHandler.java` already exists, add the two new handler methods to it. Otherwise create it:

```java
package com.nxecom.api.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalState(IllegalStateException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handlePaymentFailed(RuntimeException ex) {
        if ("Payment failed".equals(ex.getMessage())) {
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                    .body(Map.of("error", ex.getMessage()));
        }
        return ResponseEntity.internalServerError().body(Map.of("error", ex.getMessage()));
    }
}
```

- [ ] **Step 3: Add `spring-boot-starter-validation` to `build.gradle`**

Open `apps/api/build.gradle` and add to the `dependencies` block:

```gradle
implementation 'org.springframework.boot:spring-boot-starter-validation'
```

- [ ] **Step 4: Build to verify compilation**

```bash
cd apps/api && ./gradlew build -x test 2>&1 | tail -20
```

Expected: `BUILD SUCCESSFUL`.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/main/java/com/nxecom/api/controller/CheckoutController.java \
        apps/api/src/main/java/com/nxecom/api/config/GlobalExceptionHandler.java \
        apps/api/build.gradle
git commit -m "feat(api): add CheckoutController and exception handler"
```

---

## Frontend Tasks

### Task 7: Update order model and add CheckoutService

**Files:**
- Modify: `libs/data-access/src/lib/models/order.model.ts`
- Create: `libs/data-access/src/lib/services/checkout.service.ts`
- Modify: `libs/data-access/src/index.ts`

- [ ] **Step 1: Update `order.model.ts`**

Replace the entire file content:

```typescript
import { CartItem } from './cart.model';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

export interface OrderItemResponse {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderResponse {
  id: string;
  status: string;
  total: number;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface CheckoutRequest {
  name: string;
  address: string;
  city: string;
  zip: string;
}
```

- [ ] **Step 2: Create `checkout.service.ts`**

```typescript
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckoutRequest, OrderResponse } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class CheckoutApiService {
  private http = inject(HttpClient);
  private base = '/api/checkout';

  placeOrder(request: CheckoutRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.base, request, {
      withCredentials: true,
    });
  }
}
```

- [ ] **Step 3: Export from `libs/data-access/src/index.ts`**

Add these two lines after the existing service exports:

```typescript
export * from './lib/services/checkout.service';
export * from './lib/models/order.model';
```

Note: `order.model` is already exported — just add the checkout service line:

```typescript
export * from './lib/services/checkout.service';
```

- [ ] **Step 4: Commit**

```bash
git add libs/data-access/src/lib/models/order.model.ts \
        libs/data-access/src/lib/services/checkout.service.ts \
        libs/data-access/src/index.ts
git commit -m "feat(data-access): add CheckoutApiService and OrderResponse model"
```

---

### Task 8: CheckoutPageComponent

**Files:**
- Create: `apps/store/src/app/pages/checkout/checkout.page.ts`

- [ ] **Step 1: Create `checkout.page.ts`**

```typescript
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CheckoutApiService, CheckoutRequest } from '@nx-ecom-app/data-access';
import { ButtonComponent } from '@nx-ecom-app/design-system';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ButtonComponent],
  template: `
    <div class="checkout-page">
      <h1>Checkout</h1>

      <form [formGroup]="form" (ngSubmit)="submit()" class="checkout-form">
        <h2>Shipping Address</h2>

        <div class="field">
          <label for="name">Full Name</label>
          <input id="name" formControlName="name" placeholder="Jane Doe" />
          <span class="error" *ngIf="form.get('name')?.invalid && form.get('name')?.touched">
            Name is required.
          </span>
        </div>

        <div class="field">
          <label for="address">Street Address</label>
          <input id="address" formControlName="address" placeholder="123 Main St" />
          <span class="error" *ngIf="form.get('address')?.invalid && form.get('address')?.touched">
            Address is required.
          </span>
        </div>

        <div class="field-row">
          <div class="field">
            <label for="city">City</label>
            <input id="city" formControlName="city" placeholder="Springfield" />
            <span class="error" *ngIf="form.get('city')?.invalid && form.get('city')?.touched">
              City is required.
            </span>
          </div>
          <div class="field">
            <label for="zip">ZIP Code</label>
            <input id="zip" formControlName="zip" placeholder="12345" />
            <span class="error" *ngIf="form.get('zip')?.invalid && form.get('zip')?.touched">
              ZIP is required.
            </span>
          </div>
        </div>

        <div class="error-banner" *ngIf="errorMessage()">
          {{ errorMessage() }}
        </div>

        <div class="actions">
          <ds-button variant="ghost" type="button" routerLink="/cart">Back to Cart</ds-button>
          <ds-button
            variant="primary"
            size="lg"
            type="submit"
            [disabled]="form.invalid || loading()">
            {{ loading() ? 'Processing...' : 'Place Order' }}
          </ds-button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .checkout-page { max-width: 600px; margin: 0 auto; padding: 2rem; }
    h1 { font-size: 2rem; font-weight: 800; margin-bottom: 2rem; }
    h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem; }
    .checkout-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .field { display: flex; flex-direction: column; gap: 0.25rem; }
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    label { font-weight: 600; font-size: 0.875rem; }
    input {
      padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem;
      font-size: 1rem; outline: none;
    }
    input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
    .error { color: #ef4444; font-size: 0.8rem; }
    .error-banner {
      background: #fee2e2; color: #b91c1c; padding: 0.75rem 1rem;
      border-radius: 0.5rem; font-size: 0.9rem;
    }
    .actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 0.5rem; }
  `],
})
export class CheckoutPageComponent {
  private fb = inject(FormBuilder);
  private checkoutService = inject(CheckoutApiService);
  private router = inject(Router);

  form = this.fb.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    zip: ['', Validators.required],
  });

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMessage.set(null);

    const request = this.form.value as CheckoutRequest;
    this.checkoutService.placeOrder(request).subscribe({
      next: (order) => {
        this.loading.set(false);
        this.router.navigate(['/order-confirmation'], { state: { order } });
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.error;
        if (err.status === 400) {
          this.errorMessage.set(msg ?? 'Your cart is empty. Please add items before checking out.');
        } else if (err.status === 402) {
          this.errorMessage.set('Payment failed. Please try again.');
        } else {
          this.errorMessage.set('Something went wrong. Please try again.');
        }
      },
    });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/store/src/app/pages/checkout/checkout.page.ts
git commit -m "feat(store): add CheckoutPageComponent"
```

---

### Task 9: OrderConfirmationPageComponent

**Files:**
- Create: `apps/store/src/app/pages/order-confirmation/order-confirmation.page.ts`

- [ ] **Step 1: Create `order-confirmation.page.ts`**

```typescript
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OrderResponse } from '@nx-ecom-app/data-access';
import { ButtonComponent } from '@nx-ecom-app/design-system';

@Component({
  selector: 'app-order-confirmation-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  template: `
    <div class="confirmation-page">
      <div *ngIf="order(); else noOrder" class="confirmation-card">
        <div class="success-icon">✓</div>
        <h1>Order Confirmed!</h1>
        <p class="order-id">Order ID: <strong>{{ order()!.id }}</strong></p>
        <span class="badge">{{ order()!.status }}</span>

        <div class="section">
          <h2>Shipping To</h2>
          <p>{{ order()!.shippingName }}</p>
          <p>{{ order()!.shippingAddress }}</p>
          <p>{{ order()!.shippingCity }}, {{ order()!.shippingZip }}</p>
        </div>

        <div class="section">
          <h2>Items</h2>
          <div class="item-row" *ngFor="let item of order()!.items">
            <span>{{ item.productName }} × {{ item.quantity }}</span>
            <span>\${{ item.subtotal | number: '1.2-2' }}</span>
          </div>
          <div class="item-row total-row">
            <strong>Total</strong>
            <strong>\${{ order()!.total | number: '1.2-2' }}</strong>
          </div>
        </div>

        <ds-button variant="primary" size="lg" routerLink="/" style="margin-top:1rem">
          Continue Shopping
        </ds-button>
      </div>

      <ng-template #noOrder>
        <div class="no-order">
          <p>No order found.</p>
          <ds-button variant="primary" routerLink="/">Go to Home</ds-button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .confirmation-page { max-width: 600px; margin: 0 auto; padding: 2rem; }
    .confirmation-card { text-align: center; }
    .success-icon {
      width: 4rem; height: 4rem; border-radius: 50%;
      background: #d1fae5; color: #065f46;
      font-size: 2rem; display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1rem;
    }
    h1 { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
    .order-id { color: #6b7280; font-size: 0.9rem; margin-bottom: 0.5rem; }
    .badge {
      display: inline-block; padding: 0.25rem 0.75rem;
      background: #d1fae5; color: #065f46;
      border-radius: 9999px; font-size: 0.8rem; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.05em;
    }
    .section { text-align: left; margin-top: 2rem; }
    .section h2 { font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem; border-bottom: 1px solid #f3f4f6; padding-bottom: 0.5rem; }
    .section p { margin: 0.2rem 0; color: #374151; }
    .item-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #f9fafb; }
    .total-row { border-top: 2px solid #e5e7eb; margin-top: 0.5rem; padding-top: 0.75rem; }
    .no-order { text-align: center; padding: 4rem; color: #6b7280; }
  `],
})
export class OrderConfirmationPageComponent implements OnInit {
  order = signal<OrderResponse | null>(null);

  constructor(private router: Router) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { order: OrderResponse } | undefined;
    if (state?.order) {
      this.order.set(state.order);
    } else {
      // Re-read from history.state if navigation has already completed
      const histState = history.state as { order?: OrderResponse };
      if (histState?.order) {
        this.order.set(histState.order);
      }
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/store/src/app/pages/order-confirmation/order-confirmation.page.ts
git commit -m "feat(store): add OrderConfirmationPageComponent"
```

---

### Task 10: Wire up routes and cart page Checkout button

**Files:**
- Modify: `apps/store/src/app/app.routes.ts`
- Modify: `apps/store/src/app/pages/cart/cart.page.ts`

- [ ] **Step 1: Add routes to `app.routes.ts`**

Replace the contents of `app.routes.ts` with:

```typescript
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePageComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePageComponent),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail.page').then(
        (m) => m.ProductDetailPageComponent
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.page').then((m) => m.CartPageComponent),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.page').then(
        (m) => m.CheckoutPageComponent
      ),
  },
  {
    path: 'order-confirmation',
    loadComponent: () =>
      import('./pages/order-confirmation/order-confirmation.page').then(
        (m) => m.OrderConfirmationPageComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
```

- [ ] **Step 2: Wire the Checkout button in `cart.page.ts`**

Find the line in the template:

```html
          <ds-button variant="primary" size="lg" style="width:100%; margin-top:1rem">
            Checkout
          </ds-button>
```

Replace it with:

```html
          <ds-button variant="primary" size="lg" style="width:100%; margin-top:1rem"
            routerLink="/checkout">
            Checkout
          </ds-button>
```

- [ ] **Step 3: Commit**

```bash
git add apps/store/src/app/app.routes.ts \
        apps/store/src/app/pages/cart/cart.page.ts
git commit -m "feat(store): wire checkout route and cart checkout button"
```

---

### Task 11: Smoke test the full flow

- [ ] **Step 1: Run all backend tests**

```bash
cd apps/api && ./gradlew test 2>&1 | tail -30
```

Expected: BUILD SUCCESSFUL, all tests pass.

- [ ] **Step 2: Build the frontend**

```bash
cd /Users/santosh/monorepo-talk/nx-ecom-app && npx nx build store 2>&1 | tail -20
```

Expected: `Successfully ran target build for project store`.

- [ ] **Step 3: Start the backend**

```bash
cd apps/api && ./gradlew bootRun &
```

- [ ] **Step 4: Start the frontend dev server**

```bash
npx nx serve store
```

- [ ] **Step 5: Manual smoke test**

1. Browse to `http://localhost:4200`
2. Add a product to cart
3. Go to `/cart` — click **Checkout**
4. Fill in the shipping form and click **Place Order**
5. Verify the order confirmation page shows the order ID, items, and total
6. Verify the H2 console at `http://localhost:8080/h2-console` shows a row in `orders` and `order_items` tables

- [ ] **Step 6: Final commit**

```bash
git add -A && git commit -m "feat: checkout and payment processing complete"
```
