package com.dam.rentacar.service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dam.rentacar.model.Coche;
import com.dam.rentacar.model.Usuario;
import com.dam.rentacar.model.Valoracion;
import com.dam.rentacar.repository.CocheRepository;
import com.dam.rentacar.repository.UsuarioRepository;
import com.dam.rentacar.repository.ValoracionRepository;

@Service
public class ValoracionService {
    
    @Autowired
    private ValoracionRepository valoracionRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private CocheRepository cocheRepository;
    
    /**
     * Obtener todas las valoraciones
     */
    public List<Valoracion> obtenerTodasValoraciones() {
        return valoracionRepository.findAll();
    }
    
    /**
     * Obtener una valoración por ID
     */
    public Optional<Valoracion> obtenerValoracion(Integer id) {
        return valoracionRepository.findById(id);
    }
    
    /**
     * Obtener valoraciones de un usuario
     */
    public List<Valoracion> obtenerValoracionesUsuario(Integer idUsuario) {
        return valoracionRepository.findAll().stream()
                .filter(v -> v.getUsuario().getId() == idUsuario)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener valoraciones de un vehículo
     */
    public List<Valoracion> obtenerValoracionesCoche(Integer idCoche) {
        return valoracionRepository.findAll().stream()
                .filter(v -> v.getCoche().getId() == idCoche)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener puntuación promedio de un vehículo
     */
    public double obtenerPuntuacionPromedioCoche(Integer idCoche) {
        List<Valoracion> valoraciones = obtenerValoracionesCoche(idCoche);
        if (valoraciones.isEmpty()) {
            return 0.0;
        }
        return valoraciones.stream()
                .mapToInt(Valoracion::getPuntuacion)
                .average()
                .orElse(0.0);
    }
    
    /**
     * Crear una nueva valoración
     */
    public Valoracion crearValoracion(Integer idUsuario, Integer idCoche, 
                                       int puntuacion, String comentario) {
        // Validar usuario
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(idUsuario);
        if (!usuarioOpt.isPresent()) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
        
        // Validar vehículo
        Optional<Coche> cocheOpt = cocheRepository.findById(idCoche);
        if (!cocheOpt.isPresent()) {
            throw new IllegalArgumentException("Vehículo no encontrado");
        }
        
        // Validar puntuación (1-5)
        if (puntuacion < 1 || puntuacion > 5) {
            throw new IllegalArgumentException("La puntuación debe estar entre 1 y 5");
        }
        
        // Crear valoración
        Valoracion valoracion = new Valoracion();
        valoracion.setUsuario(usuarioOpt.get());
        valoracion.setCoche(cocheOpt.get());
        valoracion.setPuntuacion(puntuacion);
        valoracion.setComentario(comentario != null ? comentario : "");
        valoracion.setFecha(new Date(System.currentTimeMillis()));
        
        return valoracionRepository.save(valoracion);
    }
    
    /**
     * Actualizar una valoración
     */
    public Valoracion actualizarValoracion(Integer id, int puntuacion, String comentario) {
        Optional<Valoracion> valoracionOpt = valoracionRepository.findById(id);
        if (!valoracionOpt.isPresent()) {
            throw new IllegalArgumentException("Valoración no encontrada");
        }
        
        // Validar puntuación (1-5)
        if (puntuacion < 1 || puntuacion > 5) {
            throw new IllegalArgumentException("La puntuación debe estar entre 1 y 5");
        }
        
        Valoracion valoracion = valoracionOpt.get();
        valoracion.setPuntuacion(puntuacion);
        if (comentario != null) {
            valoracion.setComentario(comentario);
        }
        
        return valoracionRepository.save(valoracion);
    }
    
    /**
     * Eliminar una valoración
     */
    public void eliminarValoracion(Integer id) {
        if (!valoracionRepository.existsById(id)) {
            throw new IllegalArgumentException("Valoración no encontrada");
        }
        valoracionRepository.deleteById(id);
    }
}
