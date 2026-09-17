package com.extensao.adotapet.localizacao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CidadeRepository extends JpaRepository<Cidade, Long> {

    List<Cidade> findAllByEstadoIdOrderByNomeAsc(Long estadoId);
}