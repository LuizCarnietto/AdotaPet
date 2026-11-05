package com.extensao.adotapet.Usuario;

import java.time.LocalDate;

public record AtualizarPerfilAdotanteRequestDTO(
        String nome,
        String email,
        String telefone,
        String cpf,
        LocalDate dataNascimento
) {}