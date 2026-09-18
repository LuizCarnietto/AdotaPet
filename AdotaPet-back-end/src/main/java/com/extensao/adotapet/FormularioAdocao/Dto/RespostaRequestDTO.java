package com.extensao.adotapet.FormularioAdocao.Dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RespostaRequestDTO {

    private Long animalId;

    private String nomeCompleto;
    private String dataNascimento;
    private String cpf;
    private String estadoCivil;
    private String profissao;
    private String localTrabalho;

    private String ddd;
    private String telefone;
    private String email;

    private String cep;
    private String cidade;
    private String uf;
    private String estado;
    private String bairro;
    private String complemento;
    private String logradouro;
    private String numero;

    private List<RespostaItemDTO> respostas;
}