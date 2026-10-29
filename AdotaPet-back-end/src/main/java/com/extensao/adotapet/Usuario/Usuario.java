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

    @Column(name = "email_institucional")
    private String emailInstitucional;

    @Column(name = "endereco_publico")
    private String enderecoPublico;

    @Column(name = "instagram")
    private String instagram;

    @Column(name = "facebook")
    private String facebook;

    @Column(name = "tiktok")
    private String tiktok;

    @Column(name = "twitter")
    private String twitter;

    @Column(name = "site")
    private String site;
}

