package com.extensao.adotapet.Animal;

import com.extensao.adotapet.localizacao.Cidade;
import com.extensao.adotapet.localizacao.CidadeRepository;
import com.extensao.adotapet.Enum.Status;
import com.extensao.adotapet.Enum.TipoUsuario;
import com.extensao.adotapet.Usuario.Usuario;
import com.extensao.adotapet.Usuario.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnimalService {

    @Autowired
    private AnimalRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CidadeRepository cidadeRepository;

    public AnimalResponseDTO atualizaParcial(Long id, AnimalUpdateDTO dto) {
        Animal animal = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Animal não encontrado"));

        if (dto.getNome() != null) {
            animal.setNome(dto.getNome());
        }

        if (dto.getRaca() != null) {
            animal.setRaca(dto.getRaca());
        }

        if (dto.getIdade() != null) {
            animal.setIdade(dto.getIdade());
        }

        if (dto.getHistoricoSaude() != null) {
            animal.setHistoricoSaude(dto.getHistoricoSaude());
        }

        if (dto.getComportamento() != null) {
            animal.setComportamento(dto.getComportamento());
        }

        if (dto.getFotos() != null) {
            animal.setFotos(dto.getFotos());
        }

        if (dto.getPossuiChip() != null) {
            animal.setPossuiChip(dto.getPossuiChip());
        }

        if (dto.getCidadeId() != null) {

            Cidade cidade = cidadeRepository.findById(dto.getCidadeId())
                    .orElseThrow(() ->
                            new RuntimeException("Cidade não encontrada")
                    );

            animal.setCidade(cidade);
        }

        if (dto.getVacinado() != null) {
            animal.setVacinado(dto.getVacinado());
        }

        if (dto.getCor() != null) {
            animal.setCor(dto.getCor());
        }

        if (dto.getEspecie() != null) {
            animal.setEspecie(dto.getEspecie());
        }

        if (dto.getPorte() != null) {
            animal.setPorte(dto.getPorte());
        }

        if (dto.getSexo() != null) {
            animal.setSexo(dto.getSexo());
        }

        if (dto.getStatus() != null) {
            animal.setStatus(dto.getStatus());
        }

        Animal animalAtualizado = repository.save(animal);

        return new AnimalResponseDTO(animalAtualizado);
    }

    // cadastrar animal
    public AnimalResponseDTO cadastrarAnimal(AnimalRequestDTO data) {

        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Usuário não autenticado");
        }

        Usuario usuario = (Usuario) auth.getPrincipal();

        String email = usuario.getEmail();

        usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado")
                );

        if (!usuario.getTipoUsuario().equals(TipoUsuario.ROLE_ONG)) {
            throw new RuntimeException(
                    "Apenas usuários ONG podem cadastrar animais"
            );
        }

        Cidade cidade = cidadeRepository.findById(data.cidadeId())
                .orElseThrow(() ->
                        new RuntimeException("Cidade não encontrada")
                );

        Animal animalData = new Animal(data);

        animalData.setStatus(Status.DISPONIVEL);
        animalData.setOng(usuario);
        animalData.setCidade(cidade);

        Animal animalSalvo = repository.save(animalData);

        return new AnimalResponseDTO(animalSalvo);
    }

    // buscar animais com filtros
    public List<AnimalResponseDTO> buscar(AnimalFiltroDTO filtro) {

        Specification<Animal> spec =
                AnimalSpecification.disponivel();

        if (filtro.especie() != null) {

            spec = spec.and(
                    AnimalSpecification.especie(
                            filtro.especie()
                    )
            );
        }

        if (filtro.raca() != null &&
                !filtro.raca().isBlank()) {

            spec = spec.and(
                    AnimalSpecification.raca(
                            filtro.raca()
                    )
            );
        }

        if (filtro.sexo() != null) {

            spec = spec.and(
                    AnimalSpecification.sexo(
                            filtro.sexo()
                    )
            );
        }

        if (filtro.cor() != null &&
                !filtro.cor().isBlank()) {

            spec = spec.and(
                    AnimalSpecification.cor(
                            filtro.cor()
                    )
            );
        }

        if (filtro.idade() != null) {

            spec = spec.and(
                    AnimalSpecification.idade(
                            filtro.idade()
                    )
            );
        }

        if (filtro.porte() != null) {

            spec = spec.and(
                    AnimalSpecification.porte(
                            filtro.porte()
                    )
            );
        }

        if (filtro.possuiChip() != null) {

            spec = spec.and(
                    AnimalSpecification.possuiChip(
                            filtro.possuiChip()
                    )
            );
        }

        if (filtro.localizacao() != null &&
                !filtro.localizacao().isBlank()) {

            spec = spec.and(
                    AnimalSpecification.localizacao(
                            filtro.localizacao()
                    )
            );
        }

        if (filtro.vacinado() != null) {

            spec = spec.and(
                    AnimalSpecification.vacinado(
                            filtro.vacinado()
                    )
            );
        }

        return repository.findAll(spec)
                .stream()
                .map(AnimalResponseDTO::new)
                .toList();
    }


    // listar animais disponíveis


    public List<AnimalResponseDTO> getAll() {

        return repository.findAll(
                        AnimalSpecification.disponivel()
                )
                .stream()
                .map(AnimalResponseDTO::new)
                .toList();
    }

    // buscar animal por id

    public AnimalResponseDTO getById(Long id) {

        Animal animal = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Animal não encontrado"
                        )
                );

        return new AnimalResponseDTO(animal);
    }

    // deletar animal

    public void delete(Long id) {

        Animal animal = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Animal não encontrado"
                        )
                );

        repository.delete(animal);
    }

    // inativa animal

    public AnimalResponseDTO inativar(Long id) {

        Animal animal = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Animal não encontrado"
                        )
                );

        animal.setStatus(Status.INATIVO);

        Animal animalAtualizado =
                repository.save(animal);

        return new AnimalResponseDTO(animalAtualizado);
    }


    // Ativar animal


    public AnimalResponseDTO ativar(Long id) {

        Animal animal = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Animal não encontrado"
                        )
                );

        animal.setStatus(Status.DISPONIVEL);

        Animal animalAtualizado =
                repository.save(animal);

        return new AnimalResponseDTO(animalAtualizado);
    }

    // Atualizar animais

    public AnimalResponseDTO atualizar(
            Long id,
            AnimalRequestDTO data
    ) {

        Animal animal = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Animal não encontrado"
                        )
                );

        animal.setNome(data.nome());

        animal.setRaca(data.raca());

        animal.setIdade(data.idade());

        animal.setHistoricoSaude(
                data.historicoSaude()
        );

        animal.setComportamento(
                data.comportamento()
        );

        animal.setFotos(
                data.fotos()
        );

        animal.setPossuiChip(
                data.possuiChip()
        );

        animal.setVacinado(
                data.vacinado()
        );

        animal.setEspecie(
                data.especie()
        );

        animal.setPorte(
                data.porte()
        );

        animal.setSexo(
                data.sexo()
        );

        animal.setCor(
                data.cor()
        );

        /*
         * O status NÃO é alterado pelo DTO.
         *
         * Dessa forma, o frontend não consegue
         * alterar diretamente o status do animal.
         */

        Animal animalAtualizado =
                repository.save(animal);

        return new AnimalResponseDTO(
                animalAtualizado
        );
    }
}