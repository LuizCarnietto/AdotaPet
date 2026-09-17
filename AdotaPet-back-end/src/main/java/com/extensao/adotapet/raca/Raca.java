package com.extensao.adotapet.raca;

import com.extensao.adotapet.Enum.Especie;
import jakarta.persistence.*;

@Entity
@Table(name = "raca")
public class Raca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Especie especie;

    public Raca() {
    }

    public Raca(String nome, Especie especie) {
        this.nome = nome;
        this.especie = especie;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Especie getEspecie() {
        return especie;
    }

    public void setEspecie(Especie especie) {
        this.especie = especie;
    }
}