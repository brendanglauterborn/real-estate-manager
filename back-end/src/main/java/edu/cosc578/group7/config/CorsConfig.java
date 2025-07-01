package edu.cosc578.group7.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow all origins for development
        config.addAllowedOrigin("*");
        // Alternative: specific origins
        // config.addAllowedOrigin("http://localhost:3000");
        // config.addAllowedOrigin("http://localhost:5173"); // For Vite
        
        // Allow all headers
        config.addAllowedHeader("*");
        
        // Allow all methods (GET, POST, PUT, DELETE, etc.)
        config.addAllowedMethod("*");
        
        // Allow credentials (cookies, authorization headers, etc.)
        config.setAllowCredentials(false); // Changed to false since using '*' for origins
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}