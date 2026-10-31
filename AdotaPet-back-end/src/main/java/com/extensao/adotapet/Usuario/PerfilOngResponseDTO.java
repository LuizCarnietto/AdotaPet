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
        String fotoCapa,
        String cnpj,
        String descricaoOng,
        String emailInstitucional,
        String enderecoPublico,

        Long estadoId,
        Long cidadeId,
        String estado,
        String estadoSigla,
        String cidade,

        boolean pixAtivo,
        String tipoChavePix,
        String chavePix,
        String titularPix,

        String instagram,
        String facebook,
        String tiktok,
        String twitter,
        String site
) {}