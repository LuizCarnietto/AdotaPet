package com.extensao.adotapet.Usuario;

import com.extensao.adotapet.Enum.TipoUsuario;

import java.time.LocalDate;

public record UsuarioRequestDTO(
        String nome,
        String email,
        String senha,
        String telefone,
        String cpf,
        LocalDate dataNascimento,
        TipoUsuario tipoUsuario
) {}