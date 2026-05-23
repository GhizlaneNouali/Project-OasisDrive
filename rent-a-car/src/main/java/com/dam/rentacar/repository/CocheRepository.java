package com.dam.rentacar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dam.rentacar.model.Coche;

public interface CocheRepository extends JpaRepository<Coche, Integer> {

    

}
