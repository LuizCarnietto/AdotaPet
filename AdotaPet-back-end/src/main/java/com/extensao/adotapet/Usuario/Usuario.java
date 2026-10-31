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

    @Column(name = "nome_ong")
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

    @Column(name = "foto_capa")
    private String fotoCapa;

    @Column(name = "estado_id")
    private Long estadoId;

    @Column(name = "cidade_id")
    private Long cidadeId;

    @Column(name = "estado")
    private String estado;

    @Column(name = "estado_sigla")
    private String estadoSigla;

    @Column(name = "cidade")
    private String cidade;

    @Column(name = "pix_ativo", nullable = false)
    private boolean pixAtivo;

    @Column(name = "tipo_chave_pix")
    private String tipoChavePix;

    @Column(name = "chave_pix")
    private String chavePix;

    @Column(name = "titular_pix")
    private String titularPix;
}

