package com.dam.rentacar.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "coches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Coche {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String marca;
    private String modelo;
    private String matricula;
    private int anio;
    private float kilometros;
    private float precio_dia;
    private String color;
    private String imagen_url;
    private boolean disponible;
    private Boolean activo;

    @OneToMany(mappedBy = "coche")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Valoracion> valoraciones;
}