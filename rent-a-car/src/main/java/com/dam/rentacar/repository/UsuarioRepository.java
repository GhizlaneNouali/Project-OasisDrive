package com.dam.rentacar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dam.rentacar.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer>{
    
}
