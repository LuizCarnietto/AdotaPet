package com.extensao.adotapet.FormularioAdocao.Repository;

import com.extensao.adotapet.FormularioAdocao.Entity.PerguntaPadrao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PerguntaPadraoRepository   extends JpaRepository<PerguntaPadrao, Long> {
    List<PerguntaPadrao> findByAtivoTrue();
}
