package com.cherrycake.common.config;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Configuration;

import java.net.URI;

@Configuration
public class DatabaseConfig implements BeanPostProcessor {

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof DataSourceProperties properties) {
            String url = properties.getUrl();
            if (url != null) {
                if (url.startsWith("postgres://")) {
                    url = "jdbc:postgresql://" + url.substring("postgres://".length());
                } else if (url.startsWith("postgresql://")) {
                    url = "jdbc:" + url;
                }

                // Parse user:password from URL if present (e.g. jdbc:postgresql://user:pass@host:port/db)
                if (url.startsWith("jdbc:postgresql://") && url.contains("@")) {
                    try {
                        String cleanUri = url.substring("jdbc:".length());
                        URI uri = URI.create(cleanUri);
                        String userInfo = uri.getUserInfo();
                        if (userInfo != null) {
                            String[] parts = userInfo.split(":", 2);
                            if (properties.getUsername() == null || properties.getUsername().isBlank() || "postgres".equals(properties.getUsername())) {
                                properties.setUsername(parts[0]);
                            }
                            if (parts.length > 1 && (properties.getPassword() == null || properties.getPassword().isBlank() || "dashwood".equals(properties.getPassword()))) {
                                properties.setPassword(parts[1]);
                            }
                            String host = uri.getHost();
                            int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                            String path = uri.getPath();
                            url = "jdbc:postgresql://" + host + ":" + port + path;
                        }
                    } catch (Exception ignored) {
                        // Keep original url if parsing fails
                    }
                }
                properties.setUrl(url);
            }
        }
        return bean;
    }
}
