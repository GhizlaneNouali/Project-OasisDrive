package com.dam.rentacar.controller;

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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dam.rentacar.model.Valoracion;
import com.dam.rentacar.service.ValoracionService;

@RestController
@RequestMapping("/api/valoraciones")
@CrossOrigin(origins = "*")
public class ValoracionController {

    @Autowired
    private ValoracionService valoracionService;

    /**
     * Obtener todas las valoraciones
     */
    @GetMapping
    public ResponseEntity<List<Valoracion>> obtenerTodasValoraciones() {
        try {
            List<Valoracion> valoraciones = valoracionService.obtenerTodasValoraciones();
            return ResponseEntity.ok(valoraciones);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtener una valoración por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Valoracion> obtenerValoracion(@PathVariable Integer id) {
        try {
            Optional<Valoracion> valoracion = valoracionService.obtenerValoracion(id);
            return valoracion.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtener valoraciones de un usuario
     */
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Valoracion>> obtenerValoracionesUsuario(@PathVariable Integer idUsuario) {
        try {
            List<Valoracion> valoraciones = valoracionService.obtenerValoracionesUsuario(idUsuario);
            return ResponseEntity.ok(valoraciones);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtener valoraciones de un vehículo
     */
    @GetMapping("/coche/{idCoche}")
    public ResponseEntity<List<Valoracion>> obtenerValoracionesCoche(@PathVariable Integer idCoche) {
        try {
            List<Valoracion> valoraciones = valoracionService.obtenerValoracionesCoche(idCoche);
            return ResponseEntity.ok(valoraciones);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtener puntuación promedio de un vehículo
     */
    @GetMapping("/coche/{idCoche}/promedio")
    public ResponseEntity<Map<String, Object>> obtenerPuntuacionPromedioCoche(@PathVariable Integer idCoche) {
        try {
            double promedio = valoracionService.obtenerPuntuacionPromedioCoche(idCoche);
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("idCoche", idCoche);
            respuesta.put("puntuacionPromedio", promedio);
            return ResponseEntity.ok(respuesta);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Crear una nueva valoración
     * Parámetros esperados en JSON:
     * {
     * "idUsuario": 1,
     * "idCoche": 1,
     * "puntuacion": 5,
     * "comentario": "Excelente vehículo"
     * }
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> crearValoracion(@RequestBody Map<String, Object> request) {

        Map<String, Object> respuesta = new HashMap<>();

        try {
            Object idUsuarioObj = request.get("idUsuario");
            Object idCocheObj = request.get("idCoche");
            Object puntuacionObj = request.get("puntuacion");

            if (idUsuarioObj == null || idCocheObj == null || puntuacionObj == null) {
                respuesta.put("error", "Faltan campos requeridos");
                return ResponseEntity.badRequest().body(respuesta);
            }

            Integer idUsuario = Integer.parseInt(idUsuarioObj.toString());
            Integer idCoche = Integer.parseInt(idCocheObj.toString());
            Integer puntuacion = Integer.parseInt(puntuacionObj.toString());

            String comentario = request.get("comentario") != null
                    ? request.get("comentario").toString()
                    : "";

            Valoracion valoracion = valoracionService.crearValoracion(
                    idUsuario, idCoche, puntuacion, comentario);

            respuesta.put("mensaje", "Valoración creada correctamente");
            respuesta.put("valoracion", valoracion);

            return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);

        } catch (Exception e) {
            e.printStackTrace();
            respuesta.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }

    /**
     * Actualizar una valoración
     * Parámetros esperados en JSON:
     * {
     * "puntuacion": 4,
     * "comentario": "Buen vehículo"
     * }
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> actualizarValoracion(@PathVariable Integer id,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> respuesta = new HashMap<>();

        try {
            Integer puntuacion = ((Number) request.get("puntuacion")).intValue();
            String comentario = (String) request.get("comentario");

            Valoracion valoracionActualizada = valoracionService.actualizarValoracion(
                    id, puntuacion, comentario);

            respuesta.put("mensaje", "Valoración actualizada exitosamente");
            respuesta.put("valoracion", valoracionActualizada);
            return ResponseEntity.ok(respuesta);
        } catch (IllegalArgumentException e) {
            respuesta.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
        } catch (Exception e) {
            respuesta.put("error", "Error al actualizar la valoración: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }

    /**
     * Eliminar una valoración
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> eliminarValoracion(@PathVariable Integer id) {
        Map<String, Object> respuesta = new HashMap<>();

        try {
            valoracionService.eliminarValoracion(id);
            respuesta.put("mensaje", "Valoración eliminada exitosamente");
            return ResponseEntity.ok(respuesta);
        } catch (IllegalArgumentException e) {
            respuesta.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
        } catch (Exception e) {
            respuesta.put("error", "Error al eliminar la valoración: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }
}
