package com.extensao.adotapet.Animal;

import com.extensao.adotapet.Enum.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnimalUpdateDTO {
    private String nome;
    private Long racaId;
    private Idade idade;
    private String historicoSaude;
    private String comportamento;
    private String fotos;
    private Boolean possuiChip;
    private Long cidadeId;
    private Boolean vacinado;
    private String cor;

    private Especie especie;
    private Porte porte;
    private Sexo sexo;
    private Status status;
}
