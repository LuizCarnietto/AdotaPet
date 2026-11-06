package com.extensao.adotapet.Email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCodigoRecuperacao(String destinatario, String codigo) {

        SimpleMailMessage mensagem = new SimpleMailMessage();

        mensagem.setTo(destinatario);
        mensagem.setSubject("Recuperação de senha - AdotaPet");

        mensagem.setText(
                "Olá!\n\n" +
                        "Recebemos uma solicitação para redefinir sua senha no AdotaPet.\n\n" +
                        "Seu código de verificação é: " + codigo + "\n\n" +
                        "Esse código é válido por 15 minutos e só pode ser utilizado uma vez.\n\n" +
                        "Se você não solicitou a recuperação de senha, ignore este e-mail.\n\n" +
                        "Atenciosamente,\nEquipe AdotaPet"
        );

        mailSender.send(mensagem);
    }
}