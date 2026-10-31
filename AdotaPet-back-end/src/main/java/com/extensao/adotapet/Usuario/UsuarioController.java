package com.extensao.adotapet.Usuario;

import com.extensao.adotapet.Enum.TipoUsuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @PostMapping
    public Usuario cadastrar(@RequestBody UsuarioRequestDTO data) {

        Usuario usuario = new Usuario();

        usuario.setNomeOng(data.nomeOng());
        usuario.setNome(data.nome());
        usuario.setEmail(data.email());
        usuario.setSenha(data.senha());
        usuario.setTelefone(data.telefone());
        usuario.setCpf(data.cpf());
        usuario.setDataNascimento(data.dataNascimento());
        usuario.setTipoUsuario(data.tipoUsuario());

        return repository.save(usuario);
    }

    /*
     * Retorna os dados do perfil do usuário autenticado,
     * sem expor senha ou CPF.
     */
    @GetMapping("/perfil")
    public PerfilOngResponseDTO buscarPerfil(Authentication authentication) {

        Usuario usuario = obterUsuarioAutenticado(authentication);

        return montarResposta(usuario);
    }

    private Usuario obterUsuarioAutenticado(Authentication authentication) {

        if (authentication == null ||
                !(authentication.getPrincipal() instanceof Usuario usuario)) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Usuário não autenticado"
            );
        }

        return usuario;
    }

    private PerfilOngResponseDTO montarResposta(Usuario usuario) {

        return new PerfilOngResponseDTO(
                usuario.getNomeOng(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTelefone(),
                usuario.getEndereco(),
                usuario.getFotoPerfil(),
                usuario.getFotoCapa(),
                usuario.getCnpj(),
                usuario.getDescricaoOng(),
                usuario.getEmailInstitucional(),
                usuario.getEnderecoPublico(),

                usuario.getEstadoId(),
                usuario.getCidadeId(),
                usuario.getEstado(),
                usuario.getEstadoSigla(),
                usuario.getCidade(),

                usuario.isPixAtivo(),
                usuario.getTipoChavePix(),
                usuario.getChavePix(),
                usuario.getTitularPix(),

                usuario.getInstagram(),
                usuario.getFacebook(),
                usuario.getTiktok(),
                usuario.getTwitter(),
                usuario.getSite()
        );
    }

    private String limpar(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }

    @PutMapping("/perfil")
    public PerfilOngResponseDTO atualizarPerfil(
            @RequestBody AtualizarPerfilOngRequestDTO data,
            Authentication authentication
    ) {

        Usuario usuario = obterUsuarioAutenticado(authentication);

        if (data.nomeOng() == null || data.nomeOng().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O nome da ONG é obrigatório"
            );
        }

        if (data.cnpj() == null || !data.cnpj().matches("\\d{14}")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "CNPJ inválido"
            );
        }

        if (!data.cnpj().equals(usuario.getCnpj())
                && repository.existsByCnpj(data.cnpj())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este CNPJ já está cadastrado"
            );
        }

        if (Boolean.TRUE.equals(data.pixAtivo())) {

            if (data.tipoChavePix() == null || data.tipoChavePix().isBlank()
                    || data.chavePix() == null || data.chavePix().isBlank()
                    || data.titularPix() == null || data.titularPix().isBlank()) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Preencha todos os dados da chave Pix"
                );
            }
        }

        usuario.setNomeOng(limpar(data.nomeOng()));
        usuario.setCnpj(data.cnpj());
        usuario.setDescricaoOng(limpar(data.descricaoOng()));
        usuario.setTelefone(limpar(data.telefone()));
        usuario.setEmailInstitucional(limpar(data.emailInstitucional()));
        usuario.setEnderecoPublico(limpar(data.enderecoPublico()));

        usuario.setEstadoId(data.estadoId());
        usuario.setCidadeId(data.cidadeId());
        usuario.setEstado(limpar(data.estado()));
        usuario.setEstadoSigla(limpar(data.estadoSigla()));
        usuario.setCidade(limpar(data.cidade()));

        usuario.setPixAtivo(Boolean.TRUE.equals(data.pixAtivo()));

        if (usuario.isPixAtivo()) {
            usuario.setTipoChavePix(limpar(data.tipoChavePix()));
            usuario.setChavePix(limpar(data.chavePix()));
            usuario.setTitularPix(limpar(data.titularPix()));
        } else {
            usuario.setTipoChavePix(null);
            usuario.setChavePix(null);
            usuario.setTitularPix(null);
        }

        usuario.setInstagram(limpar(data.instagram()));
        usuario.setFacebook(limpar(data.facebook()));
        usuario.setTiktok(limpar(data.tiktok()));
        usuario.setTwitter(limpar(data.twitter()));
        usuario.setSite(limpar(data.site()));

        Usuario atualizado = repository.save(usuario);

        return montarResposta(atualizado);
    }

    @PostMapping(
            value = "/perfil/foto",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public PerfilOngResponseDTO atualizarFotoPerfil(
            @RequestParam("arquivo") MultipartFile arquivo,
            Authentication authentication
    ) {

        Usuario usuario = obterUsuarioAutenticado(authentication);

        if (arquivo == null || arquivo.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Selecione uma imagem"
            );
        }

        String extensao;

        if ("image/jpeg".equals(arquivo.getContentType())) {
            extensao = ".jpg";
        } else if ("image/png".equals(arquivo.getContentType())) {
            extensao = ".png";
        } else if ("image/webp".equals(arquivo.getContentType())) {
            extensao = ".webp";
        } else {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Formato inválido. Use JPG, PNG ou WEBP"
            );
        }

        if (arquivo.getSize() > 5 * 1024 * 1024) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A imagem deve ter no máximo 5 MB"
            );
        }

        try {
            Path diretorio = Paths.get("uploads", "perfis")
                    .toAbsolutePath()
                    .normalize();

            Files.createDirectories(diretorio);

            String nomeArquivo = UUID.randomUUID() + extensao;

            Path destino = diretorio.resolve(nomeArquivo).normalize();

            Files.copy(
                    arquivo.getInputStream(),
                    destino,
                    StandardCopyOption.REPLACE_EXISTING
            );

            usuario.setFotoPerfil("/uploads/perfis/" + nomeArquivo);

            Usuario atualizado = repository.save(usuario);

            return montarResposta(atualizado);

        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Erro ao salvar a foto de perfil"
            );
        }
    }

    /*
     * Retorna o perfil público de uma ONG pelo ID.
     */
    @GetMapping("/ong/{id}")
    public PerfilOngResponseDTO buscarPerfilPublico(@PathVariable Long id) {

        Usuario ong = repository.findById(id)
                .filter(usuario ->
                        TipoUsuario.ROLE_ONG.equals(usuario.getTipoUsuario())
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "ONG não encontrada"
                ));

        return montarResposta(ong);
    }
}