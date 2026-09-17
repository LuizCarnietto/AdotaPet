package com.extensao.adotapet.raca;

import com.extensao.adotapet.Enum.Especie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/racas")
public class RacaController {

    @Autowired
    private RacaRepository racaRepository;

    @GetMapping("/{especie}")
    public List<Raca> listarPorEspecie(
            @PathVariable Especie especie
    ) {
        return racaRepository.findAllByEspecieOrderByNomeAsc(especie);
    }

    @GetMapping("/{especie}/buscar")
    public List<Raca> buscarPorNome(
            @PathVariable Especie especie,
            @RequestParam(defaultValue = "") String nome
    ) {
        if (nome.isBlank()) {
            return racaRepository.findAllByEspecieOrderByNomeAsc(especie);
        }

        return racaRepository
                .findTop10ByEspecieAndNomeContainingIgnoreCaseOrderByNomeAsc(
                        especie,
                        nome
                );
    }
}