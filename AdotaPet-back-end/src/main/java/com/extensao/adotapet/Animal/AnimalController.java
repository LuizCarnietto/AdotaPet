package com.extensao.adotapet.Animal;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/animal")
public class AnimalController {

    @Autowired
    private AnimalService animalService;

    @PostMapping
    public AnimalResponseDTO cadastrarAnimal(@RequestBody AnimalRequestDTO data){
        return animalService.cadastrarAnimal(data);
    }

    @PostMapping("/buscar")
    public List<AnimalResponseDTO> buscar(@RequestBody AnimalFiltroDTO filtro) {
        return animalService.buscar(filtro);
    }

    @GetMapping
    public List<AnimalResponseDTO> getAll() {
        return animalService.getAll();
    }

    @GetMapping("/{id}")
    public AnimalResponseDTO getById(@PathVariable Long id){
        return animalService.getById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id){
        animalService.deleteById(id);
    }

    @PutMapping("/{id}/inativar")
    public void inativar(@PathVariable Long id){
        animalService.inativar(id);
    }

    @PutMapping("/{id}/ativar")
    public void ativar(@PathVariable Long id){
        animalService.ativar(id);
    }

    @PutMapping("/{id}")
    public AnimalResponseDTO atualizaParcial(@PathVariable Long id,
                                           @RequestBody AnimalUpdateDTO dto){
        return  animalService.atualizaParcial(id, dto);
    }
}
