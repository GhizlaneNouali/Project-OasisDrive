package com.dam.rentacar.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.dam.rentacar.model.Coche;
import com.dam.rentacar.model.Usuario;
import com.dam.rentacar.model.Valoracion;
import com.dam.rentacar.repository.CocheRepository;
import com.dam.rentacar.repository.UsuarioRepository;
import com.dam.rentacar.repository.ValoracionRepository;

public class ValoracionServiceTest {

    @Mock
    private ValoracionRepository valoracionRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private CocheRepository cocheRepository;

    @InjectMocks
    private ValoracionService valoracionService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void crearValoracion_exitoso() {
        Usuario u = new Usuario(); u.setId(1);
        Coche c = new Coche(); c.setId(2);

        when(usuarioRepository.findById(1)).thenReturn(Optional.of(u));
        when(cocheRepository.findById(2)).thenReturn(Optional.of(c));
        when(valoracionRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Valoracion v = valoracionService.crearValoracion(1, 2, 5, "Perfecto");
        assertEquals(5, v.getPuntuacion());
        assertEquals("Perfecto", v.getComentario());
    }

    @Test
    void crearValoracion_puntuacionInvalida() {
        Usuario u = new Usuario(); u.setId(1);
        Coche c = new Coche(); c.setId(2);
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(u));
        when(cocheRepository.findById(2)).thenReturn(Optional.of(c));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            valoracionService.crearValoracion(1, 2, 7, "Nope");
        });
        assertTrue(ex.getMessage().contains("puntuación"));
    }
}
