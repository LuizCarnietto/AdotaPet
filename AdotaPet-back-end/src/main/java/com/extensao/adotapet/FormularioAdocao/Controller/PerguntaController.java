package com.extensao.adotapet.FormularioAdocao.Controller;

import com.extensao.adotapet.FormularioAdocao.Entity.PerguntaPadrao;
import com.extensao.adotapet.FormularioAdocao.Repository.PerguntaPadraoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/perguntas")
public class PerguntaController {

    @Autowired
    private PerguntaPadraoRepository repository;

    @GetMapping("/perguntas")
    public List<PerguntaPadrao> listarPerguntas() {
        return repository.findByAtivoTrue();
    }
}
