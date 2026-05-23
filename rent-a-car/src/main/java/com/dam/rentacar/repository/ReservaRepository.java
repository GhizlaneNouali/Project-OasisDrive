package com.dam.rentacar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dam.rentacar.model.Reserva;

public interface ReservaRepository extends JpaRepository<Reserva, Integer> {
	long countByCoche_Id(Integer cocheId);

}
