package com.dam.rentacar.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dam.rentacar.model.Usuario;
import com.dam.rentacar.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    /**
     * Obtener todos los usuarios (Admin)
     */
    @GetMapping
    public ResponseEntity<List<Usuario>> obtenerTodosUsuarios() {
        try {
            List<Usuario> usuarios = usuarioService.obtenerTodosUsuarios();
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtener un usuario por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuario(@PathVariable Integer id) {
        try {
            Optional<Usuario> usuario = usuarioService.obtenerUsuario(id);
            return usuario.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtener usuario por email
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<Usuario> obtenerUsuarioPorEmail(@PathVariable String email) {
        try {
            Optional<Usuario> usuario = usuarioService.obtenerUsuarioPorEmail(email);
            return usuario.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtener todos los clientes (Admin)
     */
    @GetMapping("/clientes/lista")
    public ResponseEntity<List<Usuario>> obtenerClientes() {
        try {
            List<Usuario> clientes = usuarioService.obtenerClientes();
            return ResponseEntity.ok(clientes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Registro de nuevo usuario (Cliente)
     * Parámetros esperados en JSON:
     * {
     *   "nombre": "Juan",
     *   "apellidos": "García",
     *   "email": "juan@example.com",
     *   "password": "password123",
     *   "fecha_nacimiento": "1990-05-15"
     * }
     */
    @PostMapping("/registro")
    public ResponseEntity<Map<String, Object>> registroUsuario(@RequestBody Usuario usuario) {
        Map<String, Object> respuesta = new HashMap<>();
        
        try {
            Usuario nuevoUsuario = usuarioService.registrarUsuario(usuario);
            respuesta.put("mensaje", "Usuario registrado exitosamente");
            respuesta.put("usuario", nuevoUsuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
        } catch (IllegalArgumentException e) {
            respuesta.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
        } catch (Exception e) {
            respuesta.put("error", "Error al registrar usuario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }
    
    /**
     * Login de usuario
     * Parámetros esperados en JSON:
     * {
     *   "email": "juan@example.com",
     *   "password": "password123"
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUsuario(@RequestBody Map<String, String> credenciales) {
        Map<String, Object> respuesta = new HashMap<>();
        
        try {
            String email = credenciales.get("email");
            String password = credenciales.get("password");
            
            if (email == null || password == null) {
                respuesta.put("error", "Email y contraseña son requeridos");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
            }
            
            Optional<Usuario> usuarioOpt = usuarioService.login(email, password);
            
            if (usuarioOpt.isPresent()) {
                Usuario usuario = usuarioOpt.get();
                respuesta.put("mensaje", "Login exitoso");
                respuesta.put("usuario", usuario);
                return ResponseEntity.ok(respuesta);
            } else {
                respuesta.put("error", "Email o contraseña incorrectos");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(respuesta);
            }
        } catch (Exception e) {
            respuesta.put("error", "Error en el login: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }
    
    /**
     * Actualizar perfil de usuario
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> actualizarPerfil(@PathVariable Integer id,
            @RequestBody Usuario usuario) {
        Map<String, Object> respuesta = new HashMap<>();
        
        try {
            Usuario usuarioActualizado = usuarioService.actualizarPerfil(id, usuario);
            respuesta.put("mensaje", "Perfil actualizado exitosamente");
            respuesta.put("usuario", usuarioActualizado);
            return ResponseEntity.ok(respuesta);
        } catch (IllegalArgumentException e) {
            respuesta.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
        } catch (Exception e) {
            respuesta.put("error", "Error al actualizar perfil: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }
    
    /**
     * Cambiar contraseña de usuario
     * Parámetros esperados en JSON:
     * {
     *   "passwordActual": "password123",
     *   "passwordNueva": "newpassword123"
     * }
     */
    @PutMapping("/{id}/cambiar-password")
    public ResponseEntity<Map<String, Object>> cambiarPassword(@PathVariable Integer id,
            @RequestBody Map<String, String> passwords) {
        Map<String, Object> respuesta = new HashMap<>();
        
        try {
            String passwordActual = passwords.get("passwordActual");
            String passwordNueva = passwords.get("passwordNueva");
            
            if (passwordActual == null || passwordNueva == null) {
                respuesta.put("error", "Las contraseñas son requeridas");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
            }
            
            Usuario usuarioActualizado = usuarioService.cambiarPassword(id, passwordActual, passwordNueva);
            respuesta.put("mensaje", "Contraseña cambiada exitosamente");
            respuesta.put("usuario", usuarioActualizado);
            return ResponseEntity.ok(respuesta);
        } catch (IllegalArgumentException e) {
            respuesta.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
        } catch (Exception e) {
            respuesta.put("error", "Error al cambiar contraseña: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }
    
    /**
     * Eliminar usuario (Admin)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> eliminarUsuario(@PathVariable Integer id) {
        Map<String, Object> respuesta = new HashMap<>();
        
        try {
            usuarioService.eliminarUsuario(id);
            respuesta.put("mensaje", "Usuario eliminado exitosamente");
            return ResponseEntity.ok(respuesta);
        } catch (IllegalArgumentException e) {
            respuesta.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
        } catch (Exception e) {
            respuesta.put("error", "Error al eliminar usuario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }
}
