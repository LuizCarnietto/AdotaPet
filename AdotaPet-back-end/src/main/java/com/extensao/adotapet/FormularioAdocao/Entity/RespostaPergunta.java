package com.extensao.adotapet.FormularioAdocao.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
public class RespostaPergunta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private RespostaAdocao respostaAdocao;

    @ManyToOne
    private PerguntaPadrao pergunta;

    private String resposta;
}
