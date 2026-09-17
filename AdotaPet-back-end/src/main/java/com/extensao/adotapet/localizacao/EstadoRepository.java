package com.extensao.adotapet.localizacao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EstadoRepository extends JpaRepository<Estado, Long> {

    List<Estado> findAllByOrderByNomeAsc();
}