package com.dam.rentacar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dam.rentacar.model.Valoracion;

public interface ValoracionRepository extends JpaRepository<Valoracion, Integer>{
    
}
