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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dam.rentacar.dto.CocheUpdateRequest;
import com.dam.rentacar.model.Coche;
import com.dam.rentacar.service.CocheService;

@RestController
@RequestMapping("/api/coches")
@CrossOrigin(origins = "*")
public class CocheController {

    @Autowired
    private CocheService cocheService;

    /**
     * Obtener todos los vehículos
     */
    @GetMapping
    public ResponseEntity<List<Coche>> obtenerTodosCoches() {
        try {
            List<Coche> coches = cocheService.obtenerTodosCoches();
            return ResponseEntity.ok(coches);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtener vehículos activos (catálogo público)
     */
    @GetMapping("/activos/lista")
    public ResponseEntity<List<Coche>> obtenerCochesActivos() {
        try {
            List<Coche> coches = cocheService.obtenerCochesActivos();
            return ResponseEntity.ok(coches);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtener un vehículo por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Coche> obtenerCoche(@PathVariable Integer id) {
        try {
            Optional<Coche> coche = cocheService.obtenerCoche(id);
            return coche.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtener vehículos disponibles
     */
    @GetMapping("/disponibles/lista")
    public ResponseEntity<List<Coche>> obtenerCochesDisponibles() {
        try {
            List<Coche> coches = cocheService.obtenerCochesDisponibles();
            return ResponseEntity.ok(coches);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtener vehículos por marca
     */
    @GetMapping("/marca/{marca}")
    public ResponseEntity<List<Coche>> obtenerCochesPorMarca(@PathVariable String marca) {
        try {
            List<Coche> coches = cocheService.obtenerCochesPorMarca(marca);
            return ResponseEntity.ok(coches);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtener vehículos por rango de precio
     * Parámetros: /api/coches/precio?min=10&max=50
     */
    @GetMapping("/precio")
    public ResponseEntity<List<Coche>> obtenerCochesPorPrecio(
            @RequestParam float min, @RequestParam float max) {
        try {
            List<Coche> coches = cocheService.obtenerCochesPorPrecio(min, max);
            return ResponseEntity.ok(coches);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Ordenar vehículos por precio ascendente
     */
    @GetMapping("/ordenar/precio-asc")
    public ResponseEntity<List<Coche>> ordenarPorPrecioAsc() {
        try {
            List<Coche> coches = cocheService.ordenarCochesPorPrecioAsc();
            return ResponseEntity.ok(coches);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Ordenar vehículos por precio descendente
     */
    @GetMapping("/ordenar/precio-desc")
    public ResponseEntity<List<Coche>> ordenarPorPrecioDesc() {
        try {
            List<Coche> coches = cocheService.ordenarCochesPorPrecioDesc();
            return ResponseEntity.ok(coches);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Comprobar disponibilidad de un vehículo
     */
    @GetMapping("/{id}/disponible")
    public ResponseEntity<Map<String, Object>> comprobarDisponibilidad(@PathVariable Integer id) {
        try {
            boolean disponible = cocheService.comprobarDisponibilidad(id);
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("id", id);
            respuesta.put("disponible", disponible);
            return ResponseEntity.ok(respuesta);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Crear un nuevo vehículo (Admin)
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> crearCoche(@RequestBody Coche coche) {
        Map<String, Object> respuesta = new HashMap<>();
        try {
            Coche cocheCreado = cocheService.crearCoche(coche);
            respuesta.put("mensaje", "Vehículo creado exitosamente");
            respuesta.put("coche", cocheCreado);
            return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
        } catch (IllegalArgumentException e) {
            respuesta.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
        } catch (Exception e) {
            respuesta.put("error", "Error al crear el vehículo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }

    /**
     * Actualizar un vehículo (Admin)
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> actualizarCoche(@PathVariable Integer id,
            @RequestBody CocheUpdateRequest coche) {
        Map<String, Object> respuesta = new HashMap<>();
        try {
            Coche cocheActualizado = cocheService.actualizarCoche(id, coche);
            respuesta.put("mensaje", "Vehículo actualizado exitosamente");
            respuesta.put("coche", cocheActualizado);
            return ResponseEntity.ok(respuesta);
        } catch (IllegalArgumentException e) {
            respuesta.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
        } catch (Exception e) {
            respuesta.put("error", "Error al actualizar el vehículo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }

    /**
     * Eliminar un vehículo (Admin)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> eliminarCoche(@PathVariable Integer id) {
        Map<String, Object> respuesta = new HashMap<>();
        try {
            Coche cocheArchivado = cocheService.eliminarCoche(id);
            respuesta.put("mensaje", "Vehículo archivado exitosamente");
            respuesta.put("coche", cocheArchivado);
            return ResponseEntity.ok(respuesta);
        } catch (IllegalArgumentException e) {
            respuesta.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
        } catch (Exception e) {
            respuesta.put("error", "Error al archivar el vehículo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }

    /**
     * Reactivar un vehículo archivado
     */
    @PutMapping("/{id}/activar")
    public ResponseEntity<Map<String, Object>> activarCoche(@PathVariable Integer id) {
        Map<String, Object> respuesta = new HashMap<>();
        try {
            Coche cocheActivado = cocheService.activarCoche(id);
            respuesta.put("mensaje", "Vehículo reactivado exitosamente");
            respuesta.put("coche", cocheActivado);
            return ResponseEntity.ok(respuesta);
        } catch (IllegalArgumentException e) {
            respuesta.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
        } catch (Exception e) {
            respuesta.put("error", "Error al activar el vehículo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }

}
 