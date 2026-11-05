package com.extensao.adotapet.Usuario;

public record AlterarSenhaAdotanteRequestDTO(
        String senhaAtual,
        String novaSenha
) {}