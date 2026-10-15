package com.extensao.adotapet.Notificacao;

import com.extensao.adotapet.Usuario.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificacaoRepository
        extends JpaRepository<Notificacao, Long> {

    // Busca as notificações do usuário, das mais recentes para as antigas
    List<Notificacao> findByUsuarioOrderByDataCriacaoDesc(Usuario usuario);

    // Conta quantas notificações o usuário ainda não leu
    long countByUsuarioAndLidaFalse(Usuario usuario);

    // Busca uma notificação somente se pertencer ao usuário
    Optional<Notificacao> findByIdAndUsuario(Long id, Usuario usuario);
}