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
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.dam.rentacar.model.Usuario;
import com.dam.rentacar.repository.UsuarioRepository;

public class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void cambiarPassword_exitoso() {
        Usuario u = new Usuario();
        u.setId(1);
        u.setPassword("oldpass");

        when(usuarioRepository.findById(1)).thenReturn(Optional.of(u));
        when(usuarioRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Usuario res = usuarioService.cambiarPassword(1, "oldpass", "newpass");

        assertEquals("newpass", res.getPassword());
        verify(usuarioRepository).save(res);
    }

    @Test
    void cambiarPassword_contrasenaActualIncorrecta() {
        Usuario u = new Usuario();
        u.setId(2);
        u.setPassword("secret");

        when(usuarioRepository.findById(2)).thenReturn(Optional.of(u));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            usuarioService.cambiarPassword(2, "wrong", "newpass");
        });

        assertTrue(ex.getMessage().contains("incorrecta"));
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void cambiarPassword_usuarioNoEncontrado() {
        when(usuarioRepository.findById(99)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            usuarioService.cambiarPassword(99, "x", "y");
        });

        assertTrue(ex.getMessage().contains("Usuario no encontrado"));
    }
}
