package com.extensao.adotapet.raca;

import com.extensao.adotapet.Enum.Especie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RacaRepository extends JpaRepository<Raca, Long> {

    List<Raca> findAllByEspecieOrderByNomeAsc(Especie especie);

    List<Raca> findTop10ByEspecieAndNomeContainingIgnoreCaseOrderByNomeAsc(
            Especie especie,
            String nome
    );
}