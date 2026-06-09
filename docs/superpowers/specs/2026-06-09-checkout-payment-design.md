# Checkout & Payment Processing — Design Spec
Date: 2026-06-09

## Overview
Add a checkout and dummy payment processing feature to the nx-ecom-app. The user fills out a shipping address form on the checkout page, submits it, the backend validates the cart, runs a dummy payment (always succeeds), saves an Order, clears the cart, and returns an order confirmation.

## Approach
Single `POST /api/checkout` endpoint (Approach A). One round-trip, persists an `Order` entity for future order-history use, and wraps a `PaymentService` that is easy to swap for a real gateway later.

---

## Backend Design

### New Entities

**`Order`** (`orders` table)
- `id` — UUID PK
- `sessionId` — links to originating cart session
- `status` — enum: `CONFIRMED` (only value for now)
- `total` — Double
- `shippingName`, `shippingAddress`, `shippingCity`, `shippingZip` — String
- `createdAt` — LocalDateTime

**`OrderItem`** (`order_items` table)
- `id` — UUID PK
- `order` — ManyToOne → Order
- `productId`, `productName` — String (snapshot at time of purchase)
- `price` — Double
- `quantity` — Integer
- `subtotal` — Double

### New DTOs
- **`CheckoutRequest`**: `name`, `address`, `city`, `zip` (all non-blank)
- **`OrderResponse`**: `id`, `status`, `total`, `shippingName/Address/City/Zip`, `createdAt`, `List<OrderItemResponse>` (id, productId, productName, price, quantity, subtotal)

### New Services
- **`PaymentService`**: single method `process(double amount): PaymentResult`. Dummy implementation always returns `PaymentResult.SUCCESS`. `PaymentResult` is an enum: `SUCCESS`, `FAILED`.
- **`CheckoutService`**: `checkout(String sessionId, CheckoutRequest req): OrderResponse`
  1. Load cart by sessionId — throw `400` if not found or empty
  2. Call `paymentService.process(total)` — throw `402` if `FAILED`
  3. Build and save `Order` + `OrderItem`s
  4. Clear cart
  5. Return `OrderResponse`

### New Controller
**`CheckoutController`** — `POST /api/checkout`
- Accepts `@RequestBody CheckoutRequest`, `HttpSession`
- Returns `201 Created` with `OrderResponse`

### New Repositories
- `OrderRepository` (JpaRepository<Order, String>)
- `OrderItemRepository` (JpaRepository<OrderItem, String>)

---

## Frontend Design

### New Model additions (`libs/data-access/src/lib/models/order.model.ts`)
Add `OrderResponse` and `OrderItemResponse` interfaces matching the backend DTO.

### New Service (`libs/data-access/src/lib/services/checkout.service.ts`)
`CheckoutService` with `placeOrder(request: CheckoutRequest): Observable<OrderResponse>` — `POST /api/checkout` with credentials.

Export from `libs/data-access/src/index.ts`.

### New Pages

**`CheckoutPageComponent`** (`apps/store/src/app/pages/checkout/checkout.page.ts`)
- Reactive form: `name`, `address`, `city`, `zip` — all required
- "Place Order" button disabled while invalid or loading
- On submit: calls `CheckoutService.placeOrder()`, navigates to `/order-confirmation` passing `OrderResponse` via router state on success; shows inline error on failure

**`OrderConfirmationPageComponent`** (`apps/store/src/app/pages/order-confirmation/order-confirmation.page.ts`)
- Reads `OrderResponse` from router navigation state
- Displays: order ID, status badge, items table, total, shipping address
- "Continue Shopping" button → `/`

### Route changes (`apps/store/src/app/app.routes.ts`)
- Add `/checkout` → `CheckoutPageComponent`
- Add `/order-confirmation` → `OrderConfirmationPageComponent`

### Cart page change
- Wire "Checkout" button: add `routerLink="/checkout"`

---

## Error Handling
- Empty cart → `400 Bad Request` from backend; checkout page shows "Your cart is empty"
- Payment failure → `402 Payment Required`; checkout page shows "Payment failed, please try again"
- Network error → generic "Something went wrong" message

## Out of Scope
- Real payment gateway integration
- User authentication / linking orders to users
- Order history page
- Email confirmation
