package com.extensao.adotapet.RecuperacaoSenha;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class RecuperacaoSenhaController {

    @Autowired
    private RecuperacaoSenhaService recuperacaoSenhaService;

    // Solicitar código de recuperação
    @PostMapping("/esqueci-senha")
    public ResponseEntity<?> solicitarCodigo(
            @RequestBody SolicitarCodigoRequest request
    ) {

        recuperacaoSenhaService.solicitarCodigo(request.email());

        return ResponseEntity.ok(
                Map.of(
                        "mensagem",
                        "Se o e-mail estiver cadastrado, você receberá um código de recuperação."
                )
        );
    }

    // Validar código recebido
    @PostMapping("/validar-codigo")
    public ResponseEntity<?> validarCodigo(
            @RequestBody ValidarCodigoRequest request
    ) {

        boolean valido = recuperacaoSenhaService.validarCodigo(
                request.email(),
                request.codigo()
        );

        if (!valido) {
            return ResponseEntity.badRequest().body(
                    Map.of("erro", "Código inválido ou expirado.")
            );
        }

        return ResponseEntity.ok(
                Map.of("mensagem", "Código validado com sucesso.")
        );
    }

    // Redefinir senha
    @PostMapping("/redefinir-senha")
    public ResponseEntity<?> redefinirSenha(
            @RequestBody RedefinirSenhaRequest request
    ) {

        if (request.novaSenha() == null || request.novaSenha().isBlank()) {
            return ResponseEntity.badRequest().body(
                    Map.of("erro", "Informe uma nova senha.")
            );
        }

        boolean sucesso = recuperacaoSenhaService.redefinirSenha(
                request.email(),
                request.codigo(),
                request.novaSenha()
        );

        if (!sucesso) {
            return ResponseEntity.badRequest().body(
                    Map.of("erro", "Código inválido ou expirado.")
            );
        }

        return ResponseEntity.ok(
                Map.of("mensagem", "Senha redefinida com sucesso.")
        );
    }

    // Estruturas dos dados recebidos pelo controller

    public record SolicitarCodigoRequest(
            String email
    ) {}

    public record ValidarCodigoRequest(
            String email,
            String codigo
    ) {}

    public record RedefinirSenhaRequest(
            String email,
            String codigo,
            String novaSenha
    ) {}
}