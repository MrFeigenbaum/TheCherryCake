package com.cherrycake.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@SuppressWarnings("null")
public class WebMvcConfig implements WebMvcConfigurer
{
    @Override
    public void addViewControllers(ViewControllerRegistry registry)
    {
        registry.addViewController("/").setViewName("forward:/index.html");
        registry.addViewController("/menu").setViewName("forward:/index.html");
        registry.addViewController("/cart").setViewName("forward:/index.html");
        registry.addViewController("/checkout").setViewName("forward:/index.html");
        registry.addViewController("/booking").setViewName("forward:/index.html");
        registry.addViewController("/login").setViewName("forward:/index.html");
        registry.addViewController("/register").setViewName("forward:/index.html");
        registry.addViewController("/account").setViewName("forward:/index.html");
        registry.addViewController("/reports").setViewName("forward:/index.html");
        registry.addViewController("/ui-kit").setViewName("forward:/index.html");
        registry.addViewController("/order-success/**").setViewName("forward:/index.html");
        registry.addViewController("/admin").setViewName("forward:/index.html");
        registry.addViewController("/admin/**").setViewName("forward:/index.html");
        registry.addViewController("/swagger").setViewName("forward:/swagger.html");
        registry.addViewController("/mockups").setViewName("forward:/mockups.html");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry)
    {
        registry.addResourceHandler("/**").addResourceLocations("classpath:/static/");
        registry.addResourceHandler("/assets/**").addResourceLocations("classpath:/static/assets/");
    }
}