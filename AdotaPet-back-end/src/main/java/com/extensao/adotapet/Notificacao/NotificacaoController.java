package com.extensao.adotapet.Notificacao;

import com.extensao.adotapet.Usuario.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notificacoes")
public class NotificacaoController {

    @Autowired
    private NotificacaoService notificacaoService;

    @GetMapping
    public List<NotificacaoResponseDTO> listar() {

        Usuario usuario = usuarioLogado();

        return notificacaoService.listar(usuario)
                .stream()
                .map(NotificacaoResponseDTO::new)
                .toList();
    }

    @GetMapping("/nao-lidas/quantidade")
    public Map<String, Long> contarNaoLidas() {

        Usuario usuario = usuarioLogado();

        long quantidade = notificacaoService.contarNaoLidas(usuario);

        return Map.of("quantidade", quantidade);
    }

    @PatchMapping("/{id}/ler")
    public void marcarComoLida(@PathVariable Long id) {

        Usuario usuario = usuarioLogado();

        notificacaoService.marcarComoLida(id, usuario);
    }

    @PatchMapping("/ler-todas")
    public void marcarTodasComoLidas() {

        Usuario usuario = usuarioLogado();

        notificacaoService.marcarTodasComoLidas(usuario);
    }

    private Usuario usuarioLogado() {
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        return (Usuario) auth.getPrincipal();
    }
}