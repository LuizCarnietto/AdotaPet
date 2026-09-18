package com.extensao.adotapet.FormularioAdocao.Dto;

import com.extensao.adotapet.Animal.AnimalResponseDTO;
import com.extensao.adotapet.Enum.StatusAdocao;
import com.extensao.adotapet.FormularioAdocao.Entity.RespostaAdocao;

import java.time.LocalDateTime;
import java.util.List;

public record RespostaAdocaoResponseDTO(

        Long id,

        AnimalResponseDTO animal,

        Long usuarioId,

        String nomeCompleto,
        String dataNascimento,
        String cpf,
        String estadoCivil,
        String profissao,
        String localTrabalho,

        String ddd,
        String telefone,
        String email,

        String cep,
        String cidade,
        String uf,
        String estado,
        String bairro,
        String complemento,
        String logradouro,
        String numero,

        List<RespostaPerguntaResponseDTO> respostas,

        StatusAdocao status,

        LocalDateTime dataResposta

) {

    public RespostaAdocaoResponseDTO(
            RespostaAdocao respostaAdocao
    ) {
        this(
                respostaAdocao.getId(),

                new AnimalResponseDTO(
                        respostaAdocao.getAnimal()
                ),

                respostaAdocao
                        .getUsuario()
                        .getId(),

                respostaAdocao.getNomeCompleto(),
                respostaAdocao.getDataNascimento(),
                respostaAdocao.getCpf(),
                respostaAdocao.getEstadoCivil(),
                respostaAdocao.getProfissao(),
                respostaAdocao.getLocalTrabalho(),

                respostaAdocao.getDdd(),
                respostaAdocao.getTelefone(),
                respostaAdocao.getEmail(),

                respostaAdocao.getCep(),
                respostaAdocao.getCidade(),
                respostaAdocao.getUf(),
                respostaAdocao.getEstado(),
                respostaAdocao.getBairro(),
                respostaAdocao.getComplemento(),
                respostaAdocao.getLogradouro(),
                respostaAdocao.getNumero(),

                respostaAdocao
                        .getRespostas()
                        .stream()
                        .map(RespostaPerguntaResponseDTO::new)
                        .toList(),

                respostaAdocao.getStatus(),

                respostaAdocao.getDataResposta()
        );
    }
}