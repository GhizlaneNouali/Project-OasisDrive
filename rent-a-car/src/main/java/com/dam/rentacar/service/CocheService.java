package com.dam.rentacar.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.dam.rentacar.dto.CocheUpdateRequest;
import com.dam.rentacar.model.Coche;
import com.dam.rentacar.repository.CocheRepository;

@Service
public class CocheService {

    @Autowired
    private CocheRepository cocheRepository;

    /**
     * Obtener todos los vehículos
     */
    public List<Coche> obtenerTodosCoches() {
        return cocheRepository.findAll();
    }

    /**
     * Obtener vehículos activos
     */
    public List<Coche> obtenerCochesActivos() {
        return cocheRepository.findAll().stream()
                .filter(this::estaActivo)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener un vehículo por ID
     */
    public Optional<Coche> obtenerCoche(Integer id) {
        return cocheRepository.findById(id);
    }
    
    /**
     * Obtener vehículos disponibles
     */
    public List<Coche> obtenerCochesDisponibles() {
        return cocheRepository.findAll().stream()
                .filter(this::estaActivo)
                .filter(Coche::isDisponible)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener vehículos por marca
     */
    public List<Coche> obtenerCochesPorMarca(String marca) {
        return cocheRepository.findAll().stream()
                .filter(this::estaActivo)
                .filter(c -> c.getMarca().equalsIgnoreCase(marca))
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener vehículos dentro de un rango de precio
     */
    public List<Coche> obtenerCochesPorPrecio(float precioMin, float precioMax) {
        return cocheRepository.findAll().stream()
                .filter(this::estaActivo)
                .filter(c -> c.getPrecio_dia() >= precioMin && c.getPrecio_dia() <= precioMax)
                .collect(Collectors.toList());
    }
    
    /**
     * Ordenar vehículos por precio ascendente
     */
    public List<Coche> ordenarCochesPorPrecioAsc() {
        return cocheRepository.findAll(Sort.by("precio_dia").ascending()).stream()
                .filter(this::estaActivo)
                .collect(Collectors.toList());
    }

    /**
     * Ordenar vehículos por precio descendente
     */
    public List<Coche> ordenarCochesPorPrecioDesc() {
        return cocheRepository.findAll(Sort.by("precio_dia").descending()).stream()
                .filter(this::estaActivo)
                .collect(Collectors.toList());
    }
    
    /**
     * Comprobar disponibilidad de un vehículo
     */
    public boolean comprobarDisponibilidad(Integer id) {
        Optional<Coche> coche = cocheRepository.findById(id);
        return coche.isPresent() && estaActivo(coche.get()) && coche.get().isDisponible();
    }
    
    /**
     * Crear un nuevo vehículo (Admin)
     */
    public Coche crearCoche(Coche coche) {
        if (coche.getMarca() == null || coche.getMarca().isEmpty()) {
            throw new IllegalArgumentException("La marca es obligatoria");
        }
        if (coche.getModelo() == null || coche.getModelo().isEmpty()) {
            throw new IllegalArgumentException("El modelo es obligatorio");
        }
        if (coche.getPrecio_dia() <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a 0");
        }
        
        coche.setDisponible(true); // Los vehículos nuevos comienzan disponibles
        coche.setActivo(true);
        return cocheRepository.save(coche);
    }
    
    /**
     * Actualizar un vehículo (Admin)
     */
    public Coche actualizarCoche(Integer id, CocheUpdateRequest cocheActualizado) {
        Optional<Coche> cocheOpt = cocheRepository.findById(id);
        if (!cocheOpt.isPresent()) {
            throw new IllegalArgumentException("Vehículo no encontrado");
        }
        
        Coche coche = cocheOpt.get();
        
        if (cocheActualizado.getMarca() != null) {
            coche.setMarca(cocheActualizado.getMarca());
        }
        if (cocheActualizado.getModelo() != null) {
            coche.setModelo(cocheActualizado.getModelo());
        }
        if (cocheActualizado.getMatricula() != null) {
            coche.setMatricula(cocheActualizado.getMatricula());
        }
        if (cocheActualizado.getAnio() != null) {
            coche.setAnio(cocheActualizado.getAnio());
        }
        if (cocheActualizado.getKilometros() != null) {
            coche.setKilometros(cocheActualizado.getKilometros());
        }
        if (cocheActualizado.getPrecio_dia() != null) {
            coche.setPrecio_dia(cocheActualizado.getPrecio_dia());
        }
        if (cocheActualizado.getColor() != null) {
            coche.setColor(cocheActualizado.getColor());
        }
        if (cocheActualizado.getImagen_url() != null) {
            coche.setImagen_url(cocheActualizado.getImagen_url());
        }
        if (cocheActualizado.getDisponible() != null) {
            coche.setDisponible(cocheActualizado.getDisponible());
        }
        if (cocheActualizado.getActivo() != null) {
            coche.setActivo(cocheActualizado.getActivo());
        }
        
        return cocheRepository.save(coche);
    }
    
    /**
     * Archivar un vehículo (Admin)
     */
    public Coche eliminarCoche(Integer id) {
        if (!cocheRepository.existsById(id)) {
            throw new IllegalArgumentException("Vehículo no encontrado");
        }

        Optional<Coche> cocheOpt = cocheRepository.findById(id);
        if (!cocheOpt.isPresent()) {
            throw new IllegalArgumentException("Vehículo no encontrado");
        }

        Coche coche = cocheOpt.get();
        coche.setActivo(false);
        coche.setDisponible(false);
        return cocheRepository.save(coche);
    }

    /**
     * Reactivar un vehículo archivado
     */
    public Coche activarCoche(Integer id) {
        Optional<Coche> cocheOpt = cocheRepository.findById(id);
        if (!cocheOpt.isPresent()) {
            throw new IllegalArgumentException("Vehículo no encontrado");
        }

        Coche coche = cocheOpt.get();
        coche.setActivo(true);
        coche.setDisponible(true);
        return cocheRepository.save(coche);
    }
    
    /**
     * Marcar un vehículo como disponible
     */
    public Coche marcarComoDisponible(Integer id) {
        Optional<Coche> cocheOpt = cocheRepository.findById(id);
        if (!cocheOpt.isPresent()) {
            throw new IllegalArgumentException("Vehículo no encontrado");
        }
        
        Coche coche = cocheOpt.get();
        coche.setDisponible(true);
        return cocheRepository.save(coche);
    }
    
    /**
     * Marcar un vehículo como no disponible
     */
    public Coche marcarComoNoDisponible(Integer id) {
        Optional<Coche> cocheOpt = cocheRepository.findById(id);
        if (!cocheOpt.isPresent()) {
            throw new IllegalArgumentException("Vehículo no encontrado");
        }
        
        Coche coche = cocheOpt.get();
        coche.setDisponible(false);
        return cocheRepository.save(coche);
    }

    private boolean estaActivo(Coche coche) {
        return coche.getActivo() == null || coche.getActivo();
    }
}
