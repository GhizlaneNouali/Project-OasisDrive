package com.dam.rentacar.dto;

public class CocheUpdateRequest {
    private String marca;
    private String modelo;
    private String matricula;
    private Integer anio;
    private Float kilometros;
    private Float precio_dia;
    private String color;
    private String imagen_url;
    private Boolean disponible;
    private Boolean activo;

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public Integer getAnio() {
        return anio;
    }

    public void setAnio(Integer anio) {
        this.anio = anio;
    }

    public Float getKilometros() {
        return kilometros;
    }

    public void setKilometros(Float kilometros) {
        this.kilometros = kilometros;
    }

    public Float getPrecio_dia() {
        return precio_dia;
    }

    public void setPrecio_dia(Float precio_dia) {
        this.precio_dia = precio_dia;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getImagen_url() {
        return imagen_url;
    }

    public void setImagen_url(String imagen_url) {
        this.imagen_url = imagen_url;
    }

    public Boolean getDisponible() {
        return disponible;
    }

    public void setDisponible(Boolean disponible) {
        this.disponible = disponible;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}
