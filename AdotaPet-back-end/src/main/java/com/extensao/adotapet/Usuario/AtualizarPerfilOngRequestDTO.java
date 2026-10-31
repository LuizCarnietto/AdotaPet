package com.extensao.adotapet.Usuario;

public record AtualizarPerfilOngRequestDTO(
        String nomeOng,
        String cnpj,
        String descricaoOng,
        String telefone,
        String emailInstitucional,
        String enderecoPublico,

        Long estadoId,
        Long cidadeId,
        String estado,
        String estadoSigla,
        String cidade,

        Boolean pixAtivo,
        String tipoChavePix,
        String chavePix,
        String titularPix,

        String instagram,
        String facebook,
        String tiktok,
        String twitter,
        String site
) {}