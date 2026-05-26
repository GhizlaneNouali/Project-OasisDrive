package com.dam.rentacar.controller;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dam.rentacar.model.Reserva;
import com.dam.rentacar.service.ReservaService;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
public class ReservaController {
    
    @Autowired
    private ReservaService reservaService;
    
    /**
     * Obtener todas las reservas (admin)
     */
    @GetMapping
    public ResponseEntity<List<Reserva>> obtenerTodasReservas() {
        try {
            List<Reserva> reservas = reservaService.obtenerTodasReservas();
            return ResponseEntity.ok(reservas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtener una reserva por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Reserva> obtenerReserva(@PathVariable Integer id) {
        try {
            Optional<Reserva> reserva = reservaService.obtenerReserva(id);
            return reserva.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtener reservas de un usuario
     */
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Reserva>> obtenerReservasUsuario(@PathVariable Integer idUsuario) {
        try {
            List<Reserva> reservas = reservaService.obtenerReservasUsuario(idUsuario);
            return ResponseEntity.ok(reservas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Crear una nueva reserva
     * Parámetros esperados en JSON:
     * {
     *   "idUsuario": 1,
     *   "idCoche": 1,
     *   "fechaInicio": "2025-06-01",
     *   "fechaFin": "2025-06-05"
     * }
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> crearReserva(@RequestBody Map<String, Object> request) {
        Map<String, Object> respuesta = new HashMap<>();
        
        try {
            Integer idUsuario = ((Number) request.get("idUsuario")).intValue();
            Integer idCoche = ((Number) request.get("idCoche")).intValue();
            String fechaInicioStr = (String) request.get("fechaInicio");
            String fechaFinStr = (String) request.get("fechaFin");
            
            Date fechaInicio = Date.valueOf(fechaInicioStr);
            Date fechaFin = Date.valueOf(fechaFinStr);
            
            Reserva reserva = reservaService.crearReserva(idUsuario, idCoche, fechaInicio, fechaFin);
            
            respuesta.put("mensaje", "Reserva creada exitosamente");
            respuesta.put("reserva", reserva);
            return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
            
        } catch (IllegalArgumentException e) {
            respuesta.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
        } catch (Exception e) {
            respuesta.put("error", "Error al crear la reserva: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }
    
    /**
     * Cancelar una reserva
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> cancelarReserva(@PathVariable Integer id) {
        Map<String, Object> respuesta = new HashMap<>();
        
        try {
            Reserva reserva = reservaService.cancelarReserva(id);
            respuesta.put("mensaje", "Reserva cancelada exitosamente");
            respuesta.put("reserva", reserva);
            return ResponseEntity.ok(respuesta);
        } catch (IllegalArgumentException e) {
            respuesta.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
        } catch (IllegalStateException e) {
            respuesta.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
        } catch (Exception e) {
            respuesta.put("error", "Error al cancelar la reserva: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }
    
    /**
     * Finalizar una reserva (cambiar estado a FINALIZADA)
     */
    @PutMapping("/{id}/finalizar")
    public ResponseEntity<Map<String, Object>> finalizarReserva(@PathVariable Integer id,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        Map<String, Object> respuesta = new HashMap<>();
        
        // Comprobar rol: solo ADMIN puede finalizar reservas
        if (userRole == null || !userRole.equalsIgnoreCase("ADMIN")) {
            respuesta.put("error", "Acceso denegado: se requiere rol ADMIN para finalizar reservas");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(respuesta);
        }

        try {
            Reserva reserva = reservaService.finalizarReserva(id);
            respuesta.put("mensaje", "Reserva finalizada exitosamente");
            respuesta.put("reserva", reserva);
            return ResponseEntity.ok(respuesta);
        } catch (IllegalArgumentException e) {
            respuesta.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
        } catch (IllegalStateException e) {
            respuesta.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
        } catch (Exception e) {
            respuesta.put("error", "Error al finalizar la reserva: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }
}
