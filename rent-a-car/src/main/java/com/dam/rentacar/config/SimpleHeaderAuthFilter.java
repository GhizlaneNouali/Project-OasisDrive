package com.dam.rentacar.config;

import java.io.IOException;

import org.springframework.http.HttpMethod;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class SimpleHeaderAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        // Rutas públicas
        if (path.equals("/api/usuarios/login") ||
                path.equals("/api/usuarios/registro") ||
                (HttpMethod.GET.matches(method) && path.startsWith("/api/coches"))) {
            filterChain.doFilter(request, response);
            return;
        }

        // Rutas protegidas
        if (path.startsWith("/api/")) {

            String userId = request.getHeader("X-User-Id");
            String userRole = request.getHeader("X-User-Role");

            if (userId == null || userId.isEmpty()
                    || userRole == null || userRole.isEmpty()) {

                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json;charset=UTF-8");

                response.getWriter().write("""
                            {"error":"Unauthorized: missing authentication headers"}
                        """);

                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
