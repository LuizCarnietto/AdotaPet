package com.extensao.adotapet.FormularioAdocao.Entity;

import com.extensao.adotapet.Animal.Animal;
import com.extensao.adotapet.Enum.StatusAdocao;
import com.extensao.adotapet.Usuario.Usuario;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class RespostaAdocao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Usuario usuario;

    @ManyToOne
    private Animal animal;

    private LocalDateTime dataResposta = LocalDateTime.now();

    @OneToMany(mappedBy = "respostaAdocao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RespostaPergunta> respostas = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private StatusAdocao status = StatusAdocao.EM_ANALISE;
}
