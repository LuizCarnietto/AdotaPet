package com.extensao.adotapet.Animal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import com.extensao.adotapet.Usuario.Usuario;

import java.util.List;

public interface AnimalRepository extends JpaRepository<Animal, Long>,
        JpaSpecificationExecutor<Animal> {
    List<Animal> findByOngOrderByIdDesc(Usuario ong);
}