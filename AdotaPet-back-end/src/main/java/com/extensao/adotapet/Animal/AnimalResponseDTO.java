package com.extensao.adotapet.Animal;

import com.extensao.adotapet.Enum.*;

public record AnimalResponseDTO(
        Long id,
        String nome,
        String raca,
        Idade idade,
        String historicoSaude,
        String comportamento,
        String fotos,
        boolean possuiChip,

        Long cidadeId,
        String cidade,
        String estadoSigla,
        String estadoNome,

        Long ongId,
        String nomeOng,

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
                animal.getRaca(),
                animal.getIdade(),
                animal.getHistoricoSaude(),
                animal.getComportamento(),
                animal.getFotos(),
                animal.isPossuiChip(),

                animal.getCidade() != null
                        ? animal.getCidade().getId()
                        : null,

                animal.getCidade() != null
                        ? animal.getCidade().getNome()
                        : null,

                animal.getCidade() != null && animal.getCidade().getEstado() != null
                        ? animal.getCidade().getEstado().getSigla()
                        : null,

                animal.getCidade() != null && animal.getCidade().getEstado() != null
                        ? animal.getCidade().getEstado().getNome()
                        : null,

                animal.getOng().getId(),
                animal.getOng().getNome(),

                animal.getEspecie(),
                animal.getPorte(),
                animal.getSexo(),
                animal.getStatus(),
                animal.getCor()
        );
    }
}