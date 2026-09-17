package com.extensao.adotapet.Animal;

import com.extensao.adotapet.Enum.*;
import com.extensao.adotapet.Usuario.Usuario;
import jakarta.persistence.*;
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
    private String raca;

    @Enumerated(EnumType.STRING)
    private Idade idade;

    private String historicoSaude;
    private String comportamento;
    private String fotos;
    private boolean possuiChip;
    private String localizacao;
    private boolean vacinado;
    private String cor;


    //USUARIO RESPONSAVEL
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario ong;

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
        this.raca = data.raca();
        this.idade = data.idade();
        this.historicoSaude = data.historicoSaude();
        this.comportamento = data.comportamento();
        this.fotos = data.fotos();
        this.possuiChip = data.possuiChip();
        this.localizacao = data.localizacao();
        this.vacinado = data.vacinado();
        this.especie = data.especie();
        this.porte = data.porte();
        this.sexo = data.sexo();
        this.status = data.status();
        this.cor = data.cor();
    }

}
