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

    public void atualizarStatus(Long idAdocao, StatusAdocao status) {

        RespostaAdocao adocao = respostaAdocaoRepository.findById(idAdocao)
                .orElseThrow(() -> new NotFoundException("Candidatura não encontrada"));

        Animal animal = adocao.getAnimal();

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

}
