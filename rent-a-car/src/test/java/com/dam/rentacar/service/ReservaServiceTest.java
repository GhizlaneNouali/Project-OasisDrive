package com.dam.rentacar.service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.dam.rentacar.model.Coche;
import com.dam.rentacar.model.Estado;
import com.dam.rentacar.model.Reserva;
import com.dam.rentacar.model.Usuario;
import com.dam.rentacar.repository.CocheRepository;
import com.dam.rentacar.repository.ReservaRepository;
import com.dam.rentacar.repository.UsuarioRepository;

public class ReservaServiceTest {

    @Mock
    private ReservaRepository reservaRepository;

    @Mock
    private CocheRepository cocheRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private ReservaService reservaService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void crearReserva_exitoso() {
        Usuario u = new Usuario(); u.setId(1); u.setFecha_nacimiento(new java.util.Date(90, 0, 1)); // 1990
        Coche c = new Coche(); c.setId(1); c.setPrecio_dia(50f); c.setDisponible(true); c.setActivo(true);

        when(usuarioRepository.findById(1)).thenReturn(Optional.of(u));
        when(cocheRepository.findById(1)).thenReturn(Optional.of(c));
        when(reservaRepository.findAll()).thenReturn(List.of());
        when(reservaRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Date inicio = Date.valueOf("2025-06-01");
        Date fin = Date.valueOf("2025-06-03");

        Reserva r = reservaService.crearReserva(1, 1, inicio, fin);

        assertEquals(Estado.CONFIRMADA, r.getEstado());
        assertEquals(50f * 2, r.getPrecio_total());
        verify(reservaRepository).save(r);
    }

    @Test
    void crearReserva_usuarioNoEncontrado() {
        when(usuarioRepository.findById(2)).thenReturn(Optional.empty());
        Date inicio = Date.valueOf("2025-06-01");
        Date fin = Date.valueOf("2025-06-02");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            reservaService.crearReserva(2, 1, inicio, fin);
        });
        assertTrue(ex.getMessage().contains("Usuario no encontrado"));
    }

    @Test
    void crearReserva_vehiculoNoActivo() {
        Usuario u = new Usuario(); u.setId(3); u.setFecha_nacimiento(new java.util.Date(90, 0, 1));
        Coche c = new Coche(); c.setId(5); c.setActivo(false);

        when(usuarioRepository.findById(3)).thenReturn(Optional.of(u));
        when(cocheRepository.findById(5)).thenReturn(Optional.of(c));

        Date inicio = Date.valueOf("2025-06-01");
        Date fin = Date.valueOf("2025-06-02");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            reservaService.crearReserva(3, 5, inicio, fin);
        });
        assertTrue(ex.getMessage().contains("no está activo") || ex.getMessage().contains("Vehículo no encontrado"));
    }
}
