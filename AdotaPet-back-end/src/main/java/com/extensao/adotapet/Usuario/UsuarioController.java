package com.extensao.adotapet.Usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {
    @Autowired
    private UsuarioRepository repository;

    @PostMapping
    public Usuario cadastrar(@RequestBody UsuarioRequestDTO data) {
        Usuario usuario = new Usuario();
        usuario.setNome(data.nome());
        usuario.setEmail(data.email());
        usuario.setSenha(data.senha());
        usuario.setTelefone(data.telefone());
        usuario.setCpf(data.cpf());
        usuario.setDataNascimento(data.dataNascimento());
        usuario.setTipoUsuario(data.tipoUsuario());
        return repository.save(usuario);
    }

    /**
     * Retorna os dados do perfil do usuário autenticado, sem expor senha ou CPF.
     * O token JWT precisa identificar o usuário pelo e-mail em Authentication.getName().
     */
    @GetMapping("/perfil")
    public PerfilOngResponseDTO buscarPerfil(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado");
        }

        Usuario usuario = repository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        return new PerfilOngResponseDTO(
                usuario.getNomeOng(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTelefone(),
                usuario.getEndereco(),
                usuario.getFotoPerfil(),
                usuario.getDescricaoOng()
        );
    }
}