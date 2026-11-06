package com.extensao.adotapet.RecuperacaoSenha;

import com.extensao.adotapet.Email.EmailService;
import com.extensao.adotapet.Usuario.Usuario;
import com.extensao.adotapet.Usuario.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RecuperacaoSenhaService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CodigoRecuperacaoSenhaRepository codigoRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final SecureRandom random = new SecureRandom();

    public void solicitarCodigo(String email) {

        email = email.toLowerCase().trim();

        Optional<Usuario> usuarioEncontrado =
                usuarioRepository.findByEmail(email);

        // Não revela se o e-mail está cadastrado
        if (usuarioEncontrado.isEmpty()) {
            return;
        }

        Usuario usuario = usuarioEncontrado.get();

        // Invalida códigos anteriores
        List<CodigoRecuperacaoSenha> codigos =
                codigoRepository.findByUsuarioAndUtilizadoFalse(usuario);

        for (CodigoRecuperacaoSenha codigo : codigos) {
            codigo.setUtilizado(true);
        }

        codigoRepository.saveAll(codigos);

        // Gera código de 6 dígitos
        String codigoGerado = String.format(
                "%06d",
                random.nextInt(1000000)
        );

        // Cria registro
        CodigoRecuperacaoSenha novoCodigo =
                new CodigoRecuperacaoSenha();

        novoCodigo.setUsuario(usuario);
        novoCodigo.setCodigo(passwordEncoder.encode(codigoGerado));
        novoCodigo.setExpiracao(LocalDateTime.now().plusMinutes(15));
        novoCodigo.setUtilizado(false);

        codigoRepository.save(novoCodigo);

        // Envia e-mail
        emailService.enviarCodigoRecuperacao(
                usuario.getEmail(),
                codigoGerado
        );
    }

    // Valida o código enviado pelo usuário
    public boolean validarCodigo(String email, String codigoInformado) {

        Usuario usuario = usuarioRepository.findByEmail(
                email.toLowerCase().trim()
        ).orElse(null);

        if (usuario == null) {
            return false;
        }

        CodigoRecuperacaoSenha codigo = codigoRepository
                .findTopByUsuarioAndUtilizadoFalseOrderByIdDesc(usuario)
                .orElse(null);

        if (codigo == null) {
            return false;
        }

        // Verifica se o código expirou
        if (codigo.getExpiracao().isBefore(LocalDateTime.now())) {
            return false;
        }

        // Compara o código informado com o código criptografado
        return passwordEncoder.matches(
                codigoInformado,
                codigo.getCodigo()
        );
    }

    // Redefine a senha do usuário
    @Transactional
    public boolean redefinirSenha(
            String email,
            String codigoInformado,
            String novaSenha
    ) {

        Usuario usuario = usuarioRepository.findByEmail(
                email.toLowerCase().trim()
        ).orElse(null);

        if (usuario == null) {
            return false;
        }

        CodigoRecuperacaoSenha codigo = codigoRepository
                .findTopByUsuarioAndUtilizadoFalseOrderByIdDesc(usuario)
                .orElse(null);

        if (codigo == null) {
            return false;
        }

        // Verifica expiração
        if (codigo.getExpiracao().isBefore(LocalDateTime.now())) {
            return false;
        }

        // Verifica se o código está correto
        if (!passwordEncoder.matches(
                codigoInformado,
                codigo.getCodigo()
        )) {
            return false;
        }

        // Criptografa e salva a nova senha
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);

        // Impede que o código seja utilizado novamente
        codigo.setUtilizado(true);
        codigoRepository.save(codigo);

        return true;
    }
}