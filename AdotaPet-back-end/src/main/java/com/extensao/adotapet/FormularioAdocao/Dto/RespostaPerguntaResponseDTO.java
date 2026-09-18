package com.extensao.adotapet.FormularioAdocao.Dto;

import com.extensao.adotapet.FormularioAdocao.Entity.RespostaPergunta;

public record RespostaPerguntaResponseDTO(

        Long perguntaId,
        String pergunta,
        String resposta

) {

    public RespostaPerguntaResponseDTO(
            RespostaPergunta respostaPergunta
    ) {
        this(
                respostaPergunta
                        .getPergunta()
                        .getId(),

                respostaPergunta
                        .getPergunta()
                        .getTexto(),

                respostaPergunta
                        .getResposta()
        );
    }
}