package com.extensao.adotapet.FormularioAdocao.Service;

import com.extensao.adotapet.Animal.Animal;
import com.extensao.adotapet.Animal.AnimalRepository;
import com.extensao.adotapet.Enum.Status;
import com.extensao.adotapet.Enum.StatusAdocao;
import com.extensao.adotapet.FormularioAdocao.Dto.RespostaItemDTO;
import com.extensao.adotapet.FormularioAdocao.Dto.RespostaRequestDTO;
import com.extensao.adotapet.FormularioAdocao.Entity.PerguntaPadrao;
import com.extensao.adotapet.FormularioAdocao.Entity.RespostaPergunta;
import com.extensao.adotapet.FormularioAdocao.Repository.PerguntaPadraoRepository;
import com.extensao.adotapet.FormularioAdocao.Repository.RespostaPerguntaRepository;
import com.extensao.adotapet.FormularioAdocao.Entity.RespostaAdocao;
import com.extensao.adotapet.FormularioAdocao.Repository.RespostaAdocaoRepository;
import com.extensao.adotapet.Usuario.Usuario;
import com.extensao.adotapet.exception.BusinessException;
import com.extensao.adotapet.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.extensao.adotapet.FormularioAdocao.Dto.RespostaAdocaoResponseDTO;

import java.util.List;

@Service
public class FormularioAdocaoService {
    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private PerguntaPadraoRepository perguntaPadraoRepository;

    @Autowired
    private RespostaPerguntaRepository respostaPerguntaRepository;

    @Autowired
    private RespostaAdocaoRepository respostaAdocaoRepository;

    public void responder (RespostaRequestDTO dto, Usuario usuario) {

        Animal animal = animalRepository.findById(dto.getAnimalId())
                .orElseThrow(() -> new NotFoundException("Animal não encontrado"));

        if (animal.getStatus() != Status.DISPONIVEL) {
            throw new BusinessException("Este animal não está disponível para adoção");
        }

        boolean exists = respostaAdocaoRepository
                .existsByUsuarioAndAnimal(usuario, animal);

        if (exists) {
            throw new BusinessException("Você já respondeu este formulário de adoção");
        }

        RespostaAdocao respostaAdocao = new RespostaAdocao();
        respostaAdocao.setAnimal(animal);
        respostaAdocao.setUsuario(usuario);
        respostaAdocao.setStatus(StatusAdocao.EM_ANALISE);

        respostaAdocao.setNomeCompleto(dto.getNomeCompleto());
        respostaAdocao.setDataNascimento(dto.getDataNascimento());
        respostaAdocao.setCpf(dto.getCpf());
        respostaAdocao.setEstadoCivil(dto.getEstadoCivil());
        respostaAdocao.setProfissao(dto.getProfissao());
        respostaAdocao.setLocalTrabalho(dto.getLocalTrabalho());

        respostaAdocao.setDdd(dto.getDdd());
        respostaAdocao.setTelefone(dto.getTelefone());
        respostaAdocao.setEmail(dto.getEmail());

        respostaAdocao.setCep(dto.getCep());
        respostaAdocao.setCidade(dto.getCidade());
        respostaAdocao.setUf(dto.getUf());
        respostaAdocao.setEstado(dto.getEstado());
        respostaAdocao.setBairro(dto.getBairro());
        respostaAdocao.setComplemento(dto.getComplemento());
        respostaAdocao.setLogradouro(dto.getLogradouro());
        respostaAdocao.setNumero(dto.getNumero());

        for (RespostaItemDTO item : dto.getRespostas()) {
            PerguntaPadrao pergunta = perguntaPadraoRepository.findById(item.getPerguntaId())
                    .orElseThrow(() -> new NotFoundException("Pergunta não encontrada"));

            RespostaPergunta rp = new RespostaPergunta();
            rp.setPergunta(pergunta);
            rp.setResposta(item.getResposta());
            rp.setRespostaAdocao(respostaAdocao);

            respostaAdocao.getRespostas().add(rp);
        }
        respostaAdocaoRepository.save(respostaAdocao);
    }

    public void atualizarStatus(Long idAdocao, StatusAdocao status, Usuario usuario) {

        RespostaAdocao adocao = respostaAdocaoRepository.findById(idAdocao)
                .orElseThrow(() -> new NotFoundException("Candidatura não encontrada"));

        Animal animal = adocao.getAnimal();

        if (animal.getOng() == null || animal.getOng().getId() != usuario.getId()) {
            throw new BusinessException(
                    "Você não tem permissão para alterar esta candidatura"
            );
        }

        if (adocao.getStatus() != StatusAdocao.EM_ANALISE) {
            throw new BusinessException("Essa candidatura já foi processada");
        }

        if (animal.getStatus() == Status.ADOTADO) {
            throw new BusinessException("Animal já adotado");
        }

        adocao.setStatus(status);
        respostaAdocaoRepository.save(adocao);

        if (status == StatusAdocao.APROVADO) {
            animal.setStatus(Status.ADOTADO);
            animalRepository.save(animal);
        }
    }
    public RespostaAdocaoResponseDTO buscarPorId(
            Long id,
            Usuario usuario
    ) {

        RespostaAdocao respostaAdocao =
                respostaAdocaoRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new NotFoundException(
                                        "Candidatura não encontrada"
                                )
                        );

        Animal animal =
                respostaAdocao.getAnimal();

        if (animal.getOng() == null || animal.getOng().getId() != usuario.getId()
        ) {
            throw new BusinessException(
                    "Você não tem permissão para visualizar esta candidatura"
            );
        }

        return new RespostaAdocaoResponseDTO(
                respostaAdocao
        );
    }

    public List<RespostaAdocaoResponseDTO> listarParaOng(
            Usuario ong
    ) {

        return respostaAdocaoRepository
                .findByAnimalOngOrderByDataRespostaDesc(ong)
                .stream()
                .map(RespostaAdocaoResponseDTO::new)
                .toList();
    }

}
