package com.extensao.adotapet.Notificacao;

import com.extensao.adotapet.Usuario.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificacaoService {

    @Autowired
    private NotificacaoRepository notificacaoRepository;

    // Cria uma nova notificação para um usuário
    @Transactional
    public void criar(
            Usuario usuario,
            String titulo,
            String mensagem,
            Long candidaturaId
    ) {
        Notificacao notificacao = new Notificacao();

        notificacao.setUsuario(usuario);
        notificacao.setTitulo(titulo);
        notificacao.setMensagem(mensagem);
        notificacao.setCandidaturaId(candidaturaId);
        notificacao.setLida(false);

        notificacaoRepository.save(notificacao);
    }

    // Lista as notificações do usuário logado
    @Transactional(readOnly = true)
    public List<Notificacao> listar(Usuario usuario) {
        return notificacaoRepository
                .findByUsuarioOrderByDataCriacaoDesc(usuario);
    }

    // Conta as notificações não lidas
    @Transactional(readOnly = true)
    public long contarNaoLidas(Usuario usuario) {
        return notificacaoRepository
                .countByUsuarioAndLidaFalse(usuario);
    }

    // Marca uma notificação como lida
    @Transactional
    public void marcarComoLida(Long id, Usuario usuario) {

        Notificacao notificacao = notificacaoRepository
                .findByIdAndUsuario(id, usuario)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Notificação não encontrada"
                        )
                );

        notificacao.setLida(true);
    }

    // Marca todas as notificações do usuário como lidas
    @Transactional
    public void marcarTodasComoLidas(Usuario usuario) {

        List<Notificacao> notificacoes =
                notificacaoRepository
                        .findByUsuarioOrderByDataCriacaoDesc(usuario);

        for (Notificacao notificacao : notificacoes) {
            notificacao.setLida(true);
        }
    }
}