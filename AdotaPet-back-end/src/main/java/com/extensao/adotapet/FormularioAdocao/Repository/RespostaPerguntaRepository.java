package com.extensao.adotapet.FormularioAdocao.Repository;

import com.extensao.adotapet.FormularioAdocao.Entity.RespostaPergunta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RespostaPerguntaRepository
        extends JpaRepository<RespostaPergunta, Long> {
}
