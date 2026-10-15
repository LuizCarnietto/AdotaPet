package com.extensao.adotapet.Notificacao;

import java.time.LocalDateTime;

public record NotificacaoResponseDTO(
        Long id,
        String titulo,
        String mensagem,
        Long candidaturaId,
        boolean lida,
        LocalDateTime dataCriacao
) {
    public NotificacaoResponseDTO(Notificacao notificacao) {
        this(
                notificacao.getId(),
                notificacao.getTitulo(),
                notificacao.getMensagem(),
                notificacao.getCandidaturaId(),
                notificacao.isLida(),
                notificacao.getDataCriacao()
        );
    }
}