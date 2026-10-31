package uz.itpu.cherrycake.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uz.itpu.cherrycake.common.exception.BadRequestException;
import uz.itpu.cherrycake.dto.request.OrderCreateRequest;
import uz.itpu.cherrycake.dto.response.OrderResponse;
import uz.itpu.cherrycake.model.entity.User;
import uz.itpu.cherrycake.service.AuthService;
import uz.itpu.cherrycake.service.OrderService;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order placement and customer tracking endpoints")
public class OrderController
{
    private final OrderService orderService;
    private final AuthService authService;

    @PostMapping({"/api/orders", "/api/v1/orders"})
    @Operation(summary = "Place a new order with server-side price recalculation")
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderCreateRequest request)
    {
        User currentUser = authService.getCurrentAuthenticatedUser();
        OrderResponse orderResponse = orderService.createOrder(request, currentUser);
        return new ResponseEntity<>(orderResponse, HttpStatus.CREATED);
    }

    @GetMapping({"/api/orders/{orderNumber}", "/api/v1/orders/{orderNumber}"})
    @Operation(summary = "Get order details by order tracking number")
    public ResponseEntity<OrderResponse> getOrderByNumber(@PathVariable String orderNumber)
    {
        return ResponseEntity.ok(orderService.getOrderByNumber(orderNumber));
    }

    @GetMapping({"/api/orders/my", "/api/v1/orders/my"})
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current authenticated user's order history")
    public ResponseEntity<List<OrderResponse>> getMyOrders()
    {
        User currentUser = authService.getCurrentAuthenticatedUser();

        if (currentUser == null)
        {
            throw new BadRequestException("User not authenticated");
        }

        return ResponseEntity.ok(orderService.getUserOrders(currentUser.getId()));
    }
}
