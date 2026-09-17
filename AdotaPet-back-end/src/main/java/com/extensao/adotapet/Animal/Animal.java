package com.extensao.adotapet.Animal;

import com.extensao.adotapet.raca.Raca;
import com.extensao.adotapet.localizacao.Cidade;
import com.extensao.adotapet.Enum.*;
import com.extensao.adotapet.Usuario.Usuario;
import jakarta.persistence.*;
import jakarta.persistence.Lob;
import lombok.*;

@Table(name = "animal")
@Entity(name = "animal")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Animal {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String nome;

    @Enumerated(EnumType.STRING)
    private Idade idade;

    private String historicoSaude;
    private String comportamento;
    private boolean possuiChip;
    private String localizacao;
    private boolean vacinado;
    private String cor;

    @Lob
    private String fotos;

    //usuário responsável
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable=false)
    private Usuario ong;

    @ManyToOne
    @JoinColumn(name = "cidade_id")
    private Cidade cidade;

    @ManyToOne
    @JoinColumn(name = "raca_id")
    private Raca raca;

    @Enumerated(EnumType.STRING)
    private Especie especie;

    @Enumerated(EnumType.STRING)
    private Porte porte;

    @Enumerated(EnumType.STRING)
    private Sexo sexo;

    @Enumerated(EnumType.STRING)
    private Status status;

    public Animal(AnimalRequestDTO data){
        this.nome = data.nome();
        this.idade = data.idade();
        this.historicoSaude = data.historicoSaude();
        this.comportamento = data.comportamento();
        this.fotos = data.fotos();
        this.possuiChip = data.possuiChip();

        this.vacinado = data.vacinado();
        this.especie = data.especie();
        this.porte = data.porte();
        this.sexo = data.sexo();
        this.status = data.status();
        this.cor = data.cor();
    }
}
