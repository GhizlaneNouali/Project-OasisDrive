package com.dam.rentacar.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dam.rentacar.model.Rol;
import com.dam.rentacar.model.Usuario;
import com.dam.rentacar.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private static final int PASSWORD_MIN_LENGTH = 8;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    /**
     * Obtener todos los usuarios (Admin)
     */
    public List<Usuario> obtenerTodosUsuarios() {
        return usuarioRepository.findAll();
    }
    
    /**
     * Obtener un usuario por ID
     */
    public Optional<Usuario> obtenerUsuario(Integer id) {
        return usuarioRepository.findById(id);
    }
    
    /**
     * Obtener un usuario por email
     */
    public Optional<Usuario> obtenerUsuarioPorEmail(String email) {
        return usuarioRepository.findAll().stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .findFirst();
    }
    
    /**
     * Obtener todos los clientes
     */
    public List<Usuario> obtenerClientes() {
        return usuarioRepository.findAll().stream()
                .filter(u -> u.getRol() == Rol.CLIENTE)
                .collect(Collectors.toList());
    }
    
    /**
     * Registrar un nuevo usuario (cliente)
     */
    public Usuario registrarUsuario(Usuario usuario) {
        if (usuario.getNombre() == null || usuario.getNombre().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (usuario.getEmail() == null || usuario.getEmail().isEmpty()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }
        if (usuario.getPassword() == null || usuario.getPassword().isEmpty()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }
        validarLongitudPassword(usuario.getPassword());
        
        // Validar que no exista otro usuario con el mismo email
        if (obtenerUsuarioPorEmail(usuario.getEmail()).isPresent()) {
            throw new IllegalArgumentException("El email ya está registrado");
        }
        
        // Validar edad mínima (18 años)
        if (!validarEdad(usuario)) {
            throw new IllegalArgumentException("Debes tener al menos 18 años para registrarte");
        }
        
        // Los nuevos usuarios siempre son CLIENTE
        usuario.setRol(Rol.CLIENTE);
        
        // En producción, aquí se encriptaría la contraseña (BCrypt, etc.)
        // usuario.setPassword(encriptar(usuario.getPassword()));
        
        return usuarioRepository.save(usuario);
    }
    
    /**
     * Login de usuario (validar email y contraseña)
     */
    public Optional<Usuario> login(String email, String password) {
        Optional<Usuario> usuarioOpt = obtenerUsuarioPorEmail(email);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // En producción, comparar contraseña encriptada
            // if (BCrypt.checkpw(password, usuario.getPassword()))
            if (usuario.getPassword().equals(password)) {
                return Optional.of(usuario);
            }
        }
        return Optional.empty();
    }
    
    /**
     * Actualizar perfil de usuario
     */
    public Usuario actualizarPerfil(Integer id, Usuario usuarioActualizado) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (!usuarioOpt.isPresent()) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
        
        Usuario usuario = usuarioOpt.get();
        
        if (usuarioActualizado.getNombre() != null && !usuarioActualizado.getNombre().isEmpty()) {
            usuario.setNombre(usuarioActualizado.getNombre());
        }
        if (usuarioActualizado.getApellidos() != null && !usuarioActualizado.getApellidos().isEmpty()) {
            usuario.setApellidos(usuarioActualizado.getApellidos());
        }
        if (usuarioActualizado.getFecha_nacimiento() != null) {
            usuario.setFecha_nacimiento(usuarioActualizado.getFecha_nacimiento());
        }
        
        return usuarioRepository.save(usuario);
    }
    
    /**
     * Cambiar contraseña de usuario
     */
    public Usuario cambiarPassword(Integer id, String passwordActual, String passwordNueva) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (!usuarioOpt.isPresent()) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
        
        Usuario usuario = usuarioOpt.get();
        
        // Validar contraseña actual
        if (!usuario.getPassword().equals(passwordActual)) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }
        
        if (passwordNueva == null || passwordNueva.isEmpty()) {
            throw new IllegalArgumentException("La nueva contraseña no puede estar vacía");
        }
        validarLongitudPassword(passwordNueva);
        
        usuario.setPassword(passwordNueva);
        return usuarioRepository.save(usuario);
    }
    
    /**
     * Eliminar usuario (Admin)
     */
    public void eliminarUsuario(Integer id) {
        if (!usuarioRepository.existsById(id)) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }
    
    private void validarLongitudPassword(String password) {
        if (password.length() < PASSWORD_MIN_LENGTH) {
            throw new IllegalArgumentException(
                    "La contraseña debe tener al menos " + PASSWORD_MIN_LENGTH + " caracteres");
        }
    }

    /**
     * Validar que el usuario tenga al menos 18 años
     */
    private boolean validarEdad(Usuario usuario) {
        if (usuario.getFecha_nacimiento() == null) {
            return false;
        }
        
        java.util.Calendar calendar = java.util.Calendar.getInstance();
        calendar.setTime(usuario.getFecha_nacimiento());
        calendar.add(java.util.Calendar.YEAR, 18);
        
        return new java.util.Date().after(calendar.getTime());
    }
}
