package com.extensao.adotapet.Security;

import com.extensao.adotapet.Usuario.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class SecurityController {

    @Autowired
    private AuthService service;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario usuario) {
        service.register(usuario);
        return ResponseEntity.ok("Usuário criado");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {

        return ResponseEntity.ok(
                service.login(
                        usuario.getEmail(),
                        usuario.getSenha()
                )
        );
    }
}