package com.dam.rentacar.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import com.dam.rentacar.model.Reserva;
import com.dam.rentacar.service.ReservaService;

public class ReservaControllerTest {

    @Mock
    private ReservaService reservaService;

    @InjectMocks
    private ReservaController reservaController;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void finalizarReserva_denegadoParaCliente() {
        ResponseEntity<?> resp = reservaController.finalizarReserva(1, "CLIENTE");
        assertEquals(403, resp.getStatusCodeValue());
    }

    @Test
    void finalizarReserva_permitidoParaAdmin() {
        Reserva r = new Reserva();
        r.setId(1);
        when(reservaService.finalizarReserva(1)).thenReturn(r);

        ResponseEntity<?> resp = reservaController.finalizarReserva(1, "ADMIN");
        assertEquals(200, resp.getStatusCodeValue());
        verify(reservaService).finalizarReserva(1);
    }
}

