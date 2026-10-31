
package com.extensao.adotapet.Animal;

import com.extensao.adotapet.Enum.*;

public record AnimalResponseDTO(
        Long id,
        String nome,

        Long racaId,
        String raca,
        Idade idade,
        String historicoSaude,
        String comportamento,
        String fotos,
        boolean possuiChip,
        boolean vacinado,

        Long cidadeId,
        String cidade,
        String estadoSigla,
        String estadoNome,

        Long ongId,
        String nomeOng,
        String fotoPerfilOng,
        String enderecoOng,
        String cidadeOng,
        String estadoSiglaOng,

        Especie especie,
        Porte porte,
        Sexo sexo,
        Status status,
        String cor
) {

    public AnimalResponseDTO(Animal animal) {

        this(
                animal.getId(),
                animal.getNome(),

                animal.getRaca() != null
                        ? animal.getRaca().getId()
                        : null,

                animal.getRaca() != null
                        ? animal.getRaca().getNome()
                        : null,

                animal.getIdade(),
                animal.getHistoricoSaude(),
                animal.getComportamento(),
                animal.getFotos(),
                animal.isPossuiChip(),
                animal.isVacinado(),

                animal.getCidade() != null
                        ? animal.getCidade().getId()
                        : null,

                animal.getCidade() != null
                        ? animal.getCidade().getNome()
                        : null,

                animal.getCidade() != null
                        && animal.getCidade().getEstado() != null
                        ? animal.getCidade().getEstado().getSigla()
                        : null,

                animal.getCidade() != null
                        && animal.getCidade().getEstado() != null
                        ? animal.getCidade().getEstado().getNome()
                        : null,

                animal.getOng() != null
                        ? animal.getOng().getId()
                        : null,

                animal.getOng() != null
                        && animal.getOng().getNomeOng() != null
                        && !animal.getOng().getNomeOng().isBlank()
                        ? animal.getOng().getNomeOng()
                        : animal.getOng() != null
                          ? animal.getOng().getNome()
                          : null,

                animal.getOng() != null
                        ? animal.getOng().getFotoPerfil()
                        : null,

                animal.getOng() != null
                        ? animal.getOng().getEndereco()
                        : null,

                // Cidade da ONG
                animal.getOng() != null
                        ? animal.getOng().getCidade()
                        : null,

                // Sigla do estado da ONG
                animal.getOng() != null
                        ? animal.getOng().getEstadoSigla()
                        : null,

                animal.getEspecie(),
                animal.getPorte(),
                animal.getSexo(),
                animal.getStatus(),
                animal.getCor()
        );
    }
}
