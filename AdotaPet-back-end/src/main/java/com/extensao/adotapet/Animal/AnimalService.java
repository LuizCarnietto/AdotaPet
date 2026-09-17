package com.extensao.adotapet.Animal;

import com.extensao.adotapet.Enum.Status;
import com.extensao.adotapet.Enum.TipoUsuario;
import com.extensao.adotapet.Usuario.Usuario;
import com.extensao.adotapet.Usuario.UsuarioRepository;
import com.extensao.adotapet.Utils.Util;
import com.extensao.adotapet.exception.BadRequestException;
import com.extensao.adotapet.exception.ForbiddenException;
import com.extensao.adotapet.exception.NotFoundException;
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

    public AnimalResponseDTO cadastrarAnimal(AnimalRequestDTO data){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Usuario usuario = (Usuario) auth.getPrincipal();

        String email = usuario.getEmail();

        usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));


        if (!usuario.getTipoUsuario().equals(TipoUsuario.ROLE_ONG)) {
            throw new ForbiddenException("Apenas ONG pode cadastrar animais");
        }

        Animal animalData = new Animal(data);
        animalData.setCor(Util.normalizar(data.cor()));
        animalData.setRaca(Util.normalizar(data.raca()));
        animalData.setLocalizacao(Util.normalizar(data.localizacao()));
        animalData.setOng(usuario);
        repository.save(animalData);
        return new AnimalResponseDTO(animalData);
    }

    public List<AnimalResponseDTO> getAll() {

        return repository.findAll()
                .stream()
                .map(AnimalResponseDTO::new)
                .toList();
    }

    public List<AnimalResponseDTO> buscar(AnimalFiltroDTO filtro) {

        Specification<Animal> spec = Specification
                .where(AnimalSpecification.disponivel());

        if (filtro.especie() != null)
            spec = spec.and(AnimalSpecification.especie(filtro.especie()));

        if (filtro.raca() != null && !filtro.raca().isBlank())
            spec = spec.and(AnimalSpecification.raca(filtro.raca()));

        if (filtro.sexo() != null)
            spec = spec.and(AnimalSpecification.sexo(filtro.sexo()));

        if (filtro.cor() != null && !filtro.cor().isBlank())
            spec = spec.and(AnimalSpecification.cor(filtro.cor()));

        if (filtro.idade() != null)
            spec = spec.and(AnimalSpecification.idade(filtro.idade()));

        if (filtro.porte() != null)
            spec = spec.and(AnimalSpecification.porte(filtro.porte()));

        if (filtro.possuiChip() != null)
            spec = spec.and(AnimalSpecification.possuiChip(filtro.possuiChip()));

        if (filtro.vacinado() != null)
            spec = spec.and(AnimalSpecification.vacinado(filtro.vacinado()));

        if (filtro.localizacao() != null && !filtro.localizacao().isBlank())
            spec = spec.and(AnimalSpecification.localizacao(filtro.localizacao()));

        return repository.findAll(spec)
                .stream()
                .map(AnimalResponseDTO::new)
                .toList();
    }

    public AnimalResponseDTO getById(Long id){
        Animal animal = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Animal não encontrado"));
        return new AnimalResponseDTO(animal);
    }

    public void deleteById(Long id){
        Animal animal = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Animal não encontrado"));

        repository.delete(animal);
    }

    public void inativar(Long id){
        Animal animal = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Animal não encontrado"));
        animal.setStatus(Status.INATIVO);
        repository.save(animal);
    }

    public void ativar(Long id){
        Animal animal = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Animal não encontrado"));
        animal.setStatus(Status.DISPONIVEL);
        repository.save(animal);
    }

    public AnimalResponseDTO atualizaParcial(Long id, AnimalUpdateDTO dto) {
        Animal animal = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Animal não encontrado"));

        if (animal.getStatus() == Status.ADOTADO || animal.getStatus() == Status.INATIVO) {
            throw new ForbiddenException("Não é possível editar um Animal Adotado ou Inativo");
        }
        if (dto.getNome() != null) {
            animal.setNome(dto.getNome());
        }
        if (dto.getRaca() != null){
            animal.setRaca(Util.normalizar(dto.getRaca()));
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
        if (dto.getLocalizacao() != null){
            animal.setLocalizacao(Util.normalizar(dto.getLocalizacao()));
        }
        if (dto.getVacinado() != null) {
            animal.setVacinado(dto.getVacinado());
        }
        if (dto.getEspecie() != null){
            animal.setEspecie(dto.getEspecie());
        }
        if (dto.getPorte() != null){
            animal.setPorte(dto.getPorte());
        }
        if (dto.getSexo() != null){
            animal.setSexo(dto.getSexo());
        }
        if (dto.getStatus() != null){
            animal.setStatus(dto.getStatus());
        }
        if (dto.getCor() != null){
            animal.setCor(Util.normalizar(dto.getCor()));
        }
        repository.save(animal);
        return new AnimalResponseDTO(animal);
    }

}
