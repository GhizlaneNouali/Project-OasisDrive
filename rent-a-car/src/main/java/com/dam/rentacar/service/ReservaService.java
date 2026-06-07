package com.dam.rentacar.service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dam.rentacar.model.Coche;
import com.dam.rentacar.model.Estado;
import com.dam.rentacar.model.Reserva;
import com.dam.rentacar.model.Usuario;
import com.dam.rentacar.repository.CocheRepository;
import com.dam.rentacar.repository.ReservaRepository;
import com.dam.rentacar.repository.UsuarioRepository;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;
    
    @Autowired
    private CocheRepository cocheRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    // Reglas de negocio del PDF (página 12)
    private static final int DIAS_MINIMOS = 1;
    private static final int DIAS_MAXIMOS = 30;
    private static final int EDAD_MINIMA = 18;
    
    /**
     * Crear una nueva reserva
     * Valida: disponibilidad del vehículo, días (1-30), edad mínima (18 años)
     */
    public Reserva crearReserva(Integer idUsuario, Integer idCoche, Date fechaInicio, Date fechaFin) {
        // Validar usuario
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(idUsuario);
        if (!usuarioOpt.isPresent()) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
        Usuario usuario = usuarioOpt.get();
        
        // Validar edad mínima (18 años)
        if (!validarEdad(usuario)) {
            throw new IllegalArgumentException("El usuario debe tener al menos 18 años");
        }
        
        // Validar vehículo
        Optional<Coche> cocheOpt = cocheRepository.findById(idCoche);
        if (!cocheOpt.isPresent()) {
            throw new IllegalArgumentException("Vehículo no encontrado");
        }
        Coche coche = cocheOpt.get();

        if (coche.getActivo() != null && !coche.getActivo()) {
            throw new IllegalArgumentException("El vehículo no está activo");
        }
        
        // Validar fechas
        if (fechaInicio == null || fechaFin == null) {
            throw new IllegalArgumentException("Las fechas de la reserva son obligatorias");
        }
        if (!fechaInicio.before(fechaFin)) {
            throw new IllegalArgumentException("La fecha de fin debe ser posterior a la fecha de inicio");
        }

        long diasReserva = calcularDias(fechaInicio, fechaFin);
        if (diasReserva < DIAS_MINIMOS || diasReserva > DIAS_MAXIMOS) {
            throw new IllegalArgumentException("La reserva debe ser entre " + DIAS_MINIMOS + 
                    " y " + DIAS_MAXIMOS + " días. Días solicitados: " + diasReserva);
        }
        
        // Validar que no haya conflicto con otras reservas
        if (hayConflictoReservas(idCoche, fechaInicio, fechaFin)) {
            throw new IllegalArgumentException("El vehículo ya tiene una reserva en esas fechas");
        }
        
        // Calcular precio total
        float precioTotal = calcularPrecioTotal(coche.getPrecio_dia(), diasReserva);
        
        // Crear reserva
        Reserva reserva = new Reserva();
        reserva.setUsuario(usuario);
        reserva.setCoche(coche);
        reserva.setFecha_inicio(fechaInicio);
        reserva.setFecha_fin(fechaFin);
        reserva.setPrecio_total(precioTotal);
        reserva.setEstado(Estado.CONFIRMADA);
        
        return reservaRepository.save(reserva);
    }
    
    /**
     * Obtener todas las reservas
     */
    public List<Reserva> obtenerTodasReservas() {
        return reservaRepository.findAll();
    }
    
    /**
     * Obtener una reserva por ID
     */
    public Optional<Reserva> obtenerReserva(Integer id) {
        return reservaRepository.findById(id);
    }
    
    /**
     * Obtener reservas de un usuario
     */
    public List<Reserva> obtenerReservasUsuario(Integer idUsuario) {
        Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
        if (usuario.isPresent()) {
            return reservaRepository.findAll().stream()
                    .filter(r -> r.getUsuario().getId() == idUsuario)
                    .toList();
        }
        return List.of();
    }
    
    /**
     * Cancelar una reserva
     */
    public Reserva cancelarReserva(Integer idReserva) {
        Optional<Reserva> reservaOpt = reservaRepository.findById(idReserva);
        if (!reservaOpt.isPresent()) {
            throw new IllegalArgumentException("Reserva no encontrada");
        }
        
        Reserva reserva = reservaOpt.get();
        
        // Solo se pueden cancelar reservas pendientes o confirmadas
        if (reserva.getEstado() == Estado.CANCELADA || reserva.getEstado() == Estado.FINALIZADA) {
            throw new IllegalStateException("No se puede cancelar una reserva ya " + 
                    reserva.getEstado().toString().toLowerCase());
        }
        
        // Cambiar estado a cancelada
        reserva.setEstado(Estado.CANCELADA);
        
        return reservaRepository.save(reserva);
    }
    
    /**
     * Finalizar una reserva
     */
    public Reserva finalizarReserva(Integer idReserva) {
        Optional<Reserva> reservaOpt = reservaRepository.findById(idReserva);
        if (!reservaOpt.isPresent()) {
            throw new IllegalArgumentException("Reserva no encontrada");
        }
        
        Reserva reserva = reservaOpt.get();
        
        // Solo se pueden finalizar reservas confirmadas
        if (reserva.getEstado() != Estado.CONFIRMADA) {
            throw new IllegalStateException("Solo se pueden finalizar reservas confirmadas");
        }
        
        // Cambiar estado a finalizada
        reserva.setEstado(Estado.FINALIZADA);
        
        return reservaRepository.save(reserva);
    }
    
    /**
     * Calcular el número de días entre dos fechas
     */
    private long calcularDias(Date inicio, Date fin) {
        long millisecondosPorDia = 24 * 60 * 60 * 1000;
        return (fin.getTime() - inicio.getTime()) / millisecondosPorDia;
    }
    
    /**
     * Calcular precio total
     */
    private float calcularPrecioTotal(float precioDia, long dias) {
        return precioDia * dias;
    }
    
    /**
     * Validar que el usuario tenga al menos 18 años
     */
    private boolean validarEdad(Usuario usuario) {
        java.util.Date fechaNacimiento = usuario.getFecha_nacimiento();
        if (fechaNacimiento == null) {
            return false;
        }
        
        java.util.Calendar calendar = java.util.Calendar.getInstance();
        calendar.setTime(fechaNacimiento);
        calendar.add(java.util.Calendar.YEAR, EDAD_MINIMA);
        
        return new java.util.Date().after(calendar.getTime());
    }
    
    /**
     * Comprobar si hay conflicto de reservas para un vehículo en las fechas indicadas
     */
    private boolean hayConflictoReservas(Integer idCoche, Date inicio, Date fin) {
        List<Reserva> reservas = reservaRepository.findAll().stream()
                .filter(r -> r.getCoche().getId() == idCoche)
                .filter(r -> r.getEstado() != Estado.CANCELADA)
                .toList();
        
        for (Reserva reserva : reservas) {
            // Comprobar solapamiento de fechas
            if ((inicio.before(reserva.getFecha_fin()) || inicio.equals(reserva.getFecha_fin())) &&
                (fin.after(reserva.getFecha_inicio()) || fin.equals(reserva.getFecha_inicio()))) {
                return true;
            }
        }
        return false;
    }
}
