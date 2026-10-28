package com.extensao.adotapet.Usuario;
/**
 * Dados seguros exibidos no perfil da ONG.
 * Não inclui senha, CPF nem outros dados privados do usuário.
 */
public record PerfilOngResponseDTO(
        String nomeOng,
        String nome,
        String email,
        String telefone,
        String endereco,
        String fotoPerfil,
        String descricaoOng
) {}

