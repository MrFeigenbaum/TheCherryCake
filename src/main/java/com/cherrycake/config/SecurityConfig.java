package com.cherrycake.config;

import com.cherrycake.security.CustomUserDetailsService;
import com.cherrycake.security.JwtAuthenticationFilter;
import jakarta.servlet.DispatcherType;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig
{
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception
    {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(org.springframework.security.config.Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests
            (
                auth -> auth
                // Permit internal forwards & errors
                .dispatcherTypeMatchers(DispatcherType.FORWARD, DispatcherType.ERROR).permitAll()
                // Spring Boot standard static resources
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
                // Public UI static pages & assets
                .requestMatchers
                (
                    "/",
                    "/index.html",
                    "/login",
                    "/login.html",
                    "/swagger",
                    "/swagger.html",
                    "/favicon.ico",
                    "/assets/**",
                    "/error",
                    "/error/**",
                    "/error.html"
                ).permitAll()
                // Public Swagger & OpenAPI docs
                .requestMatchers
                (
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
                ).permitAll()
                // Public Auth API
                .requestMatchers
                (
                    "/api/auth/**",
                    "/api/v1/auth/**"
                ).permitAll()
                // Public Catalog, Regions, Categories, Products, Prices, Logistics
                .requestMatchers
                (
                    "/api/regions",
                    "/api/v1/catalog/regions",
                    "/api/categories",
                    "/api/v1/catalog/categories",
                    "/api/products/**",
                    "/api/v1/catalog/products/**",
                    "/api/cart/**",
                    "/api/v1/cart/**",
                    "/api/pickup-points",
                    "/api/v1/catalog/pickup-points",
                    "/api/delivery-zones",
                    "/api/v1/catalog/delivery-zones",
                    "/api/time-slots",
                    "/api/v1/time-slots"
                ).permitAll()
                // Public creation of orders & table bookings (guest orders permitted)
                .requestMatchers(HttpMethod.POST, "/api/orders", "/api/v1/orders", "/api/bookings", "/api/v1/bookings").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/orders/{orderNumber}", "/api/v1/orders/{orderNumber}", "/api/bookings/{bookingNumber}", "/api/v1/bookings/{bookingNumber}").permitAll()
                // Customer personal cabinet endpoints
                .requestMatchers("/api/orders/my", "/api/v1/orders/my", "/api/bookings/my", "/api/v1/bookings/my").authenticated()
                // Reports & Analytics: accessible by VIEWER, STAFF, ADMIN
                .requestMatchers("/api/reports/**", "/api/v1/reports/**").hasAnyRole("VIEWER", "STAFF", "ADMIN")
                // Admin orders management: accessible by STAFF, ADMIN
                .requestMatchers("/api/admin/orders/**", "/api/v1/admin/orders/**").hasAnyRole("STAFF", "ADMIN")
                // Full Admin operations: accessible by ADMIN only
                .requestMatchers("/api/admin/**", "/api/v1/admin/**").hasRole("ADMIN")
                // Any other request must be authenticated
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider()
    {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception
    {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder()
    {
        return new BCryptPasswordEncoder();
    }
}
