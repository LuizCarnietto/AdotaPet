package com.extensao.adotapet.Animal;

import com.extensao.adotapet.Enum.*;

public record AnimalRequestDTO(String nome,
                               String raca,
                               Idade idade,
                               String historicoSaude,
                               String comportamento,
                               String fotos,
                               boolean possuiChip,
                               String localizacao,
                               boolean vacinado,
                               Especie especie,
                               Porte porte,
                               Sexo sexo,
                               Status status,
                               String cor) {
}
