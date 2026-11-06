package com.extensao.adotapet.RecuperacaoSenha;

import com.extensao.adotapet.Usuario.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CodigoRecuperacaoSenhaRepository
        extends JpaRepository<CodigoRecuperacaoSenha, Long> {

    List<CodigoRecuperacaoSenha> findByUsuarioAndUtilizadoFalse(Usuario usuario);

    Optional<CodigoRecuperacaoSenha> findTopByUsuarioAndUtilizadoFalseOrderByIdDesc(Usuario usuario);
}