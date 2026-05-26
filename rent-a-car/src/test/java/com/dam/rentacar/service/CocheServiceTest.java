package com.dam.rentacar.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
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
import com.dam.rentacar.repository.CocheRepository;

public class CocheServiceTest {

    @Mock
    private CocheRepository cocheRepository;

    @InjectMocks
    private CocheService cocheService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void crearCoche_valido() {
        Coche c = new Coche();
        c.setMarca("BMW"); c.setModelo("M3"); c.setPrecio_dia(120f);

        when(cocheRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Coche res = cocheService.crearCoche(c);
        assertTrue(res.isDisponible());
        assertTrue(res.getActivo());
        verify(cocheRepository).save(res);
    }

    @Test
    void crearCoche_precioInvalido() {
        Coche c = new Coche(); c.setMarca("Audi"); c.setModelo("A4"); c.setPrecio_dia(0f);
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> cocheService.crearCoche(c));
        assertTrue(ex.getMessage().contains("precio"));
    }

    @Test
    void comprobarDisponibilidad_trueFalse() {
        Coche c = new Coche(); c.setId(1); c.setActivo(true); c.setDisponible(true);
        when(cocheRepository.findById(1)).thenReturn(Optional.of(c));

        assertTrue(cocheService.comprobarDisponibilidad(1));

        c.setDisponible(false);
        when(cocheRepository.findById(1)).thenReturn(Optional.of(c));
        assertFalse(cocheService.comprobarDisponibilidad(1));
    }
}
