package com.extensao.adotapet.localizacao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/localizacao")
public class LocalizacaoController {

    @Autowired
    private EstadoRepository estadoRepository;

    @Autowired
    private CidadeRepository cidadeRepository;

    @GetMapping("/estados")
    public List<Estado> listarEstados() {
        return estadoRepository.findAllByOrderByNomeAsc();
    }

    @GetMapping("/cidades/{estadoId}")
    public List<Cidade> listarCidades(@PathVariable Long estadoId) {
        return cidadeRepository.findAllByEstadoIdOrderByNomeAsc(estadoId);
    }
}