package com.extensao.adotapet.FormularioAdocao.Entity;

import com.extensao.adotapet.Enum.TipoPergunta;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class PerguntaPadrao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String texto;
    private Boolean ativo;

    @Enumerated(EnumType.STRING)
    private TipoPergunta tipo;

    public PerguntaPadrao(String texto, TipoPergunta tipo) {
        this.texto = texto;
        this.tipo = tipo;
    }
}
