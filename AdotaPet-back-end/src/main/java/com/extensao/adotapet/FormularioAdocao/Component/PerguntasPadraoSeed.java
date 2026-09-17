package com.extensao.adotapet.FormularioAdocao.Component;

import com.extensao.adotapet.Enum.TipoPergunta;
import com.extensao.adotapet.FormularioAdocao.Entity.PerguntaPadrao;
import com.extensao.adotapet.FormularioAdocao.Repository.PerguntaPadraoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PerguntasPadraoSeed implements CommandLineRunner {

    @Autowired
    private PerguntaPadraoRepository repository;

    @Override
    public void run(String... args) {

        List<PerguntaPadrao> perguntas = List.of(
                // antigas
                new PerguntaPadrao("Você possui quintal?", TipoPergunta.BOOLEAN),
                new PerguntaPadrao("Reside em casa, apartamento ou outro?", TipoPergunta.TEXTO),
                new PerguntaPadrao("Possui outros animais?", TipoPergunta.BOOLEAN),
                new PerguntaPadrao("Todos os moradores concordam com a adoção?", TipoPergunta.BOOLEAN),
                new PerguntaPadrao("Quantas horas o animal ficará sozinho por dia?", TipoPergunta.TEXTO),
                new PerguntaPadrao("Já teve animais antes?", TipoPergunta.BOOLEAN),
                new PerguntaPadrao("Possui condições financeiras para cuidados veterinários?", TipoPergunta.BOOLEAN),
                new PerguntaPadrao("O animal terá acesso à área interna da casa?", TipoPergunta.BOOLEAN),
                new PerguntaPadrao("Pretende vacinar e vermifugar regularmente?", TipoPergunta.BOOLEAN),
                new PerguntaPadrao("Já teve algum animal perdido/fugido?", TipoPergunta.BOOLEAN),

                // novas
                new PerguntaPadrao("Você já teve animais de estimação antes?", TipoPergunta.BOOLEAN),
                new PerguntaPadrao("Atualmente possui outros animais? Se sim, quantos e quais espécies?", TipoPergunta.TEXTO),
                new PerguntaPadrao("Os animais que você possui são castrados e vacinados?", TipoPergunta.TEXTO),
                new PerguntaPadrao("Você mora em casa, apartamento ou chácara/sítio?", TipoPergunta.TEXTO),
                new PerguntaPadrao("O imóvel é próprio ou alugado?", TipoPergunta.TEXTO),
                new PerguntaPadrao("Caso seja alugado, o proprietário permite animais?", TipoPergunta.BOOLEAN),
                new PerguntaPadrao("A residência possui áreas seguras para o animal (telas, muro, portões)?", TipoPergunta.BOOLEAN),
                new PerguntaPadrao("Onde o animal ficará durante o dia?", TipoPergunta.TEXTO),
                new PerguntaPadrao("E durante a noite?", TipoPergunta.TEXTO),
                new PerguntaPadrao("Quanto tempo o animal ficará sozinho por dia?", TipoPergunta.TEXTO),
                new PerguntaPadrao("Tem crianças pequenas em casa? Se sim, quais idades?", TipoPergunta.TEXTO),
                new PerguntaPadrao("Todos os membros da família estão de acordo com a adoção?", TipoPergunta.BOOLEAN),
                new PerguntaPadrao("Em caso de mudança, o que pretende fazer com o animal?", TipoPergunta.TEXTO),
                new PerguntaPadrao("Está ciente de que o animal precisa ser castrado, vacinado e receber cuidados veterinários regulares?", TipoPergunta.BOOLEAN),
                new PerguntaPadrao("Está disposto(a) a permitir uma visita pré e/ou pós-adoção da ONG?", TipoPergunta.BOOLEAN
                ));
        if (repository.count() == 0) {
            repository.saveAll(perguntas);
        }
    }
}
