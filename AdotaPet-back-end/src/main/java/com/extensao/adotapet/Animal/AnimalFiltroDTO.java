package com.extensao.adotapet.Animal;

import com.extensao.adotapet.Enum.*;

public record AnimalFiltroDTO(
        Especie especie,
        String raca,
        Sexo sexo,
        String cor,
        Idade idade,
        Porte porte,
        Boolean possuiChip,
        String localizacao,
        Boolean vacinado
) {}