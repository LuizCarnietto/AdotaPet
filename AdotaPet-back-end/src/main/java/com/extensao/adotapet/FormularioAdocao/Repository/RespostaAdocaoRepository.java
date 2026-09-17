package com.extensao.adotapet.FormularioAdocao.Repository;

import com.extensao.adotapet.Animal.Animal;
import com.extensao.adotapet.FormularioAdocao.Entity.RespostaAdocao;
import com.extensao.adotapet.Usuario.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RespostaAdocaoRepository
        extends JpaRepository<RespostaAdocao, Long> {
    boolean existsByUsuarioAndAnimal(Usuario usuario, Animal animal);
}
