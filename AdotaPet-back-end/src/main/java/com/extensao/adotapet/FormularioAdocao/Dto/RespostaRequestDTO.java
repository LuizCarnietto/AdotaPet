package com.extensao.adotapet.FormularioAdocao.Dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RespostaRequestDTO {
    private Long animalId;
    private List<RespostaItemDTO> respostas;
}
