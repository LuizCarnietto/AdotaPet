package com.extensao.adotapet.Usuario;

import com.extensao.adotapet.Enum.TipoUsuario;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Table(name = "usuario")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String nomeOng;
    private String nome;

    @Column(unique = true, nullable = false)
    private String email;

    private String senha;
    private String telefone;
    private String endereco;
    private String fotoPerfil;

    @Column(unique = true)
    private String cpf;

    private LocalDate dataNascimento;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_usuario", nullable = false)
    private TipoUsuario tipoUsuario;

    private String cnpj;
    private String descricaoOng;
}

