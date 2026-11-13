package com.cherrycake;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping(value = {
        "/cart",
        "/checkout",
        "/order-success/**",
        "/booking",
        "/about",
        "/admin/**"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
