package com.extensao.adotapet.Usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}